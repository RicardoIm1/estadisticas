// proteccion.js - Colocar este archivo en TODAS las páginas protegidas

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwBFw1yuoeolvohoqT6eLWDr2qkU9S2QU0QRRKbwhfT_0Fwe6MokL6Fn_siqRR1uKhx/exec";

// ✅ Función global para manejar respuesta de validación
window.manejarValidacionSesion = function(resultado) {
    console.log("🔍 Validación de sesión:", resultado);
    
    // Remover script después de usarlo
    const script = document.getElementById("validacion-script");
    if (script) script.remove();

    if (!resultado.success) {
        console.warn("❌ Sesión inválida, redirigiendo...");
        localStorage.clear();
        window.location.href = '/login.html';
        return false;
    }
    
    // ✅ Sesión válida - Verificar permisos de rol si es necesario
    const rolActual = localStorage.getItem('rol');
    const paginaActual = window.location.pathname;
    
    if (!tienePermisos(rolActual, paginaActual)) {
        console.warn("🚫 Sin permisos para esta página");
        window.location.href = '/acceso-denegado.html';
        return false;
    }
    
    // ✅ Mostrar información de usuario
    mostrarInfoUsuario();
    return true;
};

// ✅ Verificar permisos según rol y página
function tienePermisos(rol, pagina) {
    const permisos = {
        'ADMIN': ['/control/', '/', '/caja/', '/gantt/', '/archivo/'],
        'CAJA': ['/caja/'],
        'Lector': ['/gantt/'],
        'ESTADISTICAS': ['/'],
        'ARCHIVO CLINICO': ['/archivo/']
    };
    
    return permisos[rol] && permisos[rol].some(ruta => pagina.includes(ruta));
}

// ✅ Validar sesión COMPLETA (frontend + backend)
async function validarSesionCompleta() {
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');
    const loginTime = localStorage.getItem('loginTime');
    const clave = localStorage.getItem('clave'); // Necesitamos guardar esto en el login

    console.log('🔍 Verificando sesión completa:', { usuario, rol });

    // 1. Verificación básica en frontend
    if (!usuario || !rol || !loginTime) {
        console.warn('❌ No hay sesión activa');
        redirigirALogin();
        return false;
    }

    // 2. Verificar expiración (24 horas)
    const ahora = Date.now();
    const horasTranscurridas = (ahora - parseInt(loginTime)) / (1000 * 60 * 60);
    if (horasTranscurridas > 24) {
        console.warn('⏰ Sesión expirada');
        localStorage.clear();
        redirigirALogin();
        return false;
    }

    // 3. ✅ VERIFICACIÓN CRÍTICA: Validar con backend
    return await validarConBackend(usuario);
}

// ✅ Validar con backend GAS
function validarConBackend(usuario) {
    return new Promise((resolve) => {
        // Usar la clave guardada como token
        const clave = localStorage.getItem('clave') || localStorage.getItem('authToken');
        
        if (!clave) {
            redirigirALogin();
            resolve(false);
            return;
        }

        // JSONP para validación
        const script = document.createElement('script');
        script.id = 'validacion-script';
        
        const params = new URLSearchParams({
            accion: 'validarSesion',
            usuario: usuario,
            token: clave,
            callback: 'manejarValidacionSesion',
            ip: 'validacion_web'
        });

        script.src = `${SCRIPT_URL}?${params.toString()}`;
        
        // Timeout por si falla
        const timeout = setTimeout(() => {
            const scriptElement = document.getElementById("validacion-script");
            if (scriptElement) {
                scriptElement.remove();
                console.warn('⏰ Timeout validando sesión');
                redirigirALogin();
                resolve(false);
            }
        }, 8000);

        // Override la función global temporalmente para capturar el resultado
        const originalManejarValidacion = window.manejarValidacionSesion;
        window.manejarValidacionSesion = function(resultado) {
            clearTimeout(timeout);
            if (script.parentNode) script.remove();
            window.manejarValidacionSesion = originalManejarValidacion;
            
            if (resultado.success) {
                resolve(true);
            } else {
                redirigirALogin();
                resolve(false);
            }
        };

        document.head.appendChild(script);
    });
}

function mostrarInfoUsuario() {
    const usuario = localStorage.getItem('usuario');
    const rol = localStorage.getItem('rol');
    
    const userElement = document.getElementById('user-info');
    if (userElement) {
        userElement.innerHTML = `
            ${usuario} (${rol}) 
            <button onclick="cerrarSesion()" class="btn-logout">Cerrar sesión</button>
        `;
    }
}

function redirigirALogin() {
    window.location.href = '/login.html';
}

// ✅ Cerrar sesión
window.cerrarSesion = function() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.clear();
        redirigirALogin();
    }
};

// ✅ INICIALIZACIÓN: Ejecutar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Iniciando sistema de protección...');
    
    // No proteger páginas de login
    if (window.location.pathname.includes('login.html') || 
        window.location.pathname.includes('index.html')) {
        return;
    }
    
    validarSesionCompleta();
});

// ✅ Verificación periódica cada 30 minutos
setInterval(() => {
    if (!window.location.pathname.includes('login.html')) {
        validarSesionCompleta();
    }
}, 30 * 60 * 1000);