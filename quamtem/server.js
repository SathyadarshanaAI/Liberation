const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.get('/horizons', async (req, res) => {
  try {
    // User input එකෙන් values ගන්න
    const { date, time, lat, lon } = req.query;

    // Missing params check
    if (!date || !time || !lat || !lon) {
      return res.status(400).json({ error: "Missing parameters: date, time, lat, lon are required" });
    }

    // All KP planets: Sun, Mercury, Venus, Moon, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto
    const COMMAND = "10,199,299,399,499,599,699,799,899,999";
    const base = 'https://ssd.jpl.nasa.gov/api/horizons.api';

    // NASA Horizons expects longitude first, then latitude
    const SITE_COORD = `${lon},${ 'YYYY-MM-DD HH:MM'
    const START_TIME = `${date} ${time}`;
    const STOP_TIME = `${date} ${time}`;

    const params = new URLSearchParams({
      format: 'json',
      COMMAND,
      CENTER: 'coord@399',
      SITE_COORD,
      START_TIME,
      STOP headers: { 'User-Agent': 'KP-Chart-Proxy' } });
    const data = await r.json();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Proxy server
