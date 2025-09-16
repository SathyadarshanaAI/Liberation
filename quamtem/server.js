/**
 * ======================================================================
 *  © 2025 Sathyadarshana AI Buddhi – Light of Truth Project
 *  ALL RIGHTS RESERVED – HIGH COPYRIGHT PROTECTION
 *
 *  This software, algorithms, and documentation are proprietary to
 *  Sathyadarshana (Light of Truth). Unauthorized reproduction,
 *  modification, distribution, reverse engineering, or derivative
 *  works – in whole or in part – are STRICTLY PROHIBITED.
 *
 *  This code is protected under International Copyright Law.
 *  Violators may be subject to civil and criminal penalties.
 *
 *  Authorized use ONLY under direct permission from:
 *  Email: sathyadarshana2025@gmail.com
 * ======================================================================
 */

const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");

const app = express();
app.use(express.static("public"));
app.use(express.json());

// ---------------- Rate Limiting ----------------
const buckets = new Map();
function rateLimit(maxPerMinute = 60) {
  return (req, res, next) => {
    const now = Date.now();
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.ip ||
      req.connection.remoteAddress ||
      "local";
    const b = buckets.get(ip) || { count: 0, ts: now };
    if (now - b.ts > 60_000) {
      b.count = 0;
      b.ts = now;
    }
    b.count++;
    buckets.set(ip, b);
    if (b.count > maxPerMinute)
      return res.status(429).json({ error: "Too many requests" });
    next();
  };
}
app.use(rateLimit(90));

// ---------------- Helpers ----------------
const SECRET = process.env.ASTRO_SECRET || "change-me-super-secret";
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

const pad = n => String(n).padStart(2,"0");
const toUTC = d =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;

function hashId(id) {
  return crypto.createHash("sha256").update(String(id)).digest("hex").slice(0,24);
}
function sign(payload) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}
function degToSign(deg) {
  const idx = Math.floor(((deg % 360) + 360) % 360 / 30);
  return SIGNS[idx];
}

// ---------------- Stub Planetary Longitudes ----------------
// Future upgrade: replace with NASA Horizons API
async function computeGeoLongitudes(utc, ayan) {
  return {
    utc,
    center: "Geocentric (500@399)",
    ref_plane: "ECLIPTIC",
    planets: [
      { name:"Sun", longitude:120 },
      { name:"Moon", longitude:15 },
      { name:"Mars", longitude:210 },
      { name:"Mercury", longitude:80 },
      { name:"Venus", longitude:95 },
      { name:"Jupiter", longitude:10 },
      { name:"Saturn", longitude:300 }
    ]
  };
}

// ---------------- Horoscope Text Engine ----------------
function sectionText(planets){
  const get = n => planets.find(p=>p.name===n)?.longitude ?? null;
  const sun=get("Sun"), moon=get("Moon"), mar=get("Mars"), ven=get("Venus"),
        mer=get("Mercury"), jup=get("Jupiter"), sat=get("Saturn");

  const health = (sat!=null && Math.abs(sat - sun) % 180 < 5)
    ? "Vitality steady; joints and bones require attention."
    : "Energy fluctuates; maintain consistent sleep and balanced diet.";

  const education = (mer!=null && ["Gemini","Virgo"].includes(degToSign(mer)))
    ? "Quick grasp for languages and analytics; self-study is fruitful."
    : "Learning benefits from repetition and solid foundations.";

  const love = (ven!=null && ["Taurus","Libra","Pisces"].includes(degToSign(ven)))
    ? "Affection flows easily; excellent for proposals and harmony."
    : "Conversations need patience; avoid misunderstandings.";

  const career = (mar!=null && ["Aries","Capricorn","Leo","Scorpio"].includes(degToSign(mar)))
    ? "Leadership roles and initiative favored. Small goals achieved quickly."
    : "Progress through cooperation; maintain documentation.";

  const luck = (jup!=null && ["Sagittarius","Pisces","Cancer"].includes(degToSign(jup)))
    ? "Good fortune through travel, teaching, and spiritual pursuits."
    : "Moderate but steady luck; careful budgeting advised.";

  return { health, education, love, career, luck };
}

function composePreview(planets){
  const sec = sectionText(planets);
  const order = ["health","education","love","career","luck"];
  let text = order.map(k=>sec[k]).join(" ");
  const words = text.split(/\s+/);
  if (words.length > 300) text = words.slice(0,300).join(" ") + "...";
  return { text, words: Math.min(words.length, 300), sections: sec };
}

function composeFull(planets){
  const sec = sectionText(planets);
  const cycles = "Next 30 days favor steady growth. Productive windows: days 5–8 and 18–21. Avoid impulsive spending near lunar squares.";
  const remedies = "Remedies: early sunlight 10m daily, walking Tue/Thu, donate grains on Thursdays, keep gratitude journal.";
  const text = [
    sec.health, sec.education, sec.love, sec.career, sec.luck,
    cycles, remedies
  ].join(" ");
  return { text, sections: sec, cycles, remedies, words: text.split(/\s+/).length };
}

// ---------------- Endpoints ----------------

// raw geo longitudes
app.get("/geo-longitudes", async (req,res)=>{
  try{
    const utc = req.query.utc;
    if (!utc) return res.status(400).json({ error: "utc required" });

    const ayan = req.query.ayan ? parseFloat(req.query.ayan) : undefined;
    const geo = await computeGeoLongitudes(utc, ayan);

    let planets = geo.planets;
    if (Number.isFinite(ayan)) {
      planets = planets.map(p => ({
        ...p,
        longitude: ((p.longitude - ayan) % 360 + 360) % 360
      }));
    }

    res.json({
      utc: geo.utc,
      center: geo.center,
      ref_plane: geo.ref_plane,
      planets
    });
  }catch(e){ console.error(e); res.status(500).json({error:"geo-failed"}); }
});

// free preview
app.get("/horoscope-free", async (req,res)=>{
  try{
    const utc = req.query.utc || toUTC(new Date());
    const ayan = req.query.ayan ? parseFloat(req.query.ayan) : undefined;
    const id  = req.query.id || "guest";

    const geo = await computeGeoLongitudes(utc, ayan);
    const pr  = composePreview(geo.planets);

    res.json({
      kind:"free-preview",
      utc: geo.utc, center: geo.center, ref_plane: geo.ref_plane,
      id_hash: hashId(id),
      ...pr
    });
  }catch(e){ console.error(e); res.status(500).json({error:"free-failed"}); }
});

// full report (requires token)
app.get("/horoscope-full", async (req,res)=>{
  try{
    const utc = req.query.utc || toUTC(new Date());
    const ayan = req.query.ayan ? parseFloat(req.query.ayan) : undefined;
    const id  = req.query.id;
    const token = req.query.token;

    if (!id || !token) return res.status(401).json({ error:"auth-required" });
    const expected = sign(`${id}:${utc}`);
    if (token !== expected) return res.status(403).json({ error:"invalid-token" });

    const geo = await computeGeoLongitudes(utc, ayan);
    const full = composeFull(geo.planets);

    res.json({
      kind:"full-report",
      utc: geo.utc, center: geo.center, ref_plane: geo.ref_plane,
      id_hash: hashId(id),
      ...full
    });
  }catch(e){ console.error(e); res.status(500).json({error:"full-failed"}); }
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server listening at http://localhost:${PORT}`));
