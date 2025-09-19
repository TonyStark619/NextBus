// ========================
// Imports
// ========================
const express = require('express');
const http = require('http');
const net = require('net');
const cors = require('cors');
const fetch = require('node-fetch');
const { Server } = require('socket.io');
const { startBusSimulation } = require('./sim/busSimulator');
const { stops, lines, generateUpcomingTimes } = require('./data/stops');
const path = require('path');

// ========================
// App Initialization
// ========================
const app = express();

const PORT = Number(process.env.PORT) || 619;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*'; // Allow all origins for production

// ========================
// Serve Frontend
// ========================
app.use(express.static(path.join(__dirname, '../client')));

// ========================
// Middlewares
// ========================
app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

// ========================
// Health check
// ========================
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// ========================
// Static stops and lines
// ========================
app.get('/stops', (_req, res) => res.json(stops));
app.get('/lines', (_req, res) => res.json(lines));

// Upcoming times per stop
app.get('/stops/:stopId/times', (req, res) => {
  const stopId = req.params.stopId;
  const serving = lines.filter(l => l.patternStopIds.includes(stopId)).map(l => ({
    lineId: l.id,
    lineName: l.name,
    upcoming: generateUpcomingTimes(l.headwayMinutes, 5),
  }));
  res.json({ stopId, services: serving });
});

// ========================
// Geocoding via Nominatim
// ========================
app.get('/geocode', async (req, res) => {
  try {
    const query = String(req.query.q || '').trim();
    if (!query) return res.status(400).json({ error: 'Missing q parameter' });
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5`;
    const response = await fetch(url, { headers: { 'User-Agent': 'PublicTransportRT/1.0 (demo)' } });
    const data = await response.json();
    res.json(data.map(p => ({ lat: parseFloat(p.lat), lon: parseFloat(p.lon), displayName: p.display_name })));
  } catch (err) {
    res.status(500).json({ error: 'Geocode failed' });
  }
});

app.get('/reverse', async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return res.status(400).json({ error: 'Invalid lat/lon' });
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;
    const response = await fetch(url, { headers: { 'User-Agent': 'PublicTransportRT/1.0 (demo)' } });
    const data = await response.json();
    res.json({ displayName: data.display_name || '' });
  } catch (_err) {
    res.status(500).json({ error: 'Reverse geocode failed' });
  }
});

// ========================
// Routing via OSRM
// ========================
app.get('/route', async (req, res) => {
  try {
    const start = String(req.query.start || '');
    const end = String(req.query.end || '');
    const [sLat, sLon] = start.split(',').map(Number);
    const [eLat, eLon] = end.split(',').map(Number);
    if (![sLat, sLon, eLat, eLon].every(Number.isFinite)) return res.status(400).json({ error: 'Invalid start/end' });

    const url = `https://router.project-osrm.org/route/v1/driving/${sLon},${sLat};${eLon},${eLat}?overview=full&geometries=geojson`;
    const response = await fetch(url);
    const data = await response.json();
    if (!data.routes || !data.routes[0]) return res.status(404).json({ error: 'No route found' });

    const route = data.routes[0];
    res.json({ distanceMeters: route.distance, durationSeconds: route.duration, geometry: route.geometry });
  } catch (_err) {
    res.status(500).json({ error: 'Routing failed' });
  }
});

// ========================
// Socket.IO & Bus Simulator
// ========================
let simulatorStarted = false;

function findAvailablePort(startPort) {
  return new Promise(resolve => {
    const tryPort = (p) => {
      const tester = net.createServer()
        .once('error', (err) => (err.code === 'EADDRINUSE' ? tryPort(p + 1) : tryPort(p + 1)))
        .once('listening', () => { tester.close(() => resolve(p)); })
        .listen(p, '0.0.0.0');
    };
    tryPort(startPort);
  });
}

async function bindServer(startPort) {
  let port = await findAvailablePort(startPort);
  const attempt = () => {
    const server = http.createServer(app);

    const io = new Server(server, { cors: { origin: CLIENT_ORIGIN } });
    const realtimeNamespace = io.of('/realtime');
    realtimeNamespace.on('connection', (socket) => {
      socket.emit('hello', { message: 'Connected to realtime updates' });
    });

    if (!simulatorStarted) {
      startBusSimulation(realtimeNamespace);
      simulatorStarted = true;
    }

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') { port += 1; attempt(); } 
      else { console.error('Server error:', err); process.exit(1); }
    });

    server.listen(port, '0.0.0.0', () => console.log(`Server listening on port ${port}`));
  };
  attempt();
}

// ========================
// Catch-all route for frontend routing
// ========================
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

bindServer(PORT);
