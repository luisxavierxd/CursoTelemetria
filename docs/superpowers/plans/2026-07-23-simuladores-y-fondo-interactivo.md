# Simuladores interactivos, slots 3D y fondo animado — Plan de Implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enriquecer el sitio del curso (ya funcional) con un simulador interactivo por sesión, slots de modelo 3D listos para `.glb`, un fondo animado en dos capas (profundidad + circuito de Mónaco con punto de telemetría), y arreglar diagramas SVG recortados — todo estático, sin build step.

**Architecture:** Se extiende el patrón data-driven existente (`data/sesion-N.js` + `session-template.js`). Se añaden campos opcionales `simulator` y `model` a los datos; el template gana `renderSimulator()` y `renderModel()`. Cada simulador es un módulo autónomo en `assets/js/sims/` que se auto-registra en `window.TelemetrySims`. El fondo es CSS (capa A) + Anime.js sobre un SVG del circuito (capa B). Sin dependencias nuevas salvo `@google/model-viewer` por CDN.

**Tech Stack:** HTML/CSS/JS vanilla, Anime.js v3 (ya presente, CDN), `@google/model-viewer` (CDN, web component), SVG. Sin build step, sin runner de pruebas — verificación en navegador.

**Verificación (aplica a todas las tareas):** Servir la carpeta y abrir la página relevante:
```bash
python -m http.server 8080    # desde la raíz del repo; o: npx serve .
```
Luego abrir `http://localhost:8080/index.html` o `.../sesiones/sesion-N.html`. Criterio base en cada checkpoint: **consola del navegador sin errores** + el comportamiento descrito. Probar también con DevTools → "Emulate CSS prefers-reduced-motion: reduce" donde se indique.

---

## Estructura de archivos

Nuevos:
```
assets/css/sims.css                estilos de .sim (simuladores) y .model-slot
assets/js/sims/registry.js         window.TelemetrySims + helpers (revealOnView, scrollRotate)
assets/js/sims/ohm-law.js          simulador S1
assets/js/sims/voltage-divider.js  simulador S2
assets/js/sims/onewire-temp.js     simulador S3
assets/js/sims/i2c-imu.js          simulador S4
assets/js/sims/gps-lora.js         simulador S5
assets/img/monaco-circuit.svg      circuito normalizado (desde RaceCircuitMonaco.svg)
```
Modificados:
```
assets/css/base.css                capa A del fondo (.bg-ambient) + .model-slot base si aplica
assets/js/animations.js            animación capa B (dibujo + punto de telemetría Mónaco)
assets/js/session-template.js      renderModel() + renderSimulator()
assets/js/data/sesion-1..5.js      campos simulator{} y model{}
index.html                         .bg-ambient + hero con circuito Mónaco (capa B)
sesiones/sesion-1..6.html          .bg-ambient + links/scripts nuevos por página
assets/img/diagrams/voltage-divider.svg   (+ i2c-bus.svg, spi-microsd.svg si hay overflow)
```

Decisiones locked-in (pendientes en el spec):
- **Diagramas estáticos vs simulador:** se **conservan** los SVG en "Referencia rápida" (son accesibles con `<title>` y sirven de resumen); el simulador es aditivo. Solo se corrige su overflow.
- **`photoPlaceholder` vs slot 3D:** el `model{}` es del **componente principal** y va en el hero. El `photoPlaceholder` existente (foto de contexto, ej. "montado en el coche real") **se conserva** — no compiten (uno es render 3D del componente, otro foto de instalación real).

---

## Task 1: Capa A del fondo — profundidad ambiental (CSS puro, todo el sitio)

**Files:**
- Modify: `assets/css/base.css` (añadir al final)
- Modify: `index.html` (añadir `<div class="bg-ambient">` como primer hijo de `<body>`)
- Modify: `sesiones/sesion-1.html` … `sesion-6.html` (mismo div)

- [ ] **Step 1: Añadir estilos de la capa A en `assets/css/base.css`** (al final del archivo)

```css
/* ===== Fondo: Capa A — profundidad ambiental ===== */
.bg-ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(37, 71, 224, 0.18), transparent 60%),
    radial-gradient(100% 60% at 50% 110%, rgba(10, 14, 26, 0.9), transparent 70%),
    var(--bg);
}
.bg-ambient::before,
.bg-ambient::after {
  content: "";
  position: absolute;
  width: 60vmax;
  height: 60vmax;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.06;
  will-change: transform;
}
.bg-ambient::before {
  background: var(--blue-royal);
  top: -20vmax; left: -10vmax;
  animation: aurora-a 34s ease-in-out infinite alternate;
}
.bg-ambient::after {
  background: var(--blue-bright);
  bottom: -25vmax; right: -15vmax;
  animation: aurora-b 42s ease-in-out infinite alternate;
}
@keyframes aurora-a {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(12vmax, 8vmax) scale(1.15); }
}
@keyframes aurora-b {
  from { transform: translate(0, 0) scale(1.1); }
  to   { transform: translate(-10vmax, -6vmax) scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  .bg-ambient::before, .bg-ambient::after { animation: none; }
}
```

- [ ] **Step 2: Insertar el div en `index.html`** — justo después de `<body>`:

```html
<body>
  <div class="bg-ambient" aria-hidden="true"></div>
```

- [ ] **Step 3: Insertar el mismo div en las 6 páginas de sesión** — en cada `sesiones/sesion-N.html`, justo después de `<body>` y antes de `<div id="session-root"></div>`:

```html
<body>
  <div class="bg-ambient" aria-hidden="true"></div>
  <div id="session-root"></div>
```

- [ ] **Step 4: Verificar en navegador**

Servir y abrir `index.html` y una sesión. Esperado: el fondo ya no es plano — hay glow azul arriba, oscurecimiento abajo, y dos manchas suaves que derivan lentísimo. El contenido sigue legible por encima (z-index correcto). Con `prefers-reduced-motion: reduce`, las manchas quedan quietas pero el gradiente permanece. Consola sin errores.

- [ ] **Step 5: Commit**

```bash
git add assets/css/base.css index.html sesiones/*.html
git commit -m "feat: add ambient depth background layer (layer A)"
```

---

## Task 2: Capa B del fondo — circuito de Mónaco con punto de telemetría (portada)

**Files:**
- Create: `assets/img/monaco-circuit.svg` (normalizado)
- Modify: `index.html` (SVG inline en el hero + wrapper)
- Modify: `assets/css/home.css` (posicionamiento y opacidad del circuito)
- Modify: `assets/js/animations.js` (dibujo + `anime.path()` del punto)
- Delete: `RaceCircuitMonaco.svg` (raíz) tras normalizar

