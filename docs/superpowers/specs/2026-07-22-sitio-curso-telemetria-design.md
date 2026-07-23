# Sitio del Curso de Telemetría — Diseño

**Fecha:** 2026-07-22
**Estado:** Aprobado por el usuario, pendiente de implementación

## Resumen

Sitio estático (GitHub Pages) que sirve como portada e índice de presentaciones para el "Curso Telemetría — Nuevo Ingreso" de MadRams (Minibaja SAE): 5 sesiones de 1:30h + una sesión 6+ opcional de continuación. Cada sesión tiene su propia página de teoría con estética de presentación (scroll por secciones, no slides tipo PowerPoint). Las instrucciones de práctica paso a paso viven en Notion (el equipo ya tiene acceso) — el sitio enlaza a ellas, no las duplica.

**Objetivo del sitio:** que un estudiante de nuevo ingreso entienda de un vistazo qué va a aprender en cada sesión, por qué importa para el coche real, y tenga la teoría de referencia bien presentada — sin parecer una plantilla genérica de curso online ni un sitio "hecho con IA" a ojo inexperto.

## Fuente de contenido

Todo el contenido temático viene 1:1 de Notion (workspace del equipo, página raíz `Curso Telemetría — Nuevo Ingreso`, id `3a5b2fdb-b6b9-8123-8ddd-f6d0e0041c33`). No se inventa contenido técnico nuevo — se adapta el texto ya redactado por el instructor a formato web. Fórmulas, tablas, listas de errores comunes y bibliografía se toman literalmente de las páginas de Teoría de cada sesión.

## Alcance

Incluye:
- 1 página de portada (`index.html`)
- 6 páginas de sesión (`sesiones/sesion-1.html` … `sesion-6.html`)
- Sistema de diseño compartido (CSS tokens + componentes)
- Animaciones con Anime.js (moderadas, no exageradas)
- README con instrucciones para publicar en GitHub Pages

No incluye (fuera de alcance para esta primera versión):
- Contenido de "Práctica" paso a paso (queda en Notion, el sitio solo enlaza)
- Sistema de autenticación o progreso guardado
- Sesión 6+ como página de teoría completa tipo las 5 primeras — es más corta y de tono distinto (proyecto abierto, no clase fija)
- Optimización de imágenes reales — se usan placeholders marcados hasta que el usuario las consiga

## Arquitectura técnica

Sitio 100% estático, sin build step ni dependencias de Node para producción (facilita GitHub Pages: solo servir archivos). Anime.js v3 vía CDN (`cdn.jsdelivr.net/npm/animejs@3.2.1`).

```
/
├── index.html
├── sesiones/
│   ├── sesion-1.html   Electricidad + Arduino
│   ├── sesion-2.html   Suspensión (potenciómetro)
│   ├── sesion-3.html   Temperatura (DS18B20 + OneWire)
│   ├── sesion-4.html   IMU y bus I2C
│   ├── sesion-5.html   GPS + Demo del sistema real
│   └── sesion-6.html   Proyecto de equipo: Black Box real
├── assets/
│   ├── css/
│   │   ├── tokens.css      variables de diseño (color, tipografía, espaciado)
│   │   ├── base.css        reset + estilos globales + componentes compartidos
│   │   └── sesion.css       estilos específicos de plantilla de sesión
│   ├── js/
│   │   ├── main.js          nav, menú móvil, lógica no animada
│   │   └── animations.js    todas las animaciones Anime.js
│   └── img/
│       ├── logo-placeholder.svg   (el usuario reemplaza con logo real de MadRams)
│       └── placeholders/          contenedores marcados para fotos reales por sesión
└── README.md
```

## Sistema de diseño

### Color
- `--bg: #0A0E1A` — fondo principal, negro azulado
- `--bg-panel: #131B2E` — tarjetas y paneles elevados
- `--bg-panel-2: #1B2740` — paneles secundarios / hover
- `--blue-royal: #2547E0` — acento primario (marca del equipo)
- `--blue-bright: #6C8CFF` — hover, focus, highlights
- `--signal-amber: #FFB13D` — acento de "alerta" (refleja los umbrales reales del contenido: >110°C, >25°, <20%, etc.) — uso restringido a callouts de alerta/umbral
- `--text: #E8ECF6` — texto principal
- `--text-dim: #8A93AC` — texto secundario, captions
- `--border: #24304A` — bordes sutiles

### Tipografía
- Display (títulos): **Space Grotesk** — técnica, geométrica, no genérica
- Cuerpo: **IBM Plex Sans** — legible, tono de documentación técnica
- Datos/código (fórmulas, tablas de pines, valores, snippets): **IBM Plex Mono** — refuerza la sensación de datasheet real

### Elemento distintivo (signature)
Una **traza de circuito** (línea tipo pista de PCB, segmentos rectos con giros de 90°/45°, no curvas orgánicas) dibujada progresivamente con `strokeDashoffset` de Anime.js. Aparece una vez en el hero de la portada conectando visualmente el título con las tarjetas de sesión, y como acento sutil (no repetido en loop) bajo los encabezados de sección en las páginas internas. Referencia directa y literal al tema: la señal/electricidad recorriendo el temario.

### Numeración
Los números de sesión (01–06) sí son informativos aquí — el orden es real (dificultad progresiva, nota explícita del instructor en Notion), así que se usan como parte del diseño (grandes, tipográficos) en vez de como decoración genérica.

## Contenido por página

### Portada (`index.html`)

1. **Hero** — pantalla completa. Headline + subtítulo que resume el curso (5 sesiones × 1:30h, kits Arduino, basado 1:1 en los subsistemas reales de MadRams). Logo placeholder. Traza de circuito animándose al cargar. Indicador de scroll.
2. **Cómo funciona** — franja corta: estructura de cada sesión (20-30 min teoría / 60-70 min práctica), nota de seguridad (ninguna de las 5 sesiones requiere acercarse al coche viejo).
3. **Temario** — grid de 6 tarjetas:

   | # | Sesión | Subsistema real | Sensor de práctica |
   |---|--------|------------------|---------------------|
   | 1 | Electricidad + Arduino | Base de todo el sistema electrónico | LED, resistencias, multímetro |
   | 2 | Suspensión (potenciómetro) | Potenciómetro OEM GM 15098628/29 | Potenciómetro |
   | 3 | Temperatura (DS18B20 + OneWire) | DS18B20 motor/CVT, mención AS5600 | DS18B20 + MPR121 (bonus) |
   | 4 | IMU y bus I2C | MPU6050 ×2 (chasis 0x68 / volante 0x69) | MPU6050 |
   | 5 | GPS + Demo del sistema real | MAX-M10S + LoRa Heltec 915MHz + Grafana | GPS NMEA + microSD + demo guiada |
   | 6+ | Proyecto de equipo: Black Box real | Sistema completo instalado en vehículo | Circuito de Sesión 5, robusto e instalado |

   La tarjeta 6+ tiene tratamiento visual distinto (borde ámbar, etiqueta "siguiente nivel — solo equipo"), reflejando que no es una clase fija sino el proyecto de continuación.

4. **Footer** — bibliografía general del curso, crédito, logo placeholder, link a MadRams.

### Plantilla de sesión (sesiones 1–5)

Secciones, en orden:
1. Header fijo: volver a portada + indicador de progreso (puntos 1-5, sesión activa resaltada).
2. Hero de sesión: número grande, título, cita/quote de una línea (el `>` de Notion), badges (duración, subsistema real, sensor de práctica).
3. **Contenido** — bullets de "Contenido (20-25 min)" de Notion, presentados como bloques secuenciales con revelado al hacer scroll.
4. **Por qué importa / Conexión con MadRams** — panel destacado (borde azul), texto literal de esa sección en Notion.
5. **Referencia rápida** — fórmulas (mono), tablas técnicas (pines, colores de resistencias, direcciones I2C), estética de hoja de datos.
6. **Errores comunes** — lista tipo checklist/troubleshooting, con el ícono/estilo de alerta ámbar.
7. **Bibliografía** de la sesión.
8. CTA: botón real "Ver instrucciones de práctica en Notion →" enlazando a la URL de Práctica correspondiente (lista abajo).
9. Footer de sesión: nav anterior/siguiente (sesión 1 no tiene "anterior", sesión 5 enlaza a "siguiente: Sesión 6+").

Links reales a páginas de Práctica en Notion (el equipo tiene acceso):
- Sesión 1: `https://app.notion.com/p/3a5b2fdbb6b981ea8e70ebdee9da3063`
- Sesión 2: `https://app.notion.com/p/3a5b2fdbb6b981a8a4bcffe70053f8fe`
- Sesión 3: `https://app.notion.com/p/3a5b2fdbb6b981d393cdf664a8a6edc6`
- Sesión 4: `https://app.notion.com/p/3a5b2fdbb6b981449f11dab04448a812`
- Sesión 5: `https://app.notion.com/p/3a5b2fdbb6b98171a79cc786f9ca83f9`
- Sesión 6+: `https://app.notion.com/p/3a6b2fdbb6b9810498d8d9dcdc191254`

### Contenido detallado por sesión (fuente para el copy de cada página)

**Sesión 1 — Electricidad + Arduino** (⚡, sin subsistema específico — base de todo)
- Contenido: Voltaje/corriente/resistencia; Ley de Ohm V=I×R; circuitos serie vs. paralelo; qué es un microcontrolador; IDE de Arduino (`setup()`/`loop()`); uso básico de multímetro.
- Por qué importa: todo sensor de telemetría se reduce a leer un voltaje; es la base de todas las demás sesiones.
- Referencia rápida: fórmula LED (R=(5V-2V)/0.015A=200Ω→220Ω comercial); tabla de código de colores de resistencias (Rojo-Rojo-Café=220Ω, Café-Negro-Rojo=1kΩ, Café-Negro-Naranja=10kΩ); tabla de pines Arduino Uno/Nano (5V/3.3V, GND, digitales 0-13, PWM ~3/5/6/9/10/11, analógicos A0-A5, A4=SDA/A5=SCL).
- Errores comunes: LED no prende (polaridad/resistencia); Arduino no sube código (puerto/board); circuito "no hace nada" (medir continuidad antes de sospechar del código).
- Bibliografía: Scherz & Monk *Practical Electronics for Inventors*; Arduino Official Docs.

**Sesión 2 — Suspensión (potenciómetro)** (🔧, Potenciómetro OEM GM 15098628/29 ×4, divisor 5V→3.3V, alerta >25°)
- Contenido: señales analógicas vs. digitales; `analogRead()` (ADC 0-1023); divisor de voltaje 5V→3.3V; PWM básico `analogWrite()`.
- Conexión con MadRams: sensor real de suspensión es un potenciómetro OEM por rueda; señal pasa por divisor porque el sensor da 5V y el ESP32 solo acepta 3.3V; umbral real de alerta: ángulo >25°.
- Referencia rápida: fórmula ADC (`valor = (V/5V)×1023`); fórmula divisor (`Vout = Vin×(R2/(R1+R2))`, ejemplo R1=10kΩ/R2=6.8kΩ→≈2.02V); advertencia de nunca conectar 5V directo a pin de 3.3V; `map()` explicado (0-1023 → 0-40°).
- Errores comunes: analogRead fijo en 0/1023 (conexión floating); ruido excesivo (cables sueltos); LED de alerta no reacciona (umbral fuera de rango del map()).
- Bibliografía: página "Suspensión — IMU & Potenciómetros" (Notion MadRams); Arduino Docs; Scherz & Monk.

**Sesión 3 — Temperatura (DS18B20 + OneWire)** (🌡️, DS18B20 motor >110°C / CVT 90-105°C, mención AS5600, bonus MPR121)
- Contenido: bus OneWire (varios sensores en un pin, ROM address de 64 bits); por qué monitorear temperatura de motor/CVT; mención breve AS5600 (I2C, RPM); intro a sensado capacitivo (MPR121).
- Conexión con MadRams: DS18B20 en motor (alerta >110°C) y CVT (advertencia >90°C, crítico >105°C); AS5600 ×2 mide RPM; MPR121 mide nivel de líquido de frenos (alerta <20%).
- Referencia rápida: por qué el pull-up de 4.7kΩ es obligatorio (sin él, lecturas erráticas o -85°C); dirección I2C del MPR121 (0x5A).
- Errores comunes: lectura fija en -127°C/85°C (falta pull-up o cableado); "no se encontró el sensor" (VCC/GND, pin en código); MPR121 no responde (confirmar dirección con scanner).
- Bibliografía: DS18B20 Datasheet (Analog Devices); página "Temperatura — Motor & Transmisión CVT"; página "RPM & Velocidad".

**Sesión 4 — IMU y bus I2C** (📐, MPU6050 ×2, chasis 0x68 / volante 0x69)
- Contenido: qué es I2C (SDA, SCL, direcciones); por qué varios sensores comparten 2 cables; qué mide un IMU (acelerómetro + giroscopio); umbral para detección de eventos.
- Conexión con MadRams: dos MPU6050 en el mismo bus (0x68 chasis, 0x69 volante) — detección de impacto/rollover.
- Referencia rápida: SDA=A4/SCL=A5 en Arduino Uno; dirección I2C de 7 bits (0-127), pin AD0 cambia entre 0x68/0x69; mención de multiplexor TCA9548A (fuera de alcance del curso); aceleración en reposo ≈9.8 m/s² como verificación; ajuste experimental del umbral de impacto.
- Errores comunes: "no se encontró el MPU6050" (SDA/SCL invertidos, voltaje); lecturas en cero (`Wire.begin()`); I2C Scanner no encuentra nada (cableado).
- Bibliografía: MPU6050 Datasheet (InvenSense); página "Suspensión — IMU & Potenciómetros"; SparkFun Learn (I2C).

**Sesión 5 — GPS + Demo del sistema real (dashboard y radio)** (📡, MAX-M10S + LoRa Heltec 915MHz + Grafana)
- Contenido: qué es GPS y protocolo NMEA; microSD como respaldo local (CSV); por qué se necesita respaldo local además de transmisión en vivo; qué es un dashboard de telemetría (Grafana); radio LoRa en detalle (915MHz, paquetes, 5Hz vs 1Hz). La parte de dashboard/radio es demo guiada, no se programa hoy (eso es Sesión 6+).
- Conexión con MadRams: pipeline real `ESP32 → LoRa 915MHz → receptor en pits → InfluxDB → Grafana`, más respaldo SD (@10Hz) vs LoRa (@2Hz). Hoy arman GPS+SD (mitad "de abajo"), ven en demo el dashboard+radio (mitad "de arriba").
- Qué van a ver en la demo: dashboard Grafana con secciones LIVE (gauges RPM/velocidad, temperaturas, voltaje, mapa GPS coloreado por velocidad) y ANÁLISIS (máximos de sesión, comparativas, histórico); radio LoRa Heltec SX1262, paquete de ruta a 5Hz y de estado a 1Hz, protocolo binario.
- Referencia rápida: GPS necesita ver 4 satélites (fix, "cold start" puede tardar minutos); tabla pines SPI microSD Arduino Uno (MOSI=11, MISO=12, SCK=13, CS=10); SD debe estar en FAT32.
- Errores comunes: `SD.begin()` falla (pinCS/formato); GPS nunca da fix (esperar al aire libre, baudrate 9600); CSV vacío/repetido (`FILE_WRITE` y `.close()`).
- Bibliografía: u-blox MAX-M10S Datasheet; página "GPS — MAX-M10S"; página "Radios LoRa — 915MHz"; página "Integración Telemetry Stack"; Heltec WiFi LoRa 32 V4 docs; Arduino Docs SD.h.

**Sesión 6+ — Proyecto de equipo: Black Box real en el coche viejo** (🏁, tono distinto — página más corta, sin estructura de "clase de 1:30h")
- Framing: para quienes se quedan al equipo después del curso. No es sesión fija — formato abierto, 1+ sesiones de trabajo según avance.
- Diferencia clave: pasar de protoboard (Sesión 5) a circuito permanente que sobrevive vibración/polvo/calor en el vehículo real.
- Contenido: de protoboard a circuito permanente (soldadura, conectores Deutsch/JST, headers vs. jumpers); consideraciones de montaje mecánico; integración al stack real (mismo CSV, misma idea de respaldo).
- **Protocolo de seguridad (obligatorio)** — tratamiento visual de advertencia clara (ámbar/rojo, no decorativo): coche apagado y frío; nadie trabaja cerca de motor/escape/CVT sin líder de electrónica; solo el líder enciende el motor para pruebas; guantes y precaución estándar de taller.
- Conexión con MadRams: es literalmente completar una tarea pendiente real del equipo (dejar el sistema de adquisición instalado y validado en vehículo).
- Bibliografía: página "Piezas Faltantes"; página "Tasks"; página "Sesiones de Prueba — MadRams"; página "Integración Telemetry Stack"; Arduino Docs SD.h.
- CTA distinto: no hay botón de "práctica" en el mismo formato — puede decir "Habla con el líder de electrónica del equipo" o enlazar a la página de Práctica de Notion (`https://app.notion.com/p/3a6b2fdbb6b9810498d8d9dcdc191254`) con framing de "siguiente paso", no de tarea de clase.

## Animaciones (Anime.js, uso moderado)

- Traza de circuito dibujándose una vez al cargar el hero de portada (`strokeDashoffset`, sin loop).
- Revelado escalonado (`stagger`) de las 6 tarjetas de temario al entrar en viewport — dispara una sola vez por elemento (usar `IntersectionObserver` + `autoplay:false`/`seek` o simplemente disparar al entrar, sin re-disparar en scroll repetido).
- Revelado de bloques de contenido en páginas de sesión al hacer scroll (fade + translateY sutil), una vez por bloque.
- Micro-interacción en hover de tarjetas: leve elevación + glow de borde (puede ser CSS transition, no necesariamente Anime.js).
- Contador simple ("5 sesiones", "1:30h") animando su valor al aparecer en la franja "Cómo funciona".
- Explícitamente evitar: loops infinitos, animaciones en cada scroll repetido, parallax exagerado, cualquier cosa que compita con la lectura del contenido técnico.
- Respetar `prefers-reduced-motion`: si está activo, desactivar animaciones de entrada (mostrar contenido directamente) y la animación de la traza de circuito.

## Assets y placeholders

- `assets/img/logo-placeholder.svg` — placeholder claro y reemplazable (el usuario pondrá el logo real de MadRams).
- Placeholders de fotos reales por sensor/sesión: contenedores con aspect-ratio fijo, borde punteado, texto centrado indicando qué foto va ahí (ej. "Foto: potenciómetro OEM GM 15098628/29 instalado"). No se inventan fotos ni se generan imágenes falsas de hardware real.
- Diagramas puramente esquemáticos que sí se pueden dibujar en SVG sin necesitar una foto real (ej. diagrama de bus I2C con dos direcciones, diagrama de divisor de voltaje, diagrama de pines SPI) — estos SÍ se construyen como SVG propios porque son diagramas técnicos genéricos, no fotos de hardware específico de MadRams.

## Publicación

README con pasos: `git init`, crear repo en GitHub, push, activar GitHub Pages (rama `main`, carpeta raíz). Sin necesidad de configurar base path especial porque se usan rutas relativas en todo el sitio (funciona igual como user-page o project-page).

## Criterios de aceptación

- Las 6 páginas de sesión y la portada existen, navegables entre sí (portada↔sesión, anterior/siguiente entre sesiones).
- Todo el contenido técnico (fórmulas, tablas, errores comunes, bibliografía) coincide con el de Notion, adaptado a prosa web sin inventar datos técnicos nuevos.
- El sitio se ve correctamente en móvil y escritorio.
- Las animaciones no se re-disparan de forma molesta en cada scroll y respetan `prefers-reduced-motion`.
- Los links reales a Notion (Práctica) funcionan y abren en pestaña nueva.
- No hay imágenes de hardware inventadas — solo diagramas esquemáticos genéricos (SVG) o placeholders claramente marcados.
- El sitio no depende de ningún build step: abrir `index.html` (o servir la carpeta) es suficiente para verlo funcionando.
