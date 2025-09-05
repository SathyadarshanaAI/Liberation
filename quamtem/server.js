// server.js  — Clean NASA Horizons proxy (Node 18+)
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS (browser calls-friendly)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

/**
 * GET /horizons
 * Query params:
 *   date=YYYY-MM-DD
 *   time=HH:MM   (optional; default 00:00)
 *   lat=6.9271   (decimal)
 *   lon=79.8612  (decimal)
 *   command=399  (optional; default 399 = Earth center; 301 = Moon, 10 = Sun, etc.)
 *   step=1 d     (optional; default 1 d)
 */
app.get("/horizons", async (req, res) => {
  try {
    const { date, time = "00:00", lat, lon } = req.query;
    const command = (req.query.command || "399").toString().trim();
    const step = (req.query.step || "1 d").toString().trim();

    // Basic validation
    if (!date || !lat || !lon) {
      return res.status(400).json({
        error:
          "Missing parameters: required -> date (YYYY-MM-DD), lat, lon; optional -> time (HH:MM), command, step",
      });
    }

    // Horizons parameters
    const START_TIME = `${date} ${time}`;
    const STOP_TIME = `${date} 23:59`;

    // NOTE: Using coord@399 (Earth-centered coordinate frame) + SITE_COORD = "lon,lat,0"
    const base = "https://ssd.jpl.nasa.gov/api/horizons.api";
    const params = new URLSearchParams({
      format: "json",
      COMMAND: command,          // e.g., '301' for Moon, '10' for Sun, etc.
      CENTER: "coord@399",       // Earth-centered frame
      SITE_COORD: `${lon},${lat},0`,
      START_TIME,
      STOP_TIME,
      STEP_SIZE: step,
      QUANTITIES: "1,20,23",
    });

    const url = `${base}?${params.toString()}`;
    const r = await fetch(url, { headers: { "User-Agent": "Sathyadarshana-Termux" } });

    // Horizons sometimes returns text errors; try to parse JSON safely
    const text = await r.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(502).json({ error: "Horizons response was not JSON", raw: text.slice(0, 1000) });
    }

    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message || String(e) });
  }
});

app.get("/ping", (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
