window.SESSION_DATA = {
  slug: 'sesion-1',
  number: '01',
  icon: '⚡',
  title: 'Electricidad + Arduino',
  quote: 'Base indispensable: sin esto nada del resto tiene sentido.',
  badges: ['1:30h (25 min teoría / 65 min práctica)', 'Sin subsistema específico — base de todo el sistema', 'LED, resistencias, multímetro'],
  photoPlaceholder: 'Foto: mesa de trabajo con Arduino, protoboard, LED y multímetro del kit',
  simulator: { type: 'ohm-law', title: 'Laboratorio: Ley de Ohm y el LED', caption: 'Ajusta resistencia y voltaje; mira cómo cambia la corriente y si el LED sobrevive.' },
  model: {
    label: 'Arduino Uno', alt: 'Modelo 3D de Arduino Uno',
    src: '../assets/models/ArduinoUno.glb', orientation: '0deg 0deg 203deg',
    specs: [
      { k: 'Microcontrolador', v: 'ATmega328P' },
      { k: 'Voltaje lógico', v: '<span class="hl">5 V</span>' },
      { k: 'E/S digitales', v: '14 (6 PWM ~)' },
      { k: 'Entradas analógicas', v: '6 (A0–A5)' },
      { k: 'Flash / SRAM', v: '32 KB / 2 KB' },
      { k: 'Reloj', v: '16 MHz' },
      { k: 'Bus I2C', v: 'A4 SDA · A5 SCL' },
      { k: 'En el coche real', v: 'Heltec WiFi LoRa 32 V4 (ESP32-S3R2)' }
    ]
  },
  lesson: [
    { type: 'callout', heading: 'Por qué importa para Baja',
      body: 'Todo sensor de telemetría se reduce, al final, a leer un <strong>voltaje</strong>. Esta sesión es la base de todas las demás: sin la Ley de Ohm y sin saber usar un multímetro, ningún sensor posterior va a tener sentido.' },

    { type: 'concept', heading: 'Voltaje, corriente y resistencia',
      body: [
        'Imagina agua en una tubería. El <strong>voltaje</strong> (V, en volts) es la presión que empuja el agua; la <strong>corriente</strong> (I, en amperes) es cuánta agua pasa por segundo; y la <strong>resistencia</strong> (R, en ohms Ω) es qué tan angosto es el tubo, que se opone al paso.',
        'En electrónica es lo mismo pero con electrones: el voltaje empuja, la corriente fluye y la resistencia limita. Todo lo que harás en el curso —desde encender un LED hasta leer un sensor— es controlar estas tres cantidades.'
      ],
      teacher: 'Ancla la analogía del agua antes de la fórmula: presión = voltaje, flujo = corriente, tubo angosto = resistencia. Pregunta "¿qué pasa si abro más la llave?" para que deduzcan solos que más presión da más flujo.' },

    { type: 'concept', heading: 'La Ley de Ohm: V = I × R',
      body: [
        'Estas tres cantidades están amarradas por una sola ecuación, la más importante de toda la electrónica: <code>V = I × R</code>. Si conoces dos, siempre puedes despejar la tercera.',
        'El truco visual es el <strong>triángulo</strong>: tapa con el dedo la cantidad que buscas y las otras dos te dan la fórmula. ¿Buscas R? Tápala y queda <code>V / I</code>.',
        'Ejemplo de la práctica de hoy: el Arduino entrega 5V, pero un LED solo aguanta ~2V y ~15mA sin quemarse. ¿Qué resistencia va en serie? <code>R = (5V − 2V) / 0.015A = 200Ω</code>, y usamos la comercial más cercana: <span class="value-hl">220Ω</span>. Sin ella, la corriente pasa sin límite y el LED se quema casi al instante.'
      ],
      diagram: { src: '../assets/img/diagrams/ohm-triangle.svg', alt: 'Triángulo de la Ley de Ohm', caption: 'Tapa la cantidad que buscas: las otras dos forman la fórmula.' },
      teacher: 'Aquí entra el laboratorio de abajo: pídeles bajar la resistencia hasta pasar de 20 mA y ver el LED explotar. Conecta el estallido con "corriente sin límite = componente muerto".' },

    { type: 'lab', heading: 'Pruébalo: sube la corriente hasta quemar el LED' },

    { type: 'concept', heading: 'En serie vs. en paralelo',
      body: [
        'Los componentes se conectan de dos formas. <strong>En serie</strong>, uno tras otro en un solo camino: la misma corriente pasa por todos y los voltajes se reparten. <strong>En paralelo</strong>, en ramas separadas entre los mismos dos puntos: todos ven el mismo voltaje y la corriente se divide entre las ramas.',
        'La resistencia del LED va <strong>en serie</strong> con el LED precisamente para que toda la corriente que llega al LED pase primero por ella y quede limitada.'
      ],
      diagram: { src: '../assets/img/diagrams/series-parallel.svg', alt: 'Circuitos en serie y en paralelo', caption: 'Serie: misma corriente, voltajes que se suman. Paralelo: mismo voltaje, corriente que se reparte.', wide: true },
      teacher: 'Error clásico: poner la resistencia "cerca" del LED pero en paralelo, no en serie. Si alguien quema un LED con la resistencia puesta, revisa esto primero.' },

    { type: 'concept', heading: 'Qué es un microcontrolador',
      body: [
        'Un <strong>microcontrolador</strong> es una computadora diminuta en un solo chip: trae procesador, memoria y pines de entrada/salida. El <strong>Arduino</strong> es una placa que monta ese chip y te lo deja usar fácil, con conector USB para programarlo y pines para conectar sensores y actuadores.',
        'En el coche real el "cerebro" es un ESP32 (un primo más potente del Arduino), pero la idea es idéntica: leer voltajes de sensores, decidir con código, y actuar o transmitir.'
      ] },

    { type: 'concept', heading: 'El IDE de Arduino: setup() y loop()',
      body: [
        'Escribes el programa en el <strong>IDE de Arduino</strong> y lo subes por USB. Todo programa tiene dos funciones obligatorias: <code>setup()</code>, que corre <strong>una sola vez</strong> al encender (para configurar pines, iniciar sensores), y <code>loop()</code>, que se repite <strong>para siempre</strong> mientras haya energía.'
      ],
      code: 'void setup() {\n  pinMode(13, OUTPUT);    // se configura una sola vez\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH); // esto se repite por siempre\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n}',
      teacher: 'Analogía: setup() = alistarte antes de salir (una vez); loop() = manejar (lo mismo repetido hasta apagar). Casi todo bug de "solo funciona una vez" es código puesto en setup() que debía ir en loop().' },

    { type: 'concept', heading: 'El multímetro: tu mejor amigo para depurar',
      body: [
        'El <strong>multímetro</strong> mide tres cosas que usarás todo el curso: <strong>voltaje</strong> (¿llega la alimentación?), <strong>continuidad</strong> (¿este cable de verdad conecta? — pita si hay camino) y <strong>resistencia</strong> (¿cuánto vale este resistor?).',
        'Regla de oro: cuando algo "no hace nada", <strong>mide antes de sospechar del código</strong>. La mayoría de los problemas son un cable suelto o una tierra (GND) sin conectar, y el multímetro los encuentra en segundos.'
      ],
      teacher: 'Haz que midan continuidad de un jumper bueno y uno partido a la mitad para que oigan la diferencia. Que interioricen: primero el fierro, luego el código.' }
  ],
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
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://balsam-ringer-081.notion.site/Pr-ctica-3a5b2fdbb6b981ea8e70ebdee9da3063' },
  next: { label: 'Sesión 2 — Suspensión', url: 'sesion-2.html' }
};
