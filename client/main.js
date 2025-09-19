const SERVER_ORIGIN = localStorage.getItem('server_origin') || (import.meta.env && import.meta.env.SERVER_ORIGIN) || 'http://localhost:619';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const map = L.map('map', { zoomControl: false });
L.control.zoom({ position: 'bottomright' }).addTo(map);
const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors',
});
tiles.addTo(map);

// Default view can use saved city center
const defaultCity = localStorage.getItem('city') || 'bengaluru';
const cityCenters = {
  bengaluru: [12.9716, 77.5946], mumbai: [19.0760, 72.8777], delhi: [28.6139, 77.2090], chennai: [13.0827, 80.2707], kolkata: [22.5726, 88.3639], hyderabad: [17.3850, 78.4867], ahmedabad: [23.0225, 72.5714], jaipur: [26.9124, 75.7873], bhopal: [23.2599, 77.4126]
};
map.setView(cityCenters[defaultCity] || [12.9716, 77.5946], 13);

let fromPoint = null; // {lat, lon, name}
let toPoint = null;
let routeLayer = null;
let userMarker = null;
let busMarkers = new Map();

const fromInput = document.getElementById('from');
const toInput = document.getElementById('to');
const routeBtn = document.getElementById('route');
if (!routeBtn) {
  console.error('Route button not found!');
}
const openMapsLink = document.getElementById('open-maps');
const swapBtn = document.getElementById('swap');
const locateBtn = document.getElementById('locate-me');
const routeSummary = document.getElementById('route-summary');
// apply i18n labels if available
import('./i18n.js').then(({ applyTranslations }) => {
  try { applyTranslations(); } catch (_e) {}
}).catch(() => {});

function formatDuration(seconds) {
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return `${h} h ${rm} min`;
}

function setOpenInMapsLink(start, end) {
  // Prefer Google Maps if available; fallback to OSM
  const gmaps = `https://www.google.com/maps/dir/${start.lat},${start.lon}/${end.lat},${end.lon}`;
  openMapsLink.href = gmaps;
}

async function geocode(query) {
  const url = `${SERVER_ORIGIN}/geocode?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Geocode failed');
  return res.json();
}

async function reverseGeocode(lat, lon) {
  const url = `${SERVER_ORIGIN}/reverse?lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  if (!res.ok) return { displayName: '' };
  return res.json();
}

async function fetchRoute(start, end) {
  const url = `${SERVER_ORIGIN}/route?start=${start.lat},${start.lon}&end=${end.lat},${end.lon}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Route failed');
  return res.json();
}

function showSuggestions(containerEl, results, onPick) {
  clearSuggestions(containerEl);
  if (!results || results.length === 0) return;
  const list = document.createElement('div');
  list.className = 'suggestions-list';
  results.forEach((r) => {
    const item = document.createElement('div');
    item.className = 'suggestions-item';
    item.textContent = r.displayName;
    item.addEventListener('click', () => onPick(r));
    list.appendChild(item);
  });
  containerEl.appendChild(list);
}

function clearSuggestions(containerEl) {
  const existing = containerEl.querySelector('.suggestions-list');
  if (existing) existing.remove();
}

async function handleGeolocate() {
  if (!navigator.geolocation) return;
  locateBtn.disabled = true;
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const rev = await reverseGeocode(lat, lon);
    fromPoint = { lat, lon, name: rev.displayName || 'My location' };
    fromInput.value = fromPoint.name;
    if (userMarker) userMarker.remove();
    userMarker = L.marker([lat, lon]).addTo(map).bindPopup('You are here');
    map.setView([lat, lon], 15);
    locateBtn.disabled = false;
  }, () => {
    locateBtn.disabled = false;
  }, { enableHighAccuracy: true });
}

locateBtn.addEventListener('click', handleGeolocate);

// Debounced search for professional auto-suggestions
let searchTimeout;
function debounceSearch(input, callback, delay = 300) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    const value = input.value.trim();
    if (!value) { 
      clearSuggestions(document.getElementById(input.id + '-suggestions')); 
      return; 
    }
    try {
      const results = await geocode(value);
      callback(results, input);
    } catch (err) {
      console.warn('Search failed:', err);
    }
  }, delay);
}

fromInput.addEventListener('input', (e) => {
  debounceSearch(e.target, (results, input) => {
    showSuggestions(document.getElementById('from-suggestions'), results, (r) => {
      fromPoint = { lat: r.lat, lon: r.lon, name: r.displayName };
      input.value = r.displayName;
      clearSuggestions(document.getElementById('from-suggestions'));
      L.marker([r.lat, r.lon]).addTo(map).bindPopup(r.displayName);
      map.setView([r.lat, r.lon], 14);
    });
  });
});

toInput.addEventListener('input', (e) => {
  debounceSearch(e.target, (results, input) => {
    showSuggestions(document.getElementById('to-suggestions'), results, (r) => {
      toPoint = { lat: r.lat, lon: r.lon, name: r.displayName };
      input.value = r.displayName;
      clearSuggestions(document.getElementById('to-suggestions'));
      L.marker([r.lat, r.lon]).addTo(map).bindPopup(r.displayName);
      map.setView([r.lat, r.lon], 14);
    });
  });
});

swapBtn.addEventListener('click', () => {
  const tmp = fromPoint; fromPoint = toPoint; toPoint = tmp;
  const f = fromPoint ? fromPoint.name : '';
  const t = toPoint ? toPoint.name : '';
  fromInput.value = f || '';
  toInput.value = t || '';
});

routeBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  console.log('Find Route button clicked');
  
  // Try to geocode if points are missing
  if (!fromPoint && fromInput.value.trim()) {
    try {
      const r = await geocode(fromInput.value.trim());
      if (r[0]) fromPoint = { lat: r[0].lat, lon: r[0].lon, name: r[0].displayName };
    } catch (e) {
      alert('Could not find location: ' + fromInput.value);
      return;
    }
  }
  if (!toPoint && toInput.value.trim()) {
    try {
      const r = await geocode(toInput.value.trim());
      if (r[0]) toPoint = { lat: r[0].lat, lon: r[0].lon, name: r[0].displayName };
    } catch (e) {
      alert('Could not find location: ' + toInput.value);
      return;
    }
  }
  
  if (!fromPoint || !toPoint) {
    alert('Please enter both From and Destination locations');
    return;
  }
  
  // Navigate to dedicated map page with query params
  const q = new URLSearchParams({
    s_lat: String(fromPoint.lat),
    s_lon: String(fromPoint.lon),
    e_lat: String(toPoint.lat),
    e_lon: String(toPoint.lon),
    s_name: fromPoint.name,
    e_name: toPoint.name,
  }).toString();
  
  console.log('Navigating to map.html with params:', q);
  window.location.href = `map.html?${q}`;
});

// If user types and presses Enter without choosing suggestions, attempt geocode and route
[fromInput, toInput].forEach((el) => {
  el.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      try {
        if (!fromPoint && fromInput.value.trim()) {
          const r = await geocode(fromInput.value.trim());
          if (r[0]) fromPoint = { lat: r[0].lat, lon: r[0].lon, name: r[0].displayName };
        }
        if (!toPoint && toInput.value.trim()) {
          const r = await geocode(toInput.value.trim());
          if (r[0]) toPoint = { lat: r[0].lat, lon: r[0].lon, name: r[0].displayName };
        }
        if (fromPoint && toPoint) routeBtn.click();
      } catch (_e) {}
    }
  });
});

// Realtime buses
const socket = io(`${SERVER_ORIGIN}/realtime`, { transports: ['websocket'] });
socket.on('bus_updates', (updates) => {
  if (localStorage.getItem('show_buses') === 'false') return;
  updates.forEach((u) => {
    let marker = busMarkers.get(u.id);
    if (!marker) {
      marker = L.marker([u.lat, u.lon], {
        icon: L.divIcon({
          className: 'live-bus-marker',
          html: '<div style="font-size:16px;line-height:16px;transform: translate(-2px, -2px);">🚌</div>'
        }),
        title: u.id
      });
      marker.bindTooltip(u.id, { permanent: false, direction: 'top' });
      marker.addTo(map);
      busMarkers.set(u.id, marker);
    } else {
      marker.setLatLng([u.lat, u.lon]);
    }
  });
});


