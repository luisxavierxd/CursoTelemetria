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

  function reduced() {
    return window.TelemetrySims._util && window.TelemetrySims._util.reducedMotion();
  }

  window.TelemetrySims['ohm-law'] = function (container) {
    var V = 5, R = 220; // fuente 5V, R inicial 220Ω (caso LED de la sesión)
    var Vled = 2, Imax = 0.02; // ~2V caída LED, 20mA límite seguro
    var wasBurned = false;

    var rRange = h('input', { type: 'range', min: '100', max: '2000', step: '10', value: '220' });
    var vRange = h('input', { type: 'range', min: '3', max: '12', step: '0.5', value: '5' });

    var readI = h('span', { class: 'v' }, ['0']);
    var readR = h('span', { class: 'v' }, ['220 Ω']);
    var readV = h('span', { class: 'v' }, ['5 V']);
    var readState = h('span', { class: 'sim__pill sim__pill--ok' }, ['LED OK']);
    var ledDot = h('div', {}, []);
    ledDot.style.cssText = 'width:60px;height:60px;border-radius:50%;background:#333;transition:background .15s, box-shadow .15s;position:relative;z-index:1;';
    var stage = h('div', { class: 'sim__stage' }, [ledDot]);
    stage.style.position = 'relative';
    stage.style.overflow = 'hidden';

    // Explosión del LED al quemarse: destello, onda expansiva, chispas y sacudida.
    function explode() {
      if (reduced() || typeof anime === 'undefined') return;
      var ring = h('div', {}, []);
      ring.style.cssText = 'position:absolute;left:50%;top:50%;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:3px solid #FFB13D;pointer-events:none;z-index:2;';
      stage.appendChild(ring);
      var flash = h('div', {}, []);
      flash.style.cssText = 'position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px 0 0 -15px;border-radius:50%;background:#fff;pointer-events:none;z-index:2;';
      stage.appendChild(flash);
      anime({ targets: ring, scale: [0.4, 6], opacity: [1, 0], easing: 'easeOutQuad', duration: 650, complete: function () { ring.remove(); } });
      anime({ targets: flash, scale: [1, 2.4], opacity: [1, 0], easing: 'easeOutQuad', duration: 320, complete: function () { flash.remove(); } });
      anime({ targets: stage, translateX: [0, -7, 7, -5, 5, -2, 0], duration: 420, easing: 'easeInOutSine' });
      for (var i = 0; i < 8; i++) {
        var spark = h('div', {}, []);
        spark.style.cssText = 'position:absolute;left:50%;top:50%;width:5px;height:5px;margin:-2px;border-radius:50%;background:#FFB13D;pointer-events:none;z-index:2;';
        stage.appendChild(spark);
        var ang = (Math.PI * 2 * i) / 8;
        (function (sp, a) {
          anime({ targets: sp, translateX: Math.cos(a) * 70, translateY: Math.sin(a) * 70, opacity: [1, 0], scale: [1, 0.3], easing: 'easeOutQuad', duration: 620, complete: function () { sp.remove(); } });
        })(spark, ang);
      }
    }

    function update() {
      V = parseFloat(vRange.value);
      R = parseFloat(rRange.value);
      readR.textContent = R + ' Ω';
      readV.textContent = V + ' V';
      var I = V > Vled ? (V - Vled) / R : 0;
      readI.textContent = (I * 1000).toFixed(1) + ' mA';
      var brightness = Math.min(1, I / Imax);
      if (I > Imax) {
        if (!wasBurned) explode();     // solo al cruzar el umbral, no cada input
        wasBurned = true;
        ledDot.style.background = '#3a0f0f';
        ledDot.style.boxShadow = 'none';
        readState.textContent = '💥 LED quemado';
        readState.className = 'sim__pill sim__pill--crit';
      } else if (I <= 0) {
        wasBurned = false;
        ledDot.style.background = '#333';
        ledDot.style.boxShadow = 'none';
        readState.textContent = 'sin conducir';
        readState.className = 'sim__pill sim__pill--warn';
      } else {
        wasBurned = false;
        ledDot.style.background = 'rgba(255,177,61,' + (0.3 + 0.7 * brightness) + ')';
        ledDot.style.boxShadow = '0 0 ' + (6 + 24 * brightness) + 'px rgba(255,177,61,0.9)';
        readState.textContent = 'LED OK';
        readState.className = 'sim__pill sim__pill--ok';
      }
    }

    rRange.addEventListener('input', update);
    vRange.addEventListener('input', update);

    var controls = h('div', { class: 'sim__controls' }, [
      h('div', { class: 'sim__control' }, [h('label', {}, ['Resistencia: ', readR]), rRange]),
      h('div', { class: 'sim__control' }, [h('label', {}, ['Voltaje de fuente: ', readV]), vRange]),
      h('div', { class: 'sim__readout' }, [
        h('div', {}, [h('span', { class: 'k' }, ['Corriente por el LED: ']), readI]),
        h('div', {}, [h('span', { class: 'k' }, ['V = I × R  ·  límite seguro ≈ 20 mA'])])
      ]),
      readState
    ]);
    var body = h('div', { class: 'sim__body sim__body--split' }, [controls, stage]);
    container.appendChild(body);
    update();
  };
})();
