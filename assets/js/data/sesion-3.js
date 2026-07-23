window.SESSION_DATA = {
  slug: 'sesion-3',
  number: '03',
  icon: '🌡️',
  title: 'Temperatura (DS18B20 + OneWire)',
  quote: 'Bus OneWire + calibración segura de un sensor real, sin riesgos de quemadura.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'DS18B20 en motor/CVT · dos sensores, un bus', 'Bonus: MPR121 capacitivo'],
  photoPlaceholder: 'Foto: DS18B20 montado en motor/CVT del coche real',
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
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://balsam-ringer-081.notion.site/Pr-ctica-3a5b2fdbb6b981d393cdf664a8a6edc6' },
  prev: { label: 'Sesión 2', url: 'sesion-2.html' },
  next: { label: 'Sesión 4 — IMU y bus I2C', url: 'sesion-4.html' }
};
