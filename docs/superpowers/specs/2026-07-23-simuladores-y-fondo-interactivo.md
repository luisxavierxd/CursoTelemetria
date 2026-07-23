# Simuladores interactivos, slots 3D, fondo animado y arreglo de diagramas — Diseño

**Fecha:** 2026-07-23
**Estado:** Aprobado por el usuario, pendiente de plan de implementación
**Depende de:** `2026-07-22-sitio-curso-telemetria-design.md` (sitio base ya implementado)

## Resumen

El sitio del curso ya existe y funciona (portada + 6 páginas de sesión, data-driven).
Este trabajo lo enriquece con cuatro cosas, sin romper la arquitectura estática ni
introducir build step:

1. **Un simulador interactivo "estrella" por sesión** (1–5), inline en cada página.
2. **Slots de modelo 3D** (`<model-viewer>` vía CDN) para el componente principal de
   cada sesión, listos para soltar un `.glb`; mientras tanto muestran un placeholder
   estilizado. Reemplazan los photo-placeholders de los componentes principales.
3. **Fondo animado en dos capas** (profundidad ambiental + firma del circuito de
   Mónaco con un punto de telemetría dando vueltas) para quitar la sensación "plana".
4. **Arreglo de diagramas SVG recortados** (empezando por `voltage-divider.svg`).

Todo respeta `prefers-reduced-motion` y las rutas relativas existentes (funciona igual
en GitHub Pages user-page o project-page).

## Principios / restricciones (heredados del sitio base)

- Sitio 100% estático, sin build step ni dependencias de Node para producción.
- Dependencias externas solo por CDN (ya se usa Anime.js v3 vía `cdn.jsdelivr.net`).
  Se añade `@google/model-viewer` vía CDN como `<script type="module">`.
- Sistema de diseño existente (tokens de color/tipografía) — los simuladores usan los
  mismos tokens (`--blue-royal`, `--blue-bright`, `--signal-amber`, `--bg-panel`, mono
  `IBM Plex Mono`, etc.). Nada de paletas nuevas.
- Animaciones moderadas: sin loops que compitan con la lectura; revelado una sola vez
  por elemento; `prefers-reduced-motion` desactiva movimiento (auroras quietas, punto
  de Mónaco quieto, sin auto-rotate del 3D, simuladores en estado final estático).
- Contenido técnico 1:1 con lo que ya está en las páginas de sesión (umbrales, fórmulas,
  direcciones). Los simuladores no inventan datos nuevos; visualizan los ya presentes.

## Arquitectura

### Extensión del modelo de datos (`assets/js/data/sesion-N.js`)

Dos campos **opcionales** nuevos por sesión:

```js
simulator: {
  type: 'ohm-law',            // clave en window.TelemetrySims
  title: 'Laboratorio: Ley de Ohm',
  caption: 'Ajusta los valores y observa cómo responde el circuito.'
},
model: {
  label: 'Arduino Uno',
  alt: 'Modelo 3D de un Arduino Uno',
  src: '',                    // '' => placeholder; ruta a .glb => model-viewer activo
  poster: ''                  // opcional: imagen mientras carga el .glb
}
```

Ambos son opcionales: si faltan, el template simplemente no renderiza esa sección
(comportamiento actual intacto). La sesión 6 puede omitir ambos.

### Render (`assets/js/session-template.js`)

Se añaden dos funciones y se insertan en `render()` en orden lógico:

- `renderModel(data)` — antes o dentro del hero/contenido: renderiza el slot 3D del
  componente principal. Si `model.src` está vacío, produce un `.model-slot` placeholder
  (borde punteado, etiqueta "Modelo 3D: <label> — suelta el .glb aquí"). Si `model.src`
  tiene valor, produce un `<model-viewer>` con `camera-controls auto-rotate`.
- `renderSimulator(data)` — nueva sección "Laboratorio" después de "Referencia rápida":
  crea el contenedor y llama `window.TelemetrySims[data.simulator.type](container)`.
  Si el `type` no está registrado, no renderiza nada (falla en silencio, no rompe la
  página).

El orden final de secciones queda:
header → hero (+ model slot del componente) → Contenido → Conexión → Referencia rápida
→ **Laboratorio (simulador)** → Errores → Seguridad → Bibliografía → CTA → nav → footer.

### Registro de simuladores (`assets/js/sims/registry.js`)

```js
window.TelemetrySims = window.TelemetrySims || {};
```

Cada módulo de simulador se auto-registra:
`window.TelemetrySims['ohm-law'] = function (container) { ... };`

`registry.js` también expone un helper compartido para revelar el simulador al entrar
en viewport reutilizando el `IntersectionObserver` de `animations.js` (clase `.reveal`),
de modo que cada sim no reimplemente su propio observer.

### Carga por página (`sesiones/sesion-N.html`)

Cada página de sesión suma, en este orden (antes de `session-template.js`, que es quien
llama a `render`):

```html
<link rel="stylesheet" href="../assets/css/sims.css">
...
<script type="module" src="https://cdn.jsdelivr.net/npm/@google/model-viewer@^4/dist/model-viewer.min.js"></script>
<script src="../assets/js/sims/registry.js"></script>
<script src="../assets/js/sims/<modulo-de-la-sesion>.js"></script>
```

El módulo del simulador debe cargarse **antes** de `session-template.js` para que
`window.TelemetrySims[type]` ya exista al renderizar. `model-viewer` es un web component
(module, async) y se puede definir después sin problema.

## Los 5 simuladores

Todos comparten: contenedor `.sim` con encabezado (título + caption), controles a la
izquierda/arriba y visualización a la derecha/abajo (responsive, apilado en móvil),
tokens de diseño existentes, sin librerías nuevas (solo DOM + opcional Anime.js ya
cargado), y estado final legible cuando `prefers-reduced-motion` está activo.

### S1 — `ohm-law.js` — Ley de Ohm interactiva
- Tres sliders V, I, R con la relación **V = I × R** mantenida (al mover uno, se recalcula
  el dependiente según un modo seleccionado: "resolver R", "resolver I", "resolver V").
- Visualización de un circuito LED: fuente 5V → resistencia → LED. El LED se ilumina
  proporcional a la corriente; si la corriente supera un límite seguro (~20 mA) el LED
  se marca "quemado" en ámbar. Refuerza la fórmula real de la sesión (R para LED = 220Ω).
- Decodificador de código de colores: dada una R comercial (220Ω/1kΩ/10kΩ) muestra sus
  bandas (los valores exactos de la tabla de la sesión 1).

### S2 — `voltage-divider.js` — Divisor de voltaje + ADC + map()
- Control: ángulo de suspensión (arrastre o slider, 0–40°).
- Cadena visual encadenada: ángulo → posición del cursor del potenciómetro →
  `Vout = Vin·R2/(R1+R2)` (Vin 5V, R1=10k, R2=6.8k del ejemplo de la sesión) →
  valor ADC `(Vout/5)·1023` → `map(0..1023 → 0..40°)`.
- Alerta ámbar cuando el ángulo supera **25°** (umbral real de la sesión 2).
- Es el widget que "cuenta la sesión completa" en un solo lugar.

### S3 — `onewire-temp.js` — Bus OneWire + temperaturas motor/CVT
- Dos sensores DS18B20 (motor y CVT) sobre **un solo cable de datos** (ilustrado).
- Sliders de temperatura por sensor; umbrales reales:
  motor alerta >110°C; CVT advertencia >90°C, crítico >105°C (colores verde/ámbar/rojo).
- Toggle "pull-up 4.7kΩ": al desactivarlo, las lecturas se muestran erráticas / −85°C
  (el error real documentado en la sesión).
- Muestra el concepto de ROM address de 64 bits distinguiendo ambos sensores.

### S4 — `i2c-imu.js` — Bus I2C (direcciones) + umbral IMU
- Dos MPU6050 en el mismo bus SDA/SCL. Toggle **AD0** que cambia la dirección entre
  **0x68** y **0x69**; si ambos quedan en la misma dirección, se marca conflicto.
- Acelerómetro inclinable: el usuario arrastra para inclinar; se muestran los ejes y la
  magnitud; al superar un umbral configurable dispara "impacto/rollover detectado"
  (ámbar). En reposo el eje vertical marca ≈9.8 m/s² (verificación real de la sesión).

### S5 — `gps-lora.js` — GPS/NMEA + paquete LoRa
- Un punto GPS recorre un mini-trayecto (puede reutilizar el trazo de Mónaco a pequeña
  escala) generando una sentencia **NMEA** (`$GPGGA...`) que se actualiza con lat/lon.
- Constructor de paquete LoRa: muestra el paquete de ruta a 5 Hz y el de estado a 1 Hz
  con sus bytes (protocolo binario), reflejando el pipeline real descrito en la sesión.
- Sin transmisión/servidor real: es una visualización del formato, no networking.

## Slots de modelo 3D

- Componente por sesión con su componente principal:
  S1 Arduino Uno · S2 potenciómetro · S3 DS18B20 · S4 MPU6050 · S5 módulo GPS.
- `renderModel` produce:
  - **Sin `src`:** `.model-slot.is-placeholder` — caja con aspect-ratio fijo, borde
    punteado y patrón sutil (reutiliza estética de `.photo-placeholder`), texto
    "Modelo 3D: <label> — suelta el .glb aquí".
  - **Con `src`:** `<model-viewer src auto-rotate camera-controls>` dentro de `.model-slot`,
    con `poster` si se dio.
- **Interacción de scroll:** cuando el slot tiene un `<model-viewer>` real, un script
  (en `registry.js` o un `model-scroll.js` dedicado) actualiza `camera-orbit` (ángulo
  theta) según el progreso de scroll de la sección, además del `auto-rotate` al entrar
  en viewport. Con `prefers-reduced-motion`, sin auto-rotate ni scroll-rotate (queda
  estático, controlable manualmente).
- Reemplaza el `photoPlaceholder` del componente principal (el campo `photoPlaceholder`
  puede permanecer para fotos de contexto que no sean el componente, o retirarse por
  sesión según convenga; decisión por sesión en el plan).

## Fondo animado (dos capas)

### Capa A — Profundidad ambiental (todo el sitio)
- Un elemento fijo detrás del contenido (`.bg-ambient`, `position: fixed; inset:0;
  z-index:-1; pointer-events:none`).
- Base: `radial-gradient` sutil (glow azul arriba, navy más profundo abajo) sobre `--bg`.
- 2–3 "auroras": blobs grandes muy desenfocados (`filter: blur`) en `--blue-royal` /
  `--blue-bright`, opacidad ~0.06, que derivan lentísimo con `@keyframes` CSS
  (transform/translate). CSS puro (no Anime.js) para que viva en toda página sin JS extra.
- `prefers-reduced-motion`: auroras quietas (sin animación), el gradiente base permanece.

### Capa B — Firma del circuito de Mónaco (telemetría)
- Fuente: `RaceCircuitMonaco.svg` (ya en el root; se moverá/normalizará a
  `assets/img/monaco-circuit.svg` o se inlinea, según convenga en el plan).
- Uso: line-art tenue (stroke azul de marca, baja opacidad) en el hero de la portada y
  como motivo sutil recurrente (p. ej. hero de sesión, muy leve).
- Animación:
  1. El trazo del circuito se dibuja una vez al cargar (`strokeDashoffset` con Anime.js,
     igual que la traza PCB existente).
  2. Un **punto de telemetría** recorre el circuito de forma continua y suave usando
     `anime.path()` sobre el `d` del trazo de Mónaco, con una estela corta que se
     desvanece (el "coche" siendo rastreado).
- Convive con la traza PCB existente sin chocar conceptualmente: PCB = señal recorriendo
  el temario; Mónaco = coche siendo monitoreado.
- `prefers-reduced-motion`: circuito dibujado en estado final, punto estático (o ausente).

## Arreglo de diagramas recortados

- `voltage-divider.svg`: el texto "Vout → pin analógico" empieza en x=200 con viewBox de
  ancho 320 y se sale por la derecha → ampliar viewBox / reacomodar texto para que quepa
  con padding.
- Revisar `i2c-bus.svg` y `spi-microsd.svg` por overflow de texto y darles padding
  consistente en el viewBox.
- Donde un simulador ya cubre el concepto (divisor de voltaje en S2, bus I2C en S4), el
  SVG estático queda como complemento de "Referencia rápida" o se retira de esa sesión
  (decisión por sesión en el plan) — sin perder el diagrama accesible con `<title>`.

## Archivos afectados

Nuevos:
```
assets/css/sims.css
assets/js/sims/registry.js
assets/js/sims/ohm-law.js
assets/js/sims/voltage-divider.js
assets/js/sims/onewire-temp.js
assets/js/sims/i2c-imu.js
assets/js/sims/gps-lora.js
assets/img/monaco-circuit.svg   (normalizado desde RaceCircuitMonaco.svg)
```
Modificados:
```
assets/js/session-template.js         renderModel + renderSimulator
assets/js/data/sesion-1..5.js         + campos simulator / model
assets/css/base.css (o nuevo bg.css)  capa A (.bg-ambient)
index.html                            capa A + capa B (Mónaco en hero)
sesiones/sesion-1..6.html             links/scripts nuevos (sims.css, model-viewer,
                                      registry, módulo de sim), capa A/B
assets/img/diagrams/voltage-divider.svg (+ i2c-bus, spi-microsd si aplica)
assets/js/animations.js               (opc.) animación del punto de Mónaco / helper reveal
```

## Criterios de aceptación

- Cada sesión 1–5 muestra su simulador estrella funcional, con el mismo lenguaje visual
  del sitio, y se comporta correctamente en móvil y escritorio.
- Los simuladores reflejan los datos técnicos reales de cada sesión (umbrales, fórmulas,
  direcciones) sin inventar valores nuevos.
- Cada sesión 1–5 tiene un slot 3D del componente principal: placeholder claro sin `.glb`,
  y `<model-viewer>` rotable + rotación por scroll cuando se le pone un `.glb`.
- El fondo ya no se ve plano: capa A visible en todo el sitio; capa B (Mónaco con punto
  de telemetría) en el hero de la portada.
- `prefers-reduced-motion` desactiva todo el movimiento (auroras, punto de Mónaco,
  auto-rotate/scroll-rotate 3D, revelados y animaciones de simulador) mostrando estados
  finales legibles.
- `voltage-divider.svg` (y cualquier otro diagrama con overflow) ya no recorta texto.
- Sin build step: abrir/servir la carpeta sigue siendo suficiente. Sin dependencias
  nuevas fuera de CDN.
- El sitio sigue navegable exactamente igual que antes; las secciones nuevas son aditivas.

## Fuera de alcance

- Crear los archivos `.glb` reales de los componentes (los provee el usuario después; el
  sitio queda listo para recibirlos).
- Simuladores múltiples por sesión (se eligió uno estrella por sesión).
- Backend / networking real en el simulador de GPS/LoRa (es visualización de formato).
- Simulador o modelo 3D para la sesión 6 (proyecto abierto; puede omitir ambos campos).
