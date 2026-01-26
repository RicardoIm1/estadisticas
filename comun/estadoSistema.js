// ========== estadoSistema.js (versión mejorada - respiración fluida) ==========

// Nivel simbólico de la "respiración"
let intensidadUso = 0;
let respiracionAnimationId = null;
let suspiroTimeout = null;

// Configuración de respiración
const CONFIG = {
    // Respiración normal
    frecuenciaBase: 0.03,          // Más lento para fluidez
    intensidadBase: 0.015,         // Más sutil
    velocidadActualizacion: 16,    // ~60fps para más fluidez
    
    // Respiración activa (cuando hay interacción)
    aceleracionActividad: 0.002,
    intensidadActividad: 0.003,
    
    // Suspiros
    duracionSuspiro: 2000,         // 2 segundos
    intensidadSuspiro: 0.03,       // Más sutil
    minIntervaloSuspiro: 45000,    // 45 segundos mínimo
    maxIntervaloSuspiro: 120000,   // 120 segundos máximo
    primerSuspiro: 15000,         // Primer suspiro a los 15 segundos
};

// Respiración principal del panel .glass usando requestAnimationFrame para máxima fluidez
function iniciarRespiracion() {
    const dashboard = document.querySelector('.glass');
    if (!dashboard) return;

    // Cancelar animación previa si existe
    if (respiracionAnimationId) {
        cancelAnimationFrame(respiracionAnimationId);
    }

    let fase = 0;
    let ultimoTiempo = 0;

    function animar(tiempoActual) {
        if (!ultimoTiempo) ultimoTiempo = tiempoActual;
        
        // Calcular delta time para animación consistente
        const deltaTime = Math.min(tiempoActual - ultimoTiempo, 100); // Limitar a 100ms max
        ultimoTiempo = tiempoActual;

        // Avanzar fase según delta time
        const velocidad = CONFIG.frecuenciaBase + (intensidadUso * CONFIG.aceleracionActividad);
        fase += velocidad * (deltaTime / 16); // Normalizado a 16ms (60fps)

        // Calcular intensidad
        const intensidad = CONFIG.intensidadBase + (intensidadUso * CONFIG.intensidadActividad);
        
        // Usar una onda más suave (sin cuadrada)
        const escala = 1 + Math.sin(fase) * intensidad;
        
        // Aplicar transformación con transición suave
        dashboard.style.transform = `scale(${escala})`;
        dashboard.style.transition = 'transform 0.2s ease-out';
        
        // Continuar animación
        respiracionAnimationId = requestAnimationFrame(animar);
    }

    // Iniciar animación
    respiracionAnimationId = requestAnimationFrame(animar);
}

// ---------- Suspiro espontáneo mejorado ----------
function iniciarSuspiros() {
    const dashboard = document.querySelector('.glass');
    if (!dashboard) return;

    function ejecutarSuspiro() {
        // Crear una animación más orgánica
        const keyframes = [
            { 
                transform: 'scale(1)',
                easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' // Aceleración suave
            },
            { 
                transform: `scale(${1 + CONFIG.intensidadSuspiro})`,
                offset: 0.4, // Pico a los 40% de la animación
                easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
            },
            { 
                transform: 'scale(1)',
                easing: 'cubic-bezier(0.4, 0.0, 1, 1)' // Deceleración suave
            }
        ];

        dashboard.animate(keyframes, {
            duration: CONFIG.duracionSuspiro,
            fill: 'forwards'
        });

        // Programar próximo suspiro con variación aleatoria
        programarProximoSuspiro();
    }

    function programarProximoSuspiro() {
        if (suspiroTimeout) {
            clearTimeout(suspiroTimeout);
        }

        const intervalo = Math.random() * 
            (CONFIG.maxIntervaloSuspiro - CONFIG.minIntervaloSuspiro) + 
            CONFIG.minIntervaloSuspiro;
        
        suspiroTimeout = setTimeout(ejecutarSuspiro, intervalo);
        
        console.log(`Próximo suspiro en: ${Math.round(intervalo/1000)} segundos`);
    }

    // Primer suspiro
    setTimeout(() => {
        ejecutarSuspiro();
    }, CONFIG.primerSuspiro);
}

