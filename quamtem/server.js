// server.js — Node.js Express proxy for NASA JPL Horizons (CommonJS)

const express = require("express");
const fetch = require("node-fetch"); // v2 for CommonJS
const app = express();

// ---- CORS (allow all) ----
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// ---- RAW pass-through to Horizons ----
app.get("/horizons", async (req, res) => {
  try {
    const base = "https://ssd.jpl.nasa.gov/api/horizons.api";
    const qs = new URLSearchParams(req.query).toString();
    const url = qs ? `${base}?${qs}` : base;

    const r = await fetch(url, {
      headers: { "User-Agent": "QuamtemProxy/1.0" },
    });

    const body = await r.text();
    res.status(r.status);
    res.set("Content-Type", r.headers.get("content-type") || "text/plain");
    res.send(body);
  } catch (e) {
    console.error("Horizons proxy error:", e);
    res.status(500).json({ error: String(e?.message || e) });
  }
});

// ---------- helpers ----------
const PLANETS = [
  { name: "Sun", id: "10" },
  { name: "Moon", id: "301" },
  { name: "Mercury", id: "199" },
  { name: "Venus", id: "299" },
  { name: "Mars", id: "499" },
  { name: "Jupiter", id: "599" },
  { name: "Saturn", id: "699" },
  { name: "Uranus", id: "799" },
  { name: "Neptune", id: "899" },
  { name: "Pluto", id: "999" },
];

const degNorm = (d) => ((d % 360) + 360) % 360;
const rad2deg = (r) => (r * 180) / Math.PI;

// "2025-09-06T12:00:00Z" -> "2025-09-06 12:00:00"
function toHorizonsTime(utcISO) {
  const t = String(utcISO).replace("T", " ").replace(/Z$/, "");
  return /\d{2}:\d{2}:\d{2}$/.test(t) ? t : t + ":00";
}

function buildVectorsURL(id, utcISO) {
  const u = new URL("https://ssd.jpl.nasa.gov/api/horizons.api");
  u.searchParams.set("format", "json");
  u.searchParams.set("EPHEM_TYPE", "VECTORS");
  u.searchParams.set("CENTER", "500@399"); // Earth center
  u.searchParams.set("REF_PLANE", "ECLIPTIC");
  const t = toHorizonsTime(utcISO);
  u.searchParams.set("START_TIME", t);
  u.searchParams.set("STOP_TIME", t);
  u.searchParams.set("STEP_SIZE", "1 m");
  u.searchParams.set("CSV_FORMAT", "YES"); // CSV-like text in result
  u.searchParams.set("OBJ_DATA", "NO");
  u.searchParams.set("COMMAND", id);
  return u.toString();
}

function parseXYFromResult(json) {
  const txt = (json && json.result) || "";
  const lines = txt.split(/\r?\n/);
  const headerIx = lines.findIndex(
    (l) => /(^|,)\s*X\b/i.test(l) && /(^|,)\s*Y\b/i.test(l)
  );
  if (headerIx < 0) return null;

  // data row (skip comment lines starting with "!")
  let rowIx = headerIx + 1;
  while (rowIx < lines.length && lines[rowIx].trim().startsWith("!")) rowIx++;

  const hdr = lines[headerIx].split(",").map((s) => s.trim().toUpperCase());
  const row = (lines[rowIx] || "").split(",").map((s) => s.trim());
  const ix = hdr.indexOf("X"),
    iy = hdr.indexOf("Y");
  const x = parseFloat(row[ix]);
  const y = parseFloat(row[iy]);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}

async function computeGeoLongitudes(utc) {
  const tasks = PLANETS.map(async (b) => {
    const url = buildVectorsURL(b.id, utc);
    try {
      const r = await fetch(url, { headers: { "User-Agent": "QuamtemProxy/1.0" } });
      if (!r.ok) return { name: b.name, error: `HTTP ${r.status}` };
      const j = await r.json();
      const xy = parseXYFromResult(j);
      if (!xy) return { name: b.name, error: "parse" };
      const lon = degNorm(rad2deg(Math.atan2(xy.y, xy.x)));
      return { name: b.name, longitude: lon };
    } catch (err) {
      return { name: b.name, error: String(err?.message || err) };
    }
  });
  return Promise.all(tasks);
}

// ---------- KP-friendly routes ----------
app.get("/geo-longitudes", async (req, res) => {
  try {
    const utc = req.query.utc;
    if (!utc) return res.status(400).json({ error: "use ?utc=YYYY-MM-DDTHH:mm[:ss]Z" });
    const planets = await computeGeoLongitudes(utc);
    res.json({ utc, center: "Geocentric (500@399)", ref_plane: "ECLIPTIC", planets });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e?.message || e) });
  }
});

// (placeholder: currently same as geo)
app.get("/topo-longitudes", async (req, res) => {
  try {
    const utc = req.query.utc;
    const { lat, lon } = req.query;
    if (!utc) return res.status(400).json({ error: "use ?utc=YYYY-MM-DDTHH:mm[:ss]Z" });
    const planets = await computeGeoLongitudes(utc);
    res.json({
      utc,
      center: `Topocentric approx (lat=${lat || "NA"}, lon=${lon || "NA"})`,
      ref_plane: "ECLIPTIC",
      planets,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e?.message || e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Horizons proxy server listening at http://localhost:${PORT}`)
);