- [ ] **Step 1: Crear `assets/img/monaco-circuit.svg`** con el trazo del circuito, stroke de marca y un id estable para el path. Contenido:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 411.72 343.70" width="100%" role="img" aria-labelledby="monaco-title">
  <title id="monaco-title">Circuito de Mónaco — motivo de telemetría</title>
  <path id="monaco-track" fill="none" stroke="#2547E0" stroke-width="3" stroke-linejoin="round"
    d="m352.8 4.1504c-13.81 0.8243-23.48 12.177-34.76 18.75-15.132 10.842-32.937 19.166-44.42 34.236-3.8081 11.918 7.2143 21.834 7.6992 33.469 2.3799 12.877-3.9727 27.691-17.039 31.797-21.608 7.9502-44.019-3.3155-66.164-0.58398-15.249 1.2564-30.576 4.4208-45.71 1.0769-13.872-2.7824-28.009-3.0697-42.061-3.0837-20.279-0.65526-40.401-4.4655-60.107-8.5499-9.8358 3.4808-9.1748 16.051-15.302 23.046-9.2645 14.858-16.918 30.931-19.749 48.338-10.382 42.601-16.335 87.914-5.9935 131.09 2.9845 6.9487-1.9927 16.823 5.5254 21.516 8.5182 5.6162 19.511 4.4647 29.15 4.5723 6.3627-3.221 3.5124-12.152-0.89324-15.875-6.8457-7.1679-11.759-15.961-14.144-25.596-4.1818-13.935-6.0953-29.779-0.05469-43.404 4.8274-5.2939 10.31-10.783 10.423-18.477 2.5399-11.575 5.598-24.511-0.11424-35.558-6.7172-18.477 1.3628-38.363 12.014-53.545 5.3451-6.2228 10.439-14.267 18.566-16.574 12.2-1.5865 24.011 3.4785 36.021 4.8867 20.127 4.04 40.985 5.4105 60.521 11.713 5.4989 3.2393 13.36 5.9094 18.477 0.5171 10.835-5.0042 22.484 1.5092 33.75 0.85938 45.376 3.648 94.373-5.7234 129.19-36.775 23.603-21.125 44.441-46.111 58.145-74.801 3.2737-6.3889 3.6047-17.129-4.7976-19.494-8.795-2.811-18.662-1.7299-27.287 1.0391-6.7679 3.5504-5.7201 12.534-1.7773 17.836 2.2246 4.0916 6.7494 10.278 2.7715 14.559-5.2639 1.897-12.792-1.8673-11.882-8.136-1.2118-9.6578-5.9329-20.115-0.9949-29.337 1.655-3.8575-0.53501-8.6517-4.8828-9.2363 2.5888 1.5696-3.0196-1.1724-4.1191-0.27539z"/>
</svg>
```

- [ ] **Step 2: Inlinar el circuito en el hero de `index.html`** — dentro de `<section class="hero">`, después del `<svg class="hero__trace ...">` existente, añadir el circuito inline (inline para poder animar con Anime.js sin fetch). Añadir un `<circle>` que será el punto de telemetría y un `<g>` para la estela:

```html
      <svg class="hero__monaco circuit-trace" viewBox="0 0 411.72 343.70" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <path id="monaco-track" class="monaco-track" fill="none" stroke="#2547E0" stroke-width="3" stroke-linejoin="round"
          d="m352.8 4.1504c-13.81 0.8243-23.48 12.177-34.76 18.75-15.132 10.842-32.937 19.166-44.42 34.236-3.8081 11.918 7.2143 21.834 7.6992 33.469 2.3799 12.877-3.9727 27.691-17.039 31.797-21.608 7.9502-44.019-3.3155-66.164-0.58398-15.249 1.2564-30.576 4.4208-45.71 1.0769-13.872-2.7824-28.009-3.0697-42.061-3.0837-20.279-0.65526-40.401-4.4655-60.107-8.5499-9.8358 3.4808-9.1748 16.051-15.302 23.046-9.2645 14.858-16.918 30.931-19.749 48.338-10.382 42.601-16.335 87.914-5.9935 131.09 2.9845 6.9487-1.9927 16.823 5.5254 21.516 8.5182 5.6162 19.511 4.4647 29.15 4.5723 6.3627-3.221 3.5124-12.152-0.89324-15.875-6.8457-7.1679-11.759-15.961-14.144-25.596-4.1818-13.935-6.0953-29.779-0.05469-43.404 4.8274-5.2939 10.31-10.783 10.423-18.477 2.5399-11.575 5.598-24.511-0.11424-35.558-6.7172-18.477 1.3628-38.363 12.014-53.545 5.3451-6.2228 10.439-14.267 18.566-16.574 12.2-1.5865 24.011 3.4785 36.021 4.8867 20.127 4.04 40.985 5.4105 60.521 11.713 5.4989 3.2393 13.36 5.9094 18.477 0.5171 10.835-5.0042 22.484 1.5092 33.75 0.85938 45.376 3.648 94.373-5.7234 129.19-36.775 23.603-21.125 44.441-46.111 58.145-74.801 3.2737-6.3889 3.6047-17.129-4.7976-19.494-8.795-2.811-18.662-1.7299-27.287 1.0391-6.7679 3.5504-5.7201 12.534-1.7773 17.836 2.2246 4.0916 6.7494 10.278 2.7715 14.559-5.2639 1.897-12.792-1.8673-11.882-8.136-1.2118-9.6578-5.9329-20.115-0.9949-29.337 1.655-3.8575-0.53501-8.6517-4.8828-9.2363 2.5888 1.5696-3.0196-1.1724-4.1191-0.27539z"/>
        <circle class="monaco-dot" r="5" fill="#FFB13D"/>
      </svg>
```

- [ ] **Step 3: Estilos en `assets/css/home.css`** (añadir al final):

```css
/* Circuito de Mónaco — capa B, firma de telemetría en el hero */
.hero { position: relative; overflow: hidden; }
.hero__monaco {
  position: absolute;
  right: -4%;
  top: 50%;
  transform: translateY(-50%);
  width: min(52vw, 620px);
  height: auto;
  opacity: 0.16;
  z-index: 0;
  pointer-events: none;
}
.hero__monaco .monaco-track { stroke-dasharray: 1600; }
.hero__monaco .monaco-dot { filter: drop-shadow(0 0 6px rgba(255, 177, 61, 0.9)); }
.hero .container { position: relative; z-index: 1; }
@media (max-width: 720px) {
  .hero__monaco { opacity: 0.1; width: 90vw; right: -20%; }
}
```

- [ ] **Step 4: Animación en `assets/js/animations.js`** — añadir una función `animateMonaco()` y llamarla desde `init()`. Usa `anime.path()` sobre `#monaco-track` para mover el punto, y dibuja el trazo una vez:

