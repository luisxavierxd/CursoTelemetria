window.SESSION_DATA = {
  slug: 'sesion-5',
  number: '05',
  icon: '📡',
  title: 'GPS + Demo del sistema real (dashboard y radio)',
  quote: 'Cierre del curso introductorio: de sensores sueltos a construir la mitad de un sistema de adquisición real, y ver la otra mitad funcionando.',
  badges: ['1:30h (25-30 min teoría / 60-65 min práctica y demo)', 'GPS MAX-M10S + LoRa Heltec 915MHz + dashboard Grafana', 'Práctica hands-on: GPS + microSD'],
  simulator: { type: 'gps-lora', title: 'Laboratorio: NMEA y el paquete LoRa', caption: 'El coche recorre la pista: mira la sentencia NMEA y los bytes del paquete que viaja por radio.' },
  model: { label: 'Módulo GPS MAX-M10S', alt: 'Modelo 3D del módulo GPS', src: '' },
  lesson: [
    { type: 'callout', heading: 'Conexión con MadRams',
      body: 'Ya construiste, sin saberlo, una versión mini de casi todas las piezas de sensado (potenciómetro, MPU6050, DS18B20, MPR121). Hoy armas la mitad de "abajo" del sistema real (GPS + respaldo SD) y ves en demo la mitad de "arriba" (dashboard + radio). El pipeline completo del coche: <code>ESP32 → LoRa 915MHz → receptor en pits → InfluxDB → Grafana</code>, con respaldo en SD por si se pierde la señal.' },

    { type: 'concept', heading: 'GPS y el protocolo NMEA',
      body: [
        'Un <strong>GPS</strong> calcula su posición escuchando satélites y entrega los datos en un formato de texto estándar llamado <strong>NMEA</strong>: líneas que empiezan con <code>$GPGGA</code>, <code>$GPRMC</code>, etc., con latitud, longitud, velocidad y hora.',
        'Necesita "ver" al menos <span class="value-hl">4 satélites</span> para lograr un <em>fix</em> (posición válida). La primera vez o bajo techo puede tardar minutos ("cold start"); al aire libre, segundos. Si nunca da fix, prueba al aire libre antes de sospechar del código.'
      ],
      teacher: 'Que no se frustren si tarda: el fix depende del cielo, no del programa. Sácalos a la ventana antes de debuggear.' },

    { type: 'concept', heading: 'microSD: respaldo local en CSV',
      body: [
        'Una <strong>tarjeta microSD</strong> guarda los datos a bordo en un archivo <strong>CSV</strong> (texto separado por comas, que Excel abre directo). Se conecta por el bus <strong>SPI</strong> (en el Uno: MOSI=11, MISO=12, SCK=13, CS=10).',
        'Requisito que atora a muchos: la tarjeta debe estar en <strong>FAT32</strong> (no exFAT ni NTFS) o <code>SD.begin()</code> falla. Y hay que cerrar el archivo con <code>.close()</code> tras escribir, o el CSV sale vacío.'
      ],
      diagram: { src: '../assets/img/diagrams/spi-microsd.svg', alt: 'Diagrama de pines SPI para microSD', caption: 'Conexión SPI entre Arduino Uno y el módulo microSD.' },
      teacher: 'El 90% de los fallos de SD son dos causas: pinCS equivocado y tarjeta no-FAT32. Revísalas antes que nada.' },

    { type: 'concept', heading: 'Por qué respaldo local, no solo transmisión',
      body: [
        'Un sistema real transmite en vivo por radio… pero la radio se puede perder (obstáculos, distancia). Si el dato <strong>solo</strong> viajaba por radio, se perdió para siempre. Por eso se guarda <strong>además</strong> en la SD a bordo: si la radio falla, el dato sigue ahí al terminar la carrera.',
        'En el coche real la SD graba a ~10Hz (respaldo denso) y la radio transmite a ~2Hz (lo justo para ver en vivo). Dos ritmos, dos propósitos.'
      ],
      teacher: 'Idea clave de ingeniería: redundancia. En vivo (radio, rápido pero frágil) + respaldo (SD, completo y seguro).' },

    { type: 'concept', heading: 'El dashboard: ver los datos (Grafana)',
      body: [
        'Todos esos datos llegan a un <strong>dashboard</strong> (Grafana): gráficas y gauges en vivo. Tiene dos caras: <strong>LIVE</strong> (RPM, velocidad, temperaturas de motor/CVT, voltaje, mapa GPS coloreado por velocidad) y <strong>ANÁLISIS</strong> (máximos de la sesión, comparativas, histórico).',
        'Al verlo en la demo, identifica qué sensor de los que ya programaste alimenta cada panel: tu DS18B20 de la Sesión 3 son las gráficas de temperatura; tu MPU6050 de la Sesión 4, una alerta de impacto.'
      ],
      diagram: { src: '../assets/img/diagrams/telemetry-pipeline.svg', alt: 'Pipeline de telemetría de MadRams', caption: 'Del coche a la pantalla: LoRa en vivo + respaldo en SD, terminando en Grafana.', wide: true },
      teacher: 'Pídeles conectar cada panel con el sensor que lo alimenta. Cierra el círculo del curso: todo lo que armaron alimenta esto.' },

    { type: 'concept', heading: 'Radio LoRa: 915MHz y paquetes',
      body: [
        'El <strong>LoRa</strong> (Heltec WiFi LoRa 32 V4, chip SX1262) transmite en <span class="value-hl">915MHz</span> (banda US915, autorizada aquí). Manda la info en <strong>paquetes</strong>: uno de <strong>ruta</strong> (posición) 5 veces por segundo y uno de <strong>estado</strong> (RPM, temperaturas, voltaje) 1 vez por segundo — no todo cambia igual de rápido, así que no todo se manda igual de seguido.',
        'El protocolo es <strong>binario</strong> (no texto): cada paquete pesa menos, viaja más rápido y llega más lejos. Hoy esto se ve en <strong>demo</strong>; programarlo es la Sesión 6+.'
      ],
      teacher: 'Por qué binario y no texto: menos bytes = más alcance y menos congestión. Muéstralo con el paquete hex del laboratorio de abajo.' },

    { type: 'lab', heading: 'Míralo: NMEA en vivo y el paquete LoRa' }
  ],
  reference: {
    intro: 'Un módulo GPS necesita "ver" al menos 4 satélites para calcular posición (fix); puede tardar desde segundos (cielo abierto) hasta varios minutos (interior, primer encendido — "cold start"). Si gps.location.isUpdated() nunca es true, probar cerca de una ventana o al aire libre antes de sospechar del código. La tarjeta SD debe estar formateada en FAT32 (no exFAT, no NTFS) o SD.begin() falla; tarjetas de 2-16GB suelen ser más confiables en FAT32 que tarjetas grandes.',
    tables: [
      { caption: 'Pines SPI para el módulo microSD (Arduino Uno)', headers: ['Señal', 'Pin Uno'], rows: [
        ['MOSI', '11'], ['MISO', '12'], ['SCK', '13'], ['CS (Chip Select)', '10 (o el que se defina en el código, ej. pinCS)']
      ] }
    ]
  },
  errors: [
    'SD.begin() falla / "Error al iniciar la SD": revisar que pinCS en el código coincida con el pin físico conectado, y que la tarjeta esté en FAT32.',
    'GPS nunca da fix: esperar más tiempo al aire libre antes de asumir que el módulo está dañado; revisar también que el baudrate (9600) coincida con el del módulo.',
    'El archivo CSV sale vacío o con líneas repetidas: confirmar que se está usando SD.open(..., FILE_WRITE) y cerrando el archivo (.close()) después de cada escritura.'
  ],
  bibliography: [
    'u-blox MAX-M10S Datasheet',
    'Página "GPS — MAX-M10S + Estrategia Ruta Óptima" (Notion MadRams)',
    'Página "Radios LoRa — 915MHz" (Notion MadRams)',
    'Página "Integración Telemetry Stack — MadRams LoRa Local" (Notion MadRams)',
    'Heltec WiFi LoRa 32 V4 docs',
    'Arduino Docs — librería SD.h'
  ],
  cta: { label: 'Ver instrucciones de práctica en Notion →', url: 'https://balsam-ringer-081.notion.site/Pr-ctica-3a5b2fdbb6b98171a79cc786f9ca83f9' },
  prev: { label: 'Sesión 4', url: 'sesion-4.html' },
  next: { label: 'Sesión 6+ — Proyecto de equipo', url: 'sesion-6.html' }
};
