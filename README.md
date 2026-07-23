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
- `assets/js/animations.js` — animaciones Anime.js (traza de circuito, circuito de Mónaco con punto de telemetría, revelado al hacer scroll, contadores).
- `assets/js/sims/` — un módulo de simulador interactivo por sesión (`ohm-law`, `voltage-divider`, `onewire-temp`, `i2c-imu`, `gps-lora`) + `registry.js` (registro compartido y utilidades). `assets/css/sims.css` los estiliza.
- `assets/img/LogoMadrams.png` — logo del equipo, usado en el header y como favicon del sitio.
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

## Simuladores y modelos 3D

Cada sesión (1–5) incluye un simulador interactivo (sección "Laboratorio interactivo",
código en `assets/js/sims/<sesion>.js`) y un slot para modelo 3D del componente principal
en el hero. Los slots muestran un placeholder con borde punteado hasta que se les asigna
un archivo `.glb`/`.gltf`. La sesión 6 (proyecto abierto) no lleva simulador ni modelo.

**Para añadir un modelo 3D real:**

1. Coloca el archivo en `assets/models/<componente>.glb` (crea la carpeta `assets/models/` si no existe).
2. En `assets/js/data/sesion-N.js`, pon la ruta en `model.src`, por ejemplo:

       model: { label: 'Arduino Uno', alt: 'Modelo 3D de Arduino Uno', src: '../assets/models/arduino.glb' }

3. Al recargar, el slot pasa de placeholder a un visor `<model-viewer>` rotable
   (mouse/touch), con auto-rotación al entrar en viewport y rotación ligada al scroll de
   la sección. `<model-viewer>` se carga por CDN (`@google/model-viewer`); no requiere build.

## Pendientes para el usuario

- Añadir los modelos `.glb` de los componentes principales (Arduino, potenciómetro, DS18B20, MPU6050, GPS) — ver "Simuladores y modelos 3D" arriba.
- Reemplazar los placeholders de foto (marcados en cada sesión) por fotos reales del hardware cuando estén disponibles.
- Actualizar los links de Notion en `assets/js/data/sesion-*.js` (`cta.url`) si las páginas de Práctica cambian de ubicación.
