// server.js — NASA JPL Horizons proxy (Node.js + Express)
// Usage:
//   1) npm init -y && npm i express node-fetch@2
//   2) node server.js
//   3) GET http://localhost:3000/horizons?utc=2025-09-06T12:00:00Z
//
// Returns example:
// { planets: [ {name:"Sun", longitude:121.23}, ... ] }

const express = require('express');
const fetch = require('node-fetch'); // v2
const app = express();
const PORT = process.env.PORT || 3000;

// ---- Config ------------------------------------------------------
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

// Helpful CORS for browser dev
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// ---- Helpers -----------------------------------------------------
function degNorm(deg) {
  let x = deg % 360;
  if (x < 0) x += 360;
  return x;
}
function rad2deg(r) { return r * 180 / Math.PI; }

// Build a Horizons API URL for one object, returning **vectors** relative to Earth,
// ecliptic reference plane, at a single instant (START=STOP=utc, STEP=1 m).
function buildVectorsURL(commandId, utcISO) {
  const p = new URL('https://ssd.jpl.nasa.gov/api/horizons.api');
  // See API docs: COMMAND, EPHEM_TYPE=VECTORS, CENTER, REF_PLANE, START_TIME, STOP_TIME, STEP_SIZE, CSV_FORMAT
  // Response -> JSON: { result: "...CSV..." } OR { vectors: [...] } depending on format.
  p.searchParams.set('format', 'json');
  p.searchParams.set('COMMAND', commandId);
  p.searchParams.set('EPHEM_TYPE', 'VECTORS');
  // Geocentric:
  p.searchParams.set('CENTER', '399'); // Earth center (399). (Topocentric would use coord@399 + SITE_COORD)
  // Put vectors in ecliptic plane so XY lie in ecliptic:
  p.searchParams.set('REF_PLANE', 'ECLIPTIC'); // alternatives: FRAME
  // Single timestamp window
  p.searchParams.set('START_TIME', utcISO);
  p.searchParams.set('STOP_TIME', utcISO);
  p.searchParams.set('STEP_SIZE', '1 m');
  // Cleaner parse
  p.searchParams.set('CSV_FORMAT', 'TRUE'); // we'll parse CSV in the JSON "result" field
  p.searchParams.set('OBJ_DATA', 'NO');     // smaller payload
  return p.toString();
}

// Parse Horizons JSON (CSV inside) -> { x,y,z }
function parseXYZFromHorizons(json) {
  // When format=json & CSV_FORMAT=TRUE, Horizons returns { "signature":..., "result": "CSV text" }
  // We find the line with labels X, Y, Z and read the next data line(s).
  const txt = json && (json.result || json['data'] || '');
  if (!txt || typeof txt !== 'string') return null;

  const lines = txt.split(/\r?\n/).filter(Boolean);
  // Find header line starting with "X" or containing "X ("
  const hdrIdx = lines.findIndex(l => /(^|,)\s*X\b/i.test(l) && /(^|,)\s*Y\b/i.test(l));
  if (hdrIdx === -1 || hdrIdx+1 >= lines.length) return null;

  // The next non-comment line should be the first data row
  let i = hdrIdx + 1;
  while (i < lines.length && lines[i].trim().startsWith('!')) i++;
  const row = lines[i];
  if (!row) return null;

  // Split CSV (values like " 1.234567890E+03")
  const cols = row.split(',').map(c => c.trim());
  // Find indices of X,Y,Z from header:
  const hdr = lines[hdrIdx].split(',').map(h => h.trim().toUpperCase());
  const ix = hdr.findIndex(h => h === 'X');
  const iy = hdr.findIndex(h => h === 'Y');
  const iz = hdr.findIndex(h => h === 'Z');

  const x = parseFloat(cols[ix]);
  const y = parseFloat(cols[iy]);
  const z = parseFloat(cols[iz]);
  if (![x,y,z].every(Number.isFinite)) return null;
  return { x, y, z };
}

// Compute **geocentric ecliptic longitude** from ecliptic XY:
function eclipticLongitudeDeg(x, y) {
  return degNorm(rad2deg(Math.atan2(y, x)));
}

// ---- API route ---------------------------------------------------
app.get('/horizons', async (req, res) => {
  try {
    let { utc } = req.query;

    // If user passes local date/time + tz, you could compute UTC here.
    if (!utc) {
      return res.status(400).json({ error: "Missing 'utc' query (ISO), e.g. 2025-09-06T12:00:00Z" });
    }
    // Basic sanity
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(utc)) {
      return res.status(400).json({ error: "utc must be ISO like 2025-09-06T12:00:00Z" });
    }

    const results = [];
    for (const body of PLANETS) {
      const url = buildVectorsURL(body.id, utc);
      const r = await fetch(url, {
        headers: {
          // Identify yourself per JPL guidance
          'User-Agent': 'Sathyadarshana-KP/1.0 (contact: sathyadarshana2025@gmail.com)'
        },
        timeout: 30000
      });
      if (!r.ok) {
        results.push({ name: body.name, error: `HTTP ${r.status}` });
        continue;
      }
      const j = await r.json();
      const xyz = parseXYZFromHorizons(j);
      if (!xyz) {
        results.push({ name: body.name, error: 'Parse error' });
        continue;
      }
      const lon = eclipticLongitudeDeg(xyz.x, xyz.y);
      results.push({ name: body.name, longitude: lon, xyz });
    }

    res.json({ utc, center: 'Geocentric (Earth 399)', ref_plane: 'ECLIPTIC', planets: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err && err.message || err) });
  }
});

// Health
app.get('/', (req, res) => {
  res.type('text').send('Horizons proxy OK. Use /horizons?utc=YYYY-MM-DDTHH:mm:ssZ');
});

app.listen(PORT, () => {
  console.log(`Horizons proxy running on http://localhost:${PORT}`);
});
