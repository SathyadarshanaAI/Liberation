/**
 * ======================================================================
 *  © 2025 Sathyadarshana AI Buddhi – Light of Truth Project
 *  ALL RIGHTS RESERVED – HIGH COPYRIGHT PROTECTION
 *  Unauthorized reproduction, modification, distribution, or reverse
 *  engineering is strictly prohibited.
 * ======================================================================
 */

const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------- Middleware ----------------
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // html, js, css

// ---------------- Geocode API ----------------
app.get('/api/geocode', async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.json({ ok: false, error: "Missing query" });

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, { headers: { "User-Agent": "SathyadarshanaKP/1.0" } });
    const j = await r.json();

    const results = j.map(p => ({
      name: p.display_name,
      lat: parseFloat(p.lat),
      lon: parseFloat(p.lon)
    }));

    res.json({ ok: true, results });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ---------------- Timezone API ----------------
app.get('/api/timezone', async (req, res) => {
  try {
    const { lat, lon, ts } = req.query;
    if (!lat || !lon) return res.json({ ok: false, error: "Missing lat/lon" });

    // Open-Meteo Timezone API
    const url = `https://api.open-meteo.com/v1/timezone?latitude=${lat}&longitude=${lon}&timestamp=${ts || Math.floor(Date.now()/1000)}`;
    const r = await fetch(url);
    const j = await r.json();

    if (!j.utc_offset_seconds) throw new Error("No timezone data");

    res.json({
      ok: true,
      tzid: j.timezone,
      offsetSec: j.utc_offset_seconds
    });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ---------------- Save Report (DB) ----------------
const DB_FILE = path.join(__dirname, 'reports.json');

app.post('/api/saveReport', (req, res) => {
  try {
    const data = req.body;
    if (!data.reportId) return res.json({ ok: false, error: "Missing reportId" });

    let db = [];
    if (fs.existsSync(DB_FILE)) {
      db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
    db.push({ ...data, savedAt: new Date().toISOString() });

    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

    res.json({ ok: true, message: "Report saved" });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// ---------------- Wheel SVG (Demo) ----------------
app.get('/wheel-svg', (req, res) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <circle cx="200" cy="200" r="180" fill="none" stroke="black" stroke-width="2"/>
      ${Array.from({length: 12}).map((_,i)=>{
        const angle = (i/12)*2*Math.PI;
        const x = 200 + 180 * Math.cos(angle);
        const y = 200 + 180 * Math.sin(angle);
        return `<line x1="200" y1="200" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="black"/>`;
      }).join("\n")}
      <text x="180" y="20" font-size="14">KP Wheel (Demo)</text>
    </svg>
  `;
  res.setHeader('Content-Type', 'image/svg+xml');
  res.send(svg);
});

// ---------------- Start ----------------
app.listen(PORT, () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