// Control de estados visuales
function setEstado(estado, mensaje = null) {
    const dashboard = document.querySelector('.glass');
    const messageDiv = document.getElementById('message');
    if (!dashboard) return;

    // Incrementar intensidad durante interacción
    intensidadUso = Math.min(intensidadUso + 1.5, 5); // Más suave
    iniciarRespiracion(); // Reiniciar con nueva intensidad
    
    // Decrementar intensidad gradualmente
    const decremento = setInterval(() => {
        intensidadUso = Math.max(intensidadUso - 0.1, 0);
        if (intensidadUso <= 0) {
            clearInterval(decremento);
        }
    }, 300); // Decrementar cada 300ms para transición suave

    // Aplicar estado visual
    dashboard.style.transition =
        'background 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), ' +
        'box-shadow 0.7s cubic-bezier(0.4, 0.0, 0.2, 1), ' +
        'border 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)';

    dashboard.classList.remove('loading', 'success', 'error');
    dashboard.classList.add(estado);

    // Mostrar mensaje si existe
    if (messageDiv) {
        const iconos = {
            loading: '<i class="fas fa-sync fa-spin"></i> Procesando...',
            success: '<i class="fas fa-check-circle"></i> Éxito',
            error: '<i class="fas fa-exclamation-circle"></i> Error'
        };
        messageDiv.innerHTML = mensaje || iconos[estado];
        messageDiv.style.opacity = '1';
        messageDiv.style.transition = 'opacity 0.4s ease';
    }

    // Limpiar y volver a neutro después de un tiempo
    setTimeout(() => {
        dashboard.classList.remove('loading', 'success', 'error');
        if (messageDiv) {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                if (messageDiv.style.opacity === '0') {
                    messageDiv.innerHTML = '';
                }
            }, 500);
        }
    }, 3800); // Un poco menos tiempo
}

// Sutil respiración del fondo general
function iniciarRespiracionFondo() {
    const body = document.body;
    if (!body) return;

    let faseFondo = 0;
    let ultimoTiempoFondo = 0;

    function animarFondo(tiempoActual) {
        if (!ultimoTiempoFondo) ultimoTiempoFondo = tiempoActual;
        
        const deltaTime = tiempoActual - ultimoTiempoFondo;
        ultimoTiempoFondo = tiempoActual;

        // Avanzar fase muy lentamente
        faseFondo += 0.002 * (deltaTime / 16);
        
        // Calcular intensidad del fondo
        const intensidadFondo = Math.min(0.1 + intensidadUso / 200, 0.18);
        
        // Onda más compleja para fondo
        const brillo = 1 + Math.sin(faseFondo) * intensidadFondo * 0.08;
        const saturacion = 1 + Math.sin(faseFondo * 0.7 + Math.PI / 3) * intensidadFondo * 0.12;
        const hue = Math.sin(faseFondo * 0.3) * intensidadFondo * 2;

        // Aplicar filtros muy sutiles
        body.style.filter = `
            brightness(${brillo}) 
            saturate(${saturacion}) 
            hue-rotate(${hue}deg)
        `;
        body.style.transition = 'filter 1.2s ease-out';

        requestAnimationFrame(animarFondo);
    }

    requestAnimationFrame(animarFondo);
}

// Función para detener todo (útil para limpiar)
function detenerAnimaciones() {
    if (respiracionAnimationId) {
        cancelAnimationFrame(respiracionAnimationId);
        respiracionAnimationId = null;
    }
    
    if (suspiroTimeout) {
        clearTimeout(suspiroTimeout);
        suspiroTimeout = null;
    }
    
    // Resetear transformaciones
    const dashboard = document.querySelector('.glass');
    if (dashboard) {
        dashboard.style.transform = 'scale(1)';
        dashboard.style.transition = 'transform 0.5s ease';
    }
    
    const body = document.body;
    if (body) {
        body.style.filter = 'none';
    }
}

// ---------- Inicialización ----------
window.addEventListener('load', () => {
    console.log('🔥 estadoSistema.js iniciando animaciones...');
    
    // Pequeño delay para que todo cargue
    setTimeout(() => {
        iniciarRespiracion();
        iniciarRespiracionFondo();
        iniciarSuspiros();
        
        console.log('✅ Animaciones iniciadas correctamente');
    }, 300);
});

// Limpiar al descargar la página
window.addEventListener('beforeunload', detenerAnimaciones);