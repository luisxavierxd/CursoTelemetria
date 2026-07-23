# Sitio del Curso de Telemetría Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, GitHub-Pages-ready website for MadRams' "Curso Telemetría — Nuevo Ingreso": a landing page indexing 6 sessions, and a shared, data-driven session-page template rendering each session's theory content with a consistent design system and moderate Anime.js motion.

**Architecture:** Pure static site, no build step. A landing page (`index.html`) is hand-written. Session pages share one renderer (`assets/js/session-template.js`) that builds the DOM from a small per-session data file (`assets/js/data/sesion-N.js`); each `sesiones/sesion-N.html` is a thin shell that loads its data file + the shared renderer. This keeps the 6 nearly-identical pages DRY: one place owns markup/structure, six small files own content.

**Tech Stack:** HTML5, vanilla CSS (custom properties, no preprocessor), vanilla JS (ES modules not required — plain scripts), Anime.js v3.2.1 via CDN (`https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js`), Google Fonts (Space Grotesk, IBM Plex Sans, IBM Plex Mono) via CDN link.

## Global Constraints

- No Node/build tooling required to view or deploy the site — opening `index.html` or serving the folder with any static server must work.
- Color tokens, exactly: `--bg:#0A0E1A`, `--bg-panel:#131B2E`, `--bg-panel-2:#1B2740`, `--blue-royal:#2547E0`, `--blue-bright:#6C8CFF`, `--signal-amber:#FFB13D`, `--text:#E8ECF6`, `--text-dim:#8A93AC`, `--border:#24304A`.
- Fonts: Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono (data/code).
- All technical content (formulas, tables, common errors, bibliography) must match `docs/superpowers/specs/2026-07-22-sitio-curso-telemetria-design.md` verbatim — no invented technical facts.
- No fabricated photos of real hardware — only labeled placeholders or generic schematic SVG diagrams.
- Animations: no infinite loops, no re-triggering on repeated scroll, must respect `prefers-reduced-motion`.
- Real Notion practice links (from the spec) must be used as-is, opening in a new tab (`target="_blank" rel="noopener"`).

---

### Task 1: Project scaffold + design tokens

**Files:**
- Create: `assets/css/tokens.css`
- Create: `assets/img/.gitkeep`
- Create: `assets/img/diagrams/.gitkeep`
- Create: `assets/img/placeholders/.gitkeep`

**Interfaces:**
- Produces: CSS custom properties consumed by every other CSS file: `--bg`, `--bg-panel`, `--bg-panel-2`, `--blue-royal`, `--blue-bright`, `--signal-amber`, `--text`, `--text-dim`, `--border`, `--font-display`, `--font-body`, `--font-mono`, `--space-1`..`--space-6`, `--radius`, `--radius-lg`, `--max-width`, `--header-h`.

- [ ] **Step 1: Create folder scaffold**

```bash
mkdir -p assets/css assets/js/data assets/img/diagrams assets/img/placeholders sesiones
touch assets/img/.gitkeep assets/img/diagrams/.gitkeep assets/img/placeholders/.gitkeep
```

- [ ] **Step 2: Write `assets/css/tokens.css`**

```css
:root {
  /* Color */
  --bg: #0A0E1A;
  --bg-panel: #131B2E;
  --bg-panel-2: #1B2740;
  --blue-royal: #2547E0;
  --blue-bright: #6C8CFF;
  --signal-amber: #FFB13D;
  --text: #E8ECF6;
  --text-dim: #8A93AC;
  --border: #24304A;

  /* Type */
  --font-display: 'Space Grotesk', 'Arial Narrow', sans-serif;
  --font-body: 'IBM Plex Sans', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', 'Consolas', monospace;

  /* Space */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2.5rem;
  --space-5: 4rem;
  --space-6: 6rem;

  /* Layout */
  --radius: 10px;
  --radius-lg: 18px;
  --max-width: 1120px;
  --header-h: 64px;
}
```

- [ ] **Step 3: Verify file loads with no syntax errors**

Run: `node -e "console.log(require('fs').readFileSync('assets/css/tokens.css','utf8').includes('--blue-royal'))"`
Expected: `true`

- [ ] **Step 4: Commit**

```bash
git add assets/css/tokens.css assets/img/.gitkeep assets/img/diagrams/.gitkeep assets/img/placeholders/.gitkeep
git commit -m "chore: scaffold project and design tokens"
```

---

### Task 2: Base styles + shared components

**Files:**
- Create: `assets/css/base.css`

**Interfaces:**
- Consumes: tokens from `assets/css/tokens.css` (Task 1) — must be `<link>`-ed before this file in every HTML page.
- Produces: reusable classes consumed by `index.html` and the session template (Task 5): `.container`, `.site-header`, `.nav-dots`, `.btn`, `.btn--primary`, `.btn--ghost`, `.card`, `.badge`, `.callout`, `.callout--alert`, `.data-table`, `.formula`, `.checklist`, `.checklist__item`, `.reveal` (animation hook class), `.photo-placeholder`, `.site-footer`, `.visually-hidden`.

- [ ] **Step 1: Write `assets/css/base.css`**

```css
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-display);
  font-weight: 600;
  line-height: 1.15;
  margin: 0 0 var(--space-2);
}

p { margin: 0 0 var(--space-2); color: var(--text); }
a { color: var(--blue-bright); }
code, .formula, .data-table { font-family: var(--font-mono); }

.visually-hidden {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); white-space: nowrap;
}

a:focus-visible, button:focus-visible, .btn:focus-visible {
  outline: 2px solid var(--blue-bright);
  outline-offset: 3px;
}

.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--space-3);
}

/* Header / nav */
.site-header {
  position: sticky; top: 0; z-index: 20;
  height: var(--header-h);
  display: flex; align-items: center;
  background: rgba(10, 14, 26, 0.85);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
}
.site-header .container { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.site-header__brand { display: flex; align-items: center; gap: var(--space-1); font-family: var(--font-display); font-weight: 600; color: var(--text); text-decoration: none; }
.site-header__brand img { height: 28px; width: auto; }

.nav-dots { display: flex; gap: 8px; list-style: none; margin: 0; padding: 0; }
.nav-dots a {
  display: block; width: 10px; height: 10px; border-radius: 50%;
  background: var(--border); text-indent: -9999px; overflow: hidden;
  transition: background 0.2s ease, transform 0.2s ease;
}
.nav-dots a:hover { background: var(--blue-bright); }
.nav-dots a[aria-current="true"] { background: var(--blue-royal); transform: scale(1.3); }

/* Buttons */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 22px; border-radius: var(--radius);
  font-family: var(--font-body); font-weight: 600; font-size: 0.95rem;
  text-decoration: none; border: 1px solid transparent; cursor: pointer;
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}
.btn--primary { background: var(--blue-royal); color: #fff; }
.btn--primary:hover { background: var(--blue-bright); transform: translateY(-1px); }
.btn--ghost { background: transparent; border-color: var(--border); color: var(--text); }
.btn--ghost:hover { border-color: var(--blue-bright); color: var(--blue-bright); }

/* Cards */
.card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-3);
  transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  border-color: var(--blue-royal);
  transform: translateY(-3px);
  box-shadow: 0 12px 30px -18px rgba(37, 71, 224, 0.6);
}
.card--alert:hover { border-color: var(--signal-amber); box-shadow: 0 12px 30px -18px rgba(255, 177, 61, 0.5); }

/* Badges */
.badge {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.02em;
  padding: 4px 10px; border-radius: 999px;
  background: var(--bg-panel-2); color: var(--text-dim); border: 1px solid var(--border);
}

/* Callouts */
.callout {
  border-left: 3px solid var(--blue-royal);
  background: var(--bg-panel);
  border-radius: 0 var(--radius) var(--radius) 0;
  padding: var(--space-3);
}
.callout--alert { border-left-color: var(--signal-amber); }

/* Tables (datasheet look) */
.data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
.data-table th, .data-table td {
  text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--border);
}
.data-table th { color: var(--text-dim); font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.04em; }

.formula {
  display: block; background: var(--bg-panel-2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: var(--space-2); white-space: pre-wrap;
  color: var(--blue-bright); font-size: 0.95rem;
}

/* Checklist (errores comunes) */
.checklist { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.checklist__item {
  display: flex; gap: 10px; align-items: flex-start;
  background: var(--bg-panel); border: 1px solid var(--border);
  border-radius: var(--radius); padding: var(--space-2);
}
.checklist__item::before { content: "⚠"; color: var(--signal-amber); flex-shrink: 0; }

/* Photo placeholders */
.photo-placeholder {
  display: flex; align-items: center; justify-content: center; text-align: center;
  aspect-ratio: 4 / 3; border: 2px dashed var(--border); border-radius: var(--radius);
  color: var(--text-dim); font-size: 0.85rem; padding: var(--space-2);
  background: repeating-linear-gradient(135deg, var(--bg-panel), var(--bg-panel) 10px, var(--bg-panel-2) 10px, var(--bg-panel-2) 20px);
}

/* Reveal animation hook: JS toggles .is-visible */
.reveal { opacity: 0; transform: translateY(24px); }
.reveal.is-visible { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; }
}

.site-footer {
  border-top: 1px solid var(--border);
  padding: var(--space-4) 0;
  color: var(--text-dim);
  font-size: 0.9rem;
}
```

- [ ] **Step 2: Verify key classes exist**

Run: `node -e "const c=require('fs').readFileSync('assets/css/base.css','utf8'); ['.reveal','.callout--alert','.data-table','.photo-placeholder'].forEach(s=>{if(!c.includes(s))throw new Error('missing '+s)}); console.log('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add assets/css/base.css
git commit -m "feat: add base styles and shared component classes"
```

---

### Task 3: Animation engine (circuit trace, scroll reveal, counters)

**Files:**
- Create: `assets/js/animations.js`

**Interfaces:**
- Consumes: global `anime` (loaded via CDN `<script>` before this file), DOM elements with classes `.circuit-trace path`, `.reveal`, `[data-counter]`.
- Produces: `window.TelemetryAnim.init()` — call once per page after DOM content (including template-rendered content) is in place. Also exports `window.TelemetryAnim.revealNew(root)` to (re)scan a subtree for `.reveal` elements after the session template injects new DOM (used by Task 5).

- [ ] **Step 1: Write `assets/js/animations.js`**

```javascript
(function () {
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function drawCircuitTraces() {
    var paths = document.querySelectorAll('.circuit-trace path');
    if (!paths.length) return;
    if (reducedMotion() || typeof anime === 'undefined') {
      paths.forEach(function (p) { p.style.strokeDashoffset = 0; });
      return;
    }
    anime({
      targets: paths,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1400,
      delay: function (el, i) { return i * 180; }
    });
  }

  function revealElement(el) {
    if (reducedMotion() || typeof anime === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    el.classList.add('is-visible');
    anime({
      targets: el,
      translateY: [24, 0],
      opacity: [0, 1],
      duration: 650,
      easing: 'easeOutQuad'
    });
  }

  var observer = null;
  function getObserver() {
    if (observer) return observer;
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    return observer;
  }

  function observeReveals(root) {
    var scope = root || document;
    var items = scope.querySelectorAll('.reveal:not(.is-visible)');
    var obs = getObserver();
    items.forEach(function (el) { obs.observe(el); });
  }

  function animateCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-counter'), 10);
      var suffix = el.getAttribute('data-counter-suffix') || '';
      if (reducedMotion() || typeof anime === 'undefined') {
        el.textContent = target + suffix;
        return;
      }
      var obj = { value: 0 };
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          anime({
            targets: obj,
            value: target,
            round: 1,
            duration: 900,
            easing: 'easeOutExpo',
            update: function () { el.textContent = obj.value + suffix; }
          });
          obs.unobserve(el);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  function init() {
    drawCircuitTraces();
    observeReveals(document);
    animateCounters();
  }

  window.TelemetryAnim = { init: init, revealNew: observeReveals };
})();
```

- [ ] **Step 2: Verify syntax is valid JS**

Run: `node -c assets/js/animations.js`
Expected: no output (exit code 0)

- [ ] **Step 3: Commit**

```bash
git add assets/js/animations.js
git commit -m "feat: add anime.js-driven circuit trace, reveal and counter animations"
```

---

### Task 4: Landing page (`index.html`)

**Files:**
- Create: `index.html`
- Create: `assets/css/home.css`
- Create: `assets/img/logo-placeholder.svg`

**Interfaces:**
- Consumes: `assets/css/tokens.css`, `assets/css/base.css`, `assets/css/home.css`, `assets/js/animations.js`, global `anime` from CDN.
- Produces: links to `sesiones/sesion-1.html` … `sesiones/sesion-6.html` (must match filenames Task 6 creates).

- [ ] **Step 1: Write `assets/img/logo-placeholder.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 32" width="120" height="32" role="img" aria-label="Logo MadRams (placeholder)">
  <rect width="120" height="32" rx="6" fill="#131B2E" stroke="#24304A"/>
  <text x="60" y="20" text-anchor="middle" font-family="monospace" font-size="10" fill="#8A93AC">LOGO MADRAMS</text>
</svg>
```

- [ ] **Step 2: Write `assets/css/home.css`**

```css
.hero {
  position: relative;
  min-height: calc(100vh - var(--header-h));
  display: flex; align-items: center;
  overflow: hidden;
}
.hero__trace {
  position: absolute; inset: 0; width: 100%; height: 100%;
  opacity: 0.5; pointer-events: none;
}
.hero__content { position: relative; z-index: 1; max-width: 720px; }
.hero__eyebrow {
  font-family: var(--font-mono); color: var(--signal-amber);
  text-transform: uppercase; letter-spacing: 0.08em; font-size: 0.8rem;
  margin-bottom: var(--space-2);
}
.hero h1 { font-size: clamp(2.2rem, 5vw, 3.6rem); }
.hero p.lead { color: var(--text-dim); font-size: 1.15rem; max-width: 560px; }
.hero__actions { display: flex; gap: var(--space-2); margin-top: var(--space-3); flex-wrap: wrap; }
.scroll-hint {
  position: absolute; bottom: var(--space-3); left: var(--space-3);
  color: var(--text-dim); font-family: var(--font-mono); font-size: 0.8rem;
}

.strip {
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: var(--space-4) 0; background: var(--bg-panel);
}
.strip__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-3); text-align: center; }
.strip__stat .value { font-family: var(--font-display); font-size: 2.4rem; color: var(--blue-bright); }
.strip__stat .label { color: var(--text-dim); font-size: 0.9rem; }
.strip__note { margin-top: var(--space-3); text-align: center; color: var(--text-dim); font-size: 0.9rem; }

.sessions { padding: var(--space-6) 0; }
.sessions h2 { font-size: clamp(1.8rem, 3.5vw, 2.4rem); }
.sessions__grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-3); margin-top: var(--space-4);
}
.session-card { display: flex; flex-direction: column; gap: var(--space-1); text-decoration: none; color: var(--text); }
.session-card .num { font-family: var(--font-display); font-size: 2rem; color: var(--blue-royal); }
.session-card--bonus .num { color: var(--signal-amber); }
.session-card h3 { font-size: 1.15rem; margin-bottom: 4px; }
.session-card .sub { color: var(--text-dim); font-size: 0.88rem; margin-bottom: var(--space-1); }
.session-card .tags { display: flex; gap: 6px; flex-wrap: wrap; }

@media (max-width: 640px) {
  .hero__actions { flex-direction: column; align-items: flex-start; }
}
```

- [ ] **Step 3: Write `index.html`**

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Curso Telemetría — Nuevo Ingreso · MadRams</title>
  <meta name="description" content="Curso introductorio de electrónica para telemetría, 5 sesiones basadas 1:1 en los subsistemas reales de MadRams Minibaja SAE.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/css/tokens.css">
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/home.css">
</head>
<body>
  <header class="site-header">
    <div class="container">
      <a class="site-header__brand" href="index.html">
        <img src="assets/img/logo-placeholder.svg" alt="MadRams">
        <span>Curso Telemetría</span>
      </a>
      <a class="btn btn--ghost" href="https://app.notion.com/" target="_blank" rel="noopener">Notion del equipo</a>
    </div>
  </header>

  <main>
    <section class="hero">
      <svg class="hero__trace circuit-trace" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <path d="M0 420 L160 420 L160 300 L360 300 L360 120 L620 120 L620 260 L800 260"
              fill="none" stroke="#2547E0" stroke-width="2" stroke-dasharray="1200" />
        <path d="M0 80 L120 80 L120 200 L300 200 L300 400 L520 400 L520 480 L800 480"
              fill="none" stroke="#6C8CFF" stroke-width="1.5" stroke-dasharray="1200" opacity="0.6" />
      </svg>
      <div class="container">
        <div class="hero__content">
          <p class="hero__eyebrow">MadRams · Minibaja SAE</p>
          <h1>De la Ley de Ohm a un GPS con radio propia</h1>
          <p class="lead">Curso introductorio de electrónica para telemetría, pensado para estudiantes de nuevo ingreso. Cinco sesiones prácticas, basadas 1:1 en los sensores reales del coche: suspensión, temperatura, IMU y GPS.</p>
          <div class="hero__actions">
            <a class="btn btn--primary" href="sesiones/sesion-1.html">Empezar en Sesión 1</a>
            <a class="btn btn--ghost" href="#temario">Ver el temario</a>
          </div>
        </div>
      </div>
      <div class="scroll-hint">↓ scroll</div>
    </section>

    <section class="strip">
      <div class="container">
        <div class="strip__grid">
          <div class="strip__stat"><div class="value" data-counter="5">0</div><div class="label">sesiones</div></div>
          <div class="strip__stat"><div class="value" data-counter="90" data-counter-suffix=" min">0</div><div class="label">por sesión</div></div>
          <div class="strip__stat"><div class="value" data-counter="0" data-counter-suffix="%">0</div><div class="label">contacto con el coche viejo</div></div>
        </div>
        <p class="strip__note">Cada sesión: 20-30 min de teoría + 60-70 min de práctica con kits Arduino. Ninguna de las 5 sesiones del curso introductorio requiere acercarse al coche viejo — la Sesión 6+ es aparte y opcional.</p>
      </div>
    </section>

    <section class="sessions" id="temario">
      <div class="container">
        <h2>Temario</h2>
        <div class="sessions__grid">
          <a class="card session-card reveal" href="sesiones/sesion-1.html">
            <span class="num">01</span>
            <h3>Electricidad + Arduino</h3>
            <p class="sub">Base de todo el sistema electrónico</p>
            <div class="tags"><span class="badge">LED · resistencias</span><span class="badge">multímetro</span></div>
          </a>
          <a class="card session-card reveal" href="sesiones/sesion-2.html">
            <span class="num">02</span>
            <h3>Suspensión (potenciómetro)</h3>
            <p class="sub">Potenciómetro OEM GM 15098628/29</p>
            <div class="tags"><span class="badge">potenciómetro</span><span class="badge">divisor de voltaje</span></div>
          </a>
          <a class="card session-card reveal" href="sesiones/sesion-3.html">
            <span class="num">03</span>
            <h3>Temperatura (DS18B20 + OneWire)</h3>
            <p class="sub">DS18B20 motor/CVT · mención AS5600</p>
            <div class="tags"><span class="badge">DS18B20</span><span class="badge">MPR121 (bonus)</span></div>
          </a>
          <a class="card session-card reveal" href="sesiones/sesion-4.html">
            <span class="num">04</span>
            <h3>IMU y bus I2C</h3>
            <p class="sub">MPU6050 ×2 — chasis 0x68 / volante 0x69</p>
            <div class="tags"><span class="badge">MPU6050</span><span class="badge">I2C</span></div>
          </a>
          <a class="card session-card reveal" href="sesiones/sesion-5.html">
            <span class="num">05</span>
            <h3>GPS + Demo del sistema real</h3>
            <p class="sub">MAX-M10S · LoRa 915MHz · dashboard Grafana</p>
            <div class="tags"><span class="badge">GPS NMEA</span><span class="badge">microSD</span></div>
          </a>
          <a class="card card--alert session-card session-card--bonus reveal" href="sesiones/sesion-6.html">
            <span class="num">06+</span>
            <h3>Proyecto de equipo: Black Box real</h3>
            <p class="sub">Instalación en el coche viejo — solo equipo</p>
            <div class="tags"><span class="badge">siguiente nivel</span></div>
          </a>
        </div>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container">
      <p><strong>Bibliografía general:</strong> Scherz &amp; Monk — <em>Practical Electronics for Inventors</em> · MPU6050 Datasheet (InvenSense) · DS18B20 Datasheet (Analog Devices) · u-blox MAX-M10S Datasheet · Heltec WiFi LoRa 32 V4 docs · SparkFun Learn / Adafruit Learning System · Baja SAE 2026 Rules, Rev A.</p>
      <p>MadRams — Minibaja SAE. Material del curso vive en el Notion del equipo.</p>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>
  <script src="assets/js/animations.js"></script>
  <script>window.TelemetryAnim.init();</script>
