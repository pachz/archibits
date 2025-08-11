// Initialize Leaflet map using OpenStreetMap tiles
(function () {
  var centerLat = 40.712775;
  var centerLng = -74.005973;
  var zoomLevel = 10;

  function initializeLeaflet() {
    if (!document.getElementById('map')) return;

    var map = L.map('map', {
      scrollWheelZoom: false
    }).setView([centerLat, centerLng], zoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    var icon = L.icon({
      iconUrl: 'images/locating.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    L.marker([centerLat, centerLng], { icon: icon }).addTo(map);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initializeLeaflet();
  } else {
    window.addEventListener('load', initializeLeaflet);
  }
})();