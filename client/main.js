const SERVER_ORIGIN = localStorage.getItem('server_origin') || (import.meta.env && import.meta.env.SERVER_ORIGIN) || window.location.origin;

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Map preview on homepage
const map = L.map('map', { zoomControl: false });
L.control.zoom({ position: 'bottomright' }).addTo(map);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

const cityCenters = {
  bengaluru: [12.9716, 77.5946],
  mumbai: [19.0760, 72.8777],
  delhi: [28.6139, 77.2090],
  chennai: [13.0827, 80.2707],
  kolkata: [22.5726, 88.3639],
  hyderabad: [17.3850, 78.4867],
  ahmedabad: [23.0225, 72.5714],
  jaipur: [26.9124, 75.7873],
  bhopal: [23.2599, 77.4126],
};
map.setView(cityCenters['bengaluru'], 13);

let fromPoint = null;
let toPoint = null;
let userMarker = null;

const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const routeBtn = document.getElementById('route');
const locateBtn = document.getElementById('locate-me');

// Geolocation
locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) return alert("Geolocation not supported");
  locateBtn.disabled = true;
  navigator.geolocation.getCurrentPosition(async (pos) => {
    try {
      const { latitude, longitude } = pos.coords;
      console.log('Getting location data for:', latitude, longitude);
      const res = await fetch(`${SERVER_ORIGIN}/reverse?lat=${latitude}&lon=${longitude}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      fromPoint = { lat: latitude, lon: longitude, name: data.displayName || 'My Location' };
      fromInput.value = fromPoint.name;

      if (userMarker) userMarker.remove();
      userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup('You are here');
      map.setView([latitude, longitude], 15);
      locateBtn.disabled = false;
    } catch (error) {
      console.error('Geolocation error:', error);
      alert('Failed to get location data. Please try again.');
      locateBtn.disabled = false;
    }
  }, (error) => {
    console.error('Geolocation error:', error);
    alert('Failed to get your location. Please check location permissions.');
    locateBtn.disabled = false;
  }, { enableHighAccuracy: true });
});

// Route button
routeBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  try {
    if (!fromPoint && fromInput.value.trim()) {
      console.log('Geocoding from location:', fromInput.value.trim());
      const r = await fetch(`${SERVER_ORIGIN}/geocode?q=${encodeURIComponent(fromInput.value.trim())}`);
      if (!r.ok) throw new Error(`Geocoding failed: HTTP ${r.status}`);
      const data = await r.json();
      if (data[0]) fromPoint = { lat: data[0].lat, lon: data[0].lon, name: data[0].displayName };
    }
    if (!toPoint && toInput.value.trim()) {
      console.log('Geocoding to location:', toInput.value.trim());
      const r = await fetch(`${SERVER_ORIGIN}/geocode?q=${encodeURIComponent(toInput.value.trim())}`);
      if (!r.ok) throw new Error(`Geocoding failed: HTTP ${r.status}`);
      const data = await r.json();
      if (data[0]) toPoint = { lat: data[0].lat, lon: data[0].lon, name: data[0].displayName };
    }
    if (!fromPoint || !toPoint) return alert('Enter both From and Destination');

    // Navigate to map.html
    const q = new URLSearchParams({
      s_lat: fromPoint.lat,
      s_lon: fromPoint.lon,
      e_lat: toPoint.lat,
      e_lon: toPoint.lon,
      s_name: fromPoint.name,
      e_name: toPoint.name,
    }).toString();
    window.location.href = `map.html?${q}`;
  } catch (error) {
    console.error('Route planning error:', error);
    alert('Failed to find locations. Please check your input and try again.');
  }
});
