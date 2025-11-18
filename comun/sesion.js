async function verificarAutenticacion() {
  const usuario = localStorage.getItem('usuario');
  const rol = localStorage.getItem('rol');
  const loginTime = localStorage.getItem('loginTime');
  const token = localStorage.getItem('authToken');

  console.log('🔍 Verificando sesión:', { usuario, rol, loginTime });

  // 1. Verificación básica en frontend
  if (!usuario || !rol || !loginTime || !token) {
    console.warn('❌ No hay sesión activa - Redirigiendo a login');
    redirigirALogin();
    return false;
  }

  // 2. Verificar expiración
  const ahora = Date.now();
  const horasTranscurridas = (ahora - parseInt(loginTime)) / (1000 * 60 * 60);

  if (horasTranscurridas > 24) {
    console.warn('⏰ Sesión expirada - Redirigiendo a login');
    localStorage.clear();
    redirigirALogin();
    return false;
  }

  // 3. ✅ VERIFICACIÓN CRÍTICA: Validar con backend GAS
  try {
    const valido = await validarSesionBackend(usuario, token);
    if (!valido) {
      console.warn('🚫 Sesión inválida en backend - Redirigiendo');
      localStorage.clear();
      redirigirALogin();
      return false;
    }
  } catch (error) {
    console.error('Error validando sesión:', error);
    redirigirALogin();
    return false;
  }

  // 4. Mostrar usuario en el header
  const userElement = document.getElementById('user-info');
  if (userElement) {
    userElement.innerHTML = `${usuario} (${rol}) <button onclick="cerrarSesion()">Cerrar sesión</button>`;
  }

  // 5. ✅ PROTECCIÓN EXTRA: Ocultar contenido sensible
  protegerContenidoSensible(rol);

  return true;
}

// ✅ Validar sesión con tu backend GAS
async function validarSesionBackend(usuario, token) {
  const SCRIPT_URL = 'TU_URL_DE_APPS_SCRIPT_AQUI'; // Reemplaza con tu URL
  
  try {
    const response = await fetch(`${SCRIPT_URL}?usuario=${encodeURIComponent(usuario)}&clave=${encodeURIComponent(token)}&accion=validarSesion`);
    const resultado = await response.json();
    
    return resultado.success === true && resultado.rol;
  } catch (error) {
    console.error('Error validando con backend:', error);
    return false;
  }
}

// ✅ Ocultar/mostrar elementos según rol
function protegerContenidoSensible(rol) {
  // Ocultar elementos para roles no autorizados
  const elementosAdmin = document.querySelectorAll('[data-rol="admin"]');
  const elementosUsuario = document.querySelectorAll('[data-rol="usuario"]');
  
  if (rol !== 'admin') {
    elementosAdmin.forEach(el => {
      el.style.display = 'none';
    });
  }
  
  if (rol !== 'usuario' && rol !== 'admin') {
    elementosUsuario.forEach(el => {
      el.style.display = 'none';
    });
  }
}

function redirigirALogin() {
  // Usar ruta absoluta para evitar problemas
  window.location.href = window.location.origin + '/estadisticas/login.html';
}

// Cerrar sesión
async function cerrarSesion() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    // Opcional: Notificar al backend
    try {
      await fetch('TU_SCRIPT_URL?accion=logout&usuario=' + localStorage.getItem('usuario'));
    } catch (error) {
      console.log('Logout en backend falló, pero continuando...');
    }
    
    localStorage.clear();
    redirigirALogin();
  }
}

// 🔥 HACERLA GLOBAL DE INMEDIATO
window.cerrarSesion = cerrarSesion;

// Verificar sesión al cargar DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('📍 Página cargada:', window.location.href);
  
  // No verificar en página de login
  if (window.location.pathname.includes('login.html')) {
    return;
  }
  
  verificarAutenticacion();
});