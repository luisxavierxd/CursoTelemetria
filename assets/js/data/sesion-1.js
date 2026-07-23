window.SESSION_DATA = {
  slug: 'sesion-1',
  number: '01',
  icon: '⚡',
  title: 'Electricidad + Arduino',
  quote: 'Base indispensable: sin esto nada del resto tiene sentido.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'Sin subsistema específico — base de todo el sistema', 'LED, resistencias, multímetro'],
  photoPlaceholder: 'Foto: mesa de trabajo con Arduino, protoboard, LED y multímetro del kit',
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
