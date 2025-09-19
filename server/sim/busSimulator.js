function interpolate(a, b, t) {
  return a + (b - a) * t;
}

function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function createRouteWaypoints(city) {
  // Realistic routes for major Indian cities
  const routes = {
    bengaluru: [
      { lat: 12.9716, lon: 77.5946 }, // Majestic
      { lat: 12.8456, lon: 77.6603 }, // Electronic City
      { lat: 12.9698, lon: 77.7500 }, // Whitefield
      { lat: 12.9352, lon: 77.6245 }, // Koramangala
      { lat: 12.9719, lon: 77.6412 }, // Indiranagar
      { lat: 12.9716, lon: 77.5946 }, // Back to Majestic
    ],
    mumbai: [
      { lat: 18.9398, lon: 72.8355 }, // CST
      { lat: 19.0596, lon: 72.8295 }, // BKC
      { lat: 19.1136, lon: 72.8697 }, // Andheri
      { lat: 19.1176, lon: 72.9060 }, // Powai
      { lat: 19.2183, lon: 72.9781 }, // Thane
      { lat: 18.9398, lon: 72.8355 }, // Back to CST
    ],
    delhi: [
      { lat: 28.6315, lon: 77.2167 }, // CP
      { lat: 28.6517, lon: 77.1909 }, // Karol Bagh
      { lat: 28.5679, lon: 77.2431 }, // Lajpat Nagar
      { lat: 28.7434, lon: 77.0670 }, // Rohini
      { lat: 28.5921, lon: 77.0465 }, // Dwarka
      { lat: 28.6315, lon: 77.2167 }, // Back to CP
    ],
    chennai: [
      { lat: 13.0827, lon: 80.2707 }, // Central
      { lat: 13.0418, lon: 80.2341 }, // T. Nagar
      { lat: 13.0878, lon: 80.2200 }, // Anna Nagar
      { lat: 12.9816, lon: 80.2200 }, // Velachery
      { lat: 12.9246, lon: 80.1470 }, // Tambaram
      { lat: 13.0827, lon: 80.2707 }, // Back to Central
    ],
    kolkata: [
      { lat: 22.5851, lon: 88.3468 }, // Howrah
      { lat: 22.5525, lon: 88.3632 }, // Park Street
      { lat: 22.5937, lon: 88.4095 }, // Salt Lake
      { lat: 22.5804, lon: 88.4634 }, // New Town
      { lat: 22.6253, lon: 88.4200 }, // Dum Dum
      { lat: 22.5851, lon: 88.3468 }, // Back to Howrah
    ],
    hyderabad: [
      { lat: 17.4399, lon: 78.4983 }, // Secunderabad
      { lat: 17.4474, lon: 78.3563 }, // HITEC
      { lat: 17.4399, lon: 78.3484 }, // Gachibowli
      { lat: 17.4065, lon: 78.4772 }, // Banjara Hills
      { lat: 17.3616, lon: 78.4747 }, // Charminar
      { lat: 17.4399, lon: 78.4983 }, // Back to Secunderabad
    ],
    ahmedabad: [
      { lat: 23.0225, lon: 72.5714 }, // Kalupur
      { lat: 23.0068, lon: 72.6120 }, // Maninagar
      { lat: 23.0225, lon: 72.5400 }, // Vastrapur
      { lat: 23.0225, lon: 72.5400 }, // Bodakdev
      { lat: 23.0700, lon: 72.6500 }, // Naroda
      { lat: 23.0225, lon: 72.5714 }, // Back to Kalupur
    ],
    jaipur: [
      { lat: 26.9124, lon: 75.7873 }, // Pink City
      { lat: 26.9124, lon: 75.7873 }, // Vaishali Nagar
      { lat: 26.9124, lon: 75.7873 }, // C-Scheme
      { lat: 26.9124, lon: 75.7873 }, // Malviya Nagar
      { lat: 26.9124, lon: 75.7873 }, // Sitapura
      { lat: 26.9124, lon: 75.7873 }, // Back to Pink City
    ],
    bhopal: [
      { lat: 23.2599, lon: 77.4126 }, // TT Nagar
      { lat: 23.2467, lon: 77.4338 }, // New Market
      { lat: 23.2315, lon: 77.4020 }, // Habibganj
      { lat: 23.2156, lon: 77.4100 }, // MP Nagar
      { lat: 23.2599, lon: 77.4126 }, // Back to TT Nagar
    ],
  };
  return routes[city] || routes.bengaluru;
}

function startBusSimulation(ioNamespace) {
  const cities = ['bengaluru','delhi','mumbai','kolkata','chennai','hyderabad','ahmedabad','jaipur','bhopal'];
  const buses = [];
  cities.forEach((city) => {
    const route = createRouteWaypoints(city);
    const count = city === 'bhopal' ? 100 : 5;
    for (let i = 0; i < count; i++) { // More buses per city
      buses.push({
        id: `${city.toUpperCase()}-${i + 1}`,
        route,
        segmentIndex: Math.floor(Math.random() * (route.length - 1)),
        progress: Math.random(),
        speedMps: 5 + Math.random() * 6, // 18-40 km/h
        city: city,
      });
    }
  });

  setInterval(() => {
    const updates = buses.map((bus) => {
      const a = bus.route[bus.segmentIndex];
      const b = bus.route[(bus.segmentIndex + 1) % bus.route.length];
      const segmentMeters = haversineDistanceMeters(a.lat, a.lon, b.lat, b.lon);
      const dt = 1; // seconds per tick
      const delta = bus.speedMps * dt;
      const segmentProgressMeters = bus.progress * segmentMeters + delta;
      let t = segmentProgressMeters / segmentMeters;
      if (t >= 1) {
        bus.segmentIndex = (bus.segmentIndex + 1) % bus.route.length;
        bus.progress = 0;
      } else {
        bus.progress = t;
      }
      const start = bus.route[bus.segmentIndex];
      const end = bus.route[(bus.segmentIndex + 1) % bus.route.length];
      const lat = interpolate(start.lat, end.lat, bus.progress);
      const lon = interpolate(start.lon, end.lon, bus.progress);
      return { id: bus.id, lat, lon, speedMps: bus.speedMps };
    });
    ioNamespace.emit('bus_updates', updates);
  }, 1000);
}

module.exports = { startBusSimulation };