```js
  function animateMonaco() {
    var svg = document.querySelector('.hero__monaco');
    if (!svg) return;
    var track = svg.querySelector('.monaco-track');
    var dot = svg.querySelector('.monaco-dot');
    if (reducedMotion() || typeof anime === 'undefined') {
      if (track) track.style.strokeDashoffset = 0;
      if (dot) {
        // Colocar el punto en el inicio del trazado, estático.
        var start = track.getPointAtLength(0);
        dot.setAttribute('cx', start.x);
        dot.setAttribute('cy', start.y);
      }
      return;
    }
    // 1) Dibujar el circuito una vez.
    anime({
      targets: track,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 2200
    });
    // 2) El punto da vueltas al circuito de forma continua.
    var path = anime.path('.hero__monaco .monaco-track');
    anime({
      targets: dot,
      translateX: path('x'),
      translateY: path('y'),
      easing: 'linear',
      duration: 14000,
      loop: true,
      delay: 600
    });
  }
```

Y en `init()` añadir la llamada:

```js
  function init() {
    drawCircuitTraces();
    animateMonaco();
    observeReveals(document);
    animateCounters();
  }
```

Nota: `anime.path()` anima `translateX/translateY` sobre el `<circle>`; el `cx/cy` se dejan en 0 (default) para que la traslación posicione el punto correctamente.

- [ ] **Step 5: Borrar el SVG de la raíz** (ya normalizado dentro de `assets/img/` e inline):

```bash
git rm RaceCircuitMonaco.svg
```

- [ ] **Step 6: Verificar en navegador**

Abrir `index.html`. Esperado: al cargar, el circuito de Mónaco se dibuja (stroke) a la derecha del hero, tenue; luego un punto ámbar con glow recorre el circuito en bucle suave (~14s por vuelta). El texto del hero queda por encima y legible. Con `prefers-reduced-motion: reduce`, el circuito aparece dibujado y el punto queda estático en el inicio, sin bucle. Consola sin errores.

- [ ] **Step 7: Commit**

```bash
git add assets/img/monaco-circuit.svg index.html assets/css/home.css assets/js/animations.js
git commit -m "feat: add Monaco circuit signature with telemetry dot (background layer B)"
```

---

## Task 3: Arreglar diagramas SVG recortados

**Files:**
- Modify: `assets/img/diagrams/voltage-divider.svg`
- Modify: `assets/img/diagrams/i2c-bus.svg` (si aplica)
- Modify: `assets/img/diagrams/spi-microsd.svg` (si aplica)

- [ ] **Step 1: Corregir `voltage-divider.svg`** — el texto "Vout → pin analógico" (x=200, ~133px de ancho) se sale del viewBox de ancho 320. Ampliar el viewBox a 380 y el `<rect>` de fondo, dejando el texto dentro con padding. Reemplazar la línea del `<svg>` y del `<rect>` de fondo:

Cambiar:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" role="img" aria-labelledby="vd-title">
```
por:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 200" width="100%" role="img" aria-labelledby="vd-title">
```
Y cambiar:
```svg
<rect width="320" height="200" fill="#131B2E"/>
```
por:
```svg
<rect width="380" height="200" fill="#131B2E"/>
```
La línea de Vout y el texto ya caben (200 + ~133 = 333 < 380). Verificar que "Vout → pin analógico" en x=200 quede completo.

- [ ] **Step 2: Revisar `i2c-bus.svg` y `spi-microsd.svg`**

Abrir cada SVG y comprobar si algún `<text>` con `text-anchor` excede el ancho del viewBox. Para `i2c-bus.svg` (viewBox 400): el texto más a la derecha es "MPU6050 0x68/0x69" centrado en x=285, font-size 11 (~85px → 242.5–327.5), cabe en 400 → **sin cambios**. Para `spi-microsd.svg` (viewBox 360): textos centrados en x=180, caben → **sin cambios**. Si al inspeccionar visualmente alguno recorta, ampliar su viewBox+rect igual que en Step 1. Documentar en el commit si no requirieron cambios.

- [ ] **Step 3: Verificar en navegador**

Abrir `sesiones/sesion-2.html` (usa voltage-divider) y `sesion-4.html` (i2c-bus), `sesion-5.html` (spi-microsd). Esperado: ningún texto de diagrama queda cortado por el borde derecho. El divisor de voltaje muestra "Vout → pin analógico" completo.

- [ ] **Step 4: Commit**

```bash
git add assets/img/diagrams/*.svg
git commit -m "fix: widen voltage-divider viewBox so Vout label is not clipped"
```

---

## Task 4: Infraestructura de simuladores + slots 3D (plumbing)

Establece toda la fontanería con **un simulador de prueba mínimo** para validar el pipeline antes de escribir los 5 reales.

**Files:**
- Create: `assets/css/sims.css`
- Create: `assets/js/sims/registry.js`
- Modify: `assets/js/session-template.js` (renderModel + renderSimulator + orden de render)
- Modify: `assets/js/data/sesion-1.js` (añadir `simulator` de prueba + `model`)
- Modify: `sesiones/sesion-1.html` (links/scripts)

- [ ] **Step 1: Crear `assets/js/sims/registry.js`**

```js
(function () {
  window.TelemetrySims = window.TelemetrySims || {};

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Revela un nodo cuando entra al viewport (reutiliza la clase .reveal del sitio).
  function revealOnView(node) {
    node.classList.add('reveal');
    if (window.TelemetryAnim && window.TelemetryAnim.revealNew) {
      window.TelemetryAnim.revealNew(node.parentNode || document);
    } else {
      node.classList.add('is-visible');
    }
  }

  // Liga la rotación de un <model-viewer> al progreso de scroll de su sección.
  function scrollRotate(viewer) {
    if (reducedMotion()) return;
    function update() {
      var rect = viewer.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var progress = 1 - (rect.top + rect.height / 2) / vh; // ~0 abajo, ~1 arriba
      progress = Math.max(0, Math.min(1, progress));
      var theta = 30 + progress * 300; // grados de órbita
      viewer.setAttribute('camera-orbit', theta + 'deg 75deg auto');
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  window.TelemetrySims._util = {
    reducedMotion: reducedMotion,
    revealOnView: revealOnView,
    scrollRotate: scrollRotate
  };
})();
```

- [ ] **Step 2: Crear `assets/css/sims.css`** — estilos base compartidos de `.sim` y `.model-slot`:

```css
/* ===== Simuladores ===== */
.sim {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  display: grid;
  gap: var(--space-3);
}
.sim__head h3 { margin: 0 0 4px; font-size: 1.15rem; }
.sim__head p { margin: 0; color: var(--text-dim); font-size: 0.9rem; }
.sim__body { display: grid; gap: var(--space-3); grid-template-columns: 1fr; }
@media (min-width: 720px) {
  .sim__body--split { grid-template-columns: minmax(0, 320px) 1fr; align-items: start; }
}
.sim__controls { display: grid; gap: var(--space-2); }
.sim__control label { display: block; font-size: 0.82rem; color: var(--text-dim); margin-bottom: 4px; }
.sim__control input[type="range"] { width: 100%; accent-color: var(--blue-royal); }
.sim__stage {
  background: var(--bg-panel-2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--space-2);
  min-height: 200px;
  display: flex; align-items: center; justify-content: center;
}
.sim__readout { font-family: var(--font-mono); font-size: 0.9rem; display: grid; gap: 6px; }
.sim__readout .k { color: var(--text-dim); }
.sim__readout .v { color: var(--blue-bright); }
.sim__pill {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 0.8rem;
  padding: 4px 10px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--bg-panel);
}
.sim__pill--ok    { color: #5ED28B; border-color: rgba(94,210,139,0.4); }
.sim__pill--warn  { color: var(--signal-amber); border-color: rgba(255,177,61,0.5); }
.sim__pill--crit  { color: #FF6B6B; border-color: rgba(255,107,107,0.5); }

/* ===== Slot de modelo 3D ===== */
.model-slot {
  width: 100%;
  max-width: 460px;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
  background: var(--bg-panel);
}
.model-slot model-viewer { width: 100%; height: 100%; background: transparent; }
.model-slot.is-placeholder {
  display: flex; align-items: center; justify-content: center; text-align: center;
  border: 2px dashed var(--border);
  color: var(--text-dim); font-size: 0.85rem; padding: var(--space-2);
  background: repeating-linear-gradient(135deg, var(--bg-panel), var(--bg-panel) 10px, var(--bg-panel-2) 10px, var(--bg-panel-2) 20px);
}
.model-slot__label { display: block; }
.model-slot__hint { display: block; margin-top: 6px; font-family: var(--font-mono); font-size: 0.75rem; color: var(--blue-bright); }
```

- [ ] **Step 3: Añadir `renderModel` y `renderSimulator` en `assets/js/session-template.js`** — insertar antes de `function render(data)`:

```js
  function renderModel(data) {
    if (!data.model) return null;
    var m = data.model;
    var slot;
    if (m.src) {
      var mv = el('model-viewer', {
        src: m.src, alt: m.alt || m.label || 'Modelo 3D',
        'camera-controls': '', 'auto-rotate': '', 'interaction-prompt': 'none',
        'shadow-intensity': '1'
      }, []);
      if (m.poster) mv.setAttribute('poster', m.poster);
      slot = el('div', { class: 'model-slot' }, [mv]);
      // Rotación por scroll cuando el util esté disponible.
      setTimeout(function () {
        if (window.TelemetrySims && window.TelemetrySims._util) {
          window.TelemetrySims._util.scrollRotate(mv);
        }
      }, 0);
    } else {
      slot = el('div', { class: 'model-slot is-placeholder' }, [
        el('div', {}, [
          el('span', { class: 'model-slot__label' }, ['Modelo 3D: ' + (m.label || 'componente')]),
          el('span', { class: 'model-slot__hint' }, ['suelta el .glb aquí'])
        ])
      ]);
    }
    return el('div', { class: 'reveal', style: 'margin-top:1.5rem;' }, [slot]);
  }

  function renderSimulator(data) {
    if (!data.simulator || !window.TelemetrySims || !window.TelemetrySims[data.simulator.type]) return null;
    var sim = data.simulator;
    var body = el('div', { class: 'sim__mount' }, []);
    var section = el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Laboratorio interactivo']),
        el('div', { class: 'sim reveal' }, [
          el('div', { class: 'sim__head' }, [
            el('h3', {}, [sim.title || 'Simulador']),
            sim.caption ? el('p', {}, [sim.caption]) : null
          ]),
          body
        ])
      ])
    ]);
    // Construir el simulador tras insertarlo en el DOM.
    setTimeout(function () { window.TelemetrySims[sim.type](body); }, 0);
    return section;
  }
```

- [ ] **Step 4: Enganchar en `render()`** de `session-template.js`. Insertar el model slot dentro del hero y la sección de simulador tras "Referencia rápida". Modificar la función `render`:

En `render()`, después de `root.appendChild(renderHero(data));`, añadir:
```js
    var modelNode = renderModel(data);
    if (modelNode) {
      // Insertar el slot 3D dentro del hero (al final de su .container).
      var heroContainer = root.querySelector('.session-hero .container');
      if (heroContainer) heroContainer.appendChild(modelNode);
    }
```
Y después de `root.appendChild(renderReference(data));`, añadir:
```js
    var simNode = renderSimulator(data);
    if (simNode) root.appendChild(simNode);
```

- [ ] **Step 5: Simulador de prueba en `registry.js`** — añadir temporalmente al final del IIFE de `registry.js`, antes del cierre, un sim trivial para validar el pipeline:

```js
  window.TelemetrySims['__smoke'] = function (container) {
    container.appendChild(document.createTextNode('Simulador de prueba OK'));
  };
```

- [ ] **Step 6: Datos de prueba en `assets/js/data/sesion-1.js`** — añadir (temporal para smoke) tras `photoPlaceholder`:

```js
  simulator: { type: '__smoke', title: 'Prueba', caption: 'pipeline' },
  model: { label: 'Arduino Uno', alt: 'Modelo 3D de Arduino Uno', src: '' },
```

- [ ] **Step 7: Cargar CSS y scripts en `sesiones/sesion-1.html`**

En `<head>`, tras la línea de `sesion.css`:
```html
  <link rel="stylesheet" href="../assets/css/sims.css">
```
Antes de `<script src="../assets/js/session-template.js"></script>`, añadir:
```html
  <script type="module" src="https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js"></script>
  <script src="../assets/js/sims/registry.js"></script>
```

- [ ] **Step 8: Verificar el pipeline en navegador**

Abrir `sesiones/sesion-1.html`. Esperado: (a) en el hero aparece el slot 3D placeholder con "Modelo 3D: Arduino Uno — suelta el .glb aquí"; (b) tras "Referencia rápida" aparece la sección "Laboratorio interactivo" con el texto "Simulador de prueba OK". Consola sin errores (el módulo model-viewer carga sin fallar).

- [ ] **Step 9: Commit**

```bash
git add assets/css/sims.css assets/js/sims/registry.js assets/js/session-template.js assets/js/data/sesion-1.js sesiones/sesion-1.html
git commit -m "feat: simulator + 3D model slot infrastructure with smoke test"
```

---

## Task 5: Simulador S1 — Ley de Ohm (`ohm-law.js`)

**Files:**
- Create: `assets/js/sims/ohm-law.js`
- Modify: `assets/js/data/sesion-1.js` (reemplazar sim de prueba por `ohm-law`)
- Modify: `sesiones/sesion-1.html` (cargar el módulo)
- Modify: `assets/js/sims/registry.js` (quitar `__smoke`)

- [ ] **Step 1: Crear `assets/js/sims/ohm-law.js`**

```js
(function () {
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  window.TelemetrySims['ohm-law'] = function (container) {
    var V = 5, R = 220; // fuente 5V, R inicial 220Ω (caso LED de la sesión)
    var Vled = 2, Imax = 0.02; // ~2V caída LED, 20mA límite seguro

    var rRange = h('input', { type: 'range', min: '100', max: '2000', step: '10', value: '220' });
    var vRange = h('input', { type: 'range', min: '3', max: '12', step: '0.5', value: '5' });

    var readI = h('span', { class: 'v' }, ['0']);
    var readState = h('span', { class: 'sim__pill sim__pill--ok' }, ['LED OK']);
    var ledDot = h('div', {}, []);
    ledDot.style.cssText = 'width:60px;height:60px;border-radius:50%;background:#333;transition:background .15s, box-shadow .15s;';

    function update() {
      V = parseFloat(vRange.value);
      R = parseFloat(rRange.value);
      // Corriente por el LED: I = (V - Vled) / R (si V<=Vled, no conduce)
      var I = V > Vled ? (V - Vled) / R : 0;
      readI.textContent = (I * 1000).toFixed(1) + ' mA';
      var brightness = Math.min(1, I / Imax);
      if (I > Imax) {
        ledDot.style.background = '#5a1a1a';
        ledDot.style.boxShadow = 'none';
        readState.textContent = 'LED quemado';
        readState.className = 'sim__pill sim__pill--crit';
      } else if (I <= 0) {
        ledDot.style.background = '#333';
        ledDot.style.boxShadow = 'none';
        readState.textContent = 'sin conducir';
        readState.className = 'sim__pill sim__pill--warn';
      } else {
        ledDot.style.background = 'rgba(255,177,61,' + (0.3 + 0.7 * brightness) + ')';
        ledDot.style.boxShadow = '0 0 ' + (6 + 24 * brightness) + 'px rgba(255,177,61,0.9)';
        readState.textContent = 'LED OK';
        readState.className = 'sim__pill sim__pill--ok';
      }
    }

    rRange.addEventListener('input', update);
    vRange.addEventListener('input', update);

    var controls = h('div', { class: 'sim__controls' }, [
      h('div', { class: 'sim__control' }, [h('label', {}, ['Resistencia (Ω)']), rRange]),
      h('div', { class: 'sim__control' }, [h('label', {}, ['Voltaje de fuente (V)']), vRange]),
      h('div', { class: 'sim__readout' }, [
        h('div', {}, [h('span', { class: 'k' }, ['Corriente por el LED: ']), readI]),
        h('div', {}, [h('span', { class: 'k' }, ['V = I × R  ·  límite seguro ≈ 20 mA'])])
      ]),
      readState
    ]);
    var stage = h('div', { class: 'sim__stage' }, [ledDot]);
    var body = h('div', { class: 'sim__body sim__body--split' }, [controls, stage]);
    container.appendChild(body);
    update();
  };
})();
```

- [ ] **Step 2: Quitar el smoke sim de `registry.js`** — borrar el bloque `window.TelemetrySims['__smoke'] = ...` añadido en Task 4 Step 5.

- [ ] **Step 3: Actualizar datos en `assets/js/data/sesion-1.js`** — reemplazar la línea `simulator` de prueba por:

```js
  simulator: { type: 'ohm-law', title: 'Laboratorio: Ley de Ohm y el LED', caption: 'Ajusta resistencia y voltaje; mira cómo cambia la corriente y si el LED sobrevive.' },
```
(la línea `model:` se conserva tal cual)

- [ ] **Step 4: Cargar el módulo en `sesiones/sesion-1.html`** — tras `registry.js`:

```html
  <script src="../assets/js/sims/ohm-law.js"></script>
```

- [ ] **Step 5: Verificar en navegador**

Abrir `sesiones/sesion-1.html`. Esperado: sección "Laboratorio interactivo" con dos sliders. Al bajar la R o subir V, la corriente sube; con R muy baja / V alto el LED pasa a "quemado" (rojo, >20mA); en rango normal brilla ámbar proporcional. Con V ≤ 2V dice "sin conducir". Consola sin errores.

- [ ] **Step 6: Commit**

```bash
git add assets/js/sims/ohm-law.js assets/js/sims/registry.js assets/js/data/sesion-1.js sesiones/sesion-1.html
git commit -m "feat: S1 Ohm's law interactive simulator"
```

---

## Task 6: Simulador S2 — Divisor de voltaje + ADC (`voltage-divider.js`)

**Files:**
- Create: `assets/js/sims/voltage-divider.js`
- Modify: `assets/js/data/sesion-2.js`
- Modify: `sesiones/sesion-2.html`

- [ ] **Step 1: Crear `assets/js/sims/voltage-divider.js`**

```js
(function () {
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  window.TelemetrySims['voltage-divider'] = function (container) {
    var Vin = 5, R1 = 10000, R2 = 6800; // ejemplo real de la sesión 2
    var ALERT_DEG = 25; // umbral real de alerta

    var angleRange = h('input', { type: 'range', min: '0', max: '40', step: '1', value: '10' });
    var readVout = h('span', { class: 'v' }, ['0']);
    var readAdc = h('span', { class: 'v' }, ['0']);
    var readAngle = h('span', { class: 'v' }, ['0']);
    var pill = h('span', { class: 'sim__pill sim__pill--ok' }, ['normal']);

    // Barra visual del ángulo
    var bar = h('div', {}, []);
    bar.style.cssText = 'height:14px;border-radius:7px;background:var(--blue-royal);transition:width .1s, background .1s;';
    var barWrap = h('div', {}, [bar]);
    barWrap.style.cssText = 'width:100%;height:14px;border-radius:7px;background:var(--border);overflow:hidden;';

    function update() {
      var deg = parseFloat(angleRange.value);
      // El potenciómetro escala R2 efectivo según el ángulo (0..40 → factor 0..1)
      var frac = deg / 40;
      var r2eff = 500 + frac * (R2 - 500); // evita división por cero
      var Vout = Vin * (r2eff / (R1 + r2eff));
      var adc = Math.round((Vout / Vin) * 1023);
      // map(0..1023 → 0..40) para reconstruir el ángulo desde el ADC
      var mapped = Math.round((adc / 1023) * 40);
      readVout.textContent = Vout.toFixed(2) + ' V';
      readAdc.textContent = String(adc);
      readAngle.textContent = mapped + '°';
      bar.style.width = (deg / 40 * 100) + '%';
      if (deg > ALERT_DEG) {
        bar.style.background = 'var(--signal-amber)';
        pill.textContent = 'ALERTA >25°';
        pill.className = 'sim__pill sim__pill--warn';
      } else {
        bar.style.background = 'var(--blue-royal)';
        pill.textContent = 'normal';
        pill.className = 'sim__pill sim__pill--ok';
      }
    }
    angleRange.addEventListener('input', update);

    var controls = h('div', { class: 'sim__controls' }, [
      h('div', { class: 'sim__control' }, [h('label', {}, ['Ángulo de suspensión (0–40°)']), angleRange]),
      pill
    ]);
    var stage = h('div', { class: 'sim__stage' }, [
      h('div', { class: 'sim__readout', style: 'width:100%;' }, [
        h('div', {}, [h('span', { class: 'k' }, ['Vout = Vin·R2/(R1+R2): ']), readVout]),
        h('div', {}, [h('span', { class: 'k' }, ['ADC (Vout/5·1023): ']), readAdc]),
        h('div', {}, [h('span', { class: 'k' }, ['map() → ángulo: ']), readAngle]),
        barWrap
      ])
    ]);
    container.appendChild(h('div', { class: 'sim__body sim__body--split' }, [controls, stage]));
    update();
  };
})();
```

- [ ] **Step 2: Datos en `assets/js/data/sesion-2.js`** — añadir tras `photoPlaceholder` (revisar el nombre exacto del último campo antes de `content` y colocarlo junto a los otros campos de primer nivel):

```js
  simulator: { type: 'voltage-divider', title: 'Laboratorio: del ángulo al ADC', caption: 'Mueve la suspensión y sigue la señal: divisor → Vout → ADC → map() → alerta.' },
  model: { label: 'Potenciómetro OEM', alt: 'Modelo 3D de un potenciómetro', src: '' },
```

- [ ] **Step 3: Cargar CSS y scripts en `sesiones/sesion-2.html`** — igual que sesión 1: en `<head>` añadir `sims.css`; antes de `session-template.js` añadir el CDN de `model-viewer`, `registry.js` y:

```html
  <script src="../assets/js/sims/voltage-divider.js"></script>
```

- [ ] **Step 4: Verificar en navegador**

Abrir `sesiones/sesion-2.html`. Esperado: slot 3D "Potenciómetro OEM" en el hero; sección Laboratorio donde al mover el ángulo cambian Vout, ADC y el ángulo reconstruido, y al pasar 25° la barra y el pill se ponen ámbar "ALERTA >25°". Consola sin errores.

- [ ] **Step 5: Commit**

```bash
git add assets/js/sims/voltage-divider.js assets/js/data/sesion-2.js sesiones/sesion-2.html
git commit -m "feat: S2 voltage divider + ADC + map() simulator"
```

---

## Task 7: Simulador S3 — Bus OneWire + temperaturas (`onewire-temp.js`)

**Files:**
- Create: `assets/js/sims/onewire-temp.js`
- Modify: `assets/js/data/sesion-3.js`
- Modify: `sesiones/sesion-3.html`

- [ ] **Step 1: Crear `assets/js/sims/onewire-temp.js`**

```js
(function () {
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function sensor(label, rom, thresholds) {
    var range = h('input', { type: 'range', min: '20', max: '140', step: '1', value: '60' });
    var readT = h('span', { class: 'v' }, ['60 °C']);
    var pill = h('span', { class: 'sim__pill sim__pill--ok' }, ['normal']);
    var romEl = h('div', { class: 'sim__readout' }, [
      h('div', {}, [h('span', { class: 'k' }, ['ROM 64-bit: ']), h('span', { class: 'v' }, [rom])])
    ]);
    var el = h('div', { class: 'sim__control' }, [
      h('label', {}, [label]),
      range,
      h('div', { class: 'sim__readout' }, [h('div', {}, [readT, ' ', pill])]),
      romEl
    ]);
    function update(pullup) {
      if (!pullup) {
        readT.textContent = '-85 °C (errático)';
        pill.textContent = 'sin pull-up';
        pill.className = 'sim__pill sim__pill--crit';
        return;
      }
      var t = parseFloat(range.value);
      readT.textContent = t + ' °C';
      if (t >= thresholds.crit) { pill.textContent = 'CRÍTICO'; pill.className = 'sim__pill sim__pill--crit'; }
      else if (t >= thresholds.warn) { pill.textContent = 'advertencia'; pill.className = 'sim__pill sim__pill--warn'; }
      else { pill.textContent = 'normal'; pill.className = 'sim__pill sim__pill--ok'; }
    }
    return { el: el, range: range, update: update };
  }

  window.TelemetrySims['onewire-temp'] = function (container) {
    var motor = sensor('DS18B20 — Motor (alerta >110°C)', '28-FF-64-1A-motor', { warn: 110, crit: 125 });
    var cvt = sensor('DS18B20 — CVT (adv >90°C, crítico >105°C)', '28-FF-3C-9B-cvt', { warn: 90, crit: 105 });
    var pullup = h('input', { type: 'checkbox' });
    pullup.checked = true;

    function refresh() {
      motor.update(pullup.checked);
      cvt.update(pullup.checked);
    }
    motor.range.addEventListener('input', refresh);
    cvt.range.addEventListener('input', refresh);
    pullup.addEventListener('change', refresh);

    var note = h('div', { class: 'sim__readout' }, [
      h('div', {}, [h('span', { class: 'k' }, ['Ambos sensores comparten UN cable de datos (bus OneWire); el código los distingue por su ROM.'])])
    ]);
    var pullCtrl = h('label', { style: 'display:flex;gap:8px;align-items:center;font-size:0.85rem;' }, [
      pullup, 'Resistencia pull-up 4.7kΩ conectada'
    ]);

    var controls = h('div', { class: 'sim__controls' }, [motor.el, cvt.el, pullCtrl]);
    var stage = h('div', { class: 'sim__stage' }, [note]);
    container.appendChild(h('div', { class: 'sim__body sim__body--split' }, [controls, stage]));
    refresh();
  };
})();
```

- [ ] **Step 2: Datos en `assets/js/data/sesion-3.js`** — añadir tras `photoPlaceholder`:

```js
  simulator: { type: 'onewire-temp', title: 'Laboratorio: bus OneWire y umbrales', caption: 'Dos DS18B20 en un solo cable. Sube la temperatura y quita el pull-up para ver el error real.' },
  model: { label: 'DS18B20', alt: 'Modelo 3D del sensor DS18B20', src: '' },
```

- [ ] **Step 3: Cargar CSS y scripts en `sesiones/sesion-3.html`** — `sims.css` en head; antes de `session-template.js`: CDN model-viewer, `registry.js` y:

```html
  <script src="../assets/js/sims/onewire-temp.js"></script>
```

- [ ] **Step 4: Verificar en navegador**

Abrir `sesiones/sesion-3.html`. Esperado: dos sliders (motor/CVT) con sus ROM; al subir motor ≥110 marca advertencia/crítico, CVT ≥90 advertencia y ≥105 crítico; al desmarcar el pull-up ambas lecturas pasan a "-85°C (errático)". Consola sin errores.

- [ ] **Step 5: Commit**

```bash
git add assets/js/sims/onewire-temp.js assets/js/data/sesion-3.js sesiones/sesion-3.html
git commit -m "feat: S3 OneWire bus + temperature thresholds simulator"
```

---

## Task 8: Simulador S4 — I2C direcciones + umbral IMU (`i2c-imu.js`)

**Files:**
- Create: `assets/js/sims/i2c-imu.js`
- Modify: `assets/js/data/sesion-4.js`
- Modify: `sesiones/sesion-4.html`

