const SERVER_ORIGIN = 'https://your-backend-domain.com';

const urlParams = new URLSearchParams(window.location.search);
const start = { lat: parseFloat(urlParams.get('s_lat')), lon: parseFloat(urlParams.get('s_lon')), name: urlParams.get('s_name') };
const end = { lat: parseFloat(urlParams.get('e_lat')), lon: parseFloat(urlParams.get('e_lon')), name: urlParams.get('e_name') };

const map = L.map('map').setView([start.lat, start.lon], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

let routeLayer = null;

// Draw route
async function drawRoute() {
  const res = await fetch(`${SERVER_ORIGIN}/route?start=${start.lat},${start.lon}&end=${end.lat},${end.lon}`);
  const data = await res.json();
  if (!data.geometry) return alert('Route not found');
  if (routeLayer) routeLayer.remove();
  routeLayer = L.geoJSON(data.geometry, { style: { color: 'blue', weight: 5 } }).addTo(map);
  map.fitBounds(routeLayer.getBounds());
}
drawRoute();

// Add start & end markers
L.marker([start.lat, start.lon]).addTo(map).bindPopup('Start: ' + start.name).openPopup();
L.marker([end.lat, end.lon]).addTo(map).bindPopup('End: ' + end.name);

// Realtime buses
const busMarkers = new Map();
const socket = io(`${SERVER_ORIGIN}/realtime`, { transports: ['websocket'] });
socket.on('bus_updates', (updates) => {
  updates.forEach(u => {
    let marker = busMarkers.get(u.id);
    if (!marker) {
      marker = L.marker([u.lat, u.lon], {
        icon: L.divIcon({ className: 'live-bus-marker', html: '🚌', iconSize: [20, 20] }),
      }).addTo(map);
      busMarkers.set(u.id, marker);
    } else {
      marker.setLatLng([u.lat, u.lon]);
    }
  });
});
