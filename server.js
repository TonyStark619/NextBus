const express = require('express');
const http = require('http');
const net = require('net');
const cors = require('cors');
const fetch = require('node-fetch');
const { Server } = require('socket.io');
const { startBusSimulation } = require('./sim/busSimulator');
const { stops, lines, generateUpcomingTimes } = require('./data/stops');
const path = require('path'); // <-- import path

// 1️⃣ Initialize app FIRST
const app = express();

// 2️⃣ Serve frontend AFTER app is initialized
app.use(express.static(path.join(__dirname, '../client')));

// 3️⃣ Catch-all route to serve index.html for unknown routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// 4️⃣ Then all other middlewares / APIs
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:620' }));
app.use(express.json());
