/* =========================================================
   DB BEASISWA — Peta ringkasan untuk panel admin (Leaflet)
   AdminMap.overview(el, getPoints, { entity })
     getPoints() → [{ lat, lng, label, html, tone: 'dalam'|'luar'|'negara' }]
   Peta digambar ulang otomatis saat data CRUD berubah.
   ========================================================= */
(function () {
  window.AdminMap = {
    overview: function (el, getPoints, opts) {
      opts = opts || {};
      if (typeof el === 'string') el = document.querySelector(el);
      if (!el || typeof L === 'undefined') return null;

      var map = L.map(el, { scrollWheelZoom: false }).setView([-2.5, 125], 3);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
      }).addTo(map);
      var layer = L.layerGroup().addTo(map);

      function render() {
        layer.clearLayers();
        var bounds = L.latLngBounds();
        getPoints().forEach(function (p) {
          if (p.lat === '' || p.lat === null || p.lat === undefined || isNaN(Number(p.lat))) return;
          var ll = [Number(p.lat), Number(p.lng)];
          var icon = L.divIcon({
            className: '',
            html: '<div class="gis-marker ' + (p.tone || 'dalam') + '">' + (p.label !== undefined ? p.label : '') + '</div>',
            iconSize: [34, 34],
            iconAnchor: [17, 17]
          });
          var m = L.marker(ll, { icon: icon });
          if (p.html) m.bindPopup(p.html);
          layer.addLayer(m);
          bounds.extend(ll);
        });
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40], maxZoom: opts.maxZoom || 6 });
      }

      render();
      window.addEventListener('crud:changed', function (e) {
        if (!opts.entities || opts.entities.indexOf(e.detail.entity) !== -1) render();
      });
      setTimeout(function () { map.invalidateSize(); }, 100);
      return { map: map, render: render };
    }
  };
})();
