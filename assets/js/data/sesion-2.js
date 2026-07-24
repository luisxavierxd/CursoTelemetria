window.SESSION_DATA = {
  slug: 'sesion-2',
  number: '02',
  icon: '🔧',
  title: 'Suspensión (potenciómetro)',
  quote: 'Divisor de voltaje aplicado al sensor real de suspensión.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'Potenciómetro OEM GM 15098628/29 ×4', 'Alerta si ángulo > 25°'],
  simulator: { type: 'voltage-divider', title: 'Laboratorio: del ángulo al ADC', caption: 'Mueve la suspensión y sigue la señal: divisor → Vout → ADC → map() → alerta.' },
  model: { label: 'Potenciómetro OEM', alt: 'Modelo 3D de un potenciómetro', src: '../assets/models/Pot10k.glb', orientation: '90deg 0deg 0deg' },
  lesson: [
    { type: 'callout', heading: 'Conexión con MadRams',
      body: 'El sensor de suspensión del coche es literalmente un <strong>potenciómetro OEM</strong> (GM 15098628/29), uno por rueda. Su señal pasa por un divisor de voltaje porque el sensor da 5V pero el ESP32 solo acepta 3.3V — exactamente el circuito que practicas hoy, a otra escala. Umbral real de alerta: ángulo de suspensión <span class="value-hl">&gt; 25°</span>.' },

    { type: 'concept', heading: 'Señales analógicas vs. digitales',
      body: [
        'Hay dos tipos de señal. Una <strong>digital</strong> solo tiene dos estados: encendido o apagado, 1 o 0 (como un interruptor). Una <strong>analógica</strong> puede tomar cualquier valor intermedio (como una perilla de volumen). El voltaje del sensor de suspensión es analógico: cambia suave conforme la rueda sube y baja.',
        'El problema: el Arduino piensa en números digitales, pero el sensor habla en voltaje analógico. Necesitamos un traductor.'
      ],
      teacher: 'Ejemplo físico: un botón (digital) vs. una perilla de volumen (analógico). Pregunta cuál describe mejor la posición de la suspensión.' },

    { type: 'concept', heading: 'analogRead(): de voltaje a número (ADC)',
      body: [
        'Ese traductor es el <strong>ADC</strong> (convertidor analógico-digital). El Arduino Uno tiene un ADC de 10 bits: convierte cualquier voltaje entre 0V y 5V en un entero entre <span class="value-hl">0 y 1023</span>.',
        'La cuenta es directa: <code>valor = (V_medido / 5V) × 1023</code>. Si el potenciómetro entrega 2.5V (la mitad), <code>analogRead()</code> regresa ~511 (la mitad de 1023).'
      ],
      diagram: { src: '../assets/img/diagrams/adc-staircase.svg', alt: 'El ADC aproxima un voltaje continuo con escalones discretos 0-1023', caption: 'El voltaje continuo se aproxima con escalones: eso es "partir el voltaje en pasitos".' },
      teacher: 'Que noten que 10 bits = 2¹⁰ = 1024 niveles (0..1023). No hay que memorizar; sí entender que es "el voltaje partido en pasitos".' },

    { type: 'concept', heading: 'Divisor de voltaje: bajar 5V a 3.3V',
      body: [
        'El sensor entrega hasta 5V, pero el ESP32 del coche <strong>solo aguanta 3.3V</strong> en sus entradas — meterle 5V directo puede dañar el pin permanentemente. La solución es un <strong>divisor de voltaje</strong>: dos resistencias en serie que reparten el voltaje.',
        'La fórmula es <code>V_out = V_in × R2 / (R1 + R2)</code>. Con R1=10kΩ y R2=6.8kΩ: <code>V_out = 5V × 6.8k/16.8k ≈ 2.02V</code>. R2 es la que "se queda" con la proporción de voltaje que sale hacia el pin.',
        '⚠️ Regla que no se rompe: <strong>nunca 5V directo a un pin de 3.3V</strong> sin divisor.'
      ],
      diagram: { src: '../assets/img/diagrams/voltage-divider.svg', alt: 'Diagrama de divisor de voltaje', caption: 'El mismo circuito que baja 5V a 3.3V en el ESP32 real.' },
      teacher: 'No es capricho: el divisor protege el pin. Es exactamente el circuito del coche, solo a otra escala de voltaje.' },

    { type: 'concept', heading: 'map(): reescalar el número al ángulo',
      body: [
        'El número crudo del ADC (0-1023) no dice nada útil por sí solo. <code>map(valor, 0, 1023, 0, 40)</code> lo reescala al rango que sí entendemos: el ángulo de suspensión, de 0 a 40°.',
        'Un detalle clave que verás en el laboratorio: el <code>map()</code> debe calibrarse al rango <strong>real</strong> que produce tu circuito, no al 0-1023 teórico. Si el divisor hace que el ADC solo llegue a ~414, mapear contra 1023 da un ángulo equivocado.'
      ],
      teacher: 'Conecta con el laboratorio de abajo: mide el ADC máximo real y calibra el map() contra ese valor, no contra 1023.' },

    { type: 'lab', heading: 'Pruébalo: sigue la señal del ángulo hasta la alerta' },

    { type: 'concept', heading: 'PWM: un "voltaje analógico" de salida',
      body: [
        'Al revés del ADC (que <em>lee</em> analógico), el <strong>PWM</strong> permite <em>escribir</em> algo parecido a un voltaje variable con <code>analogWrite()</code>. En realidad prende y apaga el pin muy rápido; el promedio se comporta como un voltaje intermedio. Sirve para atenuar un LED o controlar la velocidad de un motor.',
        'Solo funciona en los pines marcados con <code>~</code> (3, 5, 6, 9, 10, 11 en el Uno).'
      ],
      teacher: 'Demo rápida: analogWrite en un LED para verlo atenuar. Aclara que no es un voltaje continuo real, es un promedio por conmutación rápida.' }
  ],
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
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://balsam-ringer-081.notion.site/Pr-ctica-3a5b2fdbb6b981a8a4bcffe70053f8fe' },
  prev: { label: 'Sesión 1', url: 'sesion-1.html' },
  next: { label: 'Sesión 3 — Temperatura', url: 'sesion-3.html' }
};
