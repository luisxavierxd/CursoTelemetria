window.SESSION_DATA = {
  slug: 'sesion-3',
  number: '03',
  icon: '🌡️',
  title: 'Temperatura (DS18B20 + OneWire)',
  quote: 'Bus OneWire + calibración segura de un sensor real, sin riesgos de quemadura.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'DS18B20 en motor/CVT · dos sensores, un bus', 'Bonus: MPR121 capacitivo'],
  simulator: { type: 'onewire-temp', title: 'Laboratorio: bus OneWire y umbrales', caption: 'Dos DS18B20 en un solo cable. Sube la temperatura y quita el pull-up para ver el error real.' },
  model: { label: 'DS18B20', alt: 'Modelo 3D del sensor DS18B20', src: '../assets/models/DS18B20.glb', orientation: '0deg 0deg 180deg' },
  lesson: [
    { type: 'callout', heading: 'Conexión con MadRams',
      body: 'El DS18B20 vigila el <strong>motor</strong> (alerta &gt;110°C) y la <strong>CVT</strong> (advertencia &gt;90°C, crítico &gt;105°C). Es una tarea real pendiente del equipo: montar físicamente el DS18B20 en motor/CVT — hoy practicamos exactamente eso, pero con agua tibia/fría para calibrar sin riesgo de quemadura.' },

    { type: 'concept', heading: 'El bus OneWire: muchos sensores, un solo cable',
      body: [
        'El DS18B20 se comunica por <strong>un solo cable de datos</strong> (a diferencia del I2C, que usa dos). Lo interesante: puedes poner <strong>varios</strong> DS18B20 en ese mismo cable y el Arduino los distingue sin problema.',
        '¿Cómo? Cada sensor trae grabado de fábrica un identificador único de 64 bits (su <strong>ROM address</strong>). El código pide "dame la temperatura del sensor con esta dirección" y así sabe cuál es el motor y cuál la CVT, aunque compartan el mismo pin.'
      ],
      diagram: { src: '../assets/img/diagrams/onewire-bus.svg', alt: 'Bus OneWire con dos DS18B20 y pull-up', caption: 'Un pin de datos, dos sensores, cada uno con su ROM única; el pull-up mantiene la línea en alto.', wide: true },
      teacher: 'Analogía de pasar lista: un solo pasillo (el cable), muchos alumnos (sensores); cada uno responde solo cuando dicen su nombre (ROM address).' },

    { type: 'concept', heading: 'La resistencia pull-up de 4.7kΩ (no es opcional)',
      body: [
        'El cable de datos necesita quedar "en alto" (en VCC) cuando nadie transmite. Eso lo garantiza una <strong>resistencia pull-up de 4.7kΩ</strong> entre DATA y VCC. Es <strong>obligatoria</strong>.',
        'Sin ella, el pin "flota" y las lecturas salen erráticas o clavadas en <span class="value-hl">−85°C</span> (o −127°C), el valor de error típico del sensor. En el laboratorio de abajo puedes quitarla y ver el desastre en vivo.'
      ],
      teacher: 'El −85/−127°C es la firma de "falta pull-up o cableado de DATA mal". Que lo memoricen: valores absurdos de temperatura = problema de hardware, no de código.' },

    { type: 'concept', heading: 'Por qué la temperatura importa en el coche',
      body: [
        'El DS18B20 vigila dos puntos críticos: el <strong>motor</strong> (alerta si pasa de <span class="value-hl">110°C</span>) y la <strong>CVT</strong> (advertencia &gt;90°C, crítico &gt;105°C). Un sobrecalentamiento puede dañar componentes caros o dejar el coche fuera de carrera.',
        'Por eso hoy la calibración se hace con agua tibia y fría, lejos del coche: mismo sensor, mismo código, cero riesgo de quemadura.'
      ],
      teacher: 'Aterriza el porqué: no es un número bonito en pantalla, es evitar fundir el motor o la CVT en plena competencia.' },

    { type: 'lab', heading: 'Pruébalo: sube la temperatura y quita el pull-up' },

    { type: 'concept', heading: 'Otros sensores del subsistema: AS5600 y MPR121',
      body: [
        'Dos menciones rápidas para ubicar el panorama. El <strong>AS5600</strong> es un encoder magnético (I2C) que MadRams usa para medir <strong>RPM</strong> de motor y salida de CVT — la comunicación I2C se ve a fondo en la Sesión 4.',
        'El <strong>MPR121</strong> es un sensor <strong>capacitivo</strong>: detecta cambios de capacitancia, o sea "tocar = señal". MadRams lo usa para medir el nivel de líquido de frenos (0-100%, alerta si baja de 20%). Es el bonus de hoy; su dirección I2C típica es <code>0x5A</code>.'
      ],
      teacher: 'No profundizar en AS5600/MPR121; solo sembrar que existen y que el I2C de la Sesión 4 es la llave para entenderlos.' }
  ],
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
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://balsam-ringer-081.notion.site/Pr-ctica-3a5b2fdbb6b981d393cdf664a8a6edc6' },
  prev: { label: 'Sesión 2', url: 'sesion-2.html' },
  next: { label: 'Sesión 4 — IMU y bus I2C', url: 'sesion-4.html' }
};
