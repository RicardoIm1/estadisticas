/**
 * Modal Psicodélico - Versión Ultra Ligera
 */

(function () {
    'use strict';

    const CONFIG = {
        interval: 9000,
        transitionDuration: 3000,
        tiempoVisible: 5000,
        fontSize: '2.8rem',
        zIndex: 9999,
        tiempoReaparicion: 30000,
        particleCount: 12  // ⭐ Reducido a 12 para máximo rendimiento
    };

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

    const colores = ['#FF6B6B','#FF8E53','#FECA57','#48DBFB','#0ABDE3','#10AC84','#EE5A24','#895ae6','#FF9FF3','#54A0FF','#01A3A4','#F368E0','#FF9F43','#00D2D3'];

    // ===== ESTADO =====
    let state = {
        ref: null,
        intervalId: null,
        timerId: null,
        loginRealizado: false,
        ultimoIndice: -1
    };

    // ===== HELPERS =====
    function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function getMensaje() {
        let idx;
        do {
            idx = Math.floor(Math.random() * mensajes.length);
        } while (idx === state.ultimoIndice && mensajes.length > 1);
        state.ultimoIndice = idx;
        return mensajes[idx];
    }

    // ===== CREAR MODAL =====
    function crearModal() {
        if (document.getElementById('modal-psicodelico')) return;

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'overlay-psicodelico';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            zIndex: CONFIG.zIndex - 1, pointerEvents: 'none',
            background: 'radial-gradient(circle at center, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)',
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            transition: 'opacity 0.8s ease', opacity: '1'
        });
        document.body.appendChild(overlay);

        // Modal
        const modal = document.createElement('div');
        modal.id = 'modal-psicodelico';
        Object.assign(modal.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            zIndex: CONFIG.zIndex, pointerEvents: 'none',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            fontFamily: 'Arial, Helvetica, sans-serif', overflow: 'hidden',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
            opacity: '1', transform: 'scale(1)'
        });

        // Textos
        const container = document.createElement('div');
        Object.assign(container.style, {
            position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center',
            width: '100%', height: '100%', pointerEvents: 'none'
        });

        const t1 = document.createElement('div');
        t1.id = 'txt1';
        Object.assign(t1.style, {
            position: 'absolute', color: 'white', fontSize: CONFIG.fontSize, fontWeight: '700',
            textShadow: '0 0 40px rgba(0,0,0,0.6), 0 0 80px rgba(0,0,0,0.4)',
            lineHeight: '1.5', letterSpacing: '3px',
            transition: `all ${CONFIG.transitionDuration}ms cubic-bezier(0.4,0,0.2,1)`,
            opacity: '0', transform: 'scale(0.8) rotate(-2deg)',
            padding: '30px 40px', pointerEvents: 'none',
            textAlign: 'center', maxWidth: '85vw', zIndex: '2'
        });

        const t2 = t1.cloneNode();
        t2.id = 'txt2';
        t2.style.zIndex = '1';

        // Partículas (solo 12)
        const particles = document.createElement('div');
        Object.assign(particles.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            pointerEvents: 'none', overflow: 'hidden', zIndex: CONFIG.zIndex - 0.5
        });

        for (let i = 0; i < CONFIG.particleCount; i++) {
            const size = Math.random() * 35 + 10;
            const p = document.createElement('div');
            const color = random(colores);
            const dur = Math.random() * 5 + 3;
            Object.assign(p.style, {
                position: 'absolute',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                width: size + 'px',
                height: size + 'px',
                borderRadius: '50%',
                background: color,
                opacity: Math.random() * 0.15 + 0.03,
                filter: `blur(${Math.random() * 6 + 2}px)`,
                animation: `flotar ${dur}s ease-in-out infinite alternate`,
                animationDelay: Math.random() * 4 + 's',
                willChange: 'transform'
            });
            particles.appendChild(p);
        }

        // CSS
        const style = document.createElement('style');
        style.id = 'psico-styles';
        style.textContent = `
            @keyframes flotar {
                0% { transform: translate(0,0) scale(1) rotate(0deg); }
                100% { transform: translate(${Math.random()*50-25}px,${Math.random()*50-25}px) scale(${Math.random()*0.5+0.5}) rotate(${Math.random()*360}deg); }
            }
            @keyframes destello {
                0%,100% { text-shadow: 0 0 40px rgba(255,107,107,0.3), 0 0 80px rgba(255,107,107,0.15); }
                25% { text-shadow: 0 0 40px rgba(254,202,87,0.3), 0 0 80px rgba(254,202,87,0.15); }
                50% { text-shadow: 0 0 40px rgba(72,219,251,0.3), 0 0 80px rgba(72,219,251,0.15); }
                75% { text-shadow: 0 0 40px rgba(245,104,224,0.3), 0 0 80px rgba(245,104,224,0.15); }
            }
            @keyframes respira {
                0%,100% { transform: scale(1); }
                50% { transform: scale(1.015); }
            }
        `;
        document.head.appendChild(style);

        // Ensamblar
        container.appendChild(t1);
        container.appendChild(t2);
        modal.appendChild(particles);
        modal.appendChild(container);
        document.body.appendChild(modal);

        state.ref = {
            modal, overlay, t1, t2, particles,
            activo: 1,
            enTransicion: false,
            oculto: false
        };

        // Eventos
        document.addEventListener('click', () => {
            if (state.ref && !state.ref.oculto && !state.loginRealizado) ocultarTemporal();
        });

        document.addEventListener('loginExitoso', () => {
            state.loginRealizado = true;
            ocultarPermanente();
        });

        document.querySelectorAll('#formularioLogin input').forEach(el => {
            el.addEventListener('focus', () => {
                if (state.ref && !state.ref.oculto && !state.loginRealizado) ocultarTemporal();
            });
        });
    }

    // ===== OCULTAR =====
    function ocultarTemporal() {
        const r = state.ref;
        if (!r || r.oculto) return;

        clearTimeout(state.timerId);
        if (r.particles) r.particles.style.animationPlayState = 'paused';

        r.modal.style.opacity = '0';
        r.modal.style.transform = 'scale(0.95)';
        r.overlay.style.opacity = '0';
        r.oculto = true;

        clearInterval(state.intervalId);
        state.intervalId = null;

        state.timerId = setTimeout(() => {
            if (!state.loginRealizado) mostrar();
        }, CONFIG.tiempoReaparicion);
    }

    function ocultarPermanente() {
        const r = state.ref;
        if (!r) return;

        clearTimeout(state.timerId);
        if (r.particles) r.particles.style.animationPlayState = 'paused';

        r.modal.style.opacity = '0';
        r.modal.style.transform = 'scale(0.95)';
        r.overlay.style.opacity = '0';
        r.oculto = true;

        clearInterval(state.intervalId);
        state.intervalId = null;
    }

    // ===== MOSTRAR =====
    function mostrar() {
        const r = state.ref;
        if (!r || state.loginRealizado) return;

        if (r.particles) r.particles.style.animationPlayState = 'running';

        r.modal.style.opacity = '1';
        r.modal.style.transform = 'scale(1)';
        r.overlay.style.opacity = '1';
        r.oculto = false;

        clearInterval(state.intervalId);
        state.intervalId = setInterval(siguiente, CONFIG.interval);

        setTimeout(siguiente, 500);
    }

    // ===== SIGUIENTE MENSAJE =====
    function siguiente() {
        const r = state.ref;
        if (!r || r.oculto || state.loginRealizado || r.enTransicion) return;

        r.enTransicion = true;

        const msg = getMensaje();
        const color = random(colores);
        const shadow = random(colores);

        const salida = r.activo === 1 ? r.t1 : r.t2;
        const entrada = r.activo === 1 ? r.t2 : r.t1;
        r.activo = r.activo === 1 ? 2 : 1;

        entrada.textContent = msg;
        entrada.style.color = color;
        entrada.style.textShadow = `0 0 40px ${shadow}50, 0 0 80px ${shadow}30, 0 0 120px ${shadow}15`;
        entrada.style.animation = 'destello 5s ease-in-out infinite';
        entrada.style.transform = 'scale(0.6) rotate(3deg)';
        entrada.style.opacity = '0';

        void entrada.offsetWidth;

        salida.style.opacity = '0';
        salida.style.transform = 'scale(0.6) rotate(4deg)';
        entrada.style.opacity = '1';
        entrada.style.transform = 'scale(1) rotate(0deg)';

        setTimeout(() => {
            r.enTransicion = false;
            salida.style.opacity = '0';
        }, CONFIG.transitionDuration + 100);
    }

    // ===== INICIAR =====
    function iniciar() {
        if (!document.getElementById('modal-psicodelico')) crearModal();
        const r = state.ref;
        if (!r) return;

        state.loginRealizado = false;
        r.oculto = false;
        r.modal.style.opacity = '1';
        r.modal.style.transform = 'scale(1)';
        r.overlay.style.opacity = '1';
        if (r.particles) r.particles.style.animationPlayState = 'running';

        const msg = getMensaje();
        const color = random(colores);
        const shadow = random(colores);

        r.t1.textContent = msg;
        r.t1.style.color = color;
        r.t1.style.textShadow = `0 0 40px ${shadow}50, 0 0 80px ${shadow}30, 0 0 120px ${shadow}15`;
        r.t1.style.animation = 'destello 5s ease-in-out infinite, respira 4s ease-in-out infinite';
        r.t1.style.opacity = '1';
        r.t1.style.transform = 'scale(1) rotate(0deg)';

        r.t2.style.opacity = '0';
        r.t2.style.transform = 'scale(0.6) rotate(3deg)';
        r.activo = 1;
        r.enTransicion = false;

        clearInterval(state.intervalId);
        state.intervalId = setInterval(siguiente, CONFIG.interval);

        setTimeout(siguiente, CONFIG.tiempoVisible + 1000);
    }

    // ===== DESTRUIR =====
    function destruir() {
        clearInterval(state.intervalId);
        clearTimeout(state.timerId);
        if (state.ref) {
            if (state.ref.modal) state.ref.modal.remove();
            if (state.ref.overlay) state.ref.overlay.remove();
        }
        const s = document.getElementById('psico-styles');
        if (s) s.remove();
        state.ref = null;
        delete window._modalPsicodelico;
    }

    // ===== API =====
    window.ModalPsicodelico = {
        iniciar,
        destruir,
        ocultarTemporal,
        mostrar,
        loginExitoso: () => { state.loginRealizado = true; ocultarPermanente(); },
        configurar: (opts) => {
            Object.assign(CONFIG, opts);
            if (state.ref) { destruir(); iniciar(); }
        }
    };

    // ===== AUTO-INICIO =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }

})();