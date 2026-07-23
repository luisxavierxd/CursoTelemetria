window.SESSION_DATA = {
  slug: 'sesion-6',
  number: '06+',
  icon: '🏁',
  title: 'Proyecto de equipo: Black Box real en el coche viejo',
  quote: 'Para quienes se quedan al equipo después del curso introductorio. Ya no es una sesión de 1:30h fija — es el primer proyecto real.',
  badges: ['Formato abierto — 1+ sesiones de trabajo, según avance', 'Sistema de adquisición completo instalado en vehículo', 'Solo para quienes se quedan al equipo'],
  content: [
    'Qué cambia al pasar de protoboard a un circuito permanente: soldadura, conectores tipo Deutsch/JST, protección contra vibración (headers en vez de jumpers sueltos)',
    'Consideraciones de montaje mecánico: dónde va la caja, cómo se sujeta, qué tan lejos debe estar de fuentes de calor real (motor, escape, CVT)',
    'Cómo se integra esta caja negra al resto del stack real de MadRams (mismo formato CSV, misma idea de respaldo que ya vieron en la Sesión 5)'
  ],
  connection: {
    heading: 'Diferencia clave vs. el curso introductorio',
    body: 'En la Sesión 5 se armó GPS + SD en protoboard, sobre una mesa. Acá el reto es que ese mismo circuito sobreviva en un vehículo real: vibración, polvo, calor, conectores que no se zafen. Es la diferencia entre un prototipo que funciona una vez y un sistema que aguanta una carrera completa. Es, literalmente, terminar una de las tareas pendientes reales del equipo: dejar el sistema de adquisición físicamente instalado y validado en vehículo, no solo en protoboard.'
  },
  reference: {
    intro: 'Este proyecto se trabaja con supervisión directa de un líder de electrónica del equipo — no hay una "referencia rápida" de fórmulas aquí porque el trabajo es de integración e instalación, no de un sensor nuevo.'
  },
  errors: [],
  isAlertSession: true,
  safety: [
    'Toda instalación física se hace con el coche apagado y frío (mínimo varias horas sin encender).',
    'Nadie monta o desmonta nada cerca del motor/escape/CVT sin un líder de electrónica presente.',
    'Si se necesita una prueba con el motor encendido, la enciende únicamente el líder del equipo, nunca un estudiante nuevo por su cuenta.',
    'Guantes y precaución estándar de taller en todo momento.'
  ],
  bibliography: [
    'Página "Piezas Faltantes — MadRams" (Notion)',
    'Página "Tasks" (Notion MadRams)',
    'Página "Sesiones de Prueba — MadRams" (Notion)',
    'Página "Integración Telemetry Stack — MadRams LoRa Local" (Notion)',
    'Arduino Docs — librería SD.h'
  ],
  cta: { label: 'Habla con el líder de electrónica del equipo →', url: 'https://app.notion.com/p/3a6b2fdbb6b9810498d8d9dcdc191254' },
  prev: { label: 'Sesión 5', url: 'sesion-5.html' }
};
