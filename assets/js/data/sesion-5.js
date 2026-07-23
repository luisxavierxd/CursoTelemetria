window.SESSION_DATA = {
  slug: 'sesion-5',
  number: '05',
  icon: '📡',
  title: 'GPS + Demo del sistema real (dashboard y radio)',
  quote: 'Cierre del curso introductorio: de sensores sueltos a construir la mitad de un sistema de adquisición real, y ver la otra mitad funcionando.',
  badges: ['1:30h (25-30 min teoría / 60-65 min práctica y demo)', 'GPS MAX-M10S + LoRa Heltec 915MHz + dashboard Grafana', 'Práctica hands-on: GPS + microSD'],
  photoPlaceholder: 'Foto: módulo GPS MAX-M10S y antena usados en la práctica',
  content: [
    'Qué es un GPS y qué datos entrega (lat/lng, velocidad, protocolo NMEA)',
    'Qué es una tarjeta microSD y cómo se usa como respaldo local de datos (formato CSV)',
    'Por qué un sistema de telemetría real necesita respaldo local, no solo transmisión en vivo',
    'Qué es un dashboard de telemetría (Grafana) y para qué sirve ver los datos en vivo vs. después',
    'Radio LoRa en más detalle: por qué 915MHz, qué es un "paquete" de datos, transmitir a 5Hz vs. 1Hz',
    'Dashboard y radio son para ver el sistema real funcionando, no para programarlo hoy — eso es la Sesión 6+'
  ],
  connection: {
    heading: 'Conexión con MadRams',
    body: 'El coche real arma todo esto: ESP32 → LoRa 915MHz → receptor en pits → InfluxDB → Grafana, y además graba todo en SD como respaldo (SD @10Hz vs. LoRa @2Hz) por si se pierde la señal de radio. Ya construyeron, sin saberlo, una versión mini de casi todas las piezas de sensado (potenciómetro, MPU6050, DS18B20, MPR121) — hoy arman la mitad de "abajo" del sistema (GPS + respaldo SD) y ven en demo la mitad de "arriba" (dashboard + radio). Dashboard Grafana real: sección LIVE (gauges de RPM y velocidad, temperaturas de motor/CVT, voltaje de batería, mapa con trayectoria GPS coloreada por velocidad) y sección ANÁLISIS (máximos de la sesión, comparativas velocidad vs. RPM, tabla histórica). Radio LoRa (Heltec WiFi LoRa 32 V4, chip SX1262): 915MHz (banda US915), paquete de ruta 5 veces por segundo y paquete de estado 1 vez por segundo, protocolo binario para pesar menos y viajar más lejos.'
  },
  reference: {
    diagram: { src: '../assets/img/diagrams/spi-microsd.svg', alt: 'Diagrama de pines SPI para microSD', caption: 'Conexión SPI entre Arduino Uno y el módulo microSD usado en la práctica.' },
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
