cat > server.js <<'JS'
// server.js — NASA Horizons proxy (CommonJS, Termux-friendly)
const express = require('express');
const fetch = require('node-fetch'); // v2.x

const app = express();

// ---- CORS (dev) ----
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// ---- 1) Raw pass-through proxy ----
// Example: /horizons?format=json&EPHEM_TYPE=VECTORS&...
app.get('/horizons', async (req, res) => {
  try {
    const base = 'https://ssd-api.jpl.nasa.gov/api/horizons.api';
    const qs = new URLSearchParams(req.query).toString();
    const url = qs ? `${base}?${qs}` : base;

    const r = await fetch(url, { headers: { 'User-Agent': 'QuamtemProxy/1.0' } });
    const contentType = r.headers.get('content-type') || 'text/plain';
    const body = await r.text();
    res.status(r.status).set('Content-Type', contentType).send(body);
  } catch (e) {
    console.error('Horizons proxy error:', e);
    res.status(500).json({ error: String(e && e.message || e) });
  }
});

// ---- Helpers ----
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

const degNorm = d => ((d % 360) + 360) % 360;
const rad2deg = r => r * 180 / Math.PI;

function toHorizonsTime(utcISO) {
  // "2025-09-06T12:00:00Z" -> "2025-09-06 12:00:00"
  const t = String(utcISO).replace('T', ' ').replace(/Z$/, '');
  return /\d{2}:\d{2}:\d{2}$/.test(t) ? t : t + ':00';
}

function buildVectorsURL(id, utcISO) {
  // Geocentric ecliptic XY at a single instant
  const u = new URL('https://ssd-api.jpl.nasa.gov/api/horizons.api');
  u.searchParams.set('format', 'json');
  u.searchParams.set('EPHEM_TYPE', 'VECTORS');
  u.searchParams.set('CENTER', '500@399');       // Earth center (geocentric)
  u.searchParams.set('REF_PLANE', 'ECLIPTIC');   // ecliptic XY
  const t = toHorizonsTime(utcISO);
  u.searchParams.set('START_TIME', t);
  u.searchParams.set('STOP_TIME',  t);
  u.searchParams.set('STEP_SIZE', '1 m');
  u.searchParams.set('CSV_FORMAT', 'YES');       // CSV in JSON .result
  u.searchParams.set('OBJ_DATA', 'NO');
  u.searchParams.set('COMMAND', id);
  return u.toString();
}

function parseXYFromResult(json) {
  const txt = (json && json.result) || '';
  const lines = txt.split(/\r?\n/);
  const headerIx = lines.findIndex(l => /(^|,)\s*X\b/i.test(l) && /(^|,)\s*Y\b/i.test(l));
  if (headerIx < 0) return null;

  let rowIx = headerIx + 1;
  while (rowIx < lines.length && lines[rowIx].trim().startsWith('!')) rowIx++;

  const hdr = lines[headerIx].split(',').map(s => s.trim().toUpperCase());
  const row = (lines[rowIx] || '').split(',').map(s => s.trim());
  const ix = hdr.indexOf('X'), iy = hdr.indexOf('Y');
  const x = parseFloat(row[ix]); const y = parseFloat(row[iy]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

// ---- 2) KP-friendly longitudes (tropical + optional sidereal) ----
// GET /geo-longitudes?utc=YYYY-MM-DDTHH:mm[:ss]Z[&ayan=23.86]
app.get('/geo-longitudes', async (req, res) => {
  try {
    const utc = req.query.utc;
    if (!utc) return res.status(400).json({ error: "use ?utc=YYYY-MM-DDTHH:mm[:ss]Z (UTC)" });
    const ayan = req.query.ayan ? parseFloat(req.query.ayan) : null;

    const planets = await Promise.all(PLANETS.map(async (b) => {
      try {
        const r = await fetch(buildVectorsURL(b.id, utc), { headers: { 'User-Agent': 'QuamtemProxy/1.0' } });
        if (!r.ok) return { name: b.name, error: `HTTP ${r.status}` };
        const j = await r.json();
        const xy = parseXYFromResult(j);
        if (!xy) return { name: b.name, error: 'parse' };
        const lonTropical = degNorm(rad2deg(Math.atan2(xy.y, xy.x)));
        const out = { name: b.name, longitude: lonTropical };
        if (Number.isFinite(ayan)) out.longitude_sidereal = degNorm(lonTropical - ayan);
        return out;
      } catch (err) {
        return { name: b.name, error: String(err && err.message || err) };
      }
    }));

    res.json({ utc, center: 'Geocentric (500@399)', ref_plane: 'ECLIPTIC', planets });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e && e.message || e) });
  }
});

// ---- Start server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Horizons proxy listening at http://localhost:${PORT}`));
JS