</body>
</html>
```

- [ ] **Step 4: Verify links resolve to files Task 6 will create**

Run: `node -e "const h=require('fs').readFileSync('index.html','utf8'); for(let i=1;i<=6;i++){ if(!h.includes('sesiones/sesion-'+i+'.html')) throw new Error('missing link to session '+i);} console.log('ok')"`
Expected: `ok`

- [ ] **Step 5: Manually preview**

Run: `python -m http.server 8000` (from project root), open `http://localhost:8000/` in a browser.
Expected: hero renders with animated circuit trace, counters animate into view, 6 session cards visible and clickable (links 404 until Task 6, that's fine at this point).

- [ ] **Step 6: Commit**

```bash
git add index.html assets/css/home.css assets/img/logo-placeholder.svg
git commit -m "feat: build landing page with hero, stats strip and temario grid"
```

---

### Task 5: Session page renderer + session CSS

**Files:**
- Create: `assets/js/session-template.js`
- Create: `assets/css/sesion.css`

**Interfaces:**
- Consumes: `window.SESSION_DATA` (object, defined by each `assets/js/data/sesion-N.js` from Task 6) with shape:
  ```
  {
    slug: string,            // "sesion-1"
    number: string,          // "01"
    icon: string,            // emoji
    title: string,
    quote: string,
    badges: string[],
    content: string[],       // bullet list, "Contenido"
    connection: { heading: string, body: string },
    reference: {
      intro?: string,
      formulas?: { label: string, code: string }[],
      tables?: { caption: string, headers: string[], rows: string[][] }[]
    },
    errors: string[],
    bibliography: string[],
    cta: { label: string, url: string },
    isAlertSession?: boolean,   // true only for sesion-6 (safety protocol styling)
    safety?: string[],          // only for sesion-6
    prev?: { label: string, url: string },
    next?: { label: string, url: string }
  }
  ```
- Produces: `window.TelemetryTemplate.render(data)` — call from each `sesion-N.html` after both scripts load; injects full page body into `#session-root` and calls `window.TelemetryAnim.revealNew(root)` + `window.TelemetryAnim.init's` counter/trace logic is not needed here (session pages don't reuse counters/traces, only `.reveal`).

- [ ] **Step 1: Write `assets/css/sesion.css`**

```css
.session-hero { padding: var(--space-5) 0 var(--space-4); border-bottom: 1px solid var(--border); }
.session-hero .num { font-family: var(--font-display); font-size: 3rem; color: var(--blue-royal); }
.session-hero h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); margin-top: var(--space-1); }
.session-hero .quote { color: var(--text-dim); font-style: italic; max-width: 640px; }
.session-hero .badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: var(--space-2); }

.session-section { padding: var(--space-5) 0; }
.session-section h2 { font-size: 1.6rem; margin-bottom: var(--space-3); }
.session-section + .session-section { border-top: 1px solid var(--border); }

.content-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.content-list li {
  background: var(--bg-panel); border: 1px solid var(--border); border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);
}

.reference-block { display: grid; gap: var(--space-3); margin-top: var(--space-2); }
.reference-block .formula-item .formula-label { color: var(--text-dim); font-size: 0.85rem; margin-bottom: 4px; }
.table-wrap { overflow-x: auto; }
.table-caption { color: var(--text-dim); font-size: 0.85rem; margin-bottom: 6px; }

.session-nav { display: flex; justify-content: space-between; gap: var(--space-2); padding: var(--space-4) 0; flex-wrap: wrap; }

.safety-box { border: 1px solid var(--signal-amber); border-radius: var(--radius-lg); padding: var(--space-3); background: rgba(255,177,61,0.06); }
.safety-box h3 { color: var(--signal-amber); }
```

- [ ] **Step 2: Write `assets/js/session-template.js`**

```javascript
(function () {
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function renderHeader(data) {
    var dots = [1, 2, 3, 4, 5].map(function (n) {
      var current = data.slug === 'sesion-' + n;
      return el('a', { href: 'sesion-' + n + '.html', 'aria-current': current ? 'true' : 'false' }, ['Sesión ' + n]);
    });
    return el('header', { class: 'site-header' }, [
      el('div', { class: 'container' }, [
        el('a', { class: 'site-header__brand', href: '../index.html' }, [
          el('img', { src: '../assets/img/logo-placeholder.svg', alt: 'MadRams' }),
          document.createTextNode('Curso Telemetría')
        ]),
        el('ul', { class: 'nav-dots' }, dots)
      ])
    ]);
  }

  function renderHero(data) {
    return el('section', { class: 'session-hero' }, [
      el('div', { class: 'container' }, [
        el('span', { class: 'num' }, [data.icon + ' ' + data.number]),
        el('h1', {}, [data.title]),
        el('p', { class: 'quote' }, [data.quote]),
        el('div', { class: 'badges' }, data.badges.map(function (b) { return el('span', { class: 'badge' }, [b]); }))
      ])
    ]);
  }

  function renderContent(data) {
    var items = data.content.map(function (line) { return el('li', {}, [line]); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Contenido']),
        el('ul', { class: 'content-list reveal' }, items)
      ])
    ]);
  }

  function renderConnection(data) {
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('div', { class: 'callout reveal' }, [
          el('h2', {}, [data.connection.heading]),
          el('p', {}, [data.connection.body])
        ])
      ])
    ]);
  }

  function renderTable(t) {
    var thead = el('thead', {}, [el('tr', {}, t.headers.map(function (h) { return el('th', {}, [h]); }))]);
    var tbody = el('tbody', {}, t.rows.map(function (row) {
      return el('tr', {}, row.map(function (cell) { return el('td', {}, [cell]); }));
    }));
    return el('div', { class: 'table-wrap' }, [
      el('p', { class: 'table-caption' }, [t.caption]),
      el('table', { class: 'data-table' }, [thead, tbody])
    ]);
  }

  function renderReference(data) {
    var ref = data.reference || {};
    var blocks = [];
    if (ref.intro) blocks.push(el('p', {}, [ref.intro]));
    (ref.formulas || []).forEach(function (f) {
      blocks.push(el('div', { class: 'formula-item' }, [
        el('div', { class: 'formula-label' }, [f.label]),
        el('code', { class: 'formula' }, [f.code])
      ]));
    });
    (ref.tables || []).forEach(function (t) { blocks.push(renderTable(t)); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Referencia rápida']),
        el('div', { class: 'reference-block reveal' }, blocks)
      ])
    ]);
  }

  function renderErrors(data) {
    var items = data.errors.map(function (e) { return el('li', { class: 'checklist__item' }, [e]); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Errores comunes']),
        el('ul', { class: 'checklist reveal' }, items)
      ])
    ]);
  }

  function renderSafety(data) {
    if (!data.safety) return null;
    var items = data.safety.map(function (s) { return el('li', { class: 'checklist__item' }, [s]); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('div', { class: 'safety-box reveal' }, [
          el('h3', {}, ['⚠ Protocolo de seguridad (obligatorio)']),
          el('ul', { class: 'checklist' }, items)
        ])
      ])
    ]);
  }

  function renderBiblio(data) {
    var items = data.bibliography.map(function (b) { return el('li', {}, [b]); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Bibliografía']),
        el('ul', { class: 'reveal' }, items)
      ])
    ]);
  }

  function renderCta(data) {
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('a', { class: 'btn btn--primary reveal', href: data.cta.url, target: '_blank', rel: 'noopener' }, [data.cta.label])
      ])
    ]);
  }

  function renderNav(data) {
    var prev = data.prev ? el('a', { class: 'btn btn--ghost', href: data.prev.url }, ['← ' + data.prev.label]) : el('span', {}, []);
    var next = data.next ? el('a', { class: 'btn btn--ghost', href: data.next.url }, [data.next.label + ' →']) : el('span', {}, []);
    return el('nav', { class: 'session-nav container' }, [prev, next]);
  }

  function renderFooter() {
    var f = el('footer', { class: 'site-footer' }, [
      el('div', { class: 'container' }, [el('p', {}, ['MadRams — Minibaja SAE. Material del curso vive en el Notion del equipo.'])])
    ]);
    return f;
  }

  function render(data) {
    var root = document.getElementById('session-root');
    root.appendChild(renderHeader(data));
    root.appendChild(renderHero(data));
    root.appendChild(renderContent(data));
    root.appendChild(renderConnection(data));
    root.appendChild(renderReference(data));
    root.appendChild(renderErrors(data));
    var safety = renderSafety(data);
    if (safety) root.appendChild(safety);
    root.appendChild(renderBiblio(data));
    root.appendChild(renderCta(data));
    root.appendChild(renderNav(data));
    root.appendChild(renderFooter());
    document.title = data.title + ' · Curso Telemetría · MadRams';
    if (window.TelemetryAnim) window.TelemetryAnim.revealNew(root);
  }

  window.TelemetryTemplate = { render: render };
})();
```

- [ ] **Step 3: Verify syntax**

Run: `node -c assets/js/session-template.js && node -c assets/css/sesion.css 2>/dev/null; echo css-skip-ok`

(CSS isn't JS-checkable; just confirm the JS file parses.)
Expected: no error output from the `node -c` call.

- [ ] **Step 4: Commit**

```bash
git add assets/css/sesion.css assets/js/session-template.js
git commit -m "feat: add data-driven session page renderer and session styles"
```

---

### Task 6: Session data files + HTML shells (all 6 sessions)

**Files:**
- Create: `assets/js/data/sesion-1.js` … `assets/js/data/sesion-6.js`
- Create: `sesiones/sesion-1.html` … `sesiones/sesion-6.html`

**Interfaces:**
- Consumes: `window.SESSION_DATA` shape from Task 5.
- Produces: the 6 public URLs linked from `index.html` (Task 4) and from each other (`prev`/`next`).

- [ ] **Step 1: Write `assets/js/data/sesion-1.js`**

```javascript
window.SESSION_DATA = {
  slug: 'sesion-1',
  number: '01',
  icon: '⚡',
  title: 'Electricidad + Arduino',
  quote: 'Base indispensable: sin esto nada del resto tiene sentido.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'Sin subsistema específico — base de todo el sistema', 'LED, resistencias, multímetro'],
  content: [
    'Voltaje (V), corriente (I), resistencia (R)',
    'Ley de Ohm: V = I × R',
    'Circuitos en serie vs. paralelo',
    'Qué es un microcontrolador y qué hace Arduino',
    'El IDE de Arduino: estructura setup() / loop()',
    'Uso básico de un multímetro (voltaje, continuidad, resistencia)'
  ],
  connection: {
    heading: 'Por qué importa para Baja',
    body: 'Todo sensor de telemetría se reduce, al final, a leer un voltaje. Esta sesión es la base de todas las demás — sin Ley de Ohm y sin saber usar un multímetro, ningún sensor posterior va a tener sentido.'
  },
  reference: {
    formulas: [
      { label: 'Resistencia para el LED (Arduino da 5V, LED necesita ~2V y ~15mA)', code: 'R = (V_arduino - V_led) / I_led\nR = (5V - 2V) / 0.015A\nR = 200 Ω  → se usa 220Ω (valor comercial más cercano)' }
    ],
    tables: [
      { caption: 'Código de colores de resistencias (las más comunes en el kit)', headers: ['Colores (banda 1 - banda 2 - multiplicador)', 'Valor'], rows: [
        ['Rojo - Rojo - Café', '220 Ω'],
        ['Café - Negro - Rojo', '1 kΩ'],
        ['Café - Negro - Naranja', '10 kΩ']
      ] },
      { caption: 'Pines del Arduino Uno/Nano — lo básico que se usa en todo el curso', headers: ['Pin', 'Para qué sirve'], rows: [
        ['5V / 3.3V', 'Alimentación para sensores'],
        ['GND', 'Tierra — siempre debe estar conectada, si falta nada funciona'],
        ['Pines digitales (0-13)', 'HIGH/LOW — encender/apagar cosas, leer botones'],
        ['Pines con ~ (ej. 3, 5, 6, 9, 10, 11)', 'Soportan PWM (analogWrite)'],
        ['Pines analógicos (A0-A5)', 'Leer voltajes variables (analogRead) — potenciómetros, sensores analógicos'],
        ['A4 (SDA) / A5 (SCL)', 'Bus I2C — se usa en Sesiones 3 y 4']
      ] }
    ]
  },
  errors: [
    'LED no prende: revisar polaridad (la pata larga va al positivo) y que la resistencia esté en el circuito, no solo cerca.',
    'Arduino no sube el código: revisar que el puerto/board correctos estén seleccionados en el IDE (Tools > Port / Board).',
    'Circuito "no hace nada": medir con multímetro en modo continuidad cada conexión antes de sospechar del código.'
  ],
  bibliography: [
    'Scherz & Monk — Practical Electronics for Inventors, McGraw-Hill (capítulos de fundamentos)',
    'Arduino Official Docs — docs.arduino.cc'
  ],
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://app.notion.com/p/3a5b2fdbb6b981ea8e70ebdee9da3063' },
  next: { label: 'Sesión 2 — Suspensión', url: 'sesion-2.html' }
};
```

- [ ] **Step 2: Write `assets/js/data/sesion-2.js`**

```javascript
window.SESSION_DATA = {
  slug: 'sesion-2',
  number: '02',
  icon: '🔧',
  title: 'Suspensión (potenciómetro)',
  quote: 'Divisor de voltaje aplicado al sensor real de suspensión.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'Potenciómetro OEM GM 15098628/29 ×4', 'Alerta si ángulo > 25°'],
  content: [
    'Señales analógicas vs. digitales',
    'analogRead() — cómo el Arduino convierte voltaje a un número (ADC 0-1023)',
    'Divisor de voltaje: por qué y cómo se usa para bajar de 5V a 3.3V',
    'PWM básico (analogWrite())'
  ],
  connection: {
    heading: 'Conexión con MadRams',
    body: 'El sensor de suspensión del coche nuevo es literalmente un potenciómetro OEM (GM 15098628/29), uno por rueda. La señal pasa por un divisor de voltaje porque el sensor da 5V pero el ESP32 solo acepta 3.3V en sus entradas — exactamente el mismo circuito que se practica hoy, solo que a otra escala de voltaje. Umbral real de alerta: ángulo de suspensión > 25°.'
  },
  reference: {
    formulas: [
      { label: 'Cómo el Arduino convierte voltaje a número (ADC de 10 bits, 0-5V → 0-1023)', code: 'valor_leido = (V_medido / 5V) × 1023\n// Ejemplo: 2.5V → ~511' },
      { label: 'Divisor de voltaje (ejemplo real: 5V → 3.3V con R1=10kΩ, R2=6.8kΩ)', code: 'V_out = V_in × (R2 / (R1 + R2))\nV_out = 5V × (6.8k / (10k + 6.8k)) ≈ 2.02V' }
    ],
    intro: '⚠ Nunca conectar 5V directo a un pin que solo acepta 3.3V (como en el ESP32) sin el divisor — se puede dañar el pin permanentemente. map(valor, in_min, in_max, out_min, out_max) convierte un rango de números a otro: en la práctica, 0-1023 de analogRead() a 0-40° de ángulo simulado de suspensión.'
  },
  errors: [
    'analogRead() siempre da 0 o 1023 fijo: revisar que el potenciómetro tenga sus 3 patas bien conectadas (dos extremos a 5V/GND, cursor central al pin analógico) — si falta un extremo, la lectura queda "flotando".',
    'Valor con mucho ruido/salta constantemente: normal en pequeña medida por ADC; si es excesivo, revisar cables sueltos o protoboard con mala conexión.',
    'LED de alerta no reacciona: verificar que el umbral en el código (25°) esté realmente dentro del rango que produce el map() (0-40°).'
  ],
  bibliography: [
    'Página "Suspensión — IMU & Potenciómetros" (Notion MadRams)',
    'Arduino Docs — analogRead(), analogWrite()',
    'Scherz & Monk — Practical Electronics for Inventors (divisores de voltaje)'
  ],
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://app.notion.com/p/3a5b2fdbb6b981a8a4bcffe70053f8fe' },
  prev: { label: 'Sesión 1', url: 'sesion-1.html' },
  next: { label: 'Sesión 3 — Temperatura', url: 'sesion-3.html' }
};
```

- [ ] **Step 3: Write `assets/js/data/sesion-3.js`**

```javascript
window.SESSION_DATA = {
  slug: 'sesion-3',
  number: '03',
  icon: '🌡️',
  title: 'Temperatura (DS18B20 + OneWire)',
  quote: 'Bus OneWire + calibración segura de un sensor real, sin riesgos de quemadura.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'DS18B20 en motor/CVT · dos sensores, un bus', 'Bonus: MPR121 capacitivo'],
  content: [
    'Bus OneWire: cómo múltiples sensores comparten un solo pin de datos',
    'Por qué monitorear temperatura de motor y CVT (riesgo de daño térmico)',
    'Mención breve de AS5600 (encoder magnético I2C usado para RPM) — sin profundizar',
    'Intro a sensado capacitivo (MPR121) como concepto de "tocar = señal"'
  ],
  connection: {
    heading: 'Conexión con MadRams',
    body: 'DS18B20 monitorea motor (alerta >110°C) y CVT (advertencia >90°C, crítico >105°C). AS5600 ×2 (vía mux por dirección duplicada) mide RPM de motor y de salida CVT. MPR121 mide nivel de líquido de frenos de forma capacitiva (0-100%), alerta si <20%. Tarea pendiente real en el Notion de MadRams: montar físicamente el DS18B20 en motor/CVT — hoy practicamos exactamente eso.'
  },
  reference: {
    intro: 'El DS18B20 usa un solo cable de datos para comunicarse (a diferencia de I2C que usa 2: SDA y SCL). Cada sensor tiene un identificador único grabado de fábrica (ROM address de 64 bits), así que se pueden poner varios DS18B20 en el mismo pin y el código los distingue por índice o por su ROM address. La resistencia pull-up de 4.7kΩ es obligatoria: el pin DATA necesita quedar "en alto" cuando nadie transmite; sin ella, las lecturas salen erráticas o en -85°C. El MPR121 típico usa la dirección I2C 0x5A por default.'
  },
  errors: [
    'Lectura fija en -127°C o 85°C: falta la resistencia pull-up o el cableado DATA está mal.',
    '"No se encontró el sensor": revisar VCC/GND, y que el pin definido en el código (PIN_DATOS) coincida con el físico.',
    'MPR121 no responde: confirmar dirección I2C con un scanner (código en la Sesión 4) antes de asumir que el módulo está dañado.'
  ],
  bibliography: [
    'DS18B20 Datasheet — Analog Devices',
    'Página "Temperatura — Motor & Transmisión CVT" (Notion MadRams)',
    'Página "RPM & Velocidad" (Notion MadRams)'
  ],
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://app.notion.com/p/3a5b2fdbb6b981d393cdf664a8a6edc6' },
  prev: { label: 'Sesión 2', url: 'sesion-2.html' },
  next: { label: 'Sesión 4 — IMU y bus I2C', url: 'sesion-4.html' }
};
```

- [ ] **Step 4: Write `assets/js/data/sesion-4.js`**

```javascript
window.SESSION_DATA = {
  slug: 'sesion-4',
  number: '04',
  icon: '📐',
  title: 'IMU y bus I2C',
  quote: 'Introducción a I2C usando el sensor real de detección de impacto/rollover.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'MPU6050 ×2 en el mismo bus I2C', 'Chasis 0x68 / volante 0x69'],
  content: [
    'Qué es un bus I2C: SDA, SCL, direcciones de dispositivo',
    'Por qué varios sensores pueden compartir 2 cables',
    'Qué es un IMU (acelerómetro + giroscopio) y qué mide cada eje',
    'Concepto de umbral para detección de eventos (impacto, inclinación)'
  ],
  connection: {
    heading: 'Conexión con MadRams',
    body: 'MadRams usa dos MPU6050 en el mismo bus I2C: uno en el chasis (dirección 0x68) y otro en el volante (0x69). Es el ejemplo perfecto de por qué existen las direcciones I2C — sin ellas, el Arduino no podría distinguir de cuál sensor viene cada dato. Uso real: detección de impacto / rollover (seguridad del piloto).'
  },
  reference: {
    intro: 'SDA (Serial Data) es por donde viajan los datos; SCL (Serial Clock) es el "reloj" que sincroniza cuándo se lee cada bit. En Arduino Uno son fijos: SDA = A4, SCL = A5. Una dirección I2C es un número de 7 bits (0-127); dos dispositivos no pueden compartir la misma dirección en el mismo bus — por eso MadRams usa 0x68 y 0x69 (el pin AD0 cambia la dirección entre esos valores). Si se necesitan más de 2 sensores idénticos (como los 2 AS5600 del coche real), se usa un multiplexor I2C (TCA9548A) — tema para fases posteriores, no necesario en este curso. La librería de Adafruit regresa la aceleración en m/s²: en reposo, el eje que apunta hacia abajo debe marcar ≈9.8 m/s², buena forma de verificar que el sensor lee bien. El valor de UMBRAL en el código de impacto es arbitrario — se recomienda probar varios valores en vivo y ajustar.'
  },
  errors: [
    '"No se encontró el MPU6050": revisar que SDA↔SCL no estén invertidos, y que VCC sea el voltaje correcto del módulo (5V o 3.3V según el modelo).',
    'Lecturas todas en cero: confirmar que Wire.begin() se esté llamando (mpu.begin() de Adafruit lo hace automático, pero con código propio hay que agregarlo).',
    'El I2C Scanner no encuentra nada: problema de cableado casi siempre — revisar continuidad de SDA/SCL/GND con multímetro.'
  ],
  bibliography: [
    'MPU6050 Datasheet — InvenSense',
    'Página "Suspensión — IMU & Potenciómetros" (Notion MadRams)',
    'SparkFun Learn — tutorial de I2C'
  ],
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://app.notion.com/p/3a5b2fdbb6b981449f11dab04448a812' },
  prev: { label: 'Sesión 3', url: 'sesion-3.html' },
  next: { label: 'Sesión 5 — GPS + Demo', url: 'sesion-5.html' }
};
```

- [ ] **Step 5: Write `assets/js/data/sesion-5.js`**

```javascript
window.SESSION_DATA = {
  slug: 'sesion-5',
  number: '05',
  icon: '📡',
  title: 'GPS + Demo del sistema real (dashboard y radio)',
  quote: 'Cierre del curso introductorio: de sensores sueltos a construir la mitad de un sistema de adquisición real, y ver la otra mitad funcionando.',
  badges: ['1:30h (25-30 min teoría / 60-65 min práctica y demo)', 'GPS MAX-M10S + LoRa Heltec 915MHz + dashboard Grafana', 'Práctica hands-on: GPS + microSD'],
  content: [
    'Qué es un GPS y qué datos entrega (lat/lng, velocidad, protocolo NMEA)',
    'Qué es una tarjeta microSD y cómo se usa como respaldo local de datos (formato CSV)',
    'Por qué un sistema de telemetría real necesita respaldo local, no solo transmisión en vivo',
    'Qué es un dashboard de telemetría (Grafana) y para qué sirve ver los datos en vivo vs. después',
    'Radio LoRa en más detalle: por qué 915MHz, qué es un "paquete" de datos, transmitir a 5Hz vs. 1Hz',
    'Dashboard y radio son para ver el sistema real funcionando, no para programarlo hoy — eso es la Sesión 6+'
  ],
  connection: {
    heading: 'Conexión con MadRams',
    body: 'El coche real arma todo esto: ESP32 → LoRa 915MHz → receptor en pits → InfluxDB → Grafana, y además graba todo en SD como respaldo (SD @10Hz vs. LoRa @2Hz) por si se pierde la señal de radio. Ya construyeron, sin saberlo, una versión mini de casi todas las piezas de sensado (potenciómetro, MPU6050, DS18B20, MPR121) — hoy arman la mitad de "abajo" del sistema (GPS + respaldo SD) y ven en demo la mitad de "arriba" (dashboard + radio). Dashboard Grafana real: sección LIVE (gauges de RPM y velocidad, temperaturas de motor/CVT, voltaje de batería, mapa con trayectoria GPS coloreada por velocidad) y sección ANÁLISIS (máximos de la sesión, comparativas velocidad vs. RPM, tabla histórica). Radio LoRa (Heltec WiFi LoRa 32 V4, chip SX1262): 915MHz (banda US915), paquete de ruta 5 veces por segundo y paquete de estado 1 vez por segundo, protocolo binario para pesar menos y viajar más lejos.'
  },
  reference: {
    intro: 'Un módulo GPS necesita "ver" al menos 4 satélites para calcular posición (fix); puede tardar desde segundos (cielo abierto) hasta varios minutos (interior, primer encendido — "cold start"). Si gps.location.isUpdated() nunca es true, probar cerca de una ventana o al aire libre antes de sospechar del código. La tarjeta SD debe estar formateada en FAT32 (no exFAT, no NTFS) o SD.begin() falla; tarjetas de 2-16GB suelen ser más confiables en FAT32 que tarjetas grandes.',
    tables: [
      { caption: 'Pines SPI para el módulo microSD (Arduino Uno)', headers: ['Señal', 'Pin Uno'], rows: [
        ['MOSI', '11'], ['MISO', '12'], ['SCK', '13'], ['CS (Chip Select)', '10 (o el que se defina en el código, ej. pinCS)']
      ] }
    ]
  },
  errors: [
    'SD.begin() falla / "Error al iniciar la SD": revisar que pinCS en el código coincida con el pin físico conectado, y que la tarjeta esté en FAT32.',
    'GPS nunca da fix: esperar más tiempo al aire libre antes de asumir que el módulo está dañado; revisar también que el baudrate (9600) coincida con el del módulo.',
    'El archivo CSV sale vacío o con líneas repetidas: confirmar que se está usando SD.open(..., FILE_WRITE) y cerrando el archivo (.close()) después de cada escritura.'
  ],
  bibliography: [
    'u-blox MAX-M10S Datasheet',
    'Página "GPS — MAX-M10S + Estrategia Ruta Óptima" (Notion MadRams)',
    'Página "Radios LoRa — 915MHz" (Notion MadRams)',
    'Página "Integración Telemetry Stack — MadRams LoRa Local" (Notion MadRams)',
    'Heltec WiFi LoRa 32 V4 docs',
    'Arduino Docs — librería SD.h'
  ],
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://app.notion.com/p/3a5b2fdbb6b98171a79cc786f9ca83f9' },
  prev: { label: 'Sesión 4', url: 'sesion-4.html' },
  next: { label: 'Sesión 6+ — Proyecto de equipo', url: 'sesion-6.html' }
};
```

- [ ] **Step 6: Write `assets/js/data/sesion-6.js`**

```javascript
window.SESSION_DATA = {
  slug: 'sesion-6',
  number: '06+',
  icon: '🏁',
  title: 'Proyecto de equipo: Black Box real en el coche viejo',
  quote: 'Para quienes se quedan al equipo después del curso introductorio. Ya no es una sesión de 1:30h fija — es el primer proyecto real.',
  badges: ['Formato abierto — 1+ sesiones de trabajo, según avance', 'Sistema de adquisición completo instalado en vehículo', 'Solo para quienes se quedan al equipo'],
  content: [
    'Qué cambia al pasar de protoboard a un circuito permanente: soldadura, conectores tipo Deutsch/JST, protección contra vibración (headers en vez de jumpers sueltos)',
    'Consideraciones de montaje mecánico: dónde va la caja, cómo se sujeta, qué tan lejos debe estar de fuentes de calor real (motor, escape, CVT)',
    'Cómo se integra esta caja negra al resto del stack real de MadRams (mismo formato CSV, misma idea de respaldo que ya vieron en la Sesión 5)'
  ],
  connection: {
    heading: 'Diferencia clave vs. el curso introductorio',
    body: 'En la Sesión 5 se armó GPS + SD en protoboard, sobre una mesa. Acá el reto es que ese mismo circuito sobreviva en un vehículo real: vibración, polvo, calor, conectores que no se zafen. Es la diferencia entre un prototipo que funciona una vez y un sistema que aguanta una carrera completa. Es, literalmente, terminar una de las tareas pendientes reales del equipo: dejar el sistema de adquisición físicamente instalado y validado en vehículo, no solo en protoboard.'
  },
  reference: {
    intro: 'Este proyecto se trabaja con supervisión directa de un líder de electrónica del equipo — no hay una "referencia rápida" de fórmulas aquí porque el trabajo es de integración e instalación, no de un sensor nuevo.'
  },
  errors: [],
  isAlertSession: true,
  safety: [
    'Toda instalación física se hace con el coche apagado y frío (mínimo varias horas sin encender).',
    'Nadie monta o desmonta nada cerca del motor/escape/CVT sin un líder de electrónica presente.',
    'Si se necesita una prueba con el motor encendido, la enciende únicamente el líder del equipo, nunca un estudiante nuevo por su cuenta.',
    'Guantes y precaución estándar de taller en todo momento.'
  ],
  bibliography: [
    'Página "Piezas Faltantes — MadRams" (Notion)',
    'Página "Tasks" (Notion MadRams)',
    'Página "Sesiones de Prueba — MadRams" (Notion)',
    'Página "Integración Telemetry Stack — MadRams LoRa Local" (Notion)',
    'Arduino Docs — librería SD.h'
  ],
  cta: { label: 'Habla con el líder de electrónica del equipo →', url: 'https://app.notion.com/p/3a6b2fdbb6b9810498d8d9dcdc191254' },
  prev: { label: 'Sesión 5', url: 'sesion-5.html' }
};
```

Note: `session-template.js`'s `renderErrors` runs even when `data.errors` is `[]`, producing an empty "Errores comunes" heading with no items for Sesión 6. Fix before this task is done — see Step 7.

- [ ] **Step 7: Guard the "Errores comunes" section for empty arrays**

Modify `assets/js/session-template.js`, in the `render()` function, replace:

```javascript
    root.appendChild(renderErrors(data));
```

with:

```javascript
    if (data.errors && data.errors.length) root.appendChild(renderErrors(data));
```

- [ ] **Step 8: Write the 6 HTML shells**

Create `sesiones/sesion-1.html` (repeat the same shell for `sesion-2.html` through `sesion-6.html`, changing only the `<script src="../assets/js/data/sesion-N.js">` filename):

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Sesión · Curso Telemetría · MadRams</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../assets/css/tokens.css">
  <link rel="stylesheet" href="../assets/css/base.css">
  <link rel="stylesheet" href="../assets/css/sesion.css">
</head>
<body>
  <div id="session-root"></div>

  <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.min.js"></script>
  <script src="../assets/js/animations.js"></script>
  <script src="../assets/js/data/sesion-1.js"></script>
  <script src="../assets/js/session-template.js"></script>
  <script>window.TelemetryTemplate.render(window.SESSION_DATA);</script>
</body>
</html>
```

For `sesion-2.html` … `sesion-6.html`, use the identical shell but change the data-file line to `<script src="../assets/js/data/sesion-2.js"></script>` (and so on through `sesion-6.js`).

- [ ] **Step 9: Verify every data file parses and every HTML shell references a real data file**

```bash
for f in assets/js/data/sesion-1.js assets/js/data/sesion-2.js assets/js/data/sesion-3.js assets/js/data/sesion-4.js assets/js/data/sesion-5.js assets/js/data/sesion-6.js; do node -c "$f" || echo "FAIL $f"; done
for i in 1 2 3 4 5 6; do grep -q "sesion-$i.js" "sesiones/sesion-$i.html" || echo "FAIL sesion-$i.html missing its data script"; done
echo done
```

Expected: no `FAIL` lines, ends with `done`.

- [ ] **Step 10: Manual preview of all 6 pages**

Run: `python -m http.server 8000` (from project root). Visit `http://localhost:8000/sesiones/sesion-1.html` through `sesion-6.html`.
Expected: each page shows header with nav dots (sessions 1-5 highlighted correctly, sesion-6 has no dot highlighted since dots only cover 1-5), hero with number/title/badges, content list, connection callout, reference block (formulas/tables), errors checklist (absent on sesion-6), bibliography, CTA button opening the correct Notion URL in a new tab, prev/next nav. Content reveals with a fade/slide as you scroll.

- [ ] **Step 11: Commit**

```bash
git add assets/js/data sesiones assets/js/session-template.js
git commit -m "feat: add session content data and pages for all 6 sessions"
```

---

### Task 7: Schematic diagrams (generic, non-photographic)

**Files:**
- Create: `assets/img/diagrams/voltage-divider.svg`
- Create: `assets/img/diagrams/i2c-bus.svg`
- Create: `assets/img/diagrams/spi-microsd.svg`
- Modify: `assets/js/data/sesion-2.js`, `assets/js/data/sesion-4.js`, `assets/js/data/sesion-5.js` (add a `diagram` field)
- Modify: `assets/js/session-template.js` (render `data.diagram` if present)

**Interfaces:**
- Produces: `data.diagram = { src: string, alt: string, caption: string }` optional field, rendered right after the "Referencia rápida" heading.

- [ ] **Step 1: Write `assets/img/diagrams/voltage-divider.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200" width="100%" role="img" aria-labelledby="vd-title">
  <title id="vd-title">Diagrama de divisor de voltaje: Vin a través de R1 y R2 hacia GND, Vout entre ambas</title>
  <rect width="320" height="200" fill="#131B2E"/>
  <line x1="60" y1="20" x2="60" y2="60" stroke="#8A93AC" stroke-width="2"/>
  <text x="60" y="14" text-anchor="middle" fill="#E8ECF6" font-family="monospace" font-size="12">Vin (5V)</text>
  <rect x="40" y="60" width="40" height="40" fill="none" stroke="#2547E0" stroke-width="2"/>
  <text x="90" y="85" fill="#8A93AC" font-family="monospace" font-size="11">R1</text>
  <line x1="60" y1="100" x2="60" y2="120" stroke="#6C8CFF" stroke-width="2"/>
  <circle cx="60" cy="120" r="4" fill="#6C8CFF"/>
  <line x1="60" y1="120" x2="180" y2="120" stroke="#6C8CFF" stroke-width="2"/>
  <text x="200" y="124" fill="#6C8CFF" font-family="monospace" font-size="12">Vout → pin analógico</text>
  <line x1="60" y1="120" x2="60" y2="140" stroke="#8A93AC" stroke-width="2"/>
  <rect x="40" y="140" width="40" height="40" fill="none" stroke="#2547E0" stroke-width="2"/>
  <text x="90" y="165" fill="#8A93AC" font-family="monospace" font-size="11">R2</text>
  <line x1="60" y1="180" x2="60" y2="195" stroke="#8A93AC" stroke-width="2"/>
  <text x="60" y="198" text-anchor="middle" fill="#8A93AC" font-family="monospace" font-size="12">GND</text>
</svg>
```

- [ ] **Step 2: Write `assets/img/diagrams/i2c-bus.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 180" width="100%" role="img" aria-labelledby="i2c-title">
  <title id="i2c-title">Diagrama de bus I2C: Arduino conectado a dos MPU6050 con direcciones 0x68 y 0x69 compartiendo SDA y SCL</title>
  <rect width="400" height="180" fill="#131B2E"/>
  <rect x="20" y="70" width="80" height="40" rx="6" fill="none" stroke="#E8ECF6" stroke-width="2"/>
  <text x="60" y="94" text-anchor="middle" fill="#E8ECF6" font-family="monospace" font-size="12">Arduino</text>
  <line x1="100" y1="80" x2="320" y2="80" stroke="#2547E0" stroke-width="2"/>
  <text x="210" y="72" text-anchor="middle" fill="#2547E0" font-family="monospace" font-size="11">SDA (A4)</text>
  <line x1="100" y1="100" x2="320" y2="100" stroke="#6C8CFF" stroke-width="2"/>
  <text x="210" y="116" text-anchor="middle" fill="#6C8CFF" font-family="monospace" font-size="11">SCL (A5)</text>
  <rect x="240" y="20" width="90" height="40" rx="6" fill="none" stroke="#FFB13D" stroke-width="2"/>
  <text x="285" y="44" text-anchor="middle" fill="#FFB13D" font-family="monospace" font-size="11">MPU6050 0x68</text>
  <line x1="285" y1="60" x2="285" y2="80" stroke="#2547E0" stroke-width="2"/>
  <rect x="240" y="120" width="90" height="40" rx="6" fill="none" stroke="#FFB13D" stroke-width="2"/>
  <text x="285" y="144" text-anchor="middle" fill="#FFB13D" font-family="monospace" font-size="11">MPU6050 0x69</text>
  <line x1="285" y1="100" x2="285" y2="120" stroke="#6C8CFF" stroke-width="2"/>
</svg>
```

- [ ] **Step 3: Write `assets/img/diagrams/spi-microsd.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 160" width="100%" role="img" aria-labelledby="spi-title">
  <title id="spi-title">Diagrama de pines SPI entre Arduino Uno y módulo microSD: MOSI 11, MISO 12, SCK 13, CS 10</title>
  <rect width="360" height="160" fill="#131B2E"/>
  <rect x="20" y="50" width="90" height="60" rx="6" fill="none" stroke="#E8ECF6" stroke-width="2"/>
  <text x="65" y="84" text-anchor="middle" fill="#E8ECF6" font-family="monospace" font-size="12">Arduino Uno</text>
  <rect x="250" y="50" width="90" height="60" rx="6" fill="none" stroke="#FFB13D" stroke-width="2"/>
  <text x="295" y="84" text-anchor="middle" fill="#FFB13D" font-family="monospace" font-size="12">microSD</text>
  <line x1="110" y1="60" x2="250" y2="60" stroke="#2547E0" stroke-width="2"/>
  <text x="180" y="55" text-anchor="middle" fill="#2547E0" font-family="monospace" font-size="10">MOSI (11)</text>
  <line x1="110" y1="75" x2="250" y2="75" stroke="#6C8CFF" stroke-width="2"/>
  <text x="180" y="71" text-anchor="middle" fill="#6C8CFF" font-family="monospace" font-size="10">MISO (12)</text>
  <line x1="110" y1="90" x2="250" y2="90" stroke="#2547E0" stroke-width="2"/>
  <text x="180" y="105" text-anchor="middle" fill="#2547E0" font-family="monospace" font-size="10">SCK (13)</text>
  <line x1="110" y1="100" x2="250" y2="100" stroke="#FFB13D" stroke-width="2"/>
  <text x="180" y="118" text-anchor="middle" fill="#FFB13D" font-family="monospace" font-size="10">CS (10)</text>
</svg>
```

- [ ] **Step 4: Add `diagram` field to relevant session data files**

In `assets/js/data/sesion-2.js`, inside the `reference: { ... }` object, add a sibling key:

```javascript
  reference: {
    diagram: { src: '../assets/img/diagrams/voltage-divider.svg', alt: 'Diagrama de divisor de voltaje', caption: 'Divisor de voltaje: el mismo circuito que baja 5V a 3.3V en el ESP32 real.' },
    formulas: [ /* ...unchanged... */ ],
    tables: [ /* ...unchanged... */ ]
  },
```

Wait — `sesion-2.js` reference has no `tables` key (only `formulas` and `intro`); add `diagram` alongside `formulas` only, keep `intro` as-is.

In `assets/js/data/sesion-4.js`, inside `reference: { intro: '...' }`, add the `diagram` key alongside `intro`:

```javascript
  reference: {
    diagram: { src: '../assets/img/diagrams/i2c-bus.svg', alt: 'Diagrama de bus I2C', caption: 'Dos MPU6050 compartiendo SDA/SCL, distinguidos por dirección (0x68 / 0x69).' },
    intro: '...'
  },
```

In `assets/js/data/sesion-5.js`, inside `reference: { intro: '...', tables: [...] }`, add the `diagram` key:

```javascript
  reference: {
    diagram: { src: '../assets/img/diagrams/spi-microsd.svg', alt: 'Diagrama de pines SPI para microSD', caption: 'Conexión SPI entre Arduino Uno y el módulo microSD usado en la práctica.' },
    intro: '...',
    tables: [ /* ...unchanged... */ ]
  },
```

- [ ] **Step 5: Render the diagram in `assets/js/session-template.js`**

In `renderReference(data)`, immediately after `var blocks = [];`, add:

```javascript
    if (ref.diagram) {
      blocks.push(el('figure', { class: 'diagram' }, [
        el('img', { src: ref.diagram.src, alt: ref.diagram.alt, loading: 'lazy' }),
        el('figcaption', { class: 'table-caption' }, [ref.diagram.caption])
      ]));
    }
```

- [ ] **Step 6: Add minimal `.diagram` styling**

Append to `assets/css/sesion.css`:

```css
.diagram { margin: 0; }
.diagram img { width: 100%; max-width: 420px; border-radius: var(--radius); border: 1px solid var(--border); }
.diagram figcaption { margin-top: 6px; }
```

- [ ] **Step 7: Verify data files still parse and diagrams referenced exist**

```bash
for f in assets/js/data/sesion-2.js assets/js/data/sesion-4.js assets/js/data/sesion-5.js; do node -c "$f" || echo "FAIL $f"; done
for f in voltage-divider i2c-bus spi-microsd; do test -f "assets/img/diagrams/$f.svg" || echo "MISSING $f.svg"; done
echo done
```

Expected: no `FAIL`/`MISSING` lines, ends with `done`.

- [ ] **Step 8: Manual preview**

Reload `sesion-2.html`, `sesion-4.html`, `sesion-5.html` in the browser (server from Task 6 Step 10). Confirm each shows its schematic diagram inside "Referencia rápida", above the formulas/tables.

- [ ] **Step 9: Commit**

```bash
git add assets/img/diagrams assets/js/data/sesion-2.js assets/js/data/sesion-4.js assets/js/data/sesion-5.js assets/js/session-template.js assets/css/sesion.css
git commit -m "feat: add generic schematic diagrams for voltage divider, I2C bus and SPI microSD"
```

---

### Task 8: Photo placeholders for real hardware

**Files:**
- Modify: `assets/js/data/sesion-1.js`, `sesion-2.js`, `sesion-3.js`, `sesion-4.js`, `sesion-5.js` (add `photoPlaceholder` field)
- Modify: `assets/js/session-template.js` (render placeholder in the hero section)

**Interfaces:**
- Produces: `data.photoPlaceholder` (string, optional) — describes what real photo should go there.

- [ ] **Step 1: Add `photoPlaceholder` to each session data file**

In `sesion-1.js`, after `badges:`, add: `photoPlaceholder: 'Foto: mesa de trabajo con Arduino, protoboard, LED y multímetro del kit',`

In `sesion-2.js`: `photoPlaceholder: 'Foto: potenciómetro OEM GM 15098628/29 instalado en la suspensión real',`

In `sesion-3.js`: `photoPlaceholder: 'Foto: DS18B20 montado en motor/CVT del coche real',`

In `sesion-4.js`: `photoPlaceholder: 'Foto: los dos MPU6050 instalados — chasis y volante',`

In `sesion-5.js`: `photoPlaceholder: 'Foto: módulo GPS MAX-M10S y antena usados en la práctica',`

(`sesion-6.js` intentionally has no `photoPlaceholder` — it already has the safety box as its visual focal point.)

- [ ] **Step 2: Render the placeholder in `renderHero()`**

In `assets/js/session-template.js`, modify `renderHero`:

```javascript
  function renderHero(data) {
    var children = [
      el('span', { class: 'num' }, [data.icon + ' ' + data.number]),
      el('h1', {}, [data.title]),
      el('p', { class: 'quote' }, [data.quote]),
      el('div', { class: 'badges' }, data.badges.map(function (b) { return el('span', { class: 'badge' }, [b]); }))
    ];
    if (data.photoPlaceholder) {
      children.push(el('div', { class: 'photo-placeholder reveal', style: 'margin-top:1.5rem;max-width:420px;' }, [data.photoPlaceholder]));
    }
    return el('section', { class: 'session-hero' }, [
      el('div', { class: 'container' }, children)
    ]);
  }
```

- [ ] **Step 3: Verify**

```bash
for f in assets/js/data/sesion-1.js assets/js/data/sesion-2.js assets/js/data/sesion-3.js assets/js/data/sesion-4.js assets/js/data/sesion-5.js; do node -c "$f" || echo "FAIL $f"; done
node -c assets/js/session-template.js
echo done
```

Expected: no `FAIL` lines, ends with `done`.

- [ ] **Step 4: Manual preview**

Reload each session page 1-5; confirm a dashed placeholder box appears in the hero with the correct descriptive text, and that Sesión 6 does not show one.

- [ ] **Step 5: Commit**

```bash
git add assets/js/data/sesion-1.js assets/js/data/sesion-2.js assets/js/data/sesion-3.js assets/js/data/sesion-4.js assets/js/data/sesion-5.js assets/js/session-template.js
git commit -m "feat: add labeled photo placeholders for real hardware images"
```

---

### Task 9: README, responsive/accessibility pass, and final verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md`**

```markdown
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
```

- [ ] **Step 2: Responsive check**

With the local server running, resize the browser (or use device toolbar) to a 375px-wide viewport. Visit `index.html` and `sesiones/sesion-1.html`.
Expected: no horizontal scroll, hero actions stack vertically, session cards grid collapses to 1 column, tables scroll horizontally inside `.table-wrap` instead of breaking layout.

- [ ] **Step 3: Reduced-motion check**

Enable "Reduce motion" in OS accessibility settings (or DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`). Reload `index.html`.
Expected: circuit trace appears fully drawn immediately (no animation), content is visible without waiting for scroll-triggered fade, counters show final values immediately.

- [ ] **Step 4: Full link audit**

```bash
grep -o 'href="[^"]*"' index.html sesiones/*.html | grep -v '^.*href="http' | sort -u
```

Expected: every relative href resolves to a file that exists in the project (`sesiones/sesion-N.html`, `../index.html`, `#temario`, `assets/...`). Manually confirm each path against `ls`.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add README with local preview and GitHub Pages instructions"
```

---

## Self-Review Notes

- **Spec coverage:** portada (Task 4), plantilla + contenido de las 6 sesiones (Tasks 5-6), diagramas esquemáticos SVG (Task 7), placeholders de foto (Task 8), animaciones moderadas + `prefers-reduced-motion` (Tasks 3, 9), sistema de diseño/tokens (Tasks 1-2), README/GitHub Pages (Task 9), links reales a Notion (Task 6) — all covered.
- **Placeholder scan:** no "TBD"/"fill in" left; the only placeholders are the intentional, spec-approved visual placeholders (logo, photos) which are explicitly described with real replacement instructions.
- **Type consistency:** `SESSION_DATA` shape defined once in Task 5 and used identically across all 6 data files in Task 6; `diagram` and `photoPlaceholder` are additive optional fields introduced in Tasks 7-8 with matching renderer changes in the same task.
