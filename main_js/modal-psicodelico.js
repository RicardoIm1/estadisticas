/**
 * Modal Psicodélico de Mensajes Positivos
 * Con transición cruzada (fade cross) - Versión LENTA y ALEATORIA
 */

(function () {
    'use strict';

    // ===== CONFIGURACIÓN =====
    const CONFIG = {
        interval: 9000,              // 9 segundos entre mensajes
        transitionDuration: 3000,    // 3 segundos de transición cruzada
        tiempoVisible: 5000,         // 5 segundos visible después de la transición
        fontSize: '2.8rem',
        maxMessages: 1,
        zIndex: 9999,
        tiempoReaparicion: 30000,
        ocultoPorClick: false
    };

    // ===== MENSAJES =====
    const mensajes = [
        "La disciplina supera al talento cuando el talento no trabaja.",
        "Cada mañana decides si eres víctima del día o dueño de tu tiempo.",
        "La productividad no es hacer más, es hacer lo que importa.",
        "Deja de esperar el momento perfecto, el momento es ahora.",
        "Tu mente es tu taller, cuida lo que fabricas en ella.",
        "El cambio no duele, lo que duele es seguir igual.",
        "La acción constante vence al miedo persistente.",
        "No confundas movimiento con avance.",
        "La excelencia no es un acto, es un hábito.",
        "El fracaso es datos, no destino.",
        "Tu única competencia es la persona que fuiste ayer.",
        "El enfoque es el arte de decir no a lo que no importa.",
        "La energía sigue a la atención, ponla donde creces.",
        "El dolor del esfuerzo es temporal, el dolor del arrepentimiento es eterno.",
        "No construyas una vida para impresionar, constrúyela para vivir.",
        "La claridad precede al éxito.",
        "El que domina su mente domina su mundo.",
        "Cada pequeño paso es una victoria invisible.",
        "No esperes la motivación, cultiva la disciplina.",
        "Tu entorno te moldea, elige bien tus compañeros.",
        "El pasado es un profesor, no una prisión.",
        "El miedo a empezar es más caro que cualquier error.",
        "Los sistemas superan a las metas.",
        "La paciencia no es esperar, es mantener el rumbo.",
        "Deja de sobrepensar, empieza a sobrehacer.",
        "El crecimiento requiere incomodidad.",
        "La gratitud no es ingenua, es estratégica.",
        "El éxito es la práctica diaria de pequeños hábitos.",
        "No te ahogas cayendo, te ahogas quedándote abajo.",
        "El mejor momento para plantar un árbol fue hace 20 años, el segundo es ahora.",
        "La resiliencia no es aguantar, es adaptarse.",
        "Tu diálogo interno es el guion de tu vida, escríbelo bien.",
        "La pereza es el disfraz del miedo.",
        "Cada día es un borrador, edítalo bien.",
        "El valor no es no tener miedo, es actuar a pesar de él.",
        "La simplicidad es la máxima sofisticación.",
        "No busques excusas, busca soluciones.",
        "El conocimiento es poder, la acción es resultado.",
        "La vida mejora cuando mejoras tú.",
        "El equilibrio no es estático, es dinámico.",
        "La crítica constructiva es un regalo, no un ataque.",
        "El éxito es un viaje, no un destino.",
        "La constancia convierte lo ordinario en extraordinario.",
        "El que no arriesga, no gana.",
        "La inteligencia se demuestra adaptándose, no sabiéndolo todo.",
        "La felicidad es un subproducto del esfuerzo significativo.",
        "No te compares con otros, compárate con tu potencial.",
        "El hoy es el ayer del mañana, hazlo valer.",
        "La pereza es el lujo que no puedes permitirte.",
        "El propósito da sentido al sufrimiento.",
        "La responsabilidad es libertad.",
        "El cambio empieza cuando el dolor de quedarse supera al de irse.",
        "La eficiencia es hacer bien las cosas, la eficacia es hacer las cosas correctas.",
        "No dejes para mañana lo que puedes hacer hoy mal, hazlo bien ahora.",
        "La autocompasión es un callejón sin salida.",
        "El aprendizaje es el oxígeno del crecimiento.",
        "La adversidad te muestra quién eres realmente.",
        "El control es una ilusión, la adaptación es poder.",
        "La grandeza está en los pequeños detalles.",
        "No busques resultados inmediatos, busca progreso constante.",
        "La vida es una serie de decisiones, elige bien.",
        "El esfuerzo sostenido es la clave del dominio.",
        "La negatividad es un imán, la positividad es un motor.",
        "La incertidumbre es el espacio del crecimiento.",
        "El hábito es el ladrillo de la construcción.",
        "No te centres en el problema, enfócate en la solución.",
        "El descanso no es debilidad, es estrategia.",
        "La honestidad contigo mismo es el primer paso.",
        "El éxito es la suma de decisiones correctas.",
        "La creatividad es la inteligencia en acción.",
        "El tiempo es el único recurso no renovable, úsalo bien.",
        "La visión sin acción es un sueño, la acción sin visión es caos.",
        "El poder está en la elección, no en la circunstancia.",
        "La vida es un espejo, devuelve lo que das.",
        "El propósito no se encuentra, se construye.",
        "La humildad es la base del aprendizaje.",
        "No tengas miedo de empezar de nuevo, es una oportunidad.",
        "La calidad de tu vida es la calidad de tus pensamientos.",
        "El progreso es más importante que la perfección.",
        "La disciplina es el puente entre metas y logros.",
        "El cambio es incómodo, pero necesario.",
        "La paciencia no es pasiva, es activa y persistente.",
        "No te aferres a lo que te limita.",
        "La fuerza no viene de la capacidad física, viene de la voluntad.",
        "El éxito es una decisión diaria.",
        "La vida es corta, no la desperdicies en mediocridad.",
        "El optimismo no es ignorar los problemas, es enfrentarlos con fe.",
        "La acción es el antídoto del miedo.",
        "La integridad es hacer lo correcto, aunque nadie mire.",
        "El aprendizaje es un viaje sin destino.",
        "La vida te da lo que te atreves a pedir.",
        "El esfuerzo es el precio de la grandeza.",
        "La claridad es poder, confunde la mente y pierdes el rumbo.",
        "No dejes que el ruido externo apague tu voz interna.",
        "La resiliencia se forja en la adversidad.",
        "El éxito es hacer lo que dices que harás.",
        "La vida es un juego, aprende las reglas y juega bien.",
        "La honestidad es la mejor política para la mente.",
        "El enfoque es la clave del dominio.",
        "No te detengas, el mundo no espera.",
        "La creatividad es la manera de resolver problemas.",
        "El valor es hacer lo correcto cuando es difícil.",
        "La vida es un eco, lo que das vuelve.",
        "El progreso es el resultado de la constancia.",
        "La mentalidad de crecimiento es la única que vale.",
        "No te conformes con lo que sabes, busca más.",
        "La acción es la respuesta a la duda.",
        "El éxito es una consecuencia, no un objetivo.",
        "La vida es un viaje, disfruta el trayecto.",
        "La perseverancia es el camino al éxito.",
        "El cambio es la única constante, acéptalo.",
        "La pasión es el combustible del alma.",
        "No te rindas, el esfuerzo siempre rinde frutos.",
        "La vida es una oportunidad, aprovechala.",
        "La autenticidad es la clave de la conexión.",
        "El aprendizaje es un acto de humildad.",
        "La acción es la que transforma el pensamiento en realidad.",
        "El éxito es la práctica del día a día.",
        "La vida es un lienzo, píntalo con tus acciones.",
        "El esfuerzo es la moneda del éxito.",
        "La claridad mental es el primer paso.",
        "El cambio empieza en ti.",
        "La vida es un regalo, no lo desaproveches.",
        "La perseverancia es la madre del logro.",
        "El éxito es un proceso, no un evento.",
        "La vida es una aventura, vívela.",
        "La acción es la que define al héroe.",
        "El aprendizaje es el camino al poder.",
        "La vida es un desafío, afróntalo.",
        "El éxito es la suma de pequeñas victorias.",
        "La vida es una oportunidad, no la dejes pasar.",
        "La perseverancia es la clave del triunfo.",
        "El cambio es una oportunidad, no una amenaza.",
        "La vida es un viaje de autodescubrimiento.",
        "El éxito es un hábito, no un destino.",
        "La acción es la que genera resultados.",
        "La vida es un juego de estrategia, juega bien.",
        "El esfuerzo es la base del logro.",
        "La claridad es el principio del éxito.",
        "El cambio es el camino al crecimiento.",
        "La vida es una oportunidad para crecer.",
        "La perseverancia es la fuerza del alma.",
        "El éxito es la recompensa del esfuerzo.",
        "La vida es un reflejo de tus pensamientos.",
        "La acción es la que materializa los sueños.",
        "El aprendizaje es la llave del progreso.",
        "La vida es un lienzo de posibilidades.",
        "El esfuerzo es el motor del cambio.",
        "La claridad es la guía del camino.",
        "El éxito es el fruto de la constancia.",
        "La vida es una oportunidad para ser mejor.",
        "La perseverancia es la aliada del éxito.",
        "El cambio es la esencia del progreso.",
        "La acción es la semilla del resultado.",
        "El éxito es la práctica de la excelencia.",
        "La vida es un viaje de mejora continua.",
        "El esfuerzo es la clave del dominio.",
        "La claridad es el faro en la tormenta.",
        "El cambio es la oportunidad de reinventarse.",
        "La vida es una escuela, aprende bien.",
        "La perseverancia es el puente al éxito.",
        "El éxito es el resultado de la disciplina.",
        "La acción es la que vence al miedo.",
        "La vida es un regalo, úsalo bien.",
        "El aprendizaje es el camino a la sabiduría.",
        "El esfuerzo es el precio del progreso.",
        "La claridad es el mapa del éxito.",
        "El cambio es la chispa del crecimiento.",
        "La vida es una oportunidad de ser grande.",
        "La perseverancia es la virtud de los fuertes.",
        "El éxito es la consecuencia de la constancia.",
        "La acción es la que mueve el mundo.",
        "La vida es un desafío, acéptalo.",
        "El aprendizaje es el motor de la vida.",
        "El esfuerzo es el secreto del éxito.",
        "La claridad es el norte del camino.",
        "El cambio es el aliento de la vida.",
        "La vida es una oportunidad de brillar.",
        "La perseverancia es la clave del triunfo.",
        "El éxito es la recompensa del trabajo.",
        "La acción es la que construye el futuro.",
        "La vida es un viaje de autosuperación.",
        "El aprendizaje es el pilar del crecimiento.",
        "El esfuerzo es el combustible del logro.",
        "La claridad es la brújula del éxito.",
        "El cambio es el arte de adaptarse.",
        "La vida es una oportunidad de mejorar.",
        "La perseverancia es la fuerza del carácter.",
        "El éxito es la meta del esfuerzo.",
        "La acción es el primer paso al éxito.",
        "La vida es un proceso de evolución.",
        "El aprendizaje es la fuente del poder.",
        "El esfuerzo es la base del progreso.",
        "La claridad es el camino al logro.",
        "El cambio es la esencia de la vida.",
        "La vida es una oportunidad de crecer.",
        "La perseverancia es el camino al éxito.",
        "El éxito es la culminación del esfuerzo.",
        "La acción es la que marca la diferencia.",
        "La vida es un viaje de transformación.",
        "El aprendizaje es la herramienta del éxito.",
        "El esfuerzo es la clave del progreso.",
        "La claridad es el inicio del cambio.",
        "El cambio es la oportunidad de ser mejor.",
        "La vida es una oportunidad de reinventarse.",
        "La perseverancia es la llave del éxito.",
        "El éxito es el resultado de la acción.",
        "La acción es la que lleva al logro.",
        "La vida es un lienzo de oportunidades.",
        "El aprendizaje es el camino al éxito.",
        "El esfuerzo es el motor del cambio.",
        "La claridad es el primer paso al éxito.",
        "El cambio es la oportunidad de crecer.",
        "La vida es un viaje de autodescubrimiento.",
        "La perseverancia es el aliado del éxito.",
        "El éxito es la recompensa del esfuerzo.",
        "La acción es la que construye el sueño.",
        "La vida es una oportunidad de ser feliz.",
        "El aprendizaje es la base del progreso.",
        "El esfuerzo es el secreto del cambio.",
        "La claridad es el camino al crecimiento.",
        "El cambio es la oportunidad de avanzar.",
        "La vida es un regalo de posibilidades.",
        "La perseverancia es la virtud del éxito.",
        "El éxito es la meta de la constancia.",
        "La acción es la que transforma la vida.",
        "La vida es una oportunidad de brillar."
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
    let cicloActivo = false;
    let ultimoIndice = -1; // ⭐ Para evitar repetir mensajes consecutivos

    // ===== FUNCIÓN PARA OBTENER MENSAJE ALEATORIO (sin repetir consecutivamente) =====
    function getMensajeAleatorio() {
        let nuevoIndice;
        do {
            nuevoIndice = Math.floor(Math.random() * mensajes.length);
        } while (nuevoIndice === ultimoIndice && mensajes.length > 1);

        ultimoIndice = nuevoIndice;
        return mensajes[nuevoIndice];
    }

    // ===== FUNCIÓN PARA OBTENER COLOR ALEATORIO =====
    function getColorAleatorio() {
        return colores[Math.floor(Math.random() * colores.length)];
    }

    // ===== FUNCIÓN PARA OBTENER COLOR DE FUENTE ALEATORIO =====
    function getColorFuenteAleatorio() {
        const coloresFuente = [
            '#FF6B6B', '#FF8E53', '#FECA57', '#48DBFB',
            '#FF9FF3', '#54A0FF', '#F368E0', '#FF9F43',
            '#00D2D3', '#FF6B6B', '#A29BFE', '#FD79A8',
            '#00B894', '#FDCB6E', '#E17055', '#74B9FF'
        ];
        return coloresFuente[Math.floor(Math.random() * coloresFuente.length)];
    }

    // ===== FUNCIÓN PARA MEZCLAR ARRAY (Fisher-Yates) =====
    function mezclarArray(array) {
        const copia = [...array];
        for (let i = copia.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copia[i], copia[j]] = [copia[j], copia[i]];
        }
        return copia;
    }

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

        // CONTENEDOR PARA LOS DOS TEXTOS
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

        // TEXTO 1 (Mensaje actual - sale)
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

        // TEXTO 2 (Mensaje entrante)
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
            @keyframes respiracionSuave {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
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
            textoActivo: 1,
            enTransicion: false
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
        }, 500);

        ref.intervalId = setInterval(mostrarSiguienteMensaje, CONFIG.interval);
    }

    // ===== MOSTRAR SIGUIENTE MENSAJE CON TRANSICIÓN CRUZADA LENTA =====
    function mostrarSiguienteMensaje() {
        const ref = window._modalPsicodelico;
        if (!ref || ref.oculto || loginRealizado || ref.enTransicion) return;

        ref.enTransicion = true;
        cicloActivo = true;

        const { texto1, texto2 } = ref;

        // ⭐ OBTENER MENSAJE ALEATORIO (sin repetir consecutivamente)
        const mensaje = getMensajeAleatorio();
        const colorFuente = getColorFuenteAleatorio();
        const colorSombra = getColorAleatorio();

        // Determinar qué texto está activo
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

        // 1. PREPARAR EL TEXTO ENTRANTE (invisible)
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
        textoEntrada.style.transform = 'scale(0.6) rotate(3deg)';
        textoEntrada.style.opacity = '0';

        // Forzar reflow
        void textoEntrada.offsetWidth;

        // 2. INICIAR TRANSICIÓN CRUZADA LENTA
        textoSalida.style.opacity = '0';
        textoSalida.style.transform = 'scale(0.6) rotate(4deg)';

        textoEntrada.style.opacity = '1';
        textoEntrada.style.transform = 'scale(1) rotate(0deg)';

        // 3. ESPERAR A QUE TERMINE LA TRANSICIÓN
        setTimeout(() => {
            ref.enTransicion = false;
            textoSalida.style.opacity = '0';
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

        // ⭐ INICIALIZAR CON MENSAJE ALEATORIO
        const mensajeInicial = getMensajeAleatorio();
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
        ref.texto1.style.animation = 'respiracionSuave 4s ease-in-out infinite';

        // Ocultar texto2 inicialmente
        ref.texto2.style.opacity = '0';
        ref.texto2.style.transform = 'scale(0.6) rotate(3deg)';
        ref.textoActivo = 1;
        ref.enTransicion = false;

        if (ref.intervalId) {
            clearInterval(ref.intervalId);
            ref.intervalId = null;
        }

        setTimeout(() => {
            if (!ref.oculto && !loginRealizado) {
                mostrarSiguienteMensaje();
            }
        }, CONFIG.tiempoVisible + 1000);

        ref.intervalId = setInterval(() => {
            if (!ref.oculto && !loginRealizado) {
                mostrarSiguienteMensaje();
            }
        }, CONFIG.interval);
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
            ref.intervalId = setInterval(() => {
                if (!ref.oculto && !loginRealizado) {
                    mostrarSiguienteMensaje();
                }
            }, CONFIG.interval);
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