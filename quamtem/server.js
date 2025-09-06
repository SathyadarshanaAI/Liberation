const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/horizons', async (req, res) => {
  try {
    const { date, time, lat, lon } = req.query;

    if (!date || !time || !lat || !lon) {
      return res.status(400).json({ error: "Missing parameters (date, time, lat, lon)" });
    }

    // NASA Horizons expects longitude first, then latitude
    const SITE_COORD = `${lon},${lat},0`;
    const START_TIME = `${date} ${time}`;
    const STOP_TIME = `${date} ${time}`;

    const base = 'https://ssd.jpl.nasa.gov/api/horizons.api';
    const params = new URLSearchParams({
      format: 'json',
      COMMAND: "10,199,299,399,499,599,699,799,899,999",
      CENTER: "coord@399",
      SITE_COORD,
      START_TIME,
      STOP_TIME,
      STEP_SIZE: "1 d",
      QUANTITIES: "1,20,23"
    });

    const url = `${base}?${params.toString()}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'TermuxProxy/1.0' } });
    const data = await r.json();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
