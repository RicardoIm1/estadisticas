function cerrarSesion() {
  const seguro = confirm('¿Estás seguro de que quieres cerrar sesión?');

  if (!seguro) return;

  // Limpia sesión local
  localStorage.clear();

  // (Opcional) Limpia cookies propias si usas alguna
  // document.cookie = "sesion=; max-age=0; path=/";

  // Redirige al login
  window.location.href = '/estadisticas/login.html';
}
