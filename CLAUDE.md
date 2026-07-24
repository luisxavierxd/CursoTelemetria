# CLAUDE.md — guía de trabajo del repo

Sitio estático (GitHub Pages) del Curso de Telemetría de MadRams. **Sin build step, sin
framework, sin runner de pruebas.** HTML/CSS/JS vanilla + Anime.js y `@google/model-viewer`
por CDN. Ver `README.md` para estructura, publicación y el flujo de modelos 3D.

## Arquitectura (data-driven)

- Cada `sesiones/sesion-N.html` es un shell que carga `assets/js/data/sesion-N.js` +
  `assets/js/session-template.js`. **El contenido vive en los archivos de datos**, no en el
  HTML: título, `lesson` (array de bloques `concept`/`callout`/`diagram`/`lab`), `reference`,
  `errors`, `bibliography`, `simulator`, `model`. Para cambiar contenido, edita `data/sesion-N.js`.
- `session-template.js` renderiza todo desde los datos (hero + modelo 3D, lección con el
  laboratorio embebido, referencia, rieles laterales). Si tocas el orden/estructura de render,
  es aquí.
- Simuladores: un módulo por sesión en `assets/js/sims/`, se auto-registran en
  `window.TelemetrySims[tipo]`. Deben cargarse **antes** de `session-template.js` en el HTML.

## Cómo previsualizar y verificar (no hay tests)

```
python -m http.server 8000      # desde la raíz
```

- **JS:** `node -c archivo.js` para validar sintaxis antes de commitear.
- **Render real:** no hay tests; verifico con Chrome headless capturando el DOM o screenshot:
  ```
  "/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu \
    --hide-scrollbars --window-size=1240,4600 --force-prefers-reduced-motion \
    --screenshot=out.png "http://localhost:PORT/sesiones/sesion-N.html"
  ```
  `--force-prefers-reduced-motion` hace visibles los elementos `.reveal` (que si no quedan
  ocultos hasta hacer scroll). Los rieles laterales solo aparecen con ancho ≥1540px.
- **Ojo:** headless **no rasteriza WebGL**, así que los modelos 3D (`<model-viewer>`) salen
  como caja vacía en screenshots aunque estén bien. Para modelos, valida la estructura del
  `.glb` con node y que sirva 200; el render real se confirma en un navegador de verdad.

## Convenciones

- Respetar `prefers-reduced-motion` en toda animación nueva (hay helpers en `animations.js` y
  `sims/registry.js`).
- Diagramas explicativos: SVG en `assets/img/diagrams/`, referenciados desde la lección. Texto
  en `<text>` con cuidado de que no se salga del viewBox ni choque con líneas; si el texto
  queda chico, marca el diagrama `wide: true` en los datos (se renderiza a ~640px).
- Modelos 3D: ver README (export `.gltf` → `npx gltf-pipeline ... -d` → `model.src`).
  Texturas espejeadas se corrigen con `KHR_texture_transform`; orientación con `model.orientation`.
- Fondos y continuidad entre páginas (circuito de Mónaco, telemetría demo) usan `sessionStorage`
  para no reiniciarse al navegar.
