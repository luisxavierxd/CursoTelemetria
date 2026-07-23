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
