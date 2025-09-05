const express = require('express');
const fetch = require('node-fetch'); // Install: npm i node-fetch@2

const app = express();
const PORT = 3000;

// Enable CORS (optional)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/horizons', async (req, res) => {
  try {
    const base = 'https://ssd.jpl.nasa.gov/api/horizons.api';
    const params = new URLSearchParams({
      format: 'json',
      COMMAND: '399',
      CENTER: 'coord@399',
      SITE_COORD: '79.8612,6.9271,0',
      START_TIME: '2025-09-03 00:00',
      STOP_TIME: '2025-09-03 23:59',
      STEP_SIZE: '1 d',
      QUANTITIES: '1,20,23'
    });

    const url = `${base}?${params.toString()}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'Termux-Proxy' } });
    const data = await r.json();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});
