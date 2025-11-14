    function verificarAutenticacion() {
      const usuario = localStorage.getItem('usuario');
      const rol = localStorage.getItem('rol');
      const loginTime = localStorage.getItem('loginTime');

      console.log('🔍 Verificando sesión:', { usuario, rol, loginTime });

      // ✅ Si NO hay sesión activa, redirigir AL LOGIN CORRECTO
      if (!usuario || !rol || !loginTime) {
        console.warn('❌ No hay sesión activa - Redirigiendo a login');
        window.location.href = '/estadisticas/login.html';
        return false;
      }

      // Verificar expiración (24 horas)
      const ahora = Date.now();
      const horasTranscurridas = (ahora - parseInt(loginTime)) / (1000 * 60 * 60);

      if (horasTranscurridas > 24) {
        console.warn('⏰ Sesión expirada - Redirigiendo a login');
        localStorage.clear();
        window.location.href = '/estadisticas/login.html';
        return false;
      }

      console.log('✅ Sesión activa:', usuario, 'Rol:', rol);

      // Mostrar en el header
      const userElement = document.getElementById('user-info');
      if (userElement) {
        userElement.innerHTML = `${usuario} (${rol})`;
      }

      return true;
    }

    // Verificar al cargar la página - VERSIÓN MEJORADA
    document.addEventListener('DOMContentLoaded', function () {
      console.log('📍 Página cargada:', window.location.href);

      // Verificar sesión inmediatamente
      if (!verificarAutenticacion()) {
        console.log('🚨 Redirección en proceso...');
        // Detener cualquier ejecución adicional
        return;
      }

      // Solo ejecutar esto si la sesión es válida
      console.log('✅ Sesión válida, continuando...');

      // Hacer función global
      window.cerrarSesion = cerrarSesion;
    });

    // También verificar en window.load por si acaso
    window.addEventListener('load', function () {
      console.log('🔄 Window loaded - Verificando sesión nuevamente');
      verificarAutenticacion();
    });
