/* ==========================================================
   OZARK - base.js
   Maneja la apertura y el cierre del menu en pantallas chicas
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

    const boton = document.getElementById('menuBoton');
    const menu  = document.getElementById('menuPrincipal');

    // Si alguna pagina no tiene el menu, no hacemos nada
    if (!boton || !menu) return;

    boton.addEventListener('click', function () {
        const estaAbierto = menu.classList.toggle('abierto');

        // Avisamos a los lectores de pantalla si el menu quedo abierto o cerrado
        boton.setAttribute('aria-expanded', estaAbierto);
        boton.setAttribute('aria-label', estaAbierto ? 'Cerrar menu' : 'Abrir menu');

        // Cambiamos el icono de barras por una cruz
        boton.innerHTML = estaAbierto
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    });

    // Al tocar un item del menu, se cierra solo
    menu.querySelectorAll('a').forEach(function (enlace) {
        enlace.addEventListener('click', function () {
            menu.classList.remove('abierto');
            boton.setAttribute('aria-expanded', 'false');
            boton.setAttribute('aria-label', 'Abrir menu');
            boton.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    // Si se agranda la ventana, el menu vuelve a su estado normal
    window.addEventListener('resize', function () {
        if (window.innerWidth > 760) {
            menu.classList.remove('abierto');
            boton.setAttribute('aria-expanded', 'false');
            boton.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

});
