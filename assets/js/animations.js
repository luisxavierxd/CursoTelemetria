(function () {
  function reducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function drawCircuitTraces() {
    var paths = document.querySelectorAll('.circuit-trace path');
    if (!paths.length) return;
    if (reducedMotion() || typeof anime === 'undefined') {
      paths.forEach(function (p) { p.style.strokeDashoffset = 0; });
      return;
    }
    anime({
      targets: paths,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 1400,
      delay: function (el, i) { return i * 180; }
    });
  }

  function revealElement(el) {
    if (reducedMotion() || typeof anime === 'undefined') {
      el.classList.add('is-visible');
      return;
    }
    el.classList.add('is-visible');
    anime({
      targets: el,
      translateY: [24, 0],
      opacity: [0, 1],
      duration: 650,
      easing: 'easeOutQuad'
    });
  }

  var observer = null;
  function getObserver() {
    if (observer) return observer;
    observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    return observer;
  }

  function observeReveals(root) {
    var scope = root || document;
    var items = scope.querySelectorAll('.reveal:not(.is-visible)');
    var obs = getObserver();
    items.forEach(function (el) { obs.observe(el); });
  }

  function animateCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    counters.forEach(function (el) {
      var target = parseInt(el.getAttribute('data-counter'), 10);
      var suffix = el.getAttribute('data-counter-suffix') || '';
      if (reducedMotion() || typeof anime === 'undefined') {
        el.textContent = target + suffix;
        return;
      }
      var obj = { value: 0 };
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          anime({
            targets: obj,
            value: target,
            round: 1,
            duration: 900,
            easing: 'easeOutExpo',
            update: function () { el.textContent = obj.value + suffix; }
          });
          obs.unobserve(el);
        });
      }, { threshold: 0.5 });
      obs.observe(el);
    });
  }

  function init() {
    drawCircuitTraces();
    observeReveals(document);
    animateCounters();
  }

  window.TelemetryAnim = { init: init, revealNew: observeReveals };
})();
