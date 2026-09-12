# Ozark — Sitio web

Sitio estatico sobre la serie **Ozark** (Netflix, 2017–2022), hecho como
primera actividad de **Programación IV** en la UTN Facultad Regional Haedo.

## Qué tiene

| Página | Contenido |
|---|---|
| `index.html` | Portada a pantalla completa con imagen de fondo y presentacion en dos columnas |
| `temporadas.html` | Las cuatro temporadas en tarjetas |
| `personajes.html` | Doce personajes divididos en principales y secundarios |
| `galeria.html` | Seis imagenes con visor ampliado |
| `contacto.html` | Formulario con validación |
| `404.html` | Página de error con el estilo del sitio |

## Tecnologias

- HTML5 semántico
- CSS3 con variables, **Flexbox** para toda la maquetación, y `clamp()` para tipografía fluida
- JavaScript sin librerías: menú responsive, visor de imagenes y validación de formulario
- [Font Awesome 6](https://fontawesome.com/) para los íconos
- Tipografías [Jost](https://fonts.google.com/specimen/Jost) y [Archivo](https://fonts.google.com/specimen/Archivo) de Google Fonts

## Estructura

```
.
├── css/
│   └── estilos.css
├── img/
│   ├── favicon.svg
│   ├── Familia-Portada.jpg
│   ├── gal1-*.jpg … gal6-*.jpg
│   └── per-*.jpg
├── js/
│   └── base.js
├── index.html
├── temporadas.html
├── personajes.html
├── galeria.html
├── contacto.html
└── 404.html
```

## Decisiones técnicas

- **Todo maquetado con Flexbox**, sin Grid, siguiendo la consigna.
- Tres puntos de corte: escritorio, 980px y 760px. En celular el menú pasa a
  hamburguesa y todas las columnas se apilan.
- Los grupos de tarjetas son de 6 elementos para que ninguna fila quede
  incompleta en 3, 2 o 1 columnas.
- El formulario **no envía datos**: no hay servidor detrás. La validación es
  del lado del cliente y el resultado se muestra en pantalla.
- Se respeta `prefers-reduced-motion`: quien tenga activada la reducción de
  movimiento no ve animaciones.

## Cómo verlo

Clonar el repo y abrir `index.html` con la extension **Live Server** de VS Code.
Hace falta conexion a internet para las tipografias y los íconos, que se cargan
por CDN.

## Créditos

Ozark es una producción de Netflix. Todas las marcas, imagenes y contenidos
pertenecen a sus respectivos titulares. Este sitio se realizó con fines
académicos y sin fin de lucro.

**Alumno:** Acosta Tomas Lautaro — UTN FRH, Programación IV
