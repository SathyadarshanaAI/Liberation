/**
 * tools/saver.js
 * Save demo outputs from Liberation backend.
 * - Hits /geo-longitudes, /horoscope-free, /horoscope-full
 * - Writes pretty JSON into ./saved/
 *
 * Usage examples:
 *   node tools/saver.js
 *   node tools/saver.js --base https://ceed-api.onrender.com --utc 2025-01-01T00:00:00Z --ayan 24 --id siddha
 *
 * Env:
 *   BASE=https://ceed-api.onrender.com
 *   ASTRO_SECRET=change-me-super-secret   // must match server
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ---------- config & args ----------
const args = new Map(
  process.argv.slice(2).flatMap(a => {
    const m = a.match(/^--([^=]+)(?:=(.*))?$/);
    return m ? [[m[1], m[2] ?? "true"]] : [];
  })
);

const pad = n => String(n).padStart(2, "0");
const toUTC = d =>
  `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}` +
  `T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;

const BASE =
  args.get("base") ||
  process.env.BASE ||
  "http://127.0.0.1:3000"; // default local

const UTC =
  args.get("utc") ||
  toUTC(new Date());

const AYAN =
  args.has("ayan") ? Number(args.get("ayan")) : undefined;

const ID =
  args.get("id") || "guest";

const SECRET =
  process.env.ASTRO_SECRET || "change-me-super-secret";

// Node 18+ has global fetch; fallback for older
const fetchFn = global.fetch || require("node-fetch");

// ---------- helpers ----------
function hmacSign(payload) {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function saveJSON(prefix, obj) {
  ensureDir(path.join(process.cwd(), "saved"));
  const ts = new Date();
  const stamp =
    `${ts.getFullYear()}-${pad(ts.getMonth() + 1)}-${pad(ts.getDate())}` +
    `_${pad(ts.getHours())}-${pad(ts.getMinutes())}-${pad(ts.getSeconds())}`;
  const file = path.join("saved", `${stamp}_${prefix}.json`);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
  console.log(`💾 Saved → ${file}`);
}

// ---------- main ----------
(async () => {
  try {
    console.log("▶️  Saver start");
    console.log(`   BASE = ${BASE}`);
    console.log(`   UTC  = ${UTC}`);
    if (AYAN !== undefined) console.log(`   AYAN = ${AYAN}`);
    console.log(`   ID   = ${ID}`);

    // 1) geo-longitudes
    const geoUrl = new URL("/geo-longitudes", BASE);
    geoUrl.searchParams.set("utc", UTC);
    if (!Number.isNaN(AYAN) && AYAN !== undefined) geoUrl.searchParams.set("ayan", String(AYAN));

    const geoRes = await fetchFn(geoUrl, { headers: { "Accept": "application/json" } });
    const geo = await geoRes.json();
    if (!geoRes.ok) throw new Error(`geo-longitudes failed: ${JSON.stringify(geo)}`);
    saveJSON("geo-longitudes", geo);

    // 2) horoscope-free
    const freeUrl = new URL("/horoscope-free", BASE);
    freeUrl.searchParams.set("utc", UTC);
    if (!Number.isNaN(AYAN) && AYAN !== undefined) freeUrl.searchParams.set("ayan", String(AYAN));
    freeUrl.searchParams.set("id", ID);

    const freeRes = await fetchFn(freeUrl, { headers: { "Accept": "application/json" } });
    const freeJson = await freeRes.json();
    if (!freeRes.ok) throw new Error(`horoscope-free failed: ${JSON.stringify(freeJson)}`);
    saveJSON("horoscope-free", freeJson);

    // 3) horoscope-full (requires token)
    const token = hmacSign(`${ID}:${UTC}`);
    const fullUrl = new URL("/horoscope-full", BASE);
    fullUrl.searchParams.set("utc", UTC);
    if (!Number.isNaN(AYAN) && AYAN !== undefined) fullUrl.searchParams.set("ayan", String(AYAN));
    fullUrl.searchParams.set("id", ID);
    fullUrl.searchParams.set("token", token);

    const fullRes = await fetchFn(fullUrl, { headers: { "Accept": "application/json" } });
    const fullJson = await fullRes.json();
    if (!fullRes.ok) throw new Error(`horoscope-full failed: ${JSON.stringify(fullJson)}`);
    saveJSON("horoscope-full", fullJson);

    console.log("✅ Done.");
  } catch (e) {
    console.error("❌ Saver error:", e.message || e);
    process.exitCode = 1;
  }
})();
