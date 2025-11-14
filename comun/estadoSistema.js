// ========== estadoSistema.js (versión ultra ligera) ==========

// Nivel simbólico de la “respiración”
let intensidadUso = 0;
let respiracionInterval;

// Respiración principal del panel .glass
function iniciarRespiracion() {
  const dashboard = document.querySelector('.glass');
  if (!dashboard) return;

  clearInterval(respiracionInterval);

  let fase = 0;

  respiracionInterval = setInterval(() => {
    fase += 0.04 + intensidadUso * 0.005; 
    // base 0.04 → suave
    // + actividad → acelera

    const intensidad = 0.02 + intensidadUso * 0.004;
    // base 0.05 → visible pero ligera
    // se intensifica con actividad

const escala = 1 + Math.sin(fase) * (intensidad * 0.8);
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
    const siguiente = Math.random() * (600000 - 200000) + 200000;
    setTimeout(suspiro, siguiente);
  }

  // primer suspiro
  setTimeout(suspiro, 25000);
}


// Control de estados visuales (igual que antes)
function setEstado(estado, mensaje = null) {
    const dashboard = document.querySelector('.glass');
    const messageDiv = document.getElementById('message');
    if (!dashboard) return;

    // sube intensidad mínima
    /* intensidadUso = Math.min(intensidadUso + 1, 8); */
    intensidadUso = Math.min(intensidadUso + 1, 4);
    iniciarRespiracion();
    setTimeout(() => (intensidadUso = Math.max(intensidadUso - 1, 0)), 6000);

    dashboard.style.transition =
        'background 0.4s ease, box-shadow 0.6s ease, border 0.4s ease';

    dashboard.classList.remove('loading', 'success', 'error');
    dashboard.classList.add(estado);

    if (messageDiv) {
        const iconos = {
            loading: '<i class="fas fa-sync fa-spin"></i> Procesando...',
            success: '<i class="fas fa-check-circle"></i> Éxito',
            error: '<i class="fas fa-exclamation-circle"></i> Error'
        };
        messageDiv.innerHTML = mensaje || iconos[estado];
        messageDiv.style.opacity = '1';
    }

    // Limpiar y volver a neutro
    setTimeout(() => {
        dashboard.classList.remove('loading', 'success', 'error');
        if (messageDiv) {
            messageDiv.style.opacity = '0';
            setTimeout(() => (messageDiv.innerHTML = ''), 400);
        }
    }, 4500);
}


// Sutil respiración del fondo general
function iniciarRespiracionFondo() {
    const body = document.body;
    if (!body) return;

    let faseFondo = 0;

    setInterval(() => {
        faseFondo += 0.01; // más suave
        const intensidad = Math.min(0.12 + intensidadUso / 160, 0.22);

        const brillo = 1 + Math.sin(faseFondo) * intensidad * 0.10;
        const saturacion = 1 + Math.sin(faseFondo + Math.PI / 2) * intensidad * 0.15;

        body.style.filter = `brightness(${brillo}) saturate(${saturacion})`;
    }, 1200); // muy poco frecuente
}

// ---------- Inicialización ----------
window.addEventListener('load', () => {
  iniciarRespiracion();
  iniciarRespiracionFondo();
  iniciarSuspiros();
});