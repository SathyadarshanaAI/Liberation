const express = require('express');
const fetch = require('node-fetch'); // Make sure to install node-fetch v2: npm i node-fetch@2

const app = express();
const PORT = 8080; // Port variable changed here

// CORS (for browser fetch)
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
    const COMMAND = "10,199,299,301,499,599,699,799,899,999";
    const base = 'https://ssd.jpl.nasa.gov/api/horizons.api';
    const SITE_COORD = `${lon},${lat},0`;
    const START_TIME = `${date} ${time}`;
    const STOP_TIME = `${date} ${time}`;
    const params = new URLSearchParams({
      format: 'json',
      COMMAND,
      CENTER: 'coord@399',
      SITE_COORD,
      START_TIME,
      STOP_TIME,
      STEP_SIZE: '1 d',
      QUANTITIES: '1,20,23'
    });
    const url = `${base}?${params.toString()}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'KP-Chart-Proxy' } });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// If running on Termux/Android, use '0.0.0.0' as host sometimes:
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy server running on port ${PORT}`);
});
