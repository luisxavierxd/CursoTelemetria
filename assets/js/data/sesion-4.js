window.SESSION_DATA = {
  slug: 'sesion-4',
  number: '04',
  icon: '📐',
  title: 'IMU y bus I2C',
  quote: 'Introducción a I2C usando el sensor real de detección de impacto/rollover.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'MPU6050 ×2 en el mismo bus I2C', 'Chasis 0x68 / volante 0x69'],
  photoPlaceholder: 'Foto: los dos MPU6050 instalados — chasis y volante',
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
    diagram: { src: '../assets/img/diagrams/i2c-bus.svg', alt: 'Diagrama de bus I2C', caption: 'Dos MPU6050 compartiendo SDA/SCL, distinguidos por dirección (0x68 / 0x69).' },
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
