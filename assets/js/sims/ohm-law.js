(function () {
  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) {
      if (c == null) return;
      n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return n;
  }

  window.TelemetrySims['ohm-law'] = function (container) {
    var V = 5, R = 220; // fuente 5V, R inicial 220Ω (caso LED de la sesión)
    var Vled = 2, Imax = 0.02; // ~2V caída LED, 20mA límite seguro

    var rRange = h('input', { type: 'range', min: '100', max: '2000', step: '10', value: '220' });
    var vRange = h('input', { type: 'range', min: '3', max: '12', step: '0.5', value: '5' });

    var readI = h('span', { class: 'v' }, ['0']);
    var readState = h('span', { class: 'sim__pill sim__pill--ok' }, ['LED OK']);
    var ledDot = h('div', {}, []);
    ledDot.style.cssText = 'width:60px;height:60px;border-radius:50%;background:#333;transition:background .15s, box-shadow .15s;';

    function update() {
      V = parseFloat(vRange.value);
      R = parseFloat(rRange.value);
      var I = V > Vled ? (V - Vled) / R : 0;
      readI.textContent = (I * 1000).toFixed(1) + ' mA';
      var brightness = Math.min(1, I / Imax);
      if (I > Imax) {
        ledDot.style.background = '#5a1a1a';
        ledDot.style.boxShadow = 'none';
        readState.textContent = 'LED quemado';
        readState.className = 'sim__pill sim__pill--crit';
      } else if (I <= 0) {
        ledDot.style.background = '#333';
        ledDot.style.boxShadow = 'none';
        readState.textContent = 'sin conducir';
        readState.className = 'sim__pill sim__pill--warn';
      } else {
        ledDot.style.background = 'rgba(255,177,61,' + (0.3 + 0.7 * brightness) + ')';
        ledDot.style.boxShadow = '0 0 ' + (6 + 24 * brightness) + 'px rgba(255,177,61,0.9)';
        readState.textContent = 'LED OK';
        readState.className = 'sim__pill sim__pill--ok';
      }
    }

    rRange.addEventListener('input', update);
    vRange.addEventListener('input', update);

    var controls = h('div', { class: 'sim__controls' }, [
      h('div', { class: 'sim__control' }, [h('label', {}, ['Resistencia (Ω)']), rRange]),
      h('div', { class: 'sim__control' }, [h('label', {}, ['Voltaje de fuente (V)']), vRange]),
      h('div', { class: 'sim__readout' }, [
        h('div', {}, [h('span', { class: 'k' }, ['Corriente por el LED: ']), readI]),
        h('div', {}, [h('span', { class: 'k' }, ['V = I × R  ·  límite seguro ≈ 20 mA'])])
      ]),
      readState
    ]);
    var stage = h('div', { class: 'sim__stage' }, [ledDot]);
    var body = h('div', { class: 'sim__body sim__body--split' }, [controls, stage]);
    container.appendChild(body);
    update();
  };
})();
