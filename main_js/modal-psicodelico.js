/**
 * Modal Psicodélico de Mensajes Positivos
 * Con funcionalidad de ocultar al hacer clic y reaparecer si no hay login
 * Mejoras: Efecto cristal intenso, overlay oscuro, borde brillante, partículas mejoradas
 */

(function () {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        interval: 6000,           // Tiempo entre mensajes (ms)
        transitionDuration: 1500,  // Duración de la transición (ms)
        tiempoVisible: 3500,      // Tiempo visible del mensaje
        fontSize: '2.4rem',       // Tamaño de fuente aumentado
        maxMessages: 1,
        zIndex: 9999,
        tiempoReaparicion: 30000,  // 30 segundos para que reaparezca si no hay login
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

        // ⭐ 1. CREAR OVERLAY OSCURO CON BLUR
        const overlay = document.createElement('div');
        overlay.id = 'overlay-psicodelico';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: ${CONFIG.zIndex - 1};
            background: radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            pointer-events: none;
            transition: opacity 0.8s ease;
            opacity: 1;
        `;
        document.body.appendChild(overlay);

        // ⭐ 2. CREAR MODAL
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

        // ⭐ 3. CONTENEDOR DE MENSAJE CON EFECTO CRISTAL INTENSO
        const messageContainer = document.createElement('div');
        messageContainer.id = 'mensaje-psicodelico';
        messageContainer.style.cssText = `
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 60px 80px;
            max-width: 85vw;
            min-height: 280px;
            border-radius: 30px;
            background: rgba(255, 255, 255, 0.08);
            backdrop-filter: blur(20px) saturate(1.8);
            -webkit-backdrop-filter: blur(20px) saturate(1.8);
            box-shadow: 
                0 0 60px rgba(255, 255, 255, 0.08),
                0 0 120px rgba(255, 255, 255, 0.04),
                inset 0 0 80px rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.12);
            transition: all 0.5s ease;
            pointer-events: none;
        `;

        // ⭐ 4. BORDE BRILLANTE GIRATORIO
        const bordeBrillante = document.createElement('div');
        bordeBrillante.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 32px;
            background: conic-gradient(
                from 0deg,
                transparent 0%,
                rgba(255,255,255,0.15) 20%,
                rgba(255,255,255,0.05) 40%,
                transparent 60%,
                rgba(255,255,255,0.12) 80%,
                transparent 100%
            );
            pointer-events: none;
            z-index: -1;
            animation: girarBorde 8s linear infinite;
        `;
        messageContainer.appendChild(bordeBrillante);

        // ⭐ 5. SEGUNDO BORDE INTERIOR PARA MÁS BRILLO
        const bordeInterior = document.createElement('div');
        bordeInterior.style.cssText = `
            position: absolute;
            top: 3px;
            left: 3px;
            right: 3px;
            bottom: 3px;
            border-radius: 28px;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.05);
            pointer-events: none;
            z-index: -1;
        `;
        messageContainer.appendChild(bordeInterior);

        // Texto del mensaje
        const texto = document.createElement('div');
        texto.id = 'texto-psicodelico';
        texto.style.cssText = `
            color: white;
            font-size: ${CONFIG.fontSize};
            font-weight: 700;
            text-shadow: 
                0 0 30px rgba(0,0,0,0.6),
                0 0 60px rgba(0,0,0,0.4),
                0 0 100px rgba(0,0,0,0.3);
            line-height: 1.5;
            letter-spacing: 2px;
            transition: all ${CONFIG.transitionDuration}ms ease;
            opacity: 0;
            transform: scale(0.8) rotate(-2deg);
            padding: 15px 25px;
            pointer-events: none;
            z-index: 1;
        `;

        // ⭐ 6. PARTÍCULAS MÁS GRANDES Y NUMEROSAS
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

        // Crear partículas mejoradas (más grandes y con más color)
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            const size = Math.random() * 45 + 15;
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
                opacity: ${Math.random() * 0.12 + 0.03};
                animation: flotarParticula ${duration}s ease-in-out infinite alternate;
                animation-delay: ${delay}s;
                filter: blur(${Math.random() * 6 + 3}px);
            `;
            particles.appendChild(particle);
        }

        // ⭐ 7. EFECTO DE REFLEJO (brillo en la parte superior)
        const reflejo = document.createElement('div');
        reflejo.style.cssText = `
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.08) 0%, transparent 60%);
            pointer-events: none;
            border-radius: 50%;
            z-index: 0;
        `;
        messageContainer.appendChild(reflejo);

        // Ensamblar
        messageContainer.appendChild(texto);
        messageContainer.appendChild(particles);
        modal.appendChild(messageContainer);
        document.body.appendChild(modal);

        // ⭐ 8. ESTILOS Y ANIMACIONES MEJORADOS
        const style = document.createElement('style');
        style.id = 'estilos-psicodelicos';
        style.textContent = `
            @keyframes flotarParticula {
                0% { 
                    transform: translate(0, 0) scale(1) rotate(0deg); 
                }
                100% { 
                    transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) scale(${Math.random() * 0.8 + 0.6}) rotate(${Math.random() * 360}deg); 
                }
            }
            @keyframes girarBorde {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes destelloColor {
                0% { 
                    text-shadow: 0 0 30px rgba(255,107,107,0.4), 0 0 60px rgba(255,107,107,0.2), 0 0 100px rgba(255,107,107,0.1); 
                }
                25% { 
                    text-shadow: 0 0 30px rgba(254,202,87,0.4), 0 0 60px rgba(254,202,87,0.2), 0 0 100px rgba(254,202,87,0.1); 
                }
                50% { 
                    text-shadow: 0 0 30px rgba(72,219,251,0.4), 0 0 60px rgba(72,219,251,0.2), 0 0 100px rgba(72,219,251,0.1); 
                }
                75% { 
                    text-shadow: 0 0 30px rgba(245,104,224,0.4), 0 0 60px rgba(245,104,224,0.2), 0 0 100px rgba(245,104,224,0.1); 
                }
                100% { 
                    text-shadow: 0 0 30px rgba(255,107,107,0.4), 0 0 60px rgba(255,107,107,0.2), 0 0 100px rgba(255,107,107,0.1); 
                }
            }
            @keyframes pulsoSuave {
                0% { transform: scale(1); }
                50% { transform: scale(1.03); }
                100% { transform: scale(1); }
            }
            @keyframes brilloReflejo {
                0% { opacity: 0.3; transform: translateX(-10px); }
                50% { opacity: 0.8; transform: translateX(10px); }
                100% { opacity: 0.3; transform: translateX(-10px); }
            }
        `;
        document.head.appendChild(style);

        // Guardar referencias
        window._modalPsicodelico = {
            container: modal,
            overlay: overlay,
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
            const ref = window._modalPsicodelico;
            if (ref && !ref.oculto && !loginRealizado) {
                ocultarModalTemporalmente();
            }
        });

        // ⭐ EVENTO: Detectar login exitoso
        document.addEventListener('loginExitoso', function () {
            loginRealizado = true;
            ocultarModalPermanente();
        });

        // ⭐ EVENTO: Detectar si el usuario está escribiendo en el formulario
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

        // Ocultar modal y overlay con animación
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

        // Ocultar con animación
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

        // Mostrar con animación
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

    // ===== CAMBIAR COLOR DE FONDO MEJORADO =====
    function cambiarColorFondo(elemento) {
        const color = getColorAleatorio();
        const color2 = getColorAleatorio();
        elemento.style.background = `
            radial-gradient(circle at 30% 40%, ${color}35, ${color}10 60%, transparent 80%),
            radial-gradient(circle at 70% 60%, ${color2}25, transparent 60%),
            rgba(255, 255, 255, 0.06)
        `;
        elemento.style.boxShadow = `
            0 0 80px ${color}25,
            0 0 150px ${color}15,
            inset 0 0 100px ${color}08,
            inset 0 0 200px ${color2}05
        `;
        elemento.style.border = `1px solid ${color}30`;
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
                0 0 30px ${colorSombra}50,
                0 0 60px ${colorSombra}30,
                0 0 100px ${colorSombra}15,
                0 0 150px ${colorSombra}10
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
        if (ref.overlay) {
            ref.overlay.style.opacity = '1';
        }

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