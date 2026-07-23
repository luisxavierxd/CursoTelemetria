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

  function sensor(label, rom, thresholds) {
    var range = h('input', { type: 'range', min: '20', max: '140', step: '1', value: '60' });
    var readT = h('span', { class: 'v' }, ['60 °C']);
    var pill = h('span', { class: 'sim__pill sim__pill--ok' }, ['normal']);
    var romEl = h('div', { class: 'sim__readout' }, [
      h('div', {}, [h('span', { class: 'k' }, ['ROM 64-bit: ']), h('span', { class: 'v' }, [rom])])
    ]);
    var el = h('div', { class: 'sim__control' }, [
      h('label', {}, [label]),
      range,
      h('div', { class: 'sim__readout' }, [h('div', {}, [readT, ' ', pill])]),
      romEl
    ]);
    function update(pullup) {
      if (!pullup) {
        readT.textContent = '-85 °C (errático)';
        pill.textContent = 'sin pull-up';
        pill.className = 'sim__pill sim__pill--crit';
        return 'nopull';
      }
      var t = parseFloat(range.value);
      readT.textContent = t + ' °C';
      if (t >= thresholds.crit) { pill.textContent = '🔥 CRÍTICO'; pill.className = 'sim__pill sim__pill--crit'; return 'crit'; }
      if (t >= thresholds.warn) { pill.textContent = 'advertencia'; pill.className = 'sim__pill sim__pill--warn'; return 'warn'; }
      pill.textContent = 'normal'; pill.className = 'sim__pill sim__pill--ok'; return 'ok';
    }
    return { el: el, range: range, update: update };
  }

  window.TelemetrySims['onewire-temp'] = function (container) {
    var motor = sensor('DS18B20 — Motor (alerta >110°C)', '28-FF-64-1A-motor', { warn: 110, crit: 125 });
    var cvt = sensor('DS18B20 — CVT (adv >90°C, crítico >105°C)', '28-FF-3C-9B-cvt', { warn: 90, crit: 105 });
    var pullup = h('input', { type: 'checkbox' });
    pullup.checked = true;
    var wasCrit = false;

    var note = h('div', { class: 'sim__readout' }, [
      h('div', {}, [h('span', { class: 'k' }, ['Ambos sensores comparten UN cable de datos (bus OneWire); el código los distingue por su ROM.'])])
    ]);
    var stage = h('div', { class: 'sim__stage' }, [note]);

    function refresh() {
      var a = motor.update(pullup.checked);
      var b = cvt.update(pullup.checked);
      var isCrit = a === 'crit' || b === 'crit';
      if (isCrit && !wasCrit && window.TelemetrySims._util) window.TelemetrySims._util.alarm(stage);
      wasCrit = isCrit;
    }
    motor.range.addEventListener('input', refresh);
    cvt.range.addEventListener('input', refresh);
    pullup.addEventListener('change', refresh);

    var pullCtrl = h('label', { style: 'display:flex;gap:8px;align-items:center;font-size:0.85rem;' }, [
      pullup, 'Resistencia pull-up 4.7kΩ conectada'
    ]);

    var controls = h('div', { class: 'sim__controls' }, [motor.el, cvt.el, pullCtrl]);
    container.appendChild(h('div', { class: 'sim__body sim__body--split' }, [controls, stage]));
    refresh();
  };
})();
