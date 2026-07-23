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

  var MONACO_PATH = 'm352.8 4.1504c-13.81 0.8243-23.48 12.177-34.76 18.75-15.132 10.842-32.937 19.166-44.42 34.236-3.8081 11.918 7.2143 21.834 7.6992 33.469 2.3799 12.877-3.9727 27.691-17.039 31.797-21.608 7.9502-44.019-3.3155-66.164-0.58398-15.249 1.2564-30.576 4.4208-45.71 1.0769-13.872-2.7824-28.009-3.0697-42.061-3.0837-20.279-0.65526-40.401-4.4655-60.107-8.5499-9.8358 3.4808-9.1748 16.051-15.302 23.046-9.2645 14.858-16.918 30.931-19.749 48.338-10.382 42.601-16.335 87.914-5.9935 131.09 2.9845 6.9487-1.9927 16.823 5.5254 21.516 8.5182 5.6162 19.511 4.4647 29.15 4.5723 6.3627-3.221 3.5124-12.152-0.89324-15.875-6.8457-7.1679-11.759-15.961-14.144-25.596-4.1818-13.935-6.0953-29.779-0.05469-43.404 4.8274-5.2939 10.31-10.783 10.423-18.477 2.5399-11.575 5.598-24.511-0.11424-35.558-6.7172-18.477 1.3628-38.363 12.014-53.545 5.3451-6.2228 10.439-14.267 18.566-16.574 12.2-1.5865 24.011 3.4785 36.021 4.8867 20.127 4.04 40.985 5.4105 60.521 11.713 5.4989 3.2393 13.36 5.9094 18.477 0.5171 10.835-5.0042 22.484 1.5092 33.75 0.85938 45.376 3.648 94.373-5.7234 129.19-36.775 23.603-21.125 44.441-46.111 58.145-74.801 3.2737-6.3889 3.6047-17.129-4.7976-19.494-8.795-2.811-18.662-1.7299-27.287 1.0391-6.7679 3.5504-5.7201 12.534-1.7773 17.836 2.2246 4.0916 6.7494 10.278 2.7715 14.559-5.2639 1.897-12.792-1.8673-11.882-8.136-1.2118-9.6578-5.9329-20.115-0.9949-29.337 1.655-3.8575-0.53501-8.6517-4.8828-9.2363 2.5888 1.5696-3.0196-1.1724-4.1191-0.27539z';

  // Inserta (una sola vez) el circuito de Mónaco como fondo fijo y centrado,
  // presente en todas las páginas del sitio.
  function ensureMonacoBackground() {
    if (document.querySelector('.bg-monaco')) return;
    var wrap = document.createElement('div');
    wrap.className = 'bg-monaco';
    wrap.setAttribute('aria-hidden', 'true');
    wrap.innerHTML = '<svg viewBox="0 0 411.72 343.70" preserveAspectRatio="xMidYMid meet">' +
      '<path class="monaco-track" fill="none" stroke="#2547E0" stroke-width="3" stroke-linejoin="round" d="' + MONACO_PATH + '"/>' +
      '<circle class="monaco-dot" r="5" fill="#FFB13D"/></svg>';
    document.body.appendChild(wrap);
  }

  function animateMonaco() {
    ensureMonacoBackground();
    var svg = document.querySelector('.bg-monaco');
    if (!svg) return;
    var track = svg.querySelector('.monaco-track');
    var dot = svg.querySelector('.monaco-dot');
    if (reducedMotion() || typeof anime === 'undefined') {
      if (track) { track.style.strokeDasharray = 'none'; track.style.strokeDashoffset = 0; }
      if (dot && track) {
        var start = track.getPointAtLength(0);
        dot.setAttribute('cx', start.x);
        dot.setAttribute('cy', start.y);
      }
      return;
    }
    anime({
      targets: track,
      strokeDashoffset: [anime.setDashoffset, 0],
      easing: 'easeInOutSine',
      duration: 2600
    });
    var path = anime.path('.bg-monaco .monaco-track');
    anime({
      targets: dot,
      translateX: path('x'),
      translateY: path('y'),
      easing: 'linear',
      duration: 22000,
      loop: true,
      delay: 800
    });
  }

  function init() {
    drawCircuitTraces();
    animateMonaco();
    observeReveals(document);
    animateCounters();
  }

  window.TelemetryAnim = { init: init, revealNew: observeReveals };
})();
