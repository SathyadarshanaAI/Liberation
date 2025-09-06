const express = require('express');
const fetch = require('node-fetch'); // version 2

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests
app.use((_, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/horizons', async (req, res) => {
  try {
    const { utc } = req.query;
    if (!utc || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(utc)) {
      return res.status(400).json({ error: "Pass utc like 2025 const PLANETS = [
      { name: 'Sun',     id: '10'  },
      { name: 'Moon',    id: '301' },
      { name: 'Mercury', id: '199' },
      { name: 'Venus',   id: '299' },
      { name: 'Saturn',  id: '699' },
      { name: 'Uranus',  id: '799' },
      { name: 'Neptune', id: '899' },
      { name: 'Pluto',   id: '999' },
    ];

    // Utility functions
    constorizons.api');
      u.searchParams.set('format', 'json');
      u.searchParams.set('COMMAND', id);
      u.searchParams.set('EPHEM_TYPE', 'VECTORS');
      u.searchParams.set('CENTER', '399'); // geocentric (Earth)
      u.searchParams.set('REF_PLANE', 'ECLIPTIC');
      u.searchParams.set('      u.searchParams.set('STEP_SIZE', '1 m');
      u.searchParams.set('CSV_FORMAT', 'TRUE');
      u.searchParams.set('OBJ_DATA', 'NO');
      return u.toString();
    }

    function parseXYZ(json) {
      const txt = json && (json.result || '');
      if (!txt) return null;
      const lines = txt.split(/\r?\n/).filter(Boolean);
      const hi =(l => /(^|,)\s*X\b/i.test(l) && /(^|,)\s*Y\b/i.test(l));
      if (hi === -1) return null;
      let i = hi + 1; while (i < lines.length && lines[i].trim().startsWith('!'))Of('Y'), iz = hdr.indexOf('Z');
      const x = parseFloat(cols[ix]), y = parseFloat(cols[iy]), z = parseFloat(cols[iz]);
      return [x, y, z].every(Number.isFinite) ? { x, y, z } : null;
    }

    //.com)' }
      });
      if (!r.ok) { out.push({ name: b.name, error: `HTTP ${r.status}` }); continue; }
      const j = await r.json();
      const xyz = parseXYZ(j);
      if (!xyz) { out.push({ name: b.name, error: 'Parse error' }); continue; }
      const lon = degNorm(rad2deg(Math.atan2(xyz.y, xyz.x)));
      out.push({ name: b.name, longitude: lon });
    }

    res.json({
      utc,
      center: 'Geocentric (399)',
      ref_plane: 'ECLIPTIC',
      planets: out
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e && e.message || e) });
  }
});

app.get('/', (_, res) => res.type('text').send('OK: /horizons?utc=YYYY-MM-DDTHH:mm:ssZ'));

app.listen(PORT, () => console.log(`Horizons proxy running at http://localhost:${PORT}`));
