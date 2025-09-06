// ---- ROUTE ----
app.get('/horizons', async (req, res) => {
  try {
    const { utc } = req.query;
    if (!utc || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?Z$/.test(utc)) {
      return res.status(400).json({ error: "Use ?utc=YYYY-MM-DDTHH:mm[:ss]Z" });
    }

    const out = [];
    for (const b of PLANETS) {
      const url = buildURL(b.id, utc);

      // ✅ Await now valid inside async function
      const r = await fetch(url, {
        headers: { 'User-Agent': 'TermuxProxy/1.0' },
        timeout: 30000
      });

      if (!r.ok) {
        out.push({ name: b.name, error: `HTTP ${r.status}` });
        continue;
      }

      const j = await r.json();
      const xyz = parseXYZ(j);

      if (!xyz) {
        out.push({ name: b.name, error: 'Parse error' });
        continue;
      }

      const lon = degNorm(rad2deg(Math.atan2(xyz.y, xyz.x)));
      out.push({ name: b.name, longitude: lon });
    }

    res.json({
      utc,
      center: 'Geocentric (399)',
      ref_plane: 'ECLIPTIC',
      planets: out
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err.message || err) });
  }
});
