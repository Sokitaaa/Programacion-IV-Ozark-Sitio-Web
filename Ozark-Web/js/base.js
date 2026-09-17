/* ==========================================================
   OZARK - base.js
   1. Menu responsive
   2. Lightbox de la galeria
   3. Validacion del formulario de contacto
   ========================================================== */

document.addEventListener('DOMContentLoaded', function () {

    /* ======================================================
       1. MENU RESPONSIVE
       ====================================================== */
    const boton = document.getElementById('menuBoton');
    const menu  = document.getElementById('menuPrincipal');

    if (boton && menu) {

        boton.addEventListener('click', function () {
            const estaAbierto = menu.classList.toggle('abierto');

            boton.setAttribute('aria-expanded', estaAbierto);
            boton.setAttribute('aria-label', estaAbierto ? 'Cerrar menú' : 'Abrir menú');
            boton.innerHTML = estaAbierto
                ? '<i class="fa-solid fa-xmark"></i>'
                : '<i class="fa-solid fa-bars"></i>';
        });

        // Al tocar un item del menu, se cierra solo
        menu.querySelectorAll('a').forEach(function (enlace) {
            enlace.addEventListener('click', function () {
                menu.classList.remove('abierto');
                boton.setAttribute('aria-expanded', 'false');
                boton.setAttribute('aria-label', 'Abrir menú');
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
    }


    /* ======================================================
       2. LIGHTBOX DE LA GALERIA
       Abre la imagen en grande sobre un fondo oscuro.
       El HTML del visor lo crea este script, por eso la
       galeria no necesita marcado extra.
       ====================================================== */
    const items = document.querySelectorAll('.galeria__item');

    if (items.length > 0) {

        // Guardo los datos de cada imagen en un array
        const imagenes = [];
        items.forEach(function (item, i) {
            const img = item.querySelector('img');
            const pie = item.querySelector('figcaption');
            imagenes.push({
                src:  img.getAttribute('src'),
                alt:  img.getAttribute('alt') || '',
                pie:  pie ? pie.textContent : ''
            });

            // Cada figure pasa a ser clickeable y navegable con teclado
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Ampliar: ' + (img.getAttribute('alt') || 'imagen'));

            item.addEventListener('click', function () { abrir(i); });
            item.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    abrir(i);
                }
            });
        });

        // Armo el visor una sola vez y lo dejo oculto
        const visor = document.createElement('div');
        visor.className = 'visor';
        visor.setAttribute('role', 'dialog');
        visor.setAttribute('aria-modal', 'true');
        visor.setAttribute('aria-hidden', 'true');
        visor.innerHTML = `
            <button class="visor__cerrar" aria-label="Cerrar"><i class="fa-solid fa-xmark"></i></button>
            <button class="visor__anterior" aria-label="Imagen anterior"><i class="fa-solid fa-chevron-left"></i></button>
            <figure class="visor__contenido">
                <img class="visor__imagen" src="" alt="">
                <figcaption class="visor__pie"></figcaption>
            </figure>
            <button class="visor__siguiente" aria-label="Imagen siguiente"><i class="fa-solid fa-chevron-right"></i></button>
        `;
        document.body.appendChild(visor);

        const visorImg = visor.querySelector('.visor__imagen');
        const visorPie = visor.querySelector('.visor__pie');
        let actual = 0;
        let ultimoFoco = null;

        function mostrar(i) {
            // El resto (%) hace que despues de la ultima vuelva a la primera
            actual = (i + imagenes.length) % imagenes.length;
            visorImg.setAttribute('src', imagenes[actual].src);
            visorImg.setAttribute('alt', imagenes[actual].alt);
            visorPie.textContent = imagenes[actual].pie;
        }

        function abrir(i) {
            ultimoFoco = document.activeElement;
            mostrar(i);
            visor.classList.add('visor--abierto');
            visor.setAttribute('aria-hidden', 'false');
            // Bloqueo el scroll del fondo mientras el visor esta abierto
            document.body.style.overflow = 'hidden';
            visor.querySelector('.visor__cerrar').focus();
        }

        function cerrar() {
            visor.classList.remove('visor--abierto');
            visor.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            if (ultimoFoco) ultimoFoco.focus();
        }

        visor.querySelector('.visor__cerrar').addEventListener('click', cerrar);
        visor.querySelector('.visor__anterior').addEventListener('click', function () { mostrar(actual - 1); });
        visor.querySelector('.visor__siguiente').addEventListener('click', function () { mostrar(actual + 1); });

        // Clic en el fondo (no en la imagen ni en los botones) tambien cierra
        visor.addEventListener('click', function (e) {
            if (e.target === visor) cerrar();
        });

        document.addEventListener('keydown', function (e) {
            if (!visor.classList.contains('visor--abierto')) return;
            if (e.key === 'Escape')     cerrar();
            if (e.key === 'ArrowLeft')  mostrar(actual - 1);
            if (e.key === 'ArrowRight') mostrar(actual + 1);
        });
    }


    /* ======================================================
       3. VALIDACION DEL FORMULARIO
       ====================================================== */
    const formulario = document.querySelector('.formulario');

    if (formulario) {

        // Apago la validacion del navegador para usar la propia
        formulario.setAttribute('novalidate', '');

        // Cada campo obligatorio necesita un lugar donde mostrar su error
        const obligatorios = formulario.querySelectorAll('[required]');
        obligatorios.forEach(function (campo) {
            const aviso = document.createElement('span');
            aviso.className = 'campo__error';
            aviso.setAttribute('aria-live', 'polite');
            campo.insertAdjacentElement('afterend', aviso);

            // Al corregir, el error desaparece en el momento
            campo.addEventListener('input', function () {
                if (campo.classList.contains('campo--invalido')) revisar(campo);
            });
        });

        function revisar(campo) {
            const aviso = campo.nextElementSibling;
            const valor = campo.value.trim();
            let error = '';

            if (valor === '') {
                error = 'Este campo no puede quedar vacío.';
            } else if (campo.type === 'email') {
                // Algo, arroba, algo, punto, algo
                const patron = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
                if (!patron.test(valor)) error = 'Revisá el correo: falta el arroba o el punto.';
            } else if (campo.id === 'nombre' && valor.length < 3) {
                error = 'El nombre necesita al menos 3 caracteres.';
            } else if (campo.id === 'mensaje' && valor.length < 10) {
                error = 'Contame un poco más: al menos 10 caracteres.';
            }

            aviso.textContent = error;
            campo.classList.toggle('campo--invalido', error !== '');
            campo.setAttribute('aria-invalid', error !== '');
            return error === '';
        }

        formulario.addEventListener('submit', function (e) {
            e.preventDefault();   // el sitio no tiene servidor detras

            let todoBien = true;
            let primerError = null;

            obligatorios.forEach(function (campo) {
                if (!revisar(campo)) {
                    todoBien = false;
                    if (!primerError) primerError = campo;
                }
            });

            const resultado = document.getElementById('resultadoFormulario');

            if (!todoBien) {
                primerError.focus();
                if (resultado) {
                    resultado.className = 'resultado resultado--error';
                    resultado.textContent = 'Faltan datos. Revisá los campos marcados.';
                }
                return;
            }

            if (resultado) {
                resultado.className = 'resultado resultado--ok';
                resultado.textContent = 'Mensaje enviado. Te respondemos dentro de las 48 horas hábiles.';
            }

            formulario.reset();
            obligatorios.forEach(function (campo) {
                campo.classList.remove('campo--invalido');
                campo.nextElementSibling.textContent = '';
            });
        });
    }


    /* ======================================================
       4. CABECERA QUE SE ACHICA AL SCROLLEAR
       ====================================================== */
    const cabecera = document.querySelector('.cabecera');

    if (cabecera) {
        let pendiente = false;

        function revisarScroll() {
            cabecera.classList.toggle('cabecera--reducida', window.scrollY > 60);
            pendiente = false;
        }

        // requestAnimationFrame evita ejecutar la funcion en cada pixel
        // de scroll: la agenda para el proximo cuadro del navegador.
        window.addEventListener('scroll', function () {
            if (!pendiente) {
                pendiente = true;
                window.requestAnimationFrame(revisarScroll);
            }
        }, { passive: true });

        revisarScroll();
    }


    /* ======================================================
       5. SIMBOLOS DEL LOGO

       En la serie, cada episodio abre con la misma O dividida
       en cuatro, pero con cuatro pictogramas distintos que
       anticipan lo que va a pasar. Aca se sortean cuatro de
       esta lista en cada carga de pagina.

       Cada glifo esta dibujado en coordenadas locales de -4 a
       4 y el <g> que lo contiene ya viene posicionado en su
       cuadrante, asi que el dibujo no necesita saber donde va.
       ====================================================== */
    const GLIFOS = [

        // Barco
        '<path d="M-4 1 L4 1 L2.6 3.4 L-2.6 3.4 Z"/>' +
        '<rect x="-0.5" y="-4" width="1" height="5"/>' +
        '<path d="M0.6 -3.6 L3.4 -0.6 L0.6 -0.6 Z"/>',

        // Pez
        '<path d="M-4 0 L1 -2.6 L1 2.6 Z"/>' +
        '<path d="M1.4 0 L4 -2.2 L4 2.2 Z"/>',

        // Pino
        '<path d="M0 -4 L3 1 L-3 1 Z"/>' +
        '<rect x="-0.7" y="1" width="1.4" height="3"/>',

        // Llave
        '<circle cx="-2" cy="0" r="2.1" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
        '<rect x="0" y="-0.55" width="4" height="1.1"/>' +
        '<rect x="2.6" y="0.4" width="1" height="1.8"/>',

        // Cruz
        '<rect x="-0.8" y="-4" width="1.6" height="8"/>' +
        '<rect x="-3" y="-1.8" width="6" height="1.6"/>',

        // Reloj
        '<circle cx="0" cy="0" r="3.5" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
        '<path d="M0 -2 L0 0 L2 0.9" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>',

        // Casa
        '<path d="M0 -4 L4 -0.6 L4 3.8 L-4 3.8 L-4 -0.6 Z"/>',

        // Ficha de casino
        '<circle cx="0" cy="0" r="3.4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="2 1.4"/>',

        // Botella
        '<path d="M-1 -4 L1 -4 L1 -2 L2 -0.6 L2 3.8 L-2 3.8 L-2 -0.6 L-1 -2 Z"/>',

        // Rayo
        '<path d="M1 -4 L-2.4 0.6 L0 0.6 L-1 4 L2.6 -0.8 L0.2 -0.8 Z"/>',

        // Sobre
        '<rect x="-4" y="-2.6" width="8" height="5.2" rx="0.5" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
        '<path d="M-4 -2.4 L0 0.6 L4 -2.4" fill="none" stroke="currentColor" stroke-width="1.1"/>',

        // Gota
        '<path d="M0 -4 C2.6 -1 3.4 0.4 3.4 1.6 A3.4 3.4 0 0 1 -3.4 1.6 C-3.4 0.4 -2.6 -1 0 -4 Z"/>',

        // Auto
        '<path d="M-4 1.2 L-2.9 -0.8 L2.9 -0.8 L4 1.2 Z"/>' +
        '<circle cx="-2.2" cy="2" r="1.1"/>' +
        '<circle cx="2.2" cy="2" r="1.1"/>',

        // Ojo
        '<path d="M-4 0 C-2 -3 2 -3 4 0 C2 3 -2 3 -4 0 Z" fill="none" stroke="currentColor" stroke-width="1.1"/>' +
        '<circle cx="0" cy="0" r="1.2"/>'
    ];

    const ranuras = document.querySelectorAll('.logo__glifo');

    if (ranuras.length === 4) {

        // Fisher-Yates sobre una copia: mezcla pareja y sin repetidos.
        // Ordenar con Math.random() en el comparador da resultados
        // sesgados, por eso no lo uso.
        const baraja = GLIFOS.slice();
        for (let i = baraja.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const guardo = baraja[i];
            baraja[i] = baraja[j];
            baraja[j] = guardo;
        }

        ranuras.forEach(function (ranura, i) {
            ranura.innerHTML = baraja[i];
        });
    }



    /* ======================================================
       6. SUBMENU DESPLEGABLE

       En escritorio el submenu ya se abre solo con CSS (hover y
       focus-within). Este modulo suma el clic en la flecha, que
       es lo unico que funciona en celular, donde no hay hover.
       ====================================================== */
    const desplegables = document.querySelectorAll('.navegacion__item--desplegable');

    desplegables.forEach(function (item) {
        const flecha = item.querySelector('.navegacion__flecha');
        const lista  = item.querySelector('.submenu');

        if (!flecha || !lista) return;

        flecha.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const abierto = item.classList.toggle('abierto');
            flecha.setAttribute('aria-expanded', abierto);
            flecha.setAttribute('aria-label', abierto
                ? 'Cerrar el submenú de temporadas'
                : 'Abrir el submenú de temporadas');
        });

        // Clic fuera del item: se cierra
        document.addEventListener('click', function (e) {
            if (!item.contains(e.target)) {
                item.classList.remove('abierto');
                flecha.setAttribute('aria-expanded', 'false');
            }
        });

        // Escape cierra y devuelve el foco a la flecha
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && item.classList.contains('abierto')) {
                item.classList.remove('abierto');
                flecha.setAttribute('aria-expanded', 'false');
                flecha.focus();
            }
        });
    });

});
