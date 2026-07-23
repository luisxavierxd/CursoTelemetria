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

  window.TelemetrySims['voltage-divider'] = function (container) {
    var Vin = 5, R1 = 10000, R2 = 6800; // ejemplo real de la sesión 2
    var ALERT_DEG = 25;                 // umbral real de alerta
    var DEG_MAX = 40;                   // rango del sensor de suspensión
    var RATIO = R2 / (R1 + R2);         // factor del divisor (≈0.405)
    // ADC observado cuando la suspensión está al máximo (Vpot = Vin). El map()
    // debe calibrarse a ESTE valor, no a 1023, o el ángulo no se reconstruye.
    var ADC_MAX = Math.round(RATIO * 1023);

    var angleRange = h('input', { type: 'range', min: '0', max: '40', step: '1', value: '10' });
    var readAngleIn = h('span', { class: 'v' }, ['10°']);
    var readVpot = h('span', { class: 'v' }, ['0']);
    var readVout = h('span', { class: 'v' }, ['0']);
    var readAdc = h('span', { class: 'v' }, ['0']);
    var readAngle = h('span', { class: 'v' }, ['0']);
    var pill = h('span', { class: 'sim__pill sim__pill--ok' }, ['normal']);

    var bar = h('div', {}, []);
    bar.style.cssText = 'height:14px;border-radius:7px;background:var(--blue-royal);transition:width .1s, background .1s;';
    var barWrap = h('div', {}, [bar]);
    barWrap.style.cssText = 'width:100%;height:14px;border-radius:7px;background:var(--border);overflow:hidden;';

    function update() {
      var deg = parseFloat(angleRange.value);
      // El potenciómetro entrega 0..Vin proporcional al ángulo.
      var Vpot = Vin * (deg / DEG_MAX);
      // El divisor lo baja para no pasar de 3.3V al pin del ESP32.
      var Vout = Vpot * RATIO;
      var adc = Math.round((Vout / Vin) * 1023);
      // map(adc, 0, ADC_MAX, 0, 40) — calibrado al ADC real, reconstruye el ángulo.
      var mapped = Math.round((adc / ADC_MAX) * DEG_MAX);
      readAngleIn.textContent = deg + '°';
      readVpot.textContent = Vpot.toFixed(2) + ' V';
      readVout.textContent = Vout.toFixed(2) + ' V';
      readAdc.textContent = String(adc);
      readAngle.textContent = mapped + '°';
      bar.style.width = (deg / DEG_MAX * 100) + '%';
      if (deg > ALERT_DEG) {
        bar.style.background = 'var(--signal-amber)';
        pill.textContent = 'ALERTA >25°';
        pill.className = 'sim__pill sim__pill--warn';
      } else {
        bar.style.background = 'var(--blue-royal)';
        pill.textContent = 'normal';
        pill.className = 'sim__pill sim__pill--ok';
      }
    }
    angleRange.addEventListener('input', update);

    var controls = h('div', { class: 'sim__controls' }, [
      h('div', { class: 'sim__control' }, [h('label', {}, ['Ángulo de suspensión (0–40°): ', readAngleIn]), angleRange]),
      pill
    ]);
    var stage = h('div', { class: 'sim__stage' }, [
      h('div', { class: 'sim__readout', style: 'width:100%;' }, [
        h('div', {}, [h('span', { class: 'k' }, ['Sensor (potenciómetro): ']), readVpot]),
        h('div', {}, [h('span', { class: 'k' }, ['Vout = Vpot·R2/(R1+R2): ']), readVout]),
        h('div', {}, [h('span', { class: 'k' }, ['ADC (Vout/5·1023): ']), readAdc]),
        h('div', {}, [h('span', { class: 'k' }, ['map() → ángulo: ']), readAngle]),
        barWrap
      ])
    ]);
    container.appendChild(h('div', { class: 'sim__body sim__body--split' }, [controls, stage]));
    update();
  };
})();
