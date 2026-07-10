/**
 * Modal Psicodélico de Mensajes Positivos
 * Con transición cruzada (fade cross) entre mensajes
 */

(function () {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        interval: 6000,
        transitionDuration: 2000,  // Aumentado para transición más suave
        tiempoVisible: 3000,
        fontSize: '2.8rem',
        maxMessages: 1,
        zIndex: 9999,
        tiempoReaparicion: 30000,
        ocultoPorClick: false
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

        // OVERLAY OSCURO CON BLUR
        const overlay = document.createElement('div');
        overlay.id = 'overlay-psicodelico';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: ${CONFIG.zIndex - 1};
            background: radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
            pointer-events: none;
            transition: opacity 0.8s ease;
            opacity: 1;
        `;
        document.body.appendChild(overlay);

        // MODAL
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

        // ⭐ CONTENEDOR PARA LOS DOS TEXTOS (superpuestos)
        const textoContainer = document.createElement('div');
        textoContainer.id = 'texto-container';
        textoContainer.style.cssText = `
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            pointer-events: none;
        `;

        // ⭐ TEXTO 1 (Mensaje actual - sale)
        const texto1 = document.createElement('div');
        texto1.id = 'texto-psicodelico-1';
        texto1.style.cssText = `
            position: absolute;
            color: white;
            font-size: ${CONFIG.fontSize};
            font-weight: 700;
            text-shadow: 
                0 0 40px rgba(0,0,0,0.6),
                0 0 80px rgba(0,0,0,0.4),
                0 0 120px rgba(0,0,0,0.3),
                0 0 200px rgba(0,0,0,0.2);
            line-height: 1.5;
            letter-spacing: 3px;
            transition: all ${CONFIG.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: scale(0.8) rotate(-2deg);
            padding: 30px 40px;
            pointer-events: none;
            text-align: center;
            max-width: 85vw;
            z-index: 2;
        `;

        // ⭐ TEXTO 2 (Mensaje entrante)
        const texto2 = document.createElement('div');
        texto2.id = 'texto-psicodelico-2';
        texto2.style.cssText = `
            position: absolute;
            color: white;
            font-size: ${CONFIG.fontSize};
            font-weight: 700;
            text-shadow: 
                0 0 40px rgba(0,0,0,0.6),
                0 0 80px rgba(0,0,0,0.4),
                0 0 120px rgba(0,0,0,0.3),
                0 0 200px rgba(0,0,0,0.2);
            line-height: 1.5;
            letter-spacing: 3px;
            transition: all ${CONFIG.transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: scale(0.8) rotate(-2deg);
            padding: 30px 40px;
            pointer-events: none;
            text-align: center;
            max-width: 85vw;
            z-index: 1;
        `;

        // PARTÍCULAS FLOTANTES
        const particles = document.createElement('div');
        particles.id = 'particulas-psicodelicas';
        particles.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            overflow: hidden;
            z-index: ${CONFIG.zIndex - 0.5};
        `;

        // Crear partículas grandes
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 60 + 20;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 8 + 4;
            const color = colores[Math.floor(Math.random() * colores.length)];
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: ${color};
                opacity: ${Math.random() * 0.1 + 0.03};
                animation: flotarParticula ${duration}s ease-in-out infinite alternate;
                animation-delay: ${delay}s;
                filter: blur(${Math.random() * 8 + 4}px);
            `;
            particles.appendChild(particle);
        }

        // Crear partículas pequeñas brillantes
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 8 + 3;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const delay = Math.random() * 4;
            const duration = Math.random() * 6 + 3;
            const color = colores[Math.floor(Math.random() * colores.length)];
            
            particle.style.cssText = `
                position: absolute;
                left: ${x}%;
                top: ${y}%;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: ${color};
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: flotarParticula ${duration}s ease-in-out infinite alternate;
                animation-delay: ${delay}s;
                filter: blur(${Math.random() * 2 + 1}px);
                box-shadow: 0 0 ${size * 2}px ${color}40;
            `;
            particles.appendChild(particle);
        }

        // Ensamblar
        textoContainer.appendChild(texto1);
        textoContainer.appendChild(texto2);
        modal.appendChild(particles);
        modal.appendChild(textoContainer);
        document.body.appendChild(modal);

        // ESTILOS Y ANIMACIONES
        const style = document.createElement('style');
        style.id = 'estilos-psicodelicos';
        style.textContent = `
            @keyframes flotarParticula {
                0% { 
                    transform: translate(0, 0) scale(1) rotate(0deg); 
                }
                100% { 
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(${Math.random() * 0.8 + 0.6}) rotate(${Math.random() * 360}deg); 
                }
            }
            @keyframes destelloColor {
                0% { 
                    text-shadow: 0 0 40px rgba(255,107,107,0.4), 0 0 80px rgba(255,107,107,0.2), 0 0 120px rgba(255,107,107,0.1), 0 0 200px rgba(255,107,107,0.05); 
                }
                25% { 
                    text-shadow: 0 0 40px rgba(254,202,87,0.4), 0 0 80px rgba(254,202,87,0.2), 0 0 120px rgba(254,202,87,0.1), 0 0 200px rgba(254,202,87,0.05); 
                }
                50% { 
                    text-shadow: 0 0 40px rgba(72,219,251,0.4), 0 0 80px rgba(72,219,251,0.2), 0 0 120px rgba(72,219,251,0.1), 0 0 200px rgba(72,219,251,0.05); 
                }
                75% { 
                    text-shadow: 0 0 40px rgba(245,104,224,0.4), 0 0 80px rgba(245,104,224,0.2), 0 0 120px rgba(245,104,224,0.1), 0 0 200px rgba(245,104,224,0.05); 
                }
                100% { 
                    text-shadow: 0 0 40px rgba(255,107,107,0.4), 0 0 80px rgba(255,107,107,0.2), 0 0 120px rgba(255,107,107,0.1), 0 0 200px rgba(255,107,107,0.05); 
                }
            }
        `;
        document.head.appendChild(style);

        // Guardar referencias
        window._modalPsicodelico = {
            container: modal,
            overlay: overlay,
            texto1: texto1,
            texto2: texto2,
            textoContainer: textoContainer,
            particles: particles,
            currentIndex: -1,
            intervalId: null,
            isPaused: false,
            oculto: false,
            textoActivo: 1  // 1 = texto1 visible, 2 = texto2 visible
        };

        // EVENTOS
        document.addEventListener('click', function ocultarModal(e) {
            const ref = window._modalPsicodelico;
            if (ref && !ref.oculto && !loginRealizado) {
                ocultarModalTemporalmente();
            }
        });

        document.addEventListener('loginExitoso', function () {
            loginRealizado = true;
            ocultarModalPermanente();
        });

        const inputs = document.querySelectorAll('#formularioLogin input');
        inputs.forEach(input => {
            input.addEventListener('focus', function () {
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

        if (temporizadorReaparicion) {
            clearTimeout(temporizadorReaparicion);
            temporizadorReaparicion = null;
        }

        ref.container.style.opacity = '0';
        ref.container.style.transform = 'scale(0.95)';
        if (ref.overlay) {
            ref.overlay.style.opacity = '0';
        }
        ref.oculto = true;

        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        temporizadorReaparicion = setTimeout(() => {
            if (!loginRealizado) {
                mostrarModal();
            }
        }, CONFIG.tiempoReaparicion);
    }

    // ===== OCULTAR MODAL PERMANENTEMENTE =====
    function ocultarModalPermanente() {
        const ref = window._modalPsicodelico;
        if (!ref) return;

        if (temporizadorReaparicion) {
            clearTimeout(temporizadorReaparicion);
            temporizadorReaparicion = null;
        }

        ref.container.style.opacity = '0';
        ref.container.style.transform = 'scale(0.95)';
        if (ref.overlay) {
            ref.overlay.style.opacity = '0';
        }
        ref.oculto = true;

        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        loginRealizado = true;
    }

    // ===== MOSTRAR MODAL =====
    function mostrarModal() {
        const ref = window._modalPsicodelico;
        if (!ref || loginRealizado) return;

        ref.container.style.opacity = '1';
        ref.container.style.transform = 'scale(1)';
        if (ref.overlay) {
            ref.overlay.style.opacity = '1';
        }
        ref.oculto = false;

        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        setTimeout(() => {
            mostrarSiguienteMensaje();
        }, 300);

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

    // ===== MOSTRAR SIGUIENTE MENSAJE CON TRANSICIÓN CRUZADA =====
    function mostrarSiguienteMensaje() {
        const ref = window._modalPsicodelico;
        if (!ref || ref.oculto || loginRealizado) return;

        const { texto1, texto2 } = ref;
        const mensaje = mensajes[Math.floor(Math.random() * mensajes.length)];
        const colorFuente = getColorFuenteAleatorio();
        const colorSombra = getColorAleatorio();

        // Determinar qué texto está activo y cuál está inactivo
        let textoSalida, textoEntrada;
        if (ref.textoActivo === 1) {
            textoSalida = texto1;
            textoEntrada = texto2;
            ref.textoActivo = 2;
        } else {
            textoSalida = texto2;
            textoEntrada = texto1;
            ref.textoActivo = 1;
        }

        // Preparar el texto entrante (invisible pero listo)
        textoEntrada.textContent = mensaje;
        textoEntrada.style.color = colorFuente;
        textoEntrada.style.textShadow = `
            0 0 40px ${colorSombra}50,
            0 0 80px ${colorSombra}30,
            0 0 120px ${colorSombra}15,
            0 0 200px ${colorSombra}10,
            0 0 300px ${colorSombra}05
        `;
        textoEntrada.style.animation = 'destelloColor 5s ease-in-out infinite';
        
        // Posicionar el texto entrante ligeramente más grande y con rotación
        textoEntrada.style.transform = 'scale(0.7) rotate(2deg)';
        textoEntrada.style.opacity = '0';

        // Forzar un reflow para asegurar la transición
        void textoEntrada.offsetWidth;

        // INICIAR TRANSICIÓN CRUZADA
        // El texto que sale se desvanece y escala
        textoSalida.style.opacity = '0';
        textoSalida.style.transform = 'scale(0.7) rotate(3deg)';
        
        // El texto que entra aparece y escala
        textoEntrada.style.opacity = '1';
        textoEntrada.style.transform = 'scale(1) rotate(0deg)';

        // Programar la limpieza del texto que salió (opcional, para mantener limpio el DOM)
        setTimeout(() => {
            if (!ref.oculto && !loginRealizado) {
                // Ocultar completamente el texto que salió (por si acaso)
                textoSalida.style.opacity = '0';
                textoSalida.style.transform = 'scale(0.7) rotate(3deg)';
            }
        }, CONFIG.transitionDuration + 100);
    }

    // ===== INICIAR MODAL =====
    function iniciarModal() {
        if (!document.getElementById('modal-psicodelico')) {
            crearModal();
        }

        const ref = window._modalPsicodelico;
        if (!ref) return;

        loginRealizado = false;
        ref.oculto = false;
        ref.container.style.opacity = '1';
        ref.container.style.transform = 'scale(1)';
        if (ref.overlay) {
            ref.overlay.style.opacity = '1';
        }

        // Inicializar con un mensaje en texto1
        const mensajeInicial = mensajes[Math.floor(Math.random() * mensajes.length)];
        const colorInicial = getColorFuenteAleatorio();
        const colorSombraInicial = getColorAleatorio();
        
        ref.texto1.textContent = mensajeInicial;
        ref.texto1.style.color = colorInicial;
        ref.texto1.style.textShadow = `
            0 0 40px ${colorSombraInicial}50,
            0 0 80px ${colorSombraInicial}30,
            0 0 120px ${colorSombraInicial}15,
            0 0 200px ${colorSombraInicial}10,
            0 0 300px ${colorSombraInicial}05
        `;
        ref.texto1.style.animation = 'destelloColor 5s ease-in-out infinite';
        ref.texto1.style.opacity = '1';
        ref.texto1.style.transform = 'scale(1) rotate(0deg)';
        
        // Ocultar texto2 inicialmente
        ref.texto2.style.opacity = '0';
        ref.texto2.style.transform = 'scale(0.7) rotate(2deg)';
        ref.textoActivo = 1;

        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        // Programar el primer cambio después del tiempo visible
        setTimeout(() => {
            mostrarSiguienteMensaje();
        }, CONFIG.tiempoVisible + 500);

        // Iniciar el ciclo
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
            if (ref.overlay) {
                ref.overlay.remove();
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