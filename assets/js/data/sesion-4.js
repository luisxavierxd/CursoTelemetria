window.SESSION_DATA = {
  slug: 'sesion-4',
  number: '04',
  icon: '📐',
  title: 'IMU y bus I2C',
  quote: 'Introducción a I2C usando el sensor real de detección de impacto/rollover.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'MPU6050 ×2 en el mismo bus I2C', 'Chasis 0x68 / volante 0x69'],
  simulator: { type: 'i2c-imu', title: 'Laboratorio: direcciones I2C y umbral de impacto', caption: 'Cambia AD0 para ver 0x68/0x69 (y el conflicto si chocan), e inclina el IMU para disparar el evento.' },
  model: { label: 'MPU6050', alt: 'Modelo 3D del IMU MPU6050', src: '' },
  lesson: [
    { type: 'callout', heading: 'Conexión con MadRams',
      body: 'MadRams usa <strong>dos MPU6050</strong> en el mismo bus I2C: uno en el chasis (<span class="value-hl">0x68</span>) y otro en el volante (<span class="value-hl">0x69</span>). Es el ejemplo perfecto de por qué existen las direcciones I2C — sin ellas el Arduino no sabría de cuál sensor viene cada dato. Uso real: detección de impacto / rollover (seguridad del piloto).' },

    { type: 'concept', heading: 'El bus I2C: dos cables, muchos sensores',
      body: [
        'El <strong>I2C</strong> conecta varios sensores al Arduino usando solo <strong>dos cables</strong>: <code>SDA</code> (por donde viajan los datos) y <code>SCL</code> (el "reloj" que sincroniza cuándo se lee cada bit). En el Arduino Uno son fijos: SDA = A4, SCL = A5.',
        '¿Cómo distingue el Arduino de cuál sensor viene cada dato si todos comparten los mismos dos cables? Por la <strong>dirección</strong> de cada dispositivo.'
      ],
      diagram: { src: '../assets/img/diagrams/i2c-bus.svg', alt: 'Diagrama de bus I2C', caption: 'Dos MPU6050 compartiendo SDA/SCL, distinguidos por su dirección (0x68 / 0x69).' },
      teacher: 'SDA = por dónde hablan; SCL = el metrónomo que los sincroniza. Sin reloj común, nadie se entiende.' },

    { type: 'concept', heading: 'Direcciones I2C: 0x68 y 0x69',
      body: [
        'Cada dispositivo del bus tiene una <strong>dirección</strong>: un número de 7 bits (0 a 127). Dos dispositivos <strong>no pueden</strong> compartir la misma dirección en el mismo bus, o el Arduino no sabría a cuál le habla.',
        'MadRams usa <span class="value-hl">0x68</span> para un MPU6050 y <span class="value-hl">0x69</span> para el otro. Muchos módulos traen un pin <code>AD0</code> que cambia la dirección entre esos dos valores. Si necesitas más de dos sensores idénticos (como los AS5600 del coche), se usa un multiplexor I2C (TCA9548A) — tema de fases posteriores.'
      ],
      teacher: 'En el laboratorio, pon ambos AD0 iguales para provocar el conflicto de dirección: es la mejor forma de que entiendan por qué existen las direcciones.' },

    { type: 'concept', heading: 'Qué es un IMU (acelerómetro + giroscopio)',
      body: [
        'Un <strong>IMU</strong> combina dos sensores: un <strong>acelerómetro</strong> (mide aceleración lineal en X, Y, Z) y un <strong>giroscopio</strong> (mide rotación). El MPU6050 trae ambos.',
        'Truco de verificación: la librería regresa la aceleración en m/s²; en reposo, el eje que apunta hacia abajo debe marcar <span class="value-hl">≈9.8 m/s²</span> (la gravedad). Si no marca eso en reposo, el sensor está mal conectado o mal leído.'
      ],
      teacher: 'La gravedad siempre presente (9.8) es el "check de cordura". Que lo usen antes de perseguir bugs raros.' },

    { type: 'concept', heading: 'Umbral: convertir números en eventos',
      body: [
        'Leer aceleración no basta; hay que <strong>decidir</strong>. Un <strong>umbral</strong> es el valor a partir del cual disparas un evento: si la aceleración pasa de cierto nivel, registras un <strong>impacto</strong> o un <strong>rollover</strong> (volcadura) — información de seguridad del piloto.',
        'El valor del umbral es arbitrario y depende de qué tan fuerte sea el golpe que quieres detectar: conviene probar en vivo (golpes suaves vs. fuertes) y ajustar, en vez de asumir un número fijo.'
      ],
      teacher: 'No hay umbral universal. Que jueguen con el slider del laboratorio para sentir la diferencia entre detectar todo (ruido) y detectar solo golpes reales.' },

    { type: 'lab', heading: 'Pruébalo: direcciones, conflicto y umbral de impacto' }
  ],
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
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://balsam-ringer-081.notion.site/Pr-ctica-3a5b2fdbb6b981449f11dab04448a812' },
  prev: { label: 'Sesión 3', url: 'sesion-3.html' },
  next: { label: 'Sesión 5 — GPS + Demo', url: 'sesion-5.html' }
};
