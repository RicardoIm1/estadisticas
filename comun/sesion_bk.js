function verificarAutenticacion() {
  const usuario = localStorage.getItem('usuario');
  const rol = localStorage.getItem('rol');
  const loginTime = localStorage.getItem('loginTime');

  console.log('🔍 Verificando sesión:', { usuario, rol, loginTime });

  if (!usuario || !rol || !loginTime) {
    console.warn('❌ No hay sesión activa - Redirigiendo a login');
    window.location.href = '/login.html';
    return false;
  }

  // Expiración (24 h)
  const ahora = Date.now();
  const horasTranscurridas = (ahora - parseInt(loginTime)) / (1000 * 60 * 60);

  if (horasTranscurridas > 24) {
    console.warn('⏰ Sesión expirada - Redirigiendo a login');
    localStorage.clear();
    window.location.href = '/login.html';
    return false;
  }

  // Mostrar usuario en el header
  const userElement = document.getElementById('user-info');
  if (userElement) {
    userElement.innerHTML = `${usuario} (${rol})`;
  }

  return true;
}

// Cerrar sesión
function cerrarSesion() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    localStorage.clear();
    window.location.href = '/login.html';
  }
}

// 🔥 HACERLA GLOBAL DE INMEDIATO
window.cerrarSesion = cerrarSesion;

// Verificar sesión al cargar DOM
document.addEventListener('DOMContentLoaded', function () {
  console.log('📍 Página cargada:', window.location.href);
  verificarAutenticacion();
});

// Doble verificación opcional
window.addEventListener('load', function () {
  console.log('🔄 Window loaded - Verificando sesión nuevamente');
  verificarAutenticacion();
});
