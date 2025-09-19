## CityRide – Real‑Time Public Transport (Small Cities)

Quick start:

1) In one terminal:

```bash
cd server
npm run dev
```

2) In another terminal:

```bash
cd client
npm run dev
```

Open the app at http://localhost:1234

Features:
- Geolocation with permission prompt
- Geocoding and reverse geocoding via Nominatim
- Routing via OSRM public demo
- Real-time simulated buses via WebSockets
- Deep link to Google Maps for navigation
- Responsive UI with Leaflet map

Environment:
- CLIENT_ORIGIN can be set for CORS (default http://localhost:1234)
- SERVER_ORIGIN used by client (set via bundler env or leave default http://localhost:3000)


