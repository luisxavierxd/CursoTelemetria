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

  // Efecto de "alarma catastrófica": destello rojo + sacudida sobre un contenedor.
  // Se llama una sola vez al entrar a un estado crítico (no en cada input).
  function alarm(el) {
    if (reducedMotion() || typeof anime === 'undefined' || !el) return;
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    if (getComputedStyle(el).overflow === 'visible') el.style.overflow = 'hidden';
    var flash = document.createElement('div');
    flash.style.cssText = 'position:absolute;inset:0;background:rgba(255,60,60,0.4);pointer-events:none;z-index:3;border-radius:inherit;';
    el.appendChild(flash);
    anime({ targets: flash, opacity: [0.9, 0], easing: 'easeOutQuad', duration: 550, complete: function () { flash.remove(); } });
    anime({ targets: el, translateX: [0, -7, 7, -5, 5, -2, 0], duration: 400, easing: 'easeInOutSine' });
  }

  window.TelemetrySims._util = {
    reducedMotion: reducedMotion,
    revealOnView: revealOnView,
    scrollRotate: scrollRotate,
    alarm: alarm
  };
})();
