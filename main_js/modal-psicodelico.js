/**
 * Modal Psicodélico de Mensajes Positivos
 * Con funcionalidad de ocultar al hacer clic y reaparecer si no hay login
 */

(function () {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        interval: 6000,           // Tiempo entre mensajes (ms)
        transitionDuration: 1500,  // Duración de la transición (ms)
        tiempoVisible: 3000,      // Tiempo visible del mensaje
        fontSize: '2.2rem',
        maxMessages: 1,
        zIndex: 9999,
        tiempoReaparicion: 30000,  // ⭐ 30 segundos para que reaparezca si no hay login
        ocultoPorClick: false     // Estado interno
    };

    // ===== MENSAJES =====
    const mensajes = [
        "✨ Cada día es una nueva oportunidad para brillar",
        "🌈 La creatividad es la inteligencia divirtiéndose",
        "🌻 La felicidad no es una meta, es una forma de viajar",
        "🌟 Tú eres el arquitecto de tu propia realidad",
        "🎨 La vida es un lienzo, píntala con tus colores favoritos",
        "💫 La mejor manera de predecir el futuro es crearlo",
        "🌸 La gratitud convierte lo que tenemos en suficiente",
        "🚀 El único límite es el que tú mismo te pones",
        "🌺 La belleza está en los ojos de quien sabe mirar",
        "⚡ La energía positiva atrae cosas maravillosas",
        "🍀 La suerte es cuando la preparación encuentra la oportunidad",
        "🌿 La paz comienza con una sonrisa",
        "🎭 La vida es una obra de teatro, ¡disfruta el show!",
        "💎 Eres más valioso de lo que imaginas",
        "🌊 La vida es como el mar, hay que saber surfear las olas",
        "🔥 Tu luz interior ilumina el camino de otros",
        "🌠 Los sueños se cumplen cuando te atreves a perseguirlos",
        "🍃 La serenidad está en aceptar lo que no podemos cambiar",
        "🎵 La música del alma es la que creas tú mismo",
        "💝 El amor y la creatividad son la misma energía",
        "🌟 Hoy es un buen día para ser feliz",
        "🌀 La vida es cambio, fluye con ella",
        "🌅 Cada amanecer trae nuevas posibilidades",
        "🎪 La vida es un circo, ¡sé el payaso o el equilibrista!",
        "🧠 La mente creativa no tiene límites",
        "🎯 El éxito es la suma de pequeños esfuerzos repetidos",
        "💪 Eres más fuerte de lo que crees",
        "🌞 La alegría es el sol que ilumina la vida",
        "🌺 Florece donde estés plantado"
    ];

    // ===== COLORES PSICODÉLICOS =====
    const colores = [
        '#FF6B6B', '#FF8E53', '#FECA57', '#48DBFB',
        '#0ABDE3', '#10AC84', '#EE5A24', '#5F27CD',
        '#FF9FF3', '#54A0FF', '#5F27CD', '#01A3A4',
        '#F368E0', '#FF9F43', '#00D2D3', '#FF6B6B'
    ];

    // ===== VARIABLES DE CONTROL =====
    let temporizadorReaparicion = null;
    let loginRealizado = false;

    // ===== CREAR ESTRUCTURA DEL MODAL =====
    function crearModal() {
        if (document.getElementById('modal-psicodelico')) return;

        const modal = document.createElement('div');
        modal.id = 'modal-psicodelico';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: ${CONFIG.zIndex};
            pointer-events: none;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Arial', 'Helvetica', sans-serif;
            overflow: hidden;
            transition: opacity 0.8s ease, transform 0.8s ease;
            opacity: 1;
            transform: scale(1);
        `;

        // Contenedor de mensaje (sin fondo)
        const messageContainer = document.createElement('div');
        messageContainer.id = 'mensaje-psicodelico';
        messageContainer.style.cssText = `
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 40px 60px;
            max-width: 80vw;
            min-height: 200px;
            border-radius: 30px;
            /* ⭐ AUMENTAR EL EFECTO CRISTAL */
            background: rgba(255, 255, 255, 0.12);        /* Más opaco */
            backdrop-filter: blur(12px) saturate(1.4);    /* Más blur y saturación */
            -webkit-backdrop-filter: blur(12px) saturate(1.4);
            box-shadow: 
                0 0 60px rgba(255, 255, 255, 0.1),
                inset 0 0 80px rgba(255, 255, 255, 0.05);  /* Brillo interior */
            border: 1px solid rgba(255, 255, 255, 0.15);   /* Borde sutil */
            transition: all 0.5s ease;
            pointer-events: none;
        `;

        // Texto del mensaje
        const texto = document.createElement('div');
        texto.id = 'texto-psicodelico';
        texto.style.cssText = `
            color: white;
            font-size: ${CONFIG.fontSize};
            font-weight: 700;
            text-shadow: 
                0 0 20px rgba(0,0,0,0.5),
                0 0 40px rgba(0,0,0,0.3),
                0 0 80px rgba(0,0,0,0.2);
            line-height: 1.4;
            letter-spacing: 1px;
            transition: all ${CONFIG.transitionDuration}ms ease;
            opacity: 0;
            transform: scale(0.8) rotate(-2deg);
            padding: 10px 20px;
            pointer-events: none;
        `;

        // Partículas de fondo
        const particles = document.createElement('div');
        particles.id = 'particulas-psicodelicas';
        particles.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
            border-radius: 30px;
        `;

        // Crear partículas
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 30 + 10;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 3;
            const duration = Math.random() * 4 + 3;
            const color = colores[Math.floor(Math.random() * colores.length)];

            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: ${color};
                opacity: ${Math.random() * 0.15 + 0.05};
                animation: flotarParticula ${duration}s ease-in-out infinite alternate;
                animation-delay: ${delay}s;
                filter: blur(${Math.random() * 4 + 2}px);
            `;
            particles.appendChild(particle);
        }

        // Ensamblar
        messageContainer.appendChild(texto);
        messageContainer.appendChild(particles);
        modal.appendChild(messageContainer);
        document.body.appendChild(modal);

        // Añadir estilos de animación
        const style = document.createElement('style');
        style.id = 'estilos-psicodelicos';
        style.textContent = `
            @keyframes flotarParticula {
                0% {
                    transform: translate(0, 0) scale(1);
                }
                100% {
                    transform: translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(${Math.random() * 0.8 + 0.6});
                }
            }
            @keyframes destelloColor {
                0% {
                    text-shadow: 0 0 30px rgba(255,107,107,0.3), 0 0 60px rgba(255,107,107,0.1);
                }
                25% {
                    text-shadow: 0 0 30px rgba(254,202,87,0.3), 0 0 60px rgba(254,202,87,0.1);
                }
                50% {
                    text-shadow: 0 0 30px rgba(72,219,251,0.3), 0 0 60px rgba(72,219,251,0.1);
                }
                75% {
                    text-shadow: 0 0 30px rgba(245,104,224,0.3), 0 0 60px rgba(245,104,224,0.1);
                }
                100% {
                    text-shadow: 0 0 30px rgba(255,107,107,0.3), 0 0 60px rgba(255,107,107,0.1);
                }
            }
            @keyframes pulsoSuave {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.02);
                }
                100% {
                    transform: scale(1);
                }
            }
        `;
        document.head.appendChild(style);

        // Guardar referencias
        window._modalPsicodelico = {
            container: modal,
            messageContainer: messageContainer,
            texto: texto,
            particles: particles,
            currentIndex: -1,
            intervalId: null,
            isPaused: false,
            oculto: false
        };

        // ⭐ EVENTO: Clic en cualquier parte para ocultar el modal
        document.addEventListener('click', function ocultarModal(e) {
            // Si el modal está visible y no está oculto
            const ref = window._modalPsicodelico;
            if (ref && !ref.oculto && !loginRealizado) {
                ocultarModalTemporalmente();
            }
        });

        // ⭐ EVENTO: Detectar login exitoso
        // Escuchar el evento personalizado que lanzaremos desde el login
        document.addEventListener('loginExitoso', function () {
            loginRealizado = true;
            ocultarModalPermanente();
        });

        // ⭐ EVENTO: Detectar si el usuario está escribiendo en el formulario
        const inputs = document.querySelectorAll('#formularioLogin input');
        inputs.forEach(input => {
            input.addEventListener('focus', function () {
                // Si el modal está visible, ocultarlo temporalmente
                const ref = window._modalPsicodelico;
                if (ref && !ref.oculto && !loginRealizado) {
                    ocultarModalTemporalmente();
                }
            });
        });
    }

    // ===== OCULTAR MODAL TEMPORALMENTE =====
    function ocultarModalTemporalmente() {
        const ref = window._modalPsicodelico;
        if (!ref || ref.oculto) return;

        // Limpiar temporizador anterior
        if (temporizadorReaparicion) {
            clearTimeout(temporizadorReaparicion);
            temporizadorReaparicion = null;
        }

        // Ocultar con animación
        ref.container.style.opacity = '0';
        ref.container.style.transform = 'scale(0.95)';
        ref.oculto = true;

        // Pausar el ciclo de mensajes
        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        // ⭐ Programar reaparición después de 30 segundos (si no hay login)
        temporizadorReaparicion = setTimeout(() => {
            // Solo reaparece si NO se ha hecho login
            if (!loginRealizado) {
                mostrarModal();
            }
        }, CONFIG.tiempoReaparicion);
    }

    // ===== OCULTAR MODAL PERMANENTEMENTE =====
    function ocultarModalPermanente() {
        const ref = window._modalPsicodelico;
        if (!ref) return;

        // Limpiar temporizador
        if (temporizadorReaparicion) {
            clearTimeout(temporizadorReaparicion);
            temporizadorReaparicion = null;
        }

        // Ocultar con animación
        ref.container.style.opacity = '0';
        ref.container.style.transform = 'scale(0.95)';
        ref.oculto = true;

        // Detener el ciclo
        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        // Liberar recursos
        loginRealizado = true;
    }

    // ===== MOSTRAR MODAL =====
    function mostrarModal() {
        const ref = window._modalPsicodelico;
        if (!ref || loginRealizado) return;

        // Mostrar con animación
        ref.container.style.opacity = '1';
        ref.container.style.transform = 'scale(1)';
        ref.oculto = false;

        // Reiniciar el ciclo de mensajes
        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        // Mostrar mensaje inmediato
        setTimeout(() => {
            mostrarSiguienteMensaje();
        }, 300);

        // Iniciar ciclo
        ref.intervalId = setInterval(mostrarSiguienteMensaje, CONFIG.interval);
    }

    // ===== OBTENER COLOR ALEATORIO =====
    function getColorAleatorio() {
        return colores[Math.floor(Math.random() * colores.length)];
    }

    // ===== OBTENER COLOR DE FUENTE ALEATORIO =====
    function getColorFuenteAleatorio() {
        const coloresFuente = [
            '#FF6B6B', '#FF8E53', '#FECA57', '#48DBFB',
            '#FF9FF3', '#54A0FF', '#F368E0', '#FF9F43',
            '#00D2D3', '#FF6B6B', '#A29BFE', '#FD79A8',
            '#00B894', '#FDCB6E', '#E17055', '#74B9FF'
        ];
        return coloresFuente[Math.floor(Math.random() * coloresFuente.length)];
    }

    // ===== CAMBIAR COLOR DE FONDO =====
    // En la función cambiarColorFondo()
    function cambiarColorFondo(elemento) {
        const color = getColorAleatorio();
        elemento.style.background = `
        radial-gradient(circle at 30% 40%, ${color}30, ${color}10 60%, transparent 80%),
        rgba(255, 255, 255, 0.08)
    `;
        elemento.style.boxShadow = `
        0 0 80px ${color}20,
        0 0 150px ${color}10,
        inset 0 0 100px ${color}05
    `;
        elemento.style.border = `1px solid ${color}25`;
    }

    // ===== MOSTRAR SIGUIENTE MENSAJE =====
    function mostrarSiguienteMensaje() {
        const ref = window._modalPsicodelico;
        if (!ref || ref.oculto || loginRealizado) return;

        const { texto, messageContainer } = ref;
        const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
        const colorFuente = getColorFuenteAleatorio();
        const colorSombra = getColorAleatorio();

        cambiarColorFondo(messageContainer);

        // Salida
        texto.style.opacity = '0';
        texto.style.transform = 'scale(0.9) rotate(3deg)';
        texto.style.color = colorFuente;

        setTimeout(() => {
            // Cambio
            texto.textContent = mensaje;

            // Entrada
            texto.style.opacity = '1';
            texto.style.transform = 'scale(1) rotate(0deg)';
            texto.style.color = colorFuente;
            texto.style.textShadow = `
                0 0 30px ${colorSombra}40,
                0 0 60px ${colorSombra}20,
                0 0 100px ${colorSombra}10
            `;
            texto.style.animation = 'destelloColor 4s ease-in-out infinite';
            messageContainer.style.animation = 'pulsoSuave 4s ease-in-out infinite';

            // Programar salida después del tiempo visible
            setTimeout(() => {
                if (!ref.oculto && !loginRealizado) {
                    texto.style.opacity = '0';
                    texto.style.transform = 'scale(0.9) rotate(-2deg)';
                }
            }, CONFIG.tiempoVisible);

        }, CONFIG.transitionDuration);
    }

    // ===== INICIAR MODAL =====
    function iniciarModal() {
        if (!document.getElementById('modal-psicodelico')) {
            crearModal();
        }

        const ref = window._modalPsicodelico;
        if (!ref) return;

        // Limpiar estado
        loginRealizado = false;
        ref.oculto = false;
        ref.container.style.opacity = '1';
        ref.container.style.transform = 'scale(1)';

        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        setTimeout(() => {
            mostrarSiguienteMensaje();
        }, 300);

        ref.intervalId = setInterval(mostrarSiguienteMensaje, CONFIG.interval);
    }

    // ===== PAUSAR/REANUDAR =====
    function togglePausa() {
        const ref = window._modalPsicodelico;
        if (!ref || loginRealizado) return;

        ref.isPaused = !ref.isPaused;

        if (ref.isPaused) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        } else {
            ref.intervalId = setInterval(mostrarSiguienteMensaje, CONFIG.interval);
            mostrarSiguienteMensaje();
        }
    }

    // ===== DESTRUIR MODAL =====
    function destruirModal() {
        const ref = window._modalPsicodelico;
        if (ref) {
            if (ref.intervalId) {
                clearInterval(ref.intervalId);
            }
            if (temporizadorReaparicion) {
                clearTimeout(temporizadorReaparicion);
                temporizadorReaparicion = null;
            }
            if (ref.container) {
                ref.container.remove();
            }
            delete window._modalPsicodelico;
        }
        const style = document.getElementById('estilos-psicodelicos');
        if (style) style.remove();
    }

    // ===== INICIALIZAR =====
    function inicializar() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', iniciarModal);
        } else {
            iniciarModal();
        }
    }

    // ===== EXPONER API PÚBLICA =====
    window.ModalPsicodelico = {
        iniciar: iniciarModal,
        pausar: togglePausa,
        reanudar: togglePausa,
        destruir: destruirModal,
        ocultarTemporal: ocultarModalTemporalmente,
        mostrar: mostrarModal,
        loginExitoso: function () {
            loginRealizado = true;
            ocultarModalPermanente();
        },
        configurar: function (opciones) {
            Object.assign(CONFIG, opciones);
            if (window._modalPsicodelico) {
                destruirModal();
                iniciarModal();
            }
        }
    };

    // ===== INICIAR AUTOMÁTICAMENTE =====
    inicializar();

})();