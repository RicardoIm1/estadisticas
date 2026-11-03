// Vercel Serverless Function: consulta de calendario Outlook mediante ICS.
// La URL del feed se configura en Vercel como OUTLOOK_ICS_URL.
const DAY = 86400000;

function unfoldICS(text) {
  return text.replace(/\r?\n[ \t]/g, "");
}

function unescapeICS(value = "") {
  return value
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

function parseDate(value, params = "") {
  const raw = String(value || "").trim();
  const allDay = /VALUE=DATE/i.test(params) || /^\d{8}$/.test(raw);
  if (allDay) {
    const m = raw.match(/^(\d{4})(\d{2})(\d{2})/);
    if (!m) return null;
    return { value: m[1] + "-" + m[2] + "-" + m[3], allDay: true };
  }
  const utc = /Z$/i.test(raw);
  const m = raw.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})?(Z)?$/i);
  if (!m) return null;
  if (utc) {
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0)));
    return { value: d.toISOString(), allDay: false };
  }
  return {
    value: m[1] + "-" + m[2] + "-" + m[3] + "T" + m[4] + ":" + m[5] + ":" + (m[6] || "00"),
    allDay: false
  };
}

function parseProperties(block) {
  const result = {};
  for (const line of block.split(/\r?\n/)) {
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const left = line.slice(0, colon);
    const value = line.slice(colon + 1);
    const parts = left.split(";");
    const key = parts.shift().toUpperCase();
    const params = parts.join(";");
    if (!result[key]) result[key] = [];
    result[key].push({ value, params });
  }
  return result;
}

function first(props, key) {
  return props[key] && props[key][0] ? props[key][0] : { value: "", params: "" };
}

function addDays(date, n) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + n);
  return d;
}

function localStamp(d) {
  const p = n => String(n).padStart(2, "0");
  return d.getUTCFullYear() + "-" + p(d.getUTCMonth() + 1) + "-" + p(d.getUTCDate()) +
    "T" + p(d.getUTCHours()) + ":" + p(d.getUTCMinutes()) + ":" + p(d.getUTCSeconds());
}

function parseRule(raw) {
  const out = {};
  for (const item of String(raw || "").split(";")) {
    const i = item.indexOf("=");
    if (i > 0) out[item.slice(0, i).toUpperCase()] = item.slice(i + 1);
  }
  return out;
}

function expandSimpleRule(event, ruleRaw, maxDate) {
  const rule = parseRule(ruleRaw);
  const freq = rule.FREQ;
  if (!freq || !["DAILY", "WEEKLY", "MONTHLY", "YEARLY"].includes(freq)) return [event];
  const interval = Math.max(1, parseInt(rule.INTERVAL || "1", 10) || 1);
  const count = Math.min(500, Math.max(1, parseInt(rule.COUNT || "500", 10) || 500));
  const start = new Date(event.start);
  if (Number.isNaN(start.getTime())) return [event];
  const end = new Date(event.end);
  const duration = Number.isNaN(end.getTime()) ? 0 : end.getTime() - start.getTime();
  const untilRaw = rule.UNTIL ? parseDate(rule.UNTIL, "") : null;
  const until = untilRaw ? new Date(untilRaw.value) : maxDate;
  const byday = rule.BYDAY ? rule.BYDAY.split(",").map(x => x.slice(-2)) : null;
  const weekdays = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const out = [];
  let cursor = new Date(start);
  let emitted = 0;
  let guard = 0;
  while (cursor <= maxDate && cursor <= until && emitted < count && guard++ < 2000) {
    let matches = false;
    const dayDiff = Math.floor((Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth(), cursor.getUTCDate()) -
      Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate())) / DAY);
    if (freq === "DAILY") matches = dayDiff >= 0 && dayDiff % interval === 0;
    if (freq === "WEEKLY") {
      const week = Math.floor(dayDiff / 7);
      const wanted = byday || [weekdays[start.getUTCDay()]];
      matches = dayDiff >= 0 && week % interval === 0 && wanted.includes(weekdays[cursor.getUTCDay()]);
    }
    if (freq === "MONTHLY") {
      const months = (cursor.getUTCFullYear() - start.getUTCFullYear()) * 12 + cursor.getUTCMonth() - start.getUTCMonth();
      matches = months >= 0 && months % interval === 0 && cursor.getUTCDate() === start.getUTCDate();
    }
    if (freq === "YEARLY") {
      const years = cursor.getUTCFullYear() - start.getUTCFullYear();
      matches = years >= 0 && years % interval === 0 && cursor.getUTCMonth() === start.getUTCMonth() &&
        cursor.getUTCDate() === start.getUTCDate();
    }
    if (matches) {
      const offset = cursor.getTime() - start.getTime();
      const copy = { ...event, id: event.id + (out.length ? "-" + out.length : ""), start: localStamp(cursor),
        end: localStamp(new Date(cursor.getTime() + duration)) };
      out.push(copy);
      emitted++;
    }
    cursor = addDays(cursor, 1);
  }
  return out.length ? out : [event];
}

function parseEvents(ics) {
  const unfolded = unfoldICS(ics);
  const blocks = unfolded.match(/BEGIN:VEVENT[\s\S]*?END:VEVENT/g) || [];
  const now = new Date();
  const maxDate = new Date(now.getTime() + 400 * DAY);
  const minDate = new Date(now.getTime() - 400 * DAY);
  const events = [];
  for (const block of blocks) {
    const p = parseProperties(block);
    const s = first(p, "DTSTART");
    const e = first(p, "DTEND");
    const start = parseDate(s.value, s.params);
    if (!start) continue;
    const end = parseDate(e.value, e.params) || start;
    const event = {
      id: unescapeICS(first(p, "UID").value) || "evt-" + events.length,
      title: unescapeICS(first(p, "SUMMARY").value) || "Compromiso sin título",
      start: start.value,
      end: end.value,
      allDay: start.allDay,
      location: unescapeICS(first(p, "LOCATION").value),
      description: unescapeICS(first(p, "DESCRIPTION").value),
      status: first(p, "STATUS").value || "CONFIRMED"
    };
    if (event.status === "CANCELLED") continue;
    const rule = first(p, "RRULE").value;
    const expanded = rule ? expandSimpleRule(event, rule, maxDate) : [event];
    for (const item of expanded) {
      const d = new Date(item.start);
      if (d >= minDate && d <= maxDate) events.push(item);
    }
  }
  events.sort((a, b) => new Date(a.start) - new Date(b.start));
  return events.slice(0, 1000);
}

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Método no permitido." });
  }
  const feedUrl = process.env.OUTLOOK_ICS_URL;
  if (!feedUrl) return res.status(503).json({ error: "Falta configurar OUTLOOK_ICS_URL en Vercel." });
  try {
    const response = await fetch(feedUrl, { headers: { "Accept": "text/calendar,text/plain,*/*" } });
    if (!response.ok) throw new Error("Outlook respondió HTTP " + response.status);
    const ics = await response.text();
    if (!ics.includes("BEGIN:VCALENDAR")) throw new Error("La respuesta no parece ser un calendario ICS válido.");
    const events = parseEvents(ics);
    return res.status(200).json({ events, count: events.length, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Error al consultar el calendario Outlook:", error);
    return res.status(502).json({ error: "No fue posible consultar el calendario de Outlook. Verifica el vínculo ICS y vuelve a intentarlo." });
  }
};