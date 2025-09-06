const express = require('express');
const fetch = require('node-fetch');   // v2.x
const app = express();
const PORT = 3000;

const PLANETS = [
  { name: 'Sun', id: '10' },
  { name: 'Moon', id: '301' },
  { name: 'Mercury', id: '199' },
  { name: 'Venus', id: '299' },
  { name: 'Mars', id: '499' },
  { name: 'Jupiter', id: '599' },
  { name: 'Saturn', id: '699' },
  { name: 'Uranus', id: '799' },
  { name: 'Neptune', id: '899' },
  { name: 'Pluto', id: '999' }
];

const degNorm = d => ((d % 360) + 360) % 360;
const rad2deg = r => r * 180 / Math.PI;

function buildURL(id, utcISO) {
  const u = new URL('https://ssd.jpl.nasa.gov/api/horizons.api');
  u.searchParams.set('format', 'json');
  u.searchParams.set('COMMAND', id);
  u.searchParams.set('EPHEM_TYPE', 'VECTORS');
  u.searchParams.set('CENTER', '399');
  u.searchParams.set('REF_PLANE', 'ECLIPTIC');
  u.searchParams.set('START_TIME', utcISO);
  u.searchParams.set('STOP_TIME', utcISO);
  u.searchParams.set('STEP_SIZE', '1 m');
  u.searchParams.set('CSV_FORMAT', 'TRUE');
  u.searchParams.set('OBJ_DATA', 'NO');
  return u.toString();
}

function parseXYZ(json) {
  const txt = json?.result || '';
  const lines = txt.split(/\r?\n/).filter(Boolean);
  const hi = lines.findIndex(l => /(^|,)\s*X\b/i.test(l));
  if (hi === -1) return null;
  const hdr = lines[hi].split(',').map(s => s.trim().toUpperCase());
  const row = lines[hi + 1] || '';
  const cols = row.split(',').map(s => s.trim());
  const ix = hdr.indexOf('X'), iy = hdr.indexOf('Y');
  const x = parseFloat(cols[ix]), y = parseFloat(cols[iy]);
  if (![x,y].every(Number.isFinite)) return null;
  return { x, y };
}

// ---- ROUTE (note the async keyword!) ----
app.get('/horizons', async (req, res) => {
  try {
    const { utc } = req.query;
    if (!utc) return res.status(400).json({ error: 'Use ?utc=YYYY-MM-DDTHH:mm:ssZ' });

    const out = [];
    for (const b of PLANETS) {
      const r = await fetch(buildURL(b.id, utc), { headers: { 'User-Agent': 'KP/1.0' } });
      const j = await r.json();
      const xyz = parseXYZ(j);
      if (!xyz) { out.push({ name: b.name, error: 'parse error' }); continue; }
      const lon = degNorm(rad2deg(Math.atan2(xyz.y, xyz.x)));
      out.push({ name: b.name, longitude: lon });
    }
    res.json({ utc, planets: out });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.listen(PORT, () => {
  console.log(`Horizons proxy running on http://localhost:${PORT}`);
});
