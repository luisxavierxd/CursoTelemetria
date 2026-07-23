# Curso Telemetría — Nuevo Ingreso (sitio web)

Sitio estático del curso introductorio de electrónica para telemetría de MadRams (Minibaja SAE). Portada + 6 páginas de sesión, sin build step.

## Ver en local

Desde la raíz del proyecto:

    python -m http.server 8000

Abre `http://localhost:8000/`.

## Estructura

- `index.html` — portada con el temario.
- `sesiones/sesion-N.html` — shells que cargan `assets/js/data/sesion-N.js` (contenido) y `assets/js/session-template.js` (el que arma la página).
- `assets/css/` — `tokens.css` (paleta/tipografía), `base.css` (componentes compartidos), `home.css`, `sesion.css`.
- `assets/js/animations.js` — animaciones Anime.js (traza de circuito, revelado al hacer scroll, contadores).
- `assets/img/logo-placeholder.svg` — reemplázalo por el logo real de MadRams cuando lo tengas.
- `assets/img/placeholders/` — usado como referencia para dónde van fotos reales (los placeholders visibles se generan en el propio HTML/JS, no son archivos).
- `assets/img/diagrams/` — diagramas esquemáticos genéricos (SVG), no fotos.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (puede ser `usuario.github.io` o cualquier otro nombre — el sitio usa rutas relativas, funciona igual como user-page o project-page).
2. Desde esta carpeta:

       git remote add origin <url-del-repo>
       git branch -M main
       git push -u origin main

3. En GitHub: Settings → Pages → Source: rama `main`, carpeta `/ (root)`.
4. Espera unos minutos; el sitio queda en `https://<usuario>.github.io/<repo>/` (o en la raíz si es un user-page).

## Pendientes para el usuario

- Reemplazar `assets/img/logo-placeholder.svg` por el logo real de MadRams.
- Reemplazar los placeholders de foto (marcados en cada sesión) por fotos reales del hardware cuando estén disponibles.
- Actualizar los links de Notion en `assets/js/data/sesion-*.js` (`cta.url`) si las páginas de Práctica cambian de ubicación.
