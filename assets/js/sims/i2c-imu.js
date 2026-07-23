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

  window.TelemetrySims['i2c-imu'] = function (container) {
    var ad0Chasis = h('input', { type: 'checkbox' });
    var ad0Volante = h('input', { type: 'checkbox' }); ad0Volante.checked = true;
    var addrChasis = h('span', { class: 'v' }, ['0x68']);
    var addrVolante = h('span', { class: 'v' }, ['0x69']);
    var conflict = h('span', { class: 'sim__pill sim__pill--ok' }, ['bus OK']);

    function addrOf(cb) { return cb.checked ? '0x69' : '0x68'; }
    function refreshAddr() {
      var a = addrOf(ad0Chasis), b = addrOf(ad0Volante);
      addrChasis.textContent = a;
      addrVolante.textContent = b;
      if (a === b) { conflict.textContent = 'conflicto: misma dirección'; conflict.className = 'sim__pill sim__pill--crit'; }
      else { conflict.textContent = 'bus OK'; conflict.className = 'sim__pill sim__pill--ok'; }
    }
    ad0Chasis.addEventListener('change', refreshAddr);
    ad0Volante.addEventListener('change', refreshAddr);

    var tiltRange = h('input', { type: 'range', min: '0', max: '30', step: '1', value: '0' });
    var thRange = h('input', { type: 'range', min: '5', max: '30', step: '1', value: '20' });
    var readAcc = h('span', { class: 'v' }, ['9.8']);
    var evPill = h('span', { class: 'sim__pill sim__pill--ok' }, ['sin evento']);
    var wasImpact = false;

    function refreshImu() {
      var tilt = parseFloat(tiltRange.value);
      var th = parseFloat(thRange.value);
      var mag = Math.sqrt(9.8 * 9.8 + tilt * tilt);
      readAcc.textContent = mag.toFixed(1) + ' m/s²';
      if (tilt >= th) {
        evPill.textContent = '💥 impacto/rollover detectado';
        evPill.className = 'sim__pill sim__pill--crit';
        if (!wasImpact && window.TelemetrySims._util) window.TelemetrySims._util.alarm(stage);
        wasImpact = true;
      } else {
        evPill.textContent = 'sin evento';
        evPill.className = 'sim__pill sim__pill--ok';
        wasImpact = false;
      }
    }
    tiltRange.addEventListener('input', refreshImu);
    thRange.addEventListener('input', refreshImu);

    var controls = h('div', { class: 'sim__controls' }, [
      h('label', { style: 'display:flex;gap:8px;align-items:center;font-size:0.85rem;' }, [ad0Chasis, 'MPU6050 chasis — AD0 en HIGH']),
      h('label', { style: 'display:flex;gap:8px;align-items:center;font-size:0.85rem;' }, [ad0Volante, 'MPU6050 volante — AD0 en HIGH']),
      conflict,
      h('div', { class: 'sim__control' }, [h('label', {}, ['Aceleración lateral (impacto)']), tiltRange]),
      h('div', { class: 'sim__control' }, [h('label', {}, ['Umbral de detección']), thRange])
    ]);
    var stage = h('div', { class: 'sim__stage' }, [
      h('div', { class: 'sim__readout', style: 'width:100%;' }, [
        h('div', {}, [h('span', { class: 'k' }, ['Chasis SDA/SCL: ']), addrChasis]),
        h('div', {}, [h('span', { class: 'k' }, ['Volante SDA/SCL: ']), addrVolante]),
        h('div', {}, [h('span', { class: 'k' }, ['Aceleración total (reposo ≈9.8): ']), readAcc]),
        h('div', {}, [evPill])
      ])
    ]);
    container.appendChild(h('div', { class: 'sim__body sim__body--split' }, [controls, stage]));
    refreshAddr();
    refreshImu();
  };
})();
