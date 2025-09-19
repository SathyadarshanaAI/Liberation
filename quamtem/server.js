// server.js — KP Demo + Graha plotting (SVG)
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve current folder (so /index.html, etc. work)
app.use(express.static(path.join(__dirname)));

// --- Helpers -------------------------------------------------
const degToXY = (cx, cy, r, deg) => {
  const rad = (Math.PI / 180) * (deg - 90); // 0° at top, clockwise
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
};

// --- Routes --------------------------------------------------

// Root page (link to the SVG)
app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html>
  <html><body style="font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.4">
    <h1>KP Demo (SVG)</h1>
    <p><a href="/wheel-svg">Open Wheel SVG</a></p>
    <p>Tip: Use <code>/wheel-svg?demo=1</code> for sample graha positions.</p>
  </body></html>`);
});

// Simple “wheel” with optional graha plotting
app.get('/wheel-svg', (req, res) => {
  const W = 600, H = 600, CX = 300, CY = 300;
  const R_OUT = 260;
  const R_IN  = 210;    // house-label radius
  const R_P   = 230;    // planet plot radius

  // 12 house lines + labels
  let lines = '';
  let houseLabels = '';
  for (let i = 0; i < 12; i++) {
    const d  = i * 30;
    const [x1, y1] = degToXY(CX, CY, 60, d);         // small inner tick start
    const [x2, y2] = degToXY(CX, CY, R_OUT, d);      // outer circle
    lines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#777" stroke-width="1"/>`;
  }
  for (let i = 0; i < 12; i++) {
    const mid = i * 30 + 15; // middle of the house
    const [lx, ly] = degToXY(CX, CY, R_IN, mid);
    houseLabels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#666">${i+1}</text>`;
  }

  // --- Demo graha data (you can replace with real angles later) ---
  // degrees are 0° at Aries cusp (top) and increase clockwise.
  const useDemo = 'demo' in req.query || true; // keep demo on by default for now
  const graha = useDemo ? [
    { name: "Sun (සූර්ය)",    deg:  95 },
    { name: "Moon (චන්ද්‍ර)",  deg: 212 },
    { name: "Mars (කුජ)",     deg:  12 },
    { name: "Mercury (බුධ)",  deg: 178 },
    { name: "Jupiter (ගුරු)", deg: 332 },
    { name: "Venus (ශුක්‍ර)",  deg: 256 },
    { name: "Saturn (ශනි)",   deg:  45 },
    { name: "Rahu (රාහු)",    deg: 120 },
    { name: "Ketu (කේතු)",    deg: 300 },
  ] : [];

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
    <!-- Outer + inner circles -->
    <circle cx="${CX}" cy="${CY}" r="${R_OUT}" fill="none" stroke="black" stroke-width="2"/>
    <circle cx="${CX}" cy="${CY}" r="60" fill="none" stroke="#999" stroke-width="1"/>
    <!-- House lines & labels -->
    ${lines}
    ${houseLabels}
    <!-- Title -->
    <text x="${CX}" y="${CY}" text-anchor="middle" dominant-baseline="middle" font-size="18" fill="#333">KP Wheel (Demo)</text>
    <!-- Graha -->
    ${planets}
  </svg>`;

  res.set('Content-Type', 'image/svg+xml; charset=utf-8').send(svg);
});

// -------------------------------------------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://127.0.0.1:${PORT}`);
});
