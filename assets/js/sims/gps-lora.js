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

  function toByteHex(n) { return ('0' + (n & 0xff).toString(16)).slice(-2).toUpperCase(); }

  window.TelemetrySims['gps-lora'] = function (container) {
    var reduced = window.TelemetrySims._util && window.TelemetrySims._util.reducedMotion();
    var baseLat = 19.4326, baseLon = -99.1332;
    var t = 0;

    var nmea = h('code', { class: 'formula', style: 'font-size:0.8rem;' }, ['$GPGGA,...']);
    var packet = h('code', { class: 'formula', style: 'font-size:0.8rem;' }, ['--']);
    var rateNote = h('div', { class: 'sim__readout' }, [
      h('div', {}, [h('span', { class: 'k' }, ['Ruta @5Hz · Estado @1Hz — protocolo binario'])])
    ]);

    var svgNS = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 200 120');
    svg.setAttribute('width', '100%');
    var track = document.createElementNS(svgNS, 'path');
    track.setAttribute('d', 'M20 60 C 40 10, 160 10, 180 60 S 40 110, 20 60 Z');
    track.setAttribute('fill', 'none');
    track.setAttribute('stroke', '#24304A');
    track.setAttribute('stroke-width', '2');
    var dot = document.createElementNS(svgNS, 'circle');
    dot.setAttribute('r', '4');
    dot.setAttribute('fill', '#FFB13D');
    svg.appendChild(track); svg.appendChild(dot);

    function fmt(n, dec) { return n.toFixed(dec); }

    var raf;
    function frame() {
      t += 0.02;
      var len = track.getTotalLength();
      var p = track.getPointAtLength((t % 1) * len);
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      var lat = baseLat + (p.y - 60) * 0.0002;
      var lon = baseLon + (p.x - 100) * 0.0002;
      var speed = (20 + 10 * Math.sin(t * 3)).toFixed(0);
      nmea.textContent = '$GPGGA,123519,' + fmt(Math.abs(lat) * 100, 3) + ',N,' +
        fmt(Math.abs(lon) * 100, 3) + ',W,1,08,0.9,545.4,M*47';
      var bytes = [];
      var latI = Math.round(lat * 1e5), lonI = Math.round(lon * 1e5);
      [24, 16, 8, 0].forEach(function (s) { bytes.push(toByteHex(latI >> s)); });
      [24, 16, 8, 0].forEach(function (s) { bytes.push(toByteHex(lonI >> s)); });
      bytes.push(toByteHex(parseInt(speed, 10)));
      packet.textContent = bytes.join(' ');
      if (!reduced) raf = requestAnimationFrame(frame);
    }

    var stage = h('div', { class: 'sim__stage' }, [svg]);
    var readouts = h('div', { class: 'sim__controls' }, [
      h('div', { class: 'sim__control' }, [h('label', {}, ['Sentencia NMEA (GPS)']), nmea]),
      h('div', { class: 'sim__control' }, [h('label', {}, ['Paquete LoRa de estado (hex)']), packet]),
      rateNote
    ]);
    container.appendChild(h('div', { class: 'sim__body sim__body--split' }, [readouts, stage]));

    frame();
    if (reduced && raf) cancelAnimationFrame(raf);
  };
})();
