const ical = require("node-ical");

const TIME_ZONE_FALLBACK = "America/Mexico_City";
const MAX_ICS_BYTES = 5 * 1024 * 1024;
const DAY_MS = 86400000;

function send(res, status, body) {
  res.status(status).setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "private, max-age=120, stale-while-revalidate=300");
  res.send(JSON.stringify(body));
}

function parseMonth(value) {
  if (!/^\d{4}-\d{2}$/.test(value || "")) return null;
  const parts = value.split("-").map(Number);
  if (parts[1] < 1 || parts[1] > 12 || parts[0] < 2000 || parts[0] > 2100) return null;
  return { year: parts[0], month: parts[1] };
}

function dateKey(date, timeZone, allDay) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  if (allDay && date.dateOnly) return date.toISOString().slice(0, 10);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timeZone || TIME_ZONE_FALLBACK,
    year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(date);
  const part = (type) => parts.find((item) => item.type === type)?.value;
  return part("year") + "-" + part("month") + "-" + part("day");
}

function cleanText(value) {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value.trim() : String(value).trim();
}

function normalizeEvent(event, occurrence) {
  const start = occurrence?.start || event.start;
  const end = occurrence?.end || event.end || start;
  if (!(start instanceof Date) || Number.isNaN(start.getTime())) return null;
  const timeZone = start.tz || event.start?.tz || TIME_ZONE_FALLBACK;
  const allDay = Boolean(start.dateOnly || occurrence?.isFullDay || event.start?.dateOnly);
  const uid = cleanText(event.uid) || cleanText(event.summary) + "-" + start.getTime();
  const startKey = dateKey(start, timeZone, allDay);
  const endKey = end instanceof Date ? dateKey(end, timeZone, allDay) : startKey;

  return {
    id: uid + "-" + start.getTime(),
    uid,
    title: cleanText(occurrence?.summary || event.summary) || "Compromiso sin título",
    start: allDay ? startKey + "T12:00:00" : start.toISOString(),
    end: allDay ? (endKey || startKey) + "T12:00:00" : end instanceof Date && !Number.isNaN(end.getTime()) ? end.toISOString() : start.toISOString(),
    dateKey: startKey,
    timeZone,
    allDay,
    location: cleanText(occurrence?.location || event.location),
    description: cleanText(occurrence?.description || event.description),
    status: cleanText(occurrence?.status || event.status).toUpperCase()
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { error: "Método no permitido." });
  }

  const feedUrl = process.env.OUTLOOK_ICS_URL;
  if (!feedUrl) return send(res, 503, {
    error: "El calendario todavía no está conectado. Falta configurar OUTLOOK_ICS_URL en Vercel."
  });

  let url;
  try { url = new URL(feedUrl); }
  catch { return send(res, 500, { error: "La dirección del calendario configurada no es válida." }); }

  if (url.protocol !== "https:" || url.hostname !== "outlook.live.com") {
    return send(res, 500, { error: "La dirección configurada no corresponde al feed seguro de Outlook." });
  }

  const requested = parseMonth(String(req.query.month || ""));
  if (req.query.month && !requested) {
    return send(res, 400, { error: "El mes solicitado debe tener formato AAAA-MM." });
  }

  const now = new Date();
  let from;
  let to;
  let responseMonth = null;
  if (requested) {
    from = new Date(Date.UTC(requested.year, requested.month - 1, 1) - 3 * DAY_MS);
    to = new Date(Date.UTC(requested.year, requested.month, 1) + 3 * DAY_MS);
    responseMonth = requested.year + "-" + String(requested.month).padStart(2, "0");
  } else {
    from = new Date(now.getTime() - 400 * DAY_MS);
    to = new Date(now.getTime() + 800 * DAY_MS);
  }

  try {
    const response = await fetch(url.toString(), {
      headers: { Accept: "text/calendar, text/plain;q=0.9, */*;q=0.8" },
      signal: AbortSignal.timeout(12000),
      redirect: "follow"
    });
    if (!response.ok) throw new Error("Outlook respondió con HTTP " + response.status);
    const declaredLength = Number(response.headers.get("content-length") || 0);
    if (declaredLength > MAX_ICS_BYTES) throw new Error("El archivo ICS supera el tamaño permitido.");
    const icsText = await response.text();
    if (Buffer.byteLength(icsText, "utf8") > MAX_ICS_BYTES) throw new Error("El archivo ICS supera el tamaño permitido.");
    if (!icsText.includes("BEGIN:VCALENDAR")) throw new Error("La respuesta de Outlook no contiene un calendario ICS válido.");

    const parsed = await ical.async.parseICS(icsText);
    const events = [];
    for (const item of Object.values(parsed)) {
      if (!item || item.type !== "VEVENT" || !item.start) continue;
      if (String(item.status || "").toUpperCase() === "CANCELLED") continue;
      let instances = [];
      if (item.rrule) {
        instances = ical.expandRecurringEvent(item, {
          from, to, includeOverrides: true, excludeExdates: true, expandOngoing: true
        });
      } else {
        const start = item.start;
        const end = item.end || start;
        if (end >= from && start <= to) instances = [{ start, end }];
      }
      for (const instance of instances) {
        const normalized = normalizeEvent(item, instance);
        if (!normalized) continue;
        const eventStart = new Date(normalized.start);
        const eventEnd = new Date(normalized.end);
        if (eventEnd < from || eventStart > to) continue;
        events.push(normalized);
      }
    }

    const unique = Array.from(new Map(events.map((event) => [event.id, event])).values());
    unique.sort((a, b) => a.start.localeCompare(b.start));
    return send(res, 200, {
      month: responseMonth,
      timeZone: TIME_ZONE_FALLBACK,
      count: unique.length,
      events: unique,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error al consultar el calendario Outlook:", error);
    return send(res, 502, {
      error: "No fue posible consultar el calendario de Outlook. Verifica que el vínculo ICS siga publicado y disponible."
    });
  }
};
