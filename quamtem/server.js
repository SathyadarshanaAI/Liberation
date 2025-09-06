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
    const START_TIME =);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
