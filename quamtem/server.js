// server.js
const express = require('express');

const app = express();
const PORT = 3000;

// Enable CORS (dev only)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/horizons', async (req, res) => {
  try {
    const { date, time, lat, lon } = req.query;

    if (!date || !time || !lat || !lon) {
      return res.status(400).json({ error: "Missing parameters: date, time, lat, lon are required" });
    }

    const base = 'https://ssd.jpl.nasa.gov/api/horizons.api';

    const params = new URLSearchParams({
      format: 'json',
      COMMAND: '10,199,299,301,499,599,699,799,899,999', // Sun..Pluto + Moon
      OBJ_DATA: 'NO',
      MAKE_EPHEM: 'YES',
      EPHEM_TYPE: 'OBSERVER',
      CENTER: 'coord@399',
      SITE_COORD: `${lon},${lat},0`,
      START_TIME: `${date} ${time}`,
      STOP_TIME: `${date} ${time}`,
      STEP_SIZE: '1 d',
      QUANTITIES: '1'
    });

    const url = `${base}?${params.toString()}`;

    const r = await fetch(url, { headers: { 'User-Agent': 'KP-Chart-Proxy' } });
    const data = await r.json();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
});