- [ ] **Step 1: Crear `assets/js/sims/i2c-imu.js`**

```js
(function () {
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  window.TelemetrySims['i2c-imu'] = function (container) {
    // --- Direcciones I2C ---
    var ad0Chasis = h('input', { type: 'checkbox' });        // desmarcado = 0x68
    var ad0Volante = h('input', { type: 'checkbox' }); ad0Volante.checked = true; // marcado = 0x69
    var addrChasis = h('span', { class: 'v' }, ['0x68']);
    var addrVolante = h('span', { class: 'v' }, ['0x69']);
    var conflict = h('span', { class: 'sim__pill sim__pill--ok' }, ['bus OK']);

    function addrOf(cb) { return cb.checked ? '0x69' : '0x68'; }
    function refreshAddr() {
      var a = addrOf(ad0Chasis), b = addrOf(ad0Volante);
      addrChasis.textContent = a;
      addrVolante.textContent = b;
      if (a === b) { conflict.textContent = 'conflicto: misma dirección'; conflict.className = 'sim__pill sim__pill--crit'; }
      else { conflict.textContent = 'bus OK'; conflict.className = 'sim__pill sim__pill--ok'; }
    }
    ad0Chasis.addEventListener('change', refreshAddr);
    ad0Volante.addEventListener('change', refreshAddr);

    // --- Umbral IMU ---
    var tiltRange = h('input', { type: 'range', min: '0', max: '30', step: '1', value: '0' });
    var thRange = h('input', { type: 'range', min: '5', max: '30', step: '1', value: '20' });
    var readAcc = h('span', { class: 'v' }, ['9.8']);
    var evPill = h('span', { class: 'sim__pill sim__pill--ok' }, ['sin evento']);

    function refreshImu() {
      var tilt = parseFloat(tiltRange.value);     // m/s² lateral simulado
      var th = parseFloat(thRange.value);
      // magnitud combinada: reposo 9.8 vertical + componente lateral
      var mag = Math.sqrt(9.8 * 9.8 + tilt * tilt);
      readAcc.textContent = mag.toFixed(1) + ' m/s²';
      if (tilt >= th) { evPill.textContent = 'impacto/rollover detectado'; evPill.className = 'sim__pill sim__pill--warn'; }
      else { evPill.textContent = 'sin evento'; evPill.className = 'sim__pill sim__pill--ok'; }
    }
    tiltRange.addEventListener('input', refreshImu);
    thRange.addEventListener('input', refreshImu);

    var controls = h('div', { class: 'sim__controls' }, [
      h('label', { style: 'display:flex;gap:8px;align-items:center;font-size:0.85rem;' }, [ad0Chasis, 'MPU6050 chasis — AD0 en HIGH']),
      h('label', { style: 'display:flex;gap:8px;align-items:center;font-size:0.85rem;' }, [ad0Volante, 'MPU6050 volante — AD0 en HIGH']),
      conflict,
      h('div', { class: 'sim__control' }, [h('label', {}, ['Aceleración lateral (impacto)']), tiltRange]),
      h('div', { class: 'sim__control' }, [h('label', {}, ['Umbral de detección']), thRange])
    ]);
    var stage = h('div', { class: 'sim__stage' }, [
      h('div', { class: 'sim__readout', style: 'width:100%;' }, [
        h('div', {}, [h('span', { class: 'k' }, ['Chasis SDA/SCL: ']), addrChasis]),
        h('div', {}, [h('span', { class: 'k' }, ['Volante SDA/SCL: ']), addrVolante]),
        h('div', {}, [h('span', { class: 'k' }, ['Aceleración total (reposo ≈9.8): ']), readAcc]),
        h('div', {}, [evPill])
      ])
    ]);
    container.appendChild(h('div', { class: 'sim__body sim__body--split' }, [controls, stage]));
    refreshAddr();
    refreshImu();
  };
})();
```

- [ ] **Step 2: Datos en `assets/js/data/sesion-4.js`** — añadir tras `photoPlaceholder`:

```js
  simulator: { type: 'i2c-imu', title: 'Laboratorio: direcciones I2C y umbral de impacto', caption: 'Cambia AD0 para ver 0x68/0x69 (y el conflicto si chocan), e inclina el IMU para disparar el evento.' },
  model: { label: 'MPU6050', alt: 'Modelo 3D del IMU MPU6050', src: '' },
```

- [ ] **Step 3: Cargar CSS y scripts en `sesiones/sesion-4.html`** — `sims.css` en head; antes de `session-template.js`: CDN model-viewer, `registry.js` y:

```html
  <script src="../assets/js/sims/i2c-imu.js"></script>
```

- [ ] **Step 4: Verificar en navegador**

Abrir `sesiones/sesion-4.html`. Esperado: dos checkboxes AD0 que muestran 0x68/0x69; si ambos quedan iguales → "conflicto". Slider de aceleración que al superar el umbral marca "impacto/rollover detectado". Consola sin errores.

- [ ] **Step 5: Commit**

```bash
git add assets/js/sims/i2c-imu.js assets/js/data/sesion-4.js sesiones/sesion-4.html
git commit -m "feat: S4 I2C addressing + IMU threshold simulator"
```

---

## Task 9: Simulador S5 — GPS/NMEA + paquete LoRa (`gps-lora.js`)

**Files:**
- Create: `assets/js/sims/gps-lora.js`
- Modify: `assets/js/data/sesion-5.js`
- Modify: `sesiones/sesion-5.html`

- [ ] **Step 1: Crear `assets/js/sims/gps-lora.js`**

```js
(function () {
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  function toByteHex(n) { return ('0' + (n & 0xff).toString(16)).slice(-2).toUpperCase(); }

  window.TelemetrySims['gps-lora'] = function (container) {
    var reduced = window.TelemetrySims._util && window.TelemetrySims._util.reducedMotion();
    var baseLat = 19.4326, baseLon = -99.1332; // punto de referencia
    var t = 0;

    var nmea = h('code', { class: 'formula', style: 'font-size:0.8rem;' }, ['$GPGGA,...']);
    var packet = h('code', { class: 'formula', style: 'font-size:0.8rem;' }, ['--']);
    var rateNote = h('div', { class: 'sim__readout' }, [
      h('div', {}, [h('span', { class: 'k' }, ['Ruta @5Hz · Estado @1Hz — protocolo binario'])])
    ]);

    // Mini "mapa": un punto que recorre un lazo
    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 120');
    svg.setAttribute('width', '100%');
    var track = document.createElementNS(svgNS, 'path');
    track.setAttribute('d', 'M20 60 C 40 10, 160 10, 180 60 S 40 110, 20 60 Z');
    track.setAttribute('fill', 'none');
    track.setAttribute('stroke', '#24304A');
    track.setAttribute('stroke-width', '2');
    var dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#FFB13D');
    svg.appendChild(track); svg.appendChild(dot);

    function fmt(n, dec) { return n.toFixed(dec); }

    function frame() {
      t += 0.02;
      var len = track.getTotalLength();
      var p = track.getPointAtLength((t % 1) * len);
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      var lat = baseLat + (p.y - 60) * 0.0002;
      var lon = baseLon + (p.x - 100) * 0.0002;
      var speed = (20 + 10 * Math.sin(t * 3)).toFixed(0);
      nmea.textContent = '$GPGGA,123519,' + fmt(Math.abs(lat) * 100, 3) + ',N,' +
        fmt(Math.abs(lon) * 100, 3) + ',W,1,08,0.9,545.4,M*47';
      // Paquete binario de estado: [lat32][lon32][speed8] simplificado a bytes hex
      var bytes = [];
      var latI = Math.round(lat * 1e5), lonI = Math.round(lon * 1e5);
      [24, 16, 8, 0].forEach(function (s) { bytes.push(toByteHex(latI >> s)); });
      [24, 16, 8, 0].forEach(function (s) { bytes.push(toByteHex(lonI >> s)); });
      bytes.push(toByteHex(parseInt(speed, 10)));
      packet.textContent = bytes.join(' ');
      if (!reduced) raf = requestAnimationFrame(frame);
    }

    var stage = h('div', { class: 'sim__stage' }, [svg]);
    var readouts = h('div', { class: 'sim__controls' }, [
      h('div', { class: 'sim__control' }, [h('label', {}, ['Sentencia NMEA (GPS)']), nmea]),
      h('div', { class: 'sim__control' }, [h('label', {}, ['Paquete LoRa de estado (hex)']), packet]),
      rateNote
    ]);
    container.appendChild(h('div', { class: 'sim__body sim__body--split' }, [readouts, stage]));

    var raf;
    frame();
    if (reduced && raf) cancelAnimationFrame(raf);
  };
})();
```

- [ ] **Step 2: Datos en `assets/js/data/sesion-5.js`** — añadir tras `photoPlaceholder`:

```js
  simulator: { type: 'gps-lora', title: 'Laboratorio: NMEA y el paquete LoRa', caption: 'El coche recorre la pista: mira la sentencia NMEA y los bytes del paquete que viaja por radio.' },
  model: { label: 'Módulo GPS MAX-M10S', alt: 'Modelo 3D del módulo GPS', src: '' },
```

- [ ] **Step 3: Cargar CSS y scripts en `sesiones/sesion-5.html`** — `sims.css` en head; antes de `session-template.js`: CDN model-viewer, `registry.js` y:

```html
  <script src="../assets/js/sims/gps-lora.js"></script>
```

- [ ] **Step 4: Verificar en navegador**

Abrir `sesiones/sesion-5.html`. Esperado: un punto ámbar recorre un lazo; la sentencia NMEA y el paquete hex se actualizan en vivo. Con `prefers-reduced-motion: reduce`, el punto queda quieto (un solo frame) sin bucle de animación. Consola sin errores.

- [ ] **Step 5: Commit**

```bash
git add assets/js/sims/gps-lora.js assets/js/data/sesion-5.js sesiones/sesion-5.html
git commit -m "feat: S5 GPS/NMEA + LoRa packet simulator"
```

---

## Task 10: Sesión 6 (fondo) + revisión integral y README

**Files:**
- Modify: `sesiones/sesion-6.html` (ya tiene `.bg-ambient` de Task 1; verificar que no falte)
- Modify: `README.md` (documentar simuladores, slots 3D y cómo añadir un `.glb`)

- [ ] **Step 1: Confirmar sesión 6** — La sesión 6 no lleva simulador ni modelo (proyecto abierto). Verificar que `sesiones/sesion-6.html` ya tenga el `<div class="bg-ambient">` de la Task 1 y que **no** cargue scripts de sims (no los necesita). No requiere `sims.css` salvo que se quiera consistencia; no añadirlo si no hay `.sim` ni `.model-slot` en la página.

- [ ] **Step 2: Documentar en `README.md`** — añadir una sección:

```markdown
## Simuladores y modelos 3D

Cada sesión (1–5) incluye un simulador interactivo (`assets/js/sims/<sesion>.js`) y un
slot para modelo 3D del componente principal. Los slots muestran un placeholder hasta
que se les asigna un archivo `.glb`/`.gltf`.

**Para añadir un modelo 3D real:**
1. Coloca el archivo en `assets/models/<componente>.glb`.
2. En `assets/js/data/sesion-N.js`, pon la ruta en `model.src`, por ejemplo:
   `model: { label: 'Arduino Uno', alt: '...', src: '../assets/models/arduino.glb' }`.
3. Al recargar, el slot pasa de placeholder a un visor `<model-viewer>` rotable
   (mouse/touch), con auto-rotación y rotación ligada al scroll.
```

- [ ] **Step 3: Revisión integral en navegador**

Recorrer las 6 páginas + portada:
- Portada: fondo ambiental + circuito Mónaco con punto girando.
- Sesiones 1–5: slot 3D en hero, simulador funcional, diagramas sin recorte.
- Sesión 6: fondo ambiental presente, sin errores por ausencia de sim/model.
- Probar `prefers-reduced-motion: reduce` en portada y una sesión: sin movimiento, estados finales legibles.
- Revisar en viewport móvil (DevTools responsive): simuladores apilan controles/stage; nada se desborda horizontalmente.
Consola sin errores en todas.

- [ ] **Step 4: Commit**

```bash
git add README.md sesiones/sesion-6.html
git commit -m "docs: document simulators and 3D model slots; verify session 6"
```

---

## Self-Review (cobertura del spec)

- Simulador estrella por sesión 1–5 → Tasks 5–9. ✓
- Slots de modelo 3D (placeholder + model-viewer + scroll-rotate) → Task 4 (`renderModel`, `scrollRotate`) + datos `model{}` en Tasks 5–9. ✓
- Fondo capa A (profundidad) → Task 1. ✓
- Fondo capa B (Mónaco + punto telemetría) → Task 2. ✓
- Arreglo de diagramas recortados → Task 3. ✓
- Respeto a `prefers-reduced-motion` → Tasks 1 (CSS), 2 (`reducedMotion()`), 4 (`scrollRotate` early-return), 9 (raf cancel); checkpoints de verificación lo prueban. ✓
- Sin build step / solo CDN → model-viewer por CDN (Tasks 4–9), sin runner. ✓
- Datos técnicos reales (umbrales 25°/110°/90-105°/20mA, direcciones 0x68/0x69, divisor R1=10k/R2=6.8k) → codificados en cada sim. ✓
- Sesión 6 sin sim/model → Task 10. ✓
- Consistencia de nombres: `window.TelemetrySims[type]`, `_util.{reducedMotion,revealOnView,scrollRotate}`, campos `simulator{type,title,caption}` y `model{label,alt,src,poster}` usados idénticos en template (Task 4) y datos (Tasks 5–9). ✓
```
```

Sin placeholders TBD. Cada paso de código muestra el código completo.
