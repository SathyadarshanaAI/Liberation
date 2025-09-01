<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script>
document.addEventListener("DOMContentLoaded", function() {
  var map = L.map('map').setView([7.1, 79.9], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  var marker = null;
  map.on('click', function(e) {
    var lat = e.latlng.lat.toFixed(6);
    var lon = e.latlng.lng.toFixed(6);
    document.getElementById('lat').value = lat;
    document.getElementById('lon').value = lon;

    if(!marker) {
      marker = L.marker(e.latlng, {draggable:true}).addTo(map);
      marker.on('dragend', function(ev) {
        var pos = marker.getLatLng();
        document.getElementById('lat').value = pos.lat.toFixed(6);
        document.getElementById('lon').value = pos.lng.toFixed(6);
      });
    } else {
      marker.setLatLng(e.latlng);
    }
  });
});
</script>
