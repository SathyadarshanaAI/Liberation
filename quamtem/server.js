// server.js — KP Demo + Real-planets via NASA Horizons (proxy) + SVG wheel
const express = require('express');
const path = require('path');

// Node 18+: global fetch; older Node: dynamic node-fetch
const _fetch = typeof fetch === 'function'
  ? fetch
  : (...a) => import('node-fetch').then(({ default: f }) => f(...a));

const app = express();
const PORT = 3000;

// ---------- CORS (for browser UIs) ----------
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve current folder (so /index.html etc. work)
app.use(express.static(path.join(__dirname)));

// ---------- Math helpers ----------
const degToXY = (cx, cy, r, deg) => {
  const rad = (Math.PI / 180) * (deg - 90); // 0° at top, clockwise
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};
const parseRAtoDeg = (raStr) => {
  const p = raStr.trim().replace(/:/g, ' ').split(/\s+/).map(Number);
  const H = p[0] || 0, M = p[1] || 0, S = p[2] || 0;
  return (H + M / 60 + S / 3600) * 15;
};
const parseDecToDeg = (decStr) => {
  const t = decStr.trim().replace(/:/g, ' ').split(/\s+/);
  if (t.length === 1 && !isNaN(parseFloat(t[0]))) return parseFloat(t[0]);
  const neg = t[0].startsWith('-');
  const d = Math.abs(parseFloat(t[0])) || 0, m = parseFloat(t[1]) || 0, s = parseFloat(t[2]) || 0;
  const v = d + m / 60 + s / 3600;
  return neg ? -v : v;
};
const eqToEclLon = (raDeg, decDeg) => {
  const eps = 23.4392911 * Math.PI / 180; // J2000 obliquity
  const ra = raDeg * Math.PI / 180, dec = decDeg * Math.PI / 180;
  const sinL = Math.sin(ra) * Math.cos(eps) + Math.tan(dec) * Math.sin(eps);
  const cosL = Math.cos(ra);
  let lam = Math.atan2(sinL, cosL) * 180 / Math.PI;
  if (lam < 0) lam += 360;
  return lam;
};

// ---------- Horizons proxy (fix CORS) ----------
app.get('/horizons', async (req, res) => {
  const qs = new URLSearchParams(req.query).toString();
  const url = `https://ssd.jpl.nasa.gov/api/horizons.api?${qs}`;
  try {
    const r = await _fetch(url);
    const text = await r.text(); // NASA sometimes sends text-wrapped JSON
    res.set('Access-Control-Allow-Origin', '*');
    res.type('text/plain').send(text);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- Real planets API: /api/graha?dt=...&lat=...&lon=... ----------
const PLANETS = [
  { name: 'Sun', code: '10' },     { name: 'Mercury', code: '199' },
  { name: 'Venus', code: '299' },  { name: 'Moon', code: '301' },
  { name: 'Mars', code: '499' },   { name: 'Jupiter', code: '599' },
  { name: 'Saturn', code: '699' }, { name: 'Uranus', code: '799' },
  { name: 'Neptune', code: '899' },{ name: 'Pluto', code: '999' },
];

// small in-memory cache (keyed by dt|lat|lon|code)
const cache = new Map();
const getKey = (dt, lat, lon, code) => `${dt}|${lat}|${lon}|${code}`;

async function fetchOnePlanet(dtISO, lat, lon, code, name) {
  const key = getKey(dtISO, lat, lon, code);
  if (cache.has(key)) return cache.get(key);

  // NOTE: SITE_COORD order MUST be lon,lat,km
  const url = `https://ssd.jpl.nasa.gov/api/horizons.api`
    + `?format=json&MAKE_EPHEM=YES&TABLE_TYPE=OBSERVER&QUANTITIES='1'`
    + `&START_TIME='${dtISO}'&STOP_TIME='${dtISO}'&STEP_SIZE='1 m'`
    + `&SITE_COORD='${lon},${lat},0'&COMMAND='${code}'`;

  // go via our proxy to avoid CORS even if called from browser
  const proxied = `${reqProtoHost()}/horizons?` +
    `format=json&MAKE_EPHEM=YES&TABLE_TYPE=OBSERVER&QUANTITIES='1'` +
    `&START_TIME='${dtISO}'&STOP_TIME='${dtISO}'&STEP_SIZE='1 m'` +
    `&SITE_COORD='${lon},${lat},0'&COMMAND='${code}'`;

  // call directly from server
  const r = await _fetch(url);
  const j = await r.json();
  const text = j.result || '';

  const lines = text.split(/\r?\n/);
  const iS = lines.findIndex(l => l.includes('$$SOE'));
  const iE = lines.findIndex((l, i) => i > iS && l.includes('$$EOE'));
  if (iS < 0 || iE < 0) return null;

  const row = lines.slice(iS + 1, iE).find(l => /\S/.test(l)) || '';
  const raMatch = row.match(/\b(\d{1,2}[:\s]\d{1,2}[:\s]\d{1,2}(\.\d+)?)\b/);
  const decMatch = row.match(/[+\-]?\d{1,2}(?::|\s)\d{1,2}(?::|\s)\d{1,2}(\.\d+)?|[+\-]?\d+\.\d+/g);
  if (!raMatch || !decMatch) return null;

  const raDeg = parseRAtoDeg(raMatch[1]);
  const decDeg = parseDecToDeg(decMatch[0]);
  const eclLon = eqToEclLon(raDeg, decDeg);

  const val = { name, longitude: eclLon };
  cache.set(key, val);
  return val;
}

// helper to get base URL for own server (for info/debug)
function reqProtoHost(req) {
  return `http://127.0.0.1:${PORT}`;
}

app.get('/api/graha', async (req, res) => {
  const dt = (req.query.dt || '').trim();  // UTC "YYYY-MM-DDTHH:MM:SS"
  const lat = Number(req.query.lat);
  const lon = Number(req.query.lon);
  if (!dt || !isFinite(lat) || !isFinite(lon)) {
    return res.status(400).json({ error: 'Required: dt (UTC ISO), lat, lon' });
  }
  try {
    const out = [];
    for (const p of PLANETS) {
      const v = await fetchOnePlanet(dt, lat, lon, p.code, p.name);
      if (v) out.push(v);
    }
    res.json({ dt, lat, lon, planets: out });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------- HTML small index ----------
app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
  <html><body style="font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.45; padding:18px">
    <h1>KP Demo</h1>
    <ul>
      <li><a href="/wheel-svg">Open Wheel SVG (demo)</a></li>
      <li><code>/wheel-svg?use=real&dt=2025-01-01T00:00:00&lat=7.2931&lon=80.6350</code></li>
      <li><code>/api/graha?dt=2025-01-01T00:00:00&lat=7.2931&lon=80.6350</code> (JSON)</li>
      <li><code>/horizons?...</code> (raw proxy)</li>
    </ul>
    <p>Tip: 0° is at Aries cusp (top), increasing clockwise.</p>
  </body></html>`);
});

// ---------- SVG wheel (demo or real) ----------
app.get('/wheel-svg', async (req, res) => {
  const W = 600, H = 600, CX = 300, CY = 300;
  const R_OUT = 260, R_IN = 210, R_P = 230;

  // 12 house lines + labels
  let lines = '';
  let houseLabels = '';
  for (let i = 0; i < 12; i++) {
    const d = i * 30;
    const [x1, y1] = degToXY(CX, CY, 60, d);
    const [x2, y2] = degToXY(CX, CY, R_OUT, d);
    lines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#777" stroke-width="1"/>`;
  }
  for (let i = 0; i < 12; i++) {
    const mid = i * 30 + 15;
    const [lx, ly] = degToXY(CX, CY, R_IN, mid);
    houseLabels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#666">${i + 1}</text>`;
  }

  let graha = [];
  const useReal = (req.query.use || '').toLowerCase() === 'real';
  if (useReal) {
    const dt = (req.query.dt || '').trim();
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    if (dt && isFinite(lat) && isFinite(lon)) {
      try {
        const out = [];
        for (const p of PLANETS) {
          const v = await fetchOnePlanet(dt, lat, lon, p.code, p.name);
          if (v) out.push(v);
        }
        graha = out.map(o => ({ name: o.name, deg: o.longitude }));
      } catch (e) {
        // fall back to empty -> only wheel renders
        graha = [];
      }
    }
  } else {
    // DEMO
    graha = [
      { name: "Sun (සූර්ය)",    deg:  95 },
      { name: "Moon (චන්ද්‍ර)",  deg: 212 },
      { name: "Mars (කුජ)",     deg:  12 },
      { name: "Mercury (බුධ)",  deg: 178 },
      { name: "Jupiter (ගුරු)", deg: 332 },
      { name: "Venus (ශුක්‍ර)",  deg: 256 },
      { name: "Saturn (ශනි)",   deg:  45 },
      { name: "Rahu (රාහු)",    deg: 120 },
      { name: "Ketu (කේතු)",    deg: 300 },
    ];
  }

  let planets = '';
  for (const p of graha) {
    const [px, py] = degToXY(CX, CY, R_P, p.deg);
    const [tx, ty] = degToXY(CX, CY, R_P + 18, p.deg);
    planets += `
      <circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="4" fill="black"/>
      <text x="${tx.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="12">${p.name}</text>
    `;
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <rect width="100%" height="100%" fill="white"/>
    <circle cx="${CX}" cy="${CY}" r="${R_OUT}" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="${CX}" cy="${CY}" r="60" fill="none" stroke="#999" stroke-width="1"/>
    ${lines}
    ${houseLabels}
    <text x="${CX}" y="${CY}" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#333">
      KP Wheel (${useReal ? 'Real' : 'Demo'})
    </text>
    ${planets}
  </svg>`;

  res.set('Content-Type', 'image/svg+xml; charset=utf-8').send(svg);
});

// ---------- Status ----------
app.get('/status', (req, res) => res.send('OK'));

// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
