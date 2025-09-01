// street-map.js
let marker = null;
const map = L.map('map', {
  zoomControl: false,
  attributionControl: false,
  dragging: true,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  tap: false
}).setView([7.1, 79.9], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map(marker);
  marker = L.marker(e.latlng).addTo(map);
  document.getElementById('lat').value = e.latlng.lat.toFixed(4);
  document.getElementById('lon').value = e.latlng.lng.toFixed(4);
});
