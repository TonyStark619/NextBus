const SERVER_ORIGIN = localStorage.getItem('server_origin') || (import.meta.env && import.meta.env.SERVER_ORIGIN) || 'http://localhost:619';

const url = new URL(window.location.href);
// apply translations if available
try { import('./i18n.js').then(m => m.applyTranslations && m.applyTranslations()); } catch (_e) {}
const s = url.searchParams;
const startLat = parseFloat(s.get('s_lat'));
const startLon = parseFloat(s.get('s_lon'));
const endLat = parseFloat(s.get('e_lat'));
const endLon = parseFloat(s.get('e_lon'));
const startName = s.get('s_name') || 'Start';
const endName = s.get('e_name') || 'Destination';

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const map = L.map('map', { zoomControl: false });
L.control.zoom({ position: 'bottomright' }).addTo(map);
const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
tiles.addTo(map);

let routeLayer = null;
let routeMidLabel = null;
let busMarkers = new Map();
let stopMarkers = [];
let allStops = [];
let summaryControl = null;
let timingsControl = null;

function fitBoundsToPoints(points) {
  const latlngs = points.map((p) => [p.lat, p.lon]);
  const bounds = L.latLngBounds(latlngs);
  map.fitBounds(bounds, { padding: [30, 30] });
}

async function fetchRoute(start, end) {
  const res = await fetch(`${SERVER_ORIGIN}/route?start=${start.lat},${start.lon}&end=${end.lat},${end.lon}`);
  if (!res.ok) throw new Error('route');
  return res.json();
}

async function init() {
  let center = [12.9716, 77.5946];
  if (Number.isFinite(startLat) && Number.isFinite(startLon)) {
    center = [startLat, startLon];
  }
  map.setView(center, 13);

  if (Number.isFinite(startLat) && Number.isFinite(startLon) && Number.isFinite(endLat) && Number.isFinite(endLon)) {
    const start = { lat: startLat, lon: startLon, name: startName };
    const end = { lat: endLat, lon: endLon, name: endName };
    const data = await fetchRoute(start, end);
    const coords = data.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
    routeLayer = L.polyline(coords, { color: '#22c55e', weight: 6 }).addTo(map);
    fitBoundsToPoints([{ lat: startLat, lon: startLon }, { lat: endLat, lon: endLon }]);
    L.marker([startLat, startLon]).addTo(map).bindPopup(startName);
    L.marker([endLat, endLon]).addTo(map).bindPopup(endName);

    // Distance/time summary control
    const km = (data.distanceMeters / 1000).toFixed(1);
    const mins = Math.round(data.durationSeconds / 60);
    if (!summaryControl) {
      summaryControl = L.control({ position: 'topright' });
      summaryControl.onAdd = function () {
        const div = L.DomUtil.create('div', 'leaflet-bar');
        div.style.padding = '8px 10px';
        div.style.background = '#0e1726';
        div.style.border = '1px solid #1f2a3a';
        div.style.borderRadius = '8px';
        div.style.color = '#e5efff';
        div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        div.id = 'route-stats';
        div.innerHTML = `<strong>${km} km</strong> · ${mins} min`;
        return div;
      };
      summaryControl.addTo(map);
    } else {
      const el = document.getElementById('route-stats');
      if (el) el.innerHTML = `<strong>${km} km</strong> · ${mins} min`;
    }

    // Midpoint label on route showing distance
    if (routeMidLabel) routeMidLabel.remove();
    const midIdx = Math.floor(coords.length / 2);
    routeMidLabel = L.marker(coords[midIdx], {
      icon: L.divIcon({
        className: 'route-distance-label',
        html: `<div style="background:#0e1726;color:#e5efff;border:1px solid #1f2a3a;padding:4px 6px;border-radius:6px;font-size:12px;">${km} km</div>`
      })
    }).addTo(map);

    // Show bus timings for nearest stops to start/end
    try {
      if (!allStops.length) {
        const r = await fetch(`${SERVER_ORIGIN}/stops`);
        if (r.ok) allStops = await r.json();
      }
      const nearest = (lat, lon) => {
        let best = null; let bestD = Infinity;
        allStops.forEach(st => {
          const d = Math.hypot(st.lat - lat, st.lon - lon);
          if (d < bestD) { bestD = d; best = st; }
        });
        return best;
      };
      const startStop = nearest(startLat, startLon);
      const endStop = nearest(endLat, endLon);
      const [ts1, ts2] = await Promise.all([
        fetch(`${SERVER_ORIGIN}/stops/${startStop.id}/times`).then(r=>r.ok?r.json():{services:[]}),
        fetch(`${SERVER_ORIGIN}/stops/${endStop.id}/times`).then(r=>r.ok?r.json():{services:[]}),
      ]);
      const renderTimes = (label, data) => {
        const items = (data.services || []).slice(0,3).map(sv => {
          const times = (sv.upcoming||[]).slice(0,3).map(t => new Date(t).toLocaleTimeString()).join(', ');
          return `<div style="margin:4px 0"><strong>${sv.lineName}:</strong> <span style="font-size:12px;color:#9fb3ca">${times}</span></div>`;
        }).join('') || '<div style="font-size:12px;color:#9fb3ca">No data</div>';
        return `<div style="margin-bottom:8px"><div style="font-weight:600;margin-bottom:4px">${label}</div>${items}</div>`;
      };
      if (!timingsControl) {
        timingsControl = L.control({ position: 'bottomleft' });
        timingsControl.onAdd = function() {
          const div = L.DomUtil.create('div', 'leaflet-bar');
          div.style.padding = '10px';
          div.style.background = '#0e1726';
          div.style.border = '1px solid #1f2a3a';
          div.style.borderRadius = '8px';
          div.style.color = '#e5efff';
          div.style.minWidth = '220px';
          div.id = 'timings-panel';
          div.innerHTML =
            renderTimes(`Near ${startName}`, ts1) +
            renderTimes(`Near ${endName}`, ts2);
          return div;
        };
        timingsControl.addTo(map);
      } else {
        const el = document.getElementById('timings-panel');
        if (el) el.innerHTML = renderTimes(`Near ${startName}`, ts1) + renderTimes(`Near ${endName}`, ts2);
      }
    } catch (_e) {}
  }
}

// realtime buses
const socket = io(`${SERVER_ORIGIN}/realtime`, { transports: ['websocket'] });
socket.on('bus_updates', (updates) => {
  updates.forEach((u) => {
    let marker = busMarkers.get(u.id);
    if (!marker) {
      marker = L.marker([u.lat, u.lon], {
        icon: L.divIcon({
          className: 'live-bus-marker',
          html: '<div style="font-size:16px;line-height:16px;transform: translate(-2px, -2px);">🚌</div>',
          iconSize: [16, 16]
        ]),
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

init();

// stops and times with enhanced display
async function loadStops() {
  const res = await fetch(`${SERVER_ORIGIN}/stops`);
  if (!res.ok) return;
  const stops = await res.json();
  allStops = stops;
  stopMarkers.forEach(m => m.remove());
  stopMarkers = stops.map((s) => {
    const m = L.marker([s.lat, s.lon], {
      icon: L.divIcon({
        className: 'bus-stop-marker',
        html: '<div style="background:#ff6b35;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;">🚌</div>',
        iconSize: [20, 20]
      })
    });
    m.on('click', async () => {
      const r = await fetch(`${SERVER_ORIGIN}/stops/${s.id}/times`);
      const data = r.ok ? await r.json() : { services: [] };
      const html = [
        `<div style="font-weight:bold;margin-bottom:8px;">${s.name}</div>`,
        `<div style="font-size:12px;color:#666;margin-bottom:8px;">${s.city}, ${s.state}</div>`,
        '<div style="font-weight:bold;margin-bottom:4px;">Next Arrivals:</div>'
      ].concat(data.services.map(sv => 
        `<div style="margin:4px 0;padding:4px;background:#f0f0f0;border-radius:4px;">
          <strong>${sv.lineName}</strong><br/>
          <span style="font-size:11px;">${sv.upcoming.slice(0,3).map(t=> new Date(t).toLocaleTimeString()).join(', ')}</span>
        </div>`
      )).join('');
      m.bindPopup(html, { maxWidth: 300 }).openPopup();
    });
    m.addTo(map);
    return m;
  });
}

loadStops();


