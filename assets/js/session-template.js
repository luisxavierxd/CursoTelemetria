(function () {
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') node.className = attrs[k];
      else if (k === 'html') node.innerHTML = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) {
      if (c == null) return;
      node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return node;
  }

  function renderHeader(data) {
    var currentNum = parseInt(data.number, 10) || 0; // '01'→1 … '06'→6
    function dot(n, extraClass, label) {
      var cls = 'nav-dot' + (extraClass ? ' ' + extraClass : '');
      if (n < currentNum) cls += ' is-done';
      else if (n === currentNum) cls += ' is-current';
      var attrs = { href: 'sesion-' + n + '.html', class: cls, 'aria-label': label };
      if (n === currentNum) attrs['aria-current'] = 'true';
      return el('a', attrs, [label]);
    }
    var dots = [1, 2, 3, 4, 5].map(function (n) { return dot(n, '', 'Sesión ' + n); });
    dots.push(dot(6, 'nav-dot--bonus', 'Sesión 6+'));
    return el('header', { class: 'site-header' }, [
      el('div', { class: 'container' }, [
        el('a', { class: 'site-header__brand', href: '../index.html' }, [
          el('img', { src: '../assets/img/logo-placeholder.svg', alt: 'MadRams' }),
          document.createTextNode('Curso Telemetría')
        ]),
        el('ul', { class: 'nav-dots' }, dots)
      ])
    ]);
  }

  function renderHero(data) {
    var traceSvg = '<svg class="circuit-trace session-hero__trace" viewBox="0 0 300 40" ' +
      'preserveAspectRatio="xMidYMid meet" aria-hidden="true">' +
      '<path d="M0 30 L60 30 L60 15 L140 15 L140 30 L220 30 L220 10 L300 10" ' +
      'fill="none" stroke="#2547E0" stroke-width="2" stroke-dasharray="900" /></svg>';
    var children = [
      el('span', { class: 'num' }, [data.icon + ' ' + data.number]),
      el('h1', {}, [data.title]),
      el('p', { class: 'quote' }, [data.quote]),
      el('div', { class: 'badges' }, data.badges.map(function (b) { return el('span', { class: 'badge' }, [b]); })),
      el('div', { class: 'session-hero__trace-wrap', html: traceSvg })
    ];
    // El componente principal se muestra como modelo 3D (renderModel); las fotos
    // de material/circuito viven en la Práctica de Notion, no aquí.
    return el('section', { class: 'session-hero' }, [
      el('div', { class: 'container' }, children)
    ]);
  }

  function renderContent(data) {
    var items = data.content.map(function (line) { return el('li', {}, [line]); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Contenido']),
        el('ul', { class: 'content-list reveal' }, items)
      ])
    ]);
  }

  function renderConnection(data) {
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('div', { class: 'callout reveal' }, [
          el('h2', {}, [data.connection.heading]),
          el('p', {}, [data.connection.body])
        ])
      ])
    ]);
  }

  function renderTable(t) {
    var thead = el('thead', {}, [el('tr', {}, t.headers.map(function (h) { return el('th', {}, [h]); }))]);
    var tbody = el('tbody', {}, t.rows.map(function (row) {
      return el('tr', {}, row.map(function (cell) { return el('td', {}, [cell]); }));
    }));
    return el('div', { class: 'table-wrap' }, [
      el('p', { class: 'table-caption' }, [t.caption]),
      el('table', { class: 'data-table' }, [thead, tbody])
    ]);
  }

  function renderReference(data) {
    var ref = data.reference || {};
    var blocks = [];
    if (ref.diagram) {
      blocks.push(el('figure', { class: 'diagram' }, [
        el('img', { src: ref.diagram.src, alt: ref.diagram.alt, loading: 'lazy' }),
        el('figcaption', { class: 'table-caption' }, [ref.diagram.caption])
      ]));
    }
    if (ref.intro) blocks.push(el('p', {}, [ref.intro]));
    (ref.formulas || []).forEach(function (f) {
      blocks.push(el('div', { class: 'formula-item' }, [
        el('div', { class: 'formula-label' }, [f.label]),
        el('code', { class: 'formula' }, [f.code])
      ]));
    });
    (ref.tables || []).forEach(function (t) { blocks.push(renderTable(t)); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Referencia rápida']),
        el('div', { class: 'reference-block reveal' }, blocks)
      ])
    ]);
  }

  function renderErrors(data) {
    var items = data.errors.map(function (e) { return el('li', { class: 'checklist__item' }, [e]); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Errores comunes']),
        el('ul', { class: 'checklist reveal' }, items)
      ])
    ]);
  }

  function renderSafety(data) {
    if (!data.safety) return null;
    var items = data.safety.map(function (s) { return el('li', { class: 'checklist__item' }, [s]); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('div', { class: 'safety-box reveal' }, [
          el('h3', {}, ['⚠ Protocolo de seguridad (obligatorio)']),
          el('ul', { class: 'checklist' }, items)
        ])
      ])
    ]);
  }

  function renderBiblio(data) {
    var items = data.bibliography.map(function (b) { return el('li', {}, [b]); });
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, ['Bibliografía']),
        el('ul', { class: 'reveal' }, items)
      ])
    ]);
  }

  function renderCta(data) {
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('a', { class: 'btn btn--primary reveal', href: data.cta.url, target: '_blank', rel: 'noopener' }, [data.cta.label])
      ])
    ]);
  }

  function renderNav(data) {
    var prev = data.prev ? el('a', { class: 'btn btn--ghost', href: data.prev.url }, ['← ' + data.prev.label]) : el('span', {}, []);
    var next = data.next ? el('a', { class: 'btn btn--ghost', href: data.next.url }, [data.next.label + ' →']) : el('span', {}, []);
    return el('nav', { class: 'session-nav container' }, [prev, next]);
  }

  function renderFooter() {
    var f = el('footer', { class: 'site-footer' }, [
      el('div', { class: 'container' }, [el('p', {}, ['MadRams — Minibaja SAE. Material del curso vive en el Notion del equipo.'])])
    ]);
    return f;
  }

  // Carga el módulo <model-viewer> desde el CDN una sola vez, y solo cuando
  // realmente hay un modelo 3D que mostrar (evita bajar un módulo grande en
  // páginas que aún usan placeholder).
  function ensureModelViewer() {
    if (document.getElementById('model-viewer-cdn')) return;
    var s = document.createElement('script');
    s.id = 'model-viewer-cdn';
    s.type = 'module';
    s.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.0.0/dist/model-viewer.min.js';
    document.head.appendChild(s);
  }

  function renderModel(data) {
    if (!data.model) return null;
    var m = data.model;
    var slot;
    if (m.src) {
      ensureModelViewer();
      var mv = el('model-viewer', {
        src: m.src, alt: m.alt || m.label || 'Modelo 3D',
        'camera-controls': '', 'auto-rotate': '', 'interaction-prompt': 'none',
        'shadow-intensity': '1'
      }, []);
      if (m.poster) mv.setAttribute('poster', m.poster);
      slot = el('div', { class: 'model-slot' }, [mv]);
      setTimeout(function () {
        if (window.TelemetrySims && window.TelemetrySims._util) {
          window.TelemetrySims._util.scrollRotate(mv);
        }
      }, 0);
    } else {
      slot = el('div', { class: 'model-slot is-placeholder' }, [
        el('div', {}, [
          el('span', { class: 'model-slot__label' }, ['Modelo 3D: ' + (m.label || 'componente')]),
          el('span', { class: 'model-slot__hint' }, ['suelta el .glb aquí'])
        ])
      ]);
    }
    return el('div', { class: 'reveal', style: 'margin-top:1.5rem;' }, [slot]);
  }

  // Construye la sección del laboratorio a partir de la spec del simulador.
  // Se usa tanto suelta (renderSimulator) como embebida en la lección (bloque 'lab').
  function buildSimSection(sim, heading) {
    if (!sim || !window.TelemetrySims || !window.TelemetrySims[sim.type]) return null;
    var body = el('div', { class: 'sim__mount' }, []);
    var section = el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('h2', { class: 'reveal' }, [heading || 'Laboratorio interactivo']),
        el('div', { class: 'sim reveal' }, [
          el('div', { class: 'sim__head' }, [
            el('h3', {}, [sim.title || 'Simulador']),
            sim.caption ? el('p', {}, [sim.caption]) : null
          ]),
          body
        ])
      ])
    ]);
    setTimeout(function () { window.TelemetrySims[sim.type](body); }, 0);
    return section;
  }

  function renderSimulator(data) { return buildSimSection(data.simulator); }

  // ---- Lección explicativa (flujo de presentación por bloques) ----
  function renderConceptBlock(b) {
    var kids = [];
    if (b.heading) kids.push(el('h2', { class: 'reveal' }, [b.heading]));
    var inner = [];
    (b.body || []).forEach(function (para) { inner.push(el('p', { html: para })); });
    if (b.code) inner.push(el('pre', { class: 'formula' }, [b.code]));
    if (b.diagram) {
      inner.push(el('figure', { class: 'diagram' + (b.diagram.wide ? ' diagram--wide' : '') }, [
        el('img', { src: b.diagram.src, alt: b.diagram.alt, loading: 'lazy' }),
        b.diagram.caption ? el('figcaption', { class: 'table-caption' }, [b.diagram.caption]) : null
      ]));
    }
    if (b.teacher) {
      inner.push(el('details', { class: 'teacher-note' }, [
        el('summary', {}, ['▸ Para el profesor']),
        el('p', { html: b.teacher })
      ]));
    }
    kids.push(el('div', { class: 'concept reveal' }, inner));
    return el('section', { class: 'session-section' }, [el('div', { class: 'container' }, kids)]);
  }

  function renderCalloutBlock(b) {
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('div', { class: 'callout reveal' }, [
          b.heading ? el('h2', {}, [b.heading]) : null,
          el('p', { html: b.body })
        ])
      ])
    ]);
  }

  function renderDiagramBlock(b) {
    return el('section', { class: 'session-section' }, [
      el('div', { class: 'container' }, [
        el('figure', { class: 'diagram diagram--wide reveal' }, [
          el('img', { src: b.src, alt: b.alt, loading: 'lazy' }),
          b.caption ? el('figcaption', { class: 'table-caption' }, [b.caption]) : null
        ])
      ])
    ]);
  }

  function renderLesson(data, sink) {
    return data.lesson.map(function (b, i) {
      var node;
      if (b.type === 'lab') node = buildSimSection(data.simulator, b.heading);
      else if (b.type === 'callout') node = renderCalloutBlock(b);
      else if (b.type === 'diagram') node = renderDiagramBlock(b);
      else node = renderConceptBlock(b);
      // Los conceptos y el laboratorio (con encabezado) alimentan el índice lateral.
      if (node && b.heading && b.type !== 'callout' && b.type !== 'diagram') {
        node.id = 'sec-' + i;
        var short = b.heading.split(':')[0].split(' (')[0];
        sink.push({ id: 'sec-' + i, label: short });
      }
      return node;
    });
  }

  // ---- Rieles laterales (pantallas anchas): índice + telemetría ambiental ----
  function buildScrollSpy(sections) {
    if (!sections.length) return null;
    var links = [];
    var ul = el('ul', { class: 'spy' }, sections.map(function (s) {
      var a = el('a', { href: '#' + s.id, 'data-spy': s.id }, [s.label]);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        var target = document.getElementById(s.id);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      links.push(a);
      return el('li', {}, [a]);
    }));
    var progressFill = el('span', { class: 'rail-progress__fill' }, []);
    var progress = el('div', { class: 'rail-progress' }, [
      el('div', { class: 'rail-progress__label' }, ['Avance']),
      el('div', { class: 'rail-progress__track' }, [progressFill])
    ]);
    var nav = el('nav', { class: 'side-rail side-rail--left', 'aria-label': 'Índice de la sesión' }, [
      el('div', { class: 'side-rail__label' }, ['En esta sesión']),
      ul,
      progress
    ]);
    // Barra de avance de lectura de la página.
    function updProgress() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (window.pageYOffset || h.scrollTop) / max * 100 : 0;
      progressFill.style.width = Math.max(0, Math.min(100, pct)).toFixed(1) + '%';
    }
    window.addEventListener('scroll', updProgress, { passive: true });
    setTimeout(updProgress, 0);
    // Resaltar el tema visible al hacer scroll.
    setTimeout(function () {
      if (!('IntersectionObserver' in window)) return;
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('data-spy') === en.target.id);
          });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      sections.forEach(function (s) {
        var t = document.getElementById(s.id);
        if (t) obs.observe(t);
      });
    }, 0);
    return nav;
  }

  function buildTelemetry() {
    var metrics = [
      { k: 'RPM', min: 1800, max: 5200, val: 3200, dec: 0, bar: true, hot: 4600 },
      { k: 'MOTOR °C', min: 78, max: 116, val: 92, dec: 0, bar: true, hot: 110, suffix: '°' },
      { k: 'CVT °C', min: 70, max: 108, val: 86, dec: 0, bar: true, hot: 105, suffix: '°' },
      { k: 'FUERZA G', min: 0, max: 2.4, val: 0.8, dec: 1, bar: true, hot: 1.8 },
      { k: 'VEL km/h', min: 0, max: 68, val: 34, dec: 0, bar: true },
      { k: 'BAT V', min: 12.1, max: 14.2, val: 13.4, dec: 1 }
    ];
    var rows = metrics.map(function (m) {
      m.vEl = el('span', { class: 'telem__v' }, ['—']);
      var kids = [el('span', { class: 'telem__k' }, [m.k]), m.vEl];
      var row = [el('div', { class: 'telem__row' }, kids)];
      if (m.bar) { m.barEl = el('span', {}, []); row.push(el('div', { class: 'telem__bar' }, [m.barEl])); }
      return el('div', {}, row);
    });
    var latEl = el('span', { class: 'telem__v' }, ['—']);
    var lonEl = el('span', { class: 'telem__v' }, ['—']);
    rows.push(el('div', { class: 'telem__row' }, [el('span', { class: 'telem__k' }, ['LAT']), latEl]));
    rows.push(el('div', { class: 'telem__row' }, [el('span', { class: 'telem__k' }, ['LON']), lonEl]));

    // Mini-gráfica en vivo del historial de RPM, con ejes y valores.
    var rpmM = metrics[0];
    function fmtK(v) { return (v / 1000).toFixed(1) + 'k'; }
    var svgNS = 'http://www.w3.org/2000/svg';
    function svgEl(tag, attrs) {
      var n = document.createElementNS(svgNS, tag);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      return n;
    }
    var spark = svgEl('svg', { viewBox: '0 0 100 40', preserveAspectRatio: 'none' });
    spark.appendChild(svgEl('line', { x1: 0, y1: 13.3, x2: 100, y2: 13.3, stroke: '#24304A', 'stroke-width': 0.5, 'vector-effect': 'non-scaling-stroke' }));
    spark.appendChild(svgEl('line', { x1: 0, y1: 26.6, x2: 100, y2: 26.6, stroke: '#24304A', 'stroke-width': 0.5, 'vector-effect': 'non-scaling-stroke' }));
    var sparkArea = svgEl('polygon', { fill: 'rgba(37,71,224,0.16)', stroke: 'none' });
    var sparkLine = svgEl('polyline', { fill: 'none', stroke: '#6C8CFF', 'stroke-width': 1.5, 'vector-effect': 'non-scaling-stroke' });
    spark.appendChild(sparkArea);
    spark.appendChild(sparkLine);

    var SPN = 48, hist = [];
    function drawSpark(norm) {
      hist.push(norm);
      if (hist.length > SPN) hist.shift();
      var lp = hist.map(function (v, i) {
        return (i / (SPN - 1) * 100).toFixed(1) + ',' + (39 - v * 37).toFixed(1);
      });
      sparkLine.setAttribute('points', lp.join(' '));
      var lastX = ((hist.length - 1) / (SPN - 1) * 100).toFixed(1);
      sparkArea.setAttribute('points', '0,40 ' + lp.join(' ') + ' ' + lastX + ',40');
    }

    var chart = el('div', { class: 'spark' }, [
      el('div', { class: 'spark__area' }, [
        el('div', { class: 'spark__yaxis' }, [
          el('span', {}, [fmtK(rpmM.max)]),
          el('span', {}, [fmtK((rpmM.min + rpmM.max) / 2)]),
          el('span', {}, [fmtK(rpmM.min)])
        ]),
        el('div', { class: 'spark__plot' }, [spark])
      ]),
      el('div', { class: 'spark__xaxis' }, [el('span', {}, ['−45 s']), el('span', {}, ['ahora'])])
    ]);

    var aside = el('aside', { class: 'side-rail side-rail--right', 'aria-hidden': 'true' }, [
      el('div', { class: 'side-rail__label' }, ['Telemetría · demo']),
      el('div', { class: 'telem' }, rows),
      el('div', { class: 'telem-spark' }, [
        el('div', { class: 'telem-spark__label' }, ['RPM · histórico']),
        chart
      ])
    ]);

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lat = 19.4326, lon = -99.1332;
    function step() {
      metrics.forEach(function (m) {
        var span = (m.max - m.min);
        m.val += (Math.random() - 0.5) * span * 0.18;
        if (m.val < m.min) m.val = m.min;
        if (m.val > m.max) m.val = m.max;
        m.vEl.textContent = m.val.toFixed(m.dec) + (m.suffix || '');
        var hot = m.hot && m.val >= m.hot;
        m.vEl.classList.toggle('is-hot', !!hot);
        if (m.barEl) {
          m.barEl.style.width = ((m.val - m.min) / span * 100).toFixed(0) + '%';
          m.barEl.style.background = hot ? 'var(--signal-amber)' : 'var(--blue-royal)';
        }
      });
      lat += (Math.random() - 0.5) * 0.0009;
      lon += (Math.random() - 0.5) * 0.0009;
      latEl.textContent = lat.toFixed(4);
      lonEl.textContent = lon.toFixed(4);
      var rpm = metrics[0];
      drawSpark((rpm.val - rpm.min) / (rpm.max - rpm.min));
    }
    // Semilla del histórico para que el sparkline no arranque vacío.
    for (var s = 0; s < SPN; s++) drawSpark(0.3 + Math.random() * 0.4);
    step();
    if (!reduced) setInterval(step, 900);
    return aside;
  }

  function renderSideRails(sections) {
    var rails = [];
    var spy = buildScrollSpy(sections);
    if (spy) rails.push(spy);
    rails.push(buildTelemetry());
    return rails;
  }

  function render(data) {
    var root = document.getElementById('session-root');
    root.appendChild(renderHeader(data));
    root.appendChild(renderHero(data));
    var modelNode = renderModel(data);
    if (modelNode) {
      var heroContainer = root.querySelector('.session-hero .container');
      if (heroContainer) heroContainer.appendChild(modelNode);
    }
    if (data.lesson && data.lesson.length) {
      // Flujo de presentación: conceptos explicados, diagramas y el laboratorio
      // embebido en el orden que definan los datos.
      var sections = [];
      renderLesson(data, sections).forEach(function (node) { if (node) root.appendChild(node); });
      root.appendChild(renderReference(data));
      renderSideRails(sections).forEach(function (r) { if (r) root.appendChild(r); });
    } else {
      // Retrocompatibilidad (p. ej. sesión 6): bullets + conexión + lab suelto.
      root.appendChild(renderContent(data));
      root.appendChild(renderConnection(data));
      root.appendChild(renderReference(data));
      var simNode = renderSimulator(data);
      if (simNode) root.appendChild(simNode);
    }
    if (data.errors && data.errors.length) root.appendChild(renderErrors(data));
    var safety = renderSafety(data);
    if (safety) root.appendChild(safety);
    root.appendChild(renderBiblio(data));
    root.appendChild(renderCta(data));
    root.appendChild(renderNav(data));
    root.appendChild(renderFooter());
    document.title = data.title + ' · Curso Telemetría · MadRams';
    if (window.TelemetryAnim) window.TelemetryAnim.init();
  }

  window.TelemetryTemplate = { render: render };
})();
