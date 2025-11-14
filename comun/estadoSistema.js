// ========== estadoSistema.js GAMIFICADO ==========

// Nivel de intensidad simbólica del “pulso”
let intensidadUso = 0;
let respiracionInterval;

// ---------- Respiración principal ----------
function iniciarRespiracion() {
  const dashboard = document.querySelector('.glass');
  if (!dashboard) return;

  clearInterval(respiracionInterval);

  let fase = 0;

  respiracionInterval = setInterval(() => {
    fase += 0.04 + intensidadUso * 0.005; 
    // base 0.04 → suave
    // + actividad → acelera

    const intensidad = 0.05 + intensidadUso * 0.008;
    // base 0.05 → visible pero ligera
    // se intensifica con actividad

    const escala = 1 + Math.sin(fase) * intensidad;
    dashboard.style.transform = `scale(${escala})`;
  }, 300);
}

// ---------- Suspiro espontáneo ----------
function iniciarSuspiros() {
  const dashboard = document.querySelector('.glass');
  if (!dashboard) return;

  function suspiro() {
    dashboard.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.015)' },
        { transform: 'scale(1)' }
      ],
      {
        duration: 1800,
        easing: 'ease-in-out'
      }
    );

    // programa siguiente suspiro entre 20 y 60s
    const siguiente = Math.random() * (60000 - 20000) + 20000;
    setTimeout(suspiro, siguiente);
  }

  // primer suspiro
  setTimeout(suspiro, 25000);
}

// ---------- Estado del sistema ----------
function setEstado(estado, mensaje = null) {
  const dashboard = document.querySelector('.glass');
  const messageDiv = document.getElementById('message');
  if (!dashboard) return;

  // Aumenta el "pulso" por actividad
  intensidadUso = Math.min(intensidadUso + 1, 10);
  iniciarRespiracion();
  setTimeout(() => {
    intensidadUso = Math.max(intensidadUso - 1, 0);
  }, 6000);

  dashboard.style.transition =
    'background 0.4s ease, box-shadow 0.6s ease, border 0.4s ease, transform 0.5s ease';

  dashboard.classList.remove('loading', 'success', 'error');
  dashboard.classList.add(estado);

  if (messageDiv) {
    const iconos = {
      loading: '<i class="fas fa-sync fa-spin"></i> Procesando...',
      success: '<i class="fas fa-check-circle"></i> Éxito ✓',
      error: '<i class="fas fa-exclamation-circle"></i> Error ✗'
    };

    messageDiv.innerHTML = mensaje || iconos[estado] || 'Listo';
    messageDiv.style.opacity = '1';

    setTimeout(() => {
      messageDiv.style.opacity = '0';
      setTimeout(() => (messageDiv.innerHTML = ''), 500);
    }, 4000);
  }

  // limpia estado visual
  setTimeout(() => {
    dashboard.classList.remove('loading', 'success', 'error');
  }, 4500);
}

// ---------- Respiración del fondo ----------
function iniciarRespiracionFondo() {
  const body = document.body;
  if (!body) return;

  let faseFondo = 0;
  setInterval(() => {
    faseFondo += 0.02;

    const intensidad = 0.03 + intensidadUso * 0.008;
    const brillo = 1 + Math.sin(faseFondo) * intensidad;
    const saturacion = 1 + Math.sin(faseFondo + Math.PI / 2) * intensidad * 1.2;

    body.style.filter = `brightness(${brillo}) saturate(${saturacion})`;
  }, 500);
}

// ---------- Inicialización ----------
window.addEventListener('load', () => {
  iniciarRespiracion();
  iniciarRespiracionFondo();
  iniciarSuspiros();
});
