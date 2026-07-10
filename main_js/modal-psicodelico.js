/**
 * Modal Psicodélico de Mensajes Positivos
 * Muestra mensajes de optimismo y creatividad con transiciones coloridas
 * Inserción: <script src="ruta/modal-psicodelico.js"></script>
 */

(function () {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        interval: 8000,           // 8 segundos total
        transitionDuration: 1500,  // 1.5 segundos de animación
        fontSize: '2.2rem',
        maxMessages: 1,
        zIndex: 9999
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
        "🎨 La creatividad es la inteligencia divirtiéndose",
        "🌺 Florece donde estés plantado"
    ];

    // ===== COLORES PSICODÉLICOS =====
    const colores = [
        '#FF6B6B', '#FF8E53', '#FECA57', '#48DBFB',
        '#0ABDE3', '#10AC84', '#EE5A24', '#5F27CD',
        '#FF9FF3', '#54A0FF', '#5F27CD', '#01A3A4',
        '#F368E0', '#FF9F43', '#00D2D3', '#FF6B6B'
    ];

    // ===== CREAR ESTRUCTURA DEL MODAL =====
    function crearModal() {
        // Verificar si ya existe
        if (document.getElementById('modal-psicodelico')) return;

        // Contenedor principal
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
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(2px);
            -webkit-backdrop-filter: blur(2px);
            box-shadow: 0 0 60px rgba(255, 255, 255, 0.05);
            transition: all 0.5s ease;
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
        `;

        // Partículas de fondo (efecto psicodélico)
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
        const numParticles = 20;
        for (let i = 0; i < numParticles; i++) {
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
            isPaused: false
        };
    }

    // ===== OBTENER COLOR ALEATORIO =====
    function getColorAleatorio() {
        return colores[Math.floor(Math.random() * colores.length)];
    }

    // ===== OBTENER COLOR DE FUENTE ALEATORIO (brillante) =====
    function getColorFuenteAleatorio() {
        const coloresFuente = [
            '#FF6B6B', '#FF8E53', '#FECA57', '#48DBFB',
            '#FF9FF3', '#54A0FF', '#F368E0', '#FF9F43',
            '#00D2D3', '#FF6B6B', '#A29BFE', '#FD79A8',
            '#00B894', '#FDCB6E', '#E17055', '#74B9FF'
        ];
        return coloresFuente[Math.floor(Math.random() * coloresFuente.length)];
    }

    // ===== CAMBIAR COLOR DE FONDO DEL MODAL (sutil) =====
    function cambiarColorFondo(elemento) {
        const color = getColorAleatorio();
        const colorOscuro = `${color}15`; // Muy transparente
        elemento.style.background = `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)`;
        elemento.style.boxShadow = `0 0 80px ${color}15, 0 0 150px ${color}10`;
    }

    // ===== MOSTRAR SIGUIENTE MENSAJE =====
    function mostrarSiguienteMensaje() {
        const ref = window._modalPsicodelico;
        if (!ref) return;

        const { texto, messageContainer } = ref;

        // Elegir mensaje aleatorio
        const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];

        // Elegir color para el texto
        const colorFuente = getColorFuenteAleatorio();
        const colorSombra = getColorAleatorio();

        // Cambiar color de fondo sutil
        cambiarColorFondo(messageContainer);

        // Aplicar transición de salida
        texto.style.opacity = '0';
        texto.style.transform = 'scale(0.9) rotate(3deg)';
        texto.style.color = colorFuente;

        setTimeout(() => {
            // Cambiar mensaje
            texto.textContent = mensaje;

            // Aplicar efectos de entrada
            texto.style.opacity = '1';
            texto.style.transform = 'scale(1) rotate(0deg)';
            texto.style.color = colorFuente;
            texto.style.textShadow = `
                0 0 30px ${colorSombra}40,
                0 0 60px ${colorSombra}20,
                0 0 100px ${colorSombra}10
            `;
            texto.style.animation = 'destelloColor 4s ease-in-out infinite';

            // Efecto de pulso en el contenedor
            messageContainer.style.animation = 'pulsoSuave 4s ease-in-out infinite';
        }, 300);
    }

    // ===== INICIAR MODAL =====
    function iniciarModal() {
        // Crear estructura si no existe
        if (!document.getElementById('modal-psicodelico')) {
            crearModal();
        }

        const ref = window._modalPsicodelico;
        if (!ref) return;

        // Limpiar intervalo anterior
        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        // Mostrar primer mensaje inmediatamente
        setTimeout(() => {
            mostrarSiguienteMensaje();
        }, 300);

        // Iniciar ciclo
        ref.intervalId = setInterval(mostrarSiguienteMensaje, CONFIG.interval);
    }

    // ===== PAUSAR/REANUDAR =====
    function togglePausa() {
        const ref = window._modalPsicodelico;
        if (!ref) return;

        ref.isPaused = !ref.isPaused;

        if (ref.isPaused) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        } else {
            ref.intervalId = setInterval(mostrarSiguienteMensaje, CONFIG.interval);
            mostrarSiguienteMensaje(); // Mostrar uno nuevo al reanudar
        }
    }

    // ===== DESTRUIR MODAL =====
    function destruirModal() {
        const ref = window._modalPsicodelico;
        if (ref) {
            if (ref.intervalId) {
                clearInterval(ref.intervalId);
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
        // Esperar a que el DOM esté listo
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
        configurar: function (opciones) {
            Object.assign(CONFIG, opciones);
            if (window._modalPsicodelico) {
                // Reiniciar con nueva configuración
                destruirModal();
                iniciarModal();
            }
        }
    };

    // ===== INICIAR AUTOMÁTICAMENTE =====
    inicializar();

})();