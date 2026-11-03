// estadoSistema.js · estados visuales ligeros y compatibles
(() => {
  "use strict";

  const STATES = ["loading", "success", "error"];
  let resetTimer = null;
  let messageTimer = null;

  function getPanel() {
    return document.querySelector(".glass");
  }

  function iniciarRespiracion() {
    const panel = getPanel();
    if (!panel) return;
    panel.classList.add("is-breathing");
  }

  function setEstado(estado, mensaje = null) {
    const panel = getPanel();
    const message = document.getElementById("message");
    if (!panel) return;

    if (resetTimer) clearTimeout(resetTimer);
    if (messageTimer) clearTimeout(messageTimer);

    panel.classList.remove(...STATES);
    if (STATES.includes(estado)) panel.classList.add(estado);

    if (message) {
      const defaults = {
        loading: "Validando…",
        success: "Acceso correcto.",
        error: "No fue posible completar la operación."
      };

      // Se conserva innerHTML por compatibilidad con las llamadas existentes
      // que envían fragmentos HTML ya construidos.
      message.innerHTML = mensaje || defaults[estado] || "";
      message.classList.add("is-visible");
      message.setAttribute("aria-live", estado === "error" ? "assertive" : "polite");
    }

    if (estado !== "loading") {
      resetTimer = setTimeout(() => {
        panel.classList.remove(...STATES);
        if (message) {
          message.classList.remove("is-visible");
          messageTimer = setTimeout(() => {
            if (!message.classList.contains("is-visible")) message.innerHTML = "";
          }, 220);
        }
      }, estado === "success" ? 2600 : 4200);
    }
  }

  function detenerAnimaciones() {
    if (resetTimer) clearTimeout(resetTimer);
    if (messageTimer) clearTimeout(messageTimer);
    resetTimer = messageTimer = null;
    const panel = getPanel();
    if (panel) panel.classList.remove("is-breathing");
  }

  // API global para mantener compatibilidad con los módulos que ya la utilizan.
  window.iniciarRespiracion = iniciarRespiracion;
  window.setEstado = setEstado;
  window.detenerAnimaciones = detenerAnimaciones;

  document.addEventListener("visibilitychange", () => {
    const panel = getPanel();
    if (panel) panel.classList.toggle("motion-paused", document.hidden);
  });
  window.addEventListener("pagehide", detenerAnimaciones, { once: true });
})();
