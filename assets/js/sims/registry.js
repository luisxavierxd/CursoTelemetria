(function () {
  window.TelemetrySims = window.TelemetrySims || {};

  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Revela un nodo cuando entra al viewport (reutiliza la clase .reveal del sitio).
  function revealOnView(node) {
    node.classList.add('reveal');
    if (window.TelemetryAnim && window.TelemetryAnim.revealNew) {
      window.TelemetryAnim.revealNew(node.parentNode || document);
    } else {
      node.classList.add('is-visible');
    }
  }

  // Liga la rotación de un <model-viewer> al progreso de scroll de su sección.
  function scrollRotate(viewer) {
    if (reducedMotion()) return;
    function update() {
      var rect = viewer.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var progress = 1 - (rect.top + rect.height / 2) / vh; // ~0 abajo, ~1 arriba
      progress = Math.max(0, Math.min(1, progress));
      var theta = 30 + progress * 300; // grados de órbita
      viewer.setAttribute('camera-orbit', theta + 'deg 75deg auto');
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  window.TelemetrySims._util = {
    reducedMotion: reducedMotion,
    revealOnView: revealOnView,
    scrollRotate: scrollRotate
  };

  // Simulador de prueba (temporal) para validar el pipeline de render.
  window.TelemetrySims['__smoke'] = function (container) {
    container.appendChild(document.createTextNode('Simulador de prueba OK'));
  };
})();
