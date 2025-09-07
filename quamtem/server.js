cat > server.js <<'EOF'
// server.js — NASA JPL Horizons proxy (CommonJS, async/await only inside route)
const express = require('express');
const fetch = require('node-fetch'); // v2
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
  u.searchParams.set('format','json');
  u.searchParams.set('COMMAND', id);
  u.searchParams.set('EPHEM_TYPE','VECTORS');
  u.searchParams.set('CENTER','399');          // geocentric
  u.searchParams.set('REF_PLANE','ECLIPTIC');  // XY is ecliptic plane
  u.searchParams.set('START_TIME', utcISO);
  u.searchParams.set('STOP_TIME',  utcISO);
  u.searchParams.set('STEP_SIZE','1 m');
  u.searchParams.set('CSV_FORMAT','TRUE');     // CSV in JSON `result`
  u.searchParams.set('OBJ_DATA','NO');
  return u.toString();
}

function parseXYZ(json) {
  const txt = json && (json.result || '');
  if (!txt) return null;
  const lines = txt.split(/\r?\n/).filter(Boolean);
  const hi = lines.findIndex(l => /(^|,)\s*X\b/i.test(l) && /(^|,)\s*Y\b/i.test(l));
  if (hi === -1) return null;
  let i = hi + 1; while (i < lines.length && lines[i].trim().startsWith('!')) i++;
  const hdr = lines[hi].split(',').map(s=>s.trim().toUpperCase());
  const row = lines[i] || '';
  const cols = row.split(',').map(s=>s.trim());
  const ix = hdr.indexOf('X'), iy = hdr.indexOf('Y');
  const x = parseFloat(cols[ix]), y = parseFloat(cols[iy]);
  if (![x,y].every(Number.isFinite)) return null;
  return { x, y };
}

// ---- ROUTE (await is inside this async function) -----------------
app.get('/horizons', async (req, res) => {
  try {
    const { utc } = req.query;
    if (!utc || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(utc)) {
      return res.status(400).json({ error: "Use ?utc=YYYY-MM-DDTHH:mm[:ss]Z" });
    }

    const out = [];
    for (const b of PLANETS) {
      const url = buildURL(b.id, utc);
      const r = await fetch(url, {
        headers: { 'User-Agent': 'TermuxProxy/1.0 (contact: you@example.com)' },
        timeout: 30000
      });
      if (!r.ok) { out.push({ name: b.name, error: `HTTP ${r.status}` }); continue; }
      const j = await r.json();
      const xy = parseXYZ(j);
      if (!xy) { out.push({ name: b.name, error: 'Parse error' }); continue; }
      const lon = degNorm(rad2deg(Math.atan2(xy.y, xy.x)));
      out.push({ name: b.name, longitude: lon });
    }

    res.json({ utc, center: 'Geocentric (399)', ref_plane: 'ECLIPTIC', planets: out });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e && e.message || e) });
  }
});

// health
app.get('/', (_, res) => res.type('text').send('OK: /horizons?utc=YYYY-MM-DDTHH:mm[:ss]Z'));

app.listen(PORT, () => {
  console.log(`Horizons proxy running on http://localhost:${PORT}`);
});
EOF
