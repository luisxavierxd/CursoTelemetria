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
    var dots = [1, 2, 3, 4, 5].map(function (n) {
      var current = data.slug === 'sesion-' + n;
      return el('a', { href: 'sesion-' + n + '.html', 'aria-current': current ? 'true' : 'false' }, ['Sesión ' + n]);
    });
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
    var children = [
      el('span', { class: 'num' }, [data.icon + ' ' + data.number]),
      el('h1', {}, [data.title]),
      el('p', { class: 'quote' }, [data.quote]),
      el('div', { class: 'badges' }, data.badges.map(function (b) { return el('span', { class: 'badge' }, [b]); }))
    ];
    if (data.photoPlaceholder) {
      children.push(el('div', { class: 'photo-placeholder reveal', style: 'margin-top:1.5rem;max-width:420px;' }, [data.photoPlaceholder]));
    }
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

  function render(data) {
    var root = document.getElementById('session-root');
    root.appendChild(renderHeader(data));
    root.appendChild(renderHero(data));
    root.appendChild(renderContent(data));
    root.appendChild(renderConnection(data));
    root.appendChild(renderReference(data));
    if (data.errors && data.errors.length) root.appendChild(renderErrors(data));
    var safety = renderSafety(data);
    if (safety) root.appendChild(safety);
    root.appendChild(renderBiblio(data));
    root.appendChild(renderCta(data));
    root.appendChild(renderNav(data));
    root.appendChild(renderFooter());
    document.title = data.title + ' · Curso Telemetría · MadRams';
    if (window.TelemetryAnim) window.TelemetryAnim.revealNew(root);
  }

  window.TelemetryTemplate = { render: render };
})();
