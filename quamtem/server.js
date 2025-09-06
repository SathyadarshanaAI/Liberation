// server.js — NASA Horizons proxy (CommonJS, NO await version)
// 1) npm i express node-fetch@2
// 2) node server.js
// 3) test: curl "http://localhost:3000/horizons?utc=2025-09-06T12:00:00Z"

const express = require('express');
const fetch = require('node-fetch'); // v2 (CommonJS)
const app = express();
const PORT = process.env.PORT || 3000;

const PLANETS = [
  { name: 'Sun',     id: '10'  },
  { name: 'Moon',    id: '301' },
  { name: 'Mercury', id: '199' },
  { name: 'Venus',   id: '299' },
  { name: 'Mars',    id: '499' },
  { name: 'Jupiter', id: '599' },
  { name: 'Saturn',  id: '699' },
  { name: 'Uranus',  id: '799' },
  { name: 'Neptune', id: '899' },
  { name: 'Pluto',   id: '999' }
];

app.use((_, res, next) => { res.header('Access-Control-Allow-Origin', '*'); next(); });

const degNorm = d => ((d % 360) + 360) % 360;
const rad2deg = r => r * 180 / Math.PI;

function buildURL(id, utcISO) {
  const u = new URL('https://ssd.jpl.nasa.gov/api/horizons.api');
  u.searchParams.set('format', 'json');
  u.searchParams.set('COMMAND', id);
  u.searchParams.set('EPHEM_TYPE', 'VECTORS');
  u.searchParams.set('CENTER', '399');         // geocentric
  u.searchParams.set('REF_PLANE', 'ECLIPTIC'); // XY in ecliptic
  u.searchParams.set('START_TIME', utcISO);
  u.searchParams.set('STOP_TIME',  utcISO);
  u.searchParams.set('STEP_SIZE', '1 m');
  u.searchParams.set('CSV_FORMAT', 'TRUE');    // CSV in JSON `result`
  u.searchParams.set('OBJ_DATA', 'NO');
  return u.toString();
}

function parseXYZ(json) {
  const txt = json && (json.result || '');
  if (!txt) return null;
  const lines = txt.split(/\r?\n/).filter(Boolean);
  const hi = lines.findIndex(l => /(^|,)\s*X\b/i.test(l) && /(^|,)\s*Y\b/i.test(l));
  if (hi === -1) return null;
  let i = hi + 1; while (i < lines.length && lines[i].trim().startsWith('!')) i++;
  const hdr = lines[hi].split(',').map(s => s.trim().toUpperCase());
  const row = lines[i] || '';
  const cols = row.split(',').map(s => s.trim());
  const ix = hdr.indexOf('X'), iy = hdr.indexOf('Y');
  const x = parseFloat(cols[ix]), y = parseFloat(cols[iy]);
  if (![x,y].every(Number.isFinite)) return null;
  return { x, y };
}

// NOTE: no async/await here — pure Promises
app.get('/horizons', (req, res) => {
  const utc = req.query.utc;
  if (!utc || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(utc)) {
    return res.status(400).json({ error: "Use ?utc=YYYY-MM-DDTHH:mm[:ss]Z" });
  }

  const tasks = PLANETS.map(b => {
    const url = buildURL(b.id, utc);
    return fetch(url, {
      headers: { 'User-Agent': 'TermuxProxy/1.0 (contact: you@example.com)' },
      timeout: 30000
    })
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(j => {
      const xy = parseXYZ(j);
      if (!xy) throw new Error('Parse error');
      const lon = degNorm(rad2deg(Math.atan2(xy.y, xy.x)));
      return { name: b.name, longitude: lon };
    })
    .catch(err => ({ name: b.name, error: String(err.message || err) }));
  });

  Promise.all(tasks)
    .then(planets => res.json({ utc, center: 'Geocentric (399)', ref_plane: 'ECLIPTIC', planets }))
    .catch(err => res.status(500).json({ error: String(err && err.message || err) }));
});

app.get('/', (_, res) => res.type('text').send('OK: /horizons?utc=YYYY-MM-DDTHH:mm[:ss]Z'));

app.listen(PORT, () => {
  console.log(`Horizons proxy running on http://localhost:${PORT}`);
});
