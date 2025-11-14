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
        fase += 0.015; // más lento, más natural, menos CPU
        const intensidad = Math.min(0.10 + intensidadUso / 120, 0.25);
        const escala = 1 + Math.sin(fase) * intensidad * 0.03; // muy sutil

        dashboard.style.transform = `scale(${escala})`;
    }, 700); // respiración más lenta, máximo ahorro
}


// Control de estados visuales (igual que antes)
function setEstado(estado, mensaje = null) {
    const dashboard = document.querySelector('.glass');
    const messageDiv = document.getElementById('message');
    if (!dashboard) return;

    // sube intensidad mínima
    intensidadUso = Math.min(intensidadUso + 1, 8);
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

window.addEventListener('load', iniciarRespiracionFondo);