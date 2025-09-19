/**
 * ======================================================================
 *  © 2025 Sathyadarshana AI Buddhi – Light of Truth Project
 *  ALL RIGHTS RESERVED – HIGH COPYRIGHT PROTECTION
 *  Unauthorized reproduction, modification, distribution, or reverse
 *  engineering is strictly prohibited.
 * ======================================================================
 */
// saver.js  — KP Wheel (Demo) + Simple Express Server
// -----------------------------------------------
// Run:  node saver.js
// Open: http://127.0.0.1:3000/  (Home page)
//       http://127.0.0.1:3000/wheel-svg  (SVG output)

const express = require("express");
const path = require("path");

const app  = express();
const PORT = 3000;
const HOST = "127.0.0.1";

// Serve current folder (optional: if you keep index.html, images, etc.)
app.use(express.static(path.join(__dirname)));

// --------------------------------------------------
// Helpers to draw a simple 12-house KP wheel in SVG
// --------------------------------------------------
const SIGNS = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

function degToXY(cx, cy, r, deg) {
  const rad = (Math.PI / 180) * deg;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

/**
 * generateWheelSVG:
 *  - 12 houses (each 30°)
 *  - outer + inner circle
 *  - house radial lines
 *  - sign labels in the middle ring
 *  - center title
 */
function generateWheelSVG({
  width = 400, height = 400,
  cx = 200, cy = 200,
  rOuter = 180, rInner = 110,
  title = "KP Wheel (Demo)"
} = {}) {

  // Radial house lines (every 30°)
  let lines = "";
  for (let i = 0; i < 12; i++) {
    const deg = i * 30 - 90; // start at top
    const [x1, y1] = degToXY(cx, cy, rInner, deg);
    const [x2, y2] = degToXY(cx, cy, rOuter, deg);
    lines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#222" stroke-width="1"/>`;
  }

  // Sign labels (mid ring between rInner & rOuter)
  const rMid = (rInner + rOuter) / 2;
  let labels = "";
  for (let i = 0; i < 12; i++) {
    // place label in the middle of each 30° sector
    const midDeg = (i * 30 + 15) - 90;
    const [lx, ly] = degToXY(cx, cy, rMid, midDeg);
    const sign = SIGNS[i];
    labels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" font-size="11" text-anchor="middle" dominant-baseline="middle">${sign}</text>`;
  }

  // Outer & inner circles
  const circles = `
    <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="#000" stroke-width="2"/>
    <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="none" stroke="#000" stroke-width="1"/>
  `;

  // Title at center
  const centerTitle = `<text x="${cx}" y="${cy}" font-size="12" text-anchor="middle" dominant-baseline="middle">${title}</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
  <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="100%" height="100%" fill="white"/>
    ${circles}
    ${lines}
    ${labels}
    ${centerTitle}
  </svg>`;
}

// -----------------------
// Routes
// -----------------------

// Home page with link to SVG
app.get("/", (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.send(`<!doctype html>
  <html>
    <head>
      <meta charset="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <title>KP Demo</title>
      <style>
        body{font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; padding:20px}
        a.btn{display:inline-block; padding:10px 14px; border:1px solid #222; border-radius:8px; text-decoration:none}
      </style>
    </head>
    <body>
      <h1>KP Demo</h1>
      <p><a class="btn" href="/wheel-svg">Open Wheel SVG</a></p>
      <p>Tip: <code>/wheel-svg?title=My%20Chart</code> වගේ query param එකකින් මැද title එක වෙනස් කරගන්න පුළුවන්.</p>
    </body>
  </html>`);
});

// SVG output (supports ?title=…)
app.get("/wheel-svg", (req, res) => {
  const title = typeof req.query.title === "string" && req.query.title.trim()
    ? req.query.title.trim()
    : "KP Wheel (Demo)";

  const svg = generateWheelSVG({ title });
  res.set("Content-Type", "image/svg+xml; charset=utf-8");
  res.send(svg);
});

// -----------------------
// Start server
// -----------------------
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://${HOST}:${PORT}`);
});
