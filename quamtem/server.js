// server.js — NASA JPL Horizons proxy (CommonJS, Node v22 OK)
// 1) npm init -y
// 2) npm i express node-fetch@2
// 3) node server.js
// 4) GET http://localhost:3000/horizons?utc=2025-09-06T12:00:00Z

const express = require('express');
const fetch = require('node-fetch'); // v2 syntax (CommonJS)
const app = express();
const PORT = process.env.PORT || 3000;

// ---- Planets (JPL IDs) ------------------------------------------
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
  { name: 'Pluto',   id: '999' },
];

// ---- Middleware --------------------------------------------------
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// ---- Helpers -----------------------------------------------------
const degNorm = (d) => ((d % 360) + 360) % 360;
const rad2deg = (r) => r * 180 / Math.PI;

function buildVectorsURL(commandId, utcISO) {
  const u = new URL('https://ssd.jpl.nasa.gov/api/horizons.api');
  u.searchParams.set('format', 'json');
  u.searchParams.set('COMMAND', commandId);
  u.searchParams.set('EPHEM_TYPE', 'VECTORS');
  u.searchParams.set('CENTER', '399');          // Geocentric (Earth center)
  u.searchParams.set('REF_PLANE', 'ECLIPTIC');  // XY in ecliptic plane
  u.searchParams.set('START_TIME', utcISO);
  u.searchParams.set('STOP_TIME', utcISO);
  u.searchParams.set('STEP_SIZE', '1 m');
  u.searchParams.set('CSV_FORMAT', 'TRUE');     // CSV inside JSON `result`
  u.searchParams.set('OBJ_DATA', 'NO');
  return u.toString();
}

function parseXYZFromHorizons(json) {
  const txt = json && (json.result || '');
  if (!txt) return null;
  const lines = txt.split(/\r?\n/).filter(Boolean);

  // find header line that contains X,Y,Z columns
  const hdrIdx = lines.findIndex(l => /(^|,)\s*X\b/i.test(l) && /(^|,)\s*Y\b/i.test(l));
  if (hdrIdx === -1) return null;

  // next non-comment line is the first data row
  let i = hdrIdx + 1;
  while (i < lines.length && lines[i].trim().startsWith('!')) i++;
  const row = lines[i];
  if (!row) return null;

  const hdr = lines[hdrIdx].split(',').map(s => s.trim().toUpperCase());
  const cols = row.split(',').map(s => s.trim());
  const ix = hdr.indexOf('X'), iy = hdr.indexOf('Y'), iz = hdr.indexOf('Z');
  const x = parseFloat(cols[ix]);
  const y = parseFloat(cols[iy]);
  const z = parseFloat(cols[iz]);
  if (![x, y, z].every(Number.isFinite)) return null;
  return { x, y, z };
}

// ---- Routes ------------------------------------------------------
app.get('/horizons', async (req, res) => {
  try {
    const { utc } = req.query;

    if (!utc || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(utc)) {
      return res.status(400).json({ error: "Pass ?utc=YYYY-MM-DDTHH:mm[:ss]Z (e.g., 2025-09-06T12:00:00Z)" });
    }

    const out = [];

    for (const body of PLANETS) {
      const url = buildVectorsURL(body.id, utc);

      // NOTE: await is inside this async route → valid in CommonJS
      const r = await fetch(url, {
        headers: { 'User-Agent': 'Sathyadarshana-KP/1.0 (contact: sathyadarshana2025@gmail.com)' },
        timeout: 30000
      });

      if (!r.ok) {
        out.push({ name: body.name, error: `HTTP ${r.status}` });
        continue;
      }

      const j = await r.json();
      const xyz = parseXYZFromHorizons(j);
      if (!xyz) {
        out.push({ name: body.name, error: 'Parse error' });
        continue;
      }

      // geocentric ecliptic longitude from XY
      const lon = degNorm(rad2deg(Math.atan2(xyz.y, xyz.x)));
      out.push({ name: body.name, longitude: lon });
    }

    res.json({ utc, center: 'Geocentric (399)', ref_plane: 'ECLIPTIC', planets: out });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err && err.message || err) });
  }
});

// health
app.get('/', (_, res) => res.type('text').send('OK: /horizons?utc=YYYY-MM-DDTHH:mm[:ss]Z'));

app.listen(PORT, () => {
  console.log(`Horizons proxy running on http://localhost:${PORT}`);
});
