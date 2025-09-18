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

/* =====================================================
   kp-chart.js
   - form validation + normalize UTC offset
   - draw base horoscope wheel (SVG)
   - plot planets (accepts list of {name,deg})
   - Vimshottari Dasha quick calculation (based on Moon deg)
   - Opera Mini detection + fallback image request hook
   ===================================================== */

/* ---------------- Helpers -------------------------- */

/** Normalize user-typed UTC offset like "+5 30", "+5.30", "0530" -> "+05:30" */
function normalizeUtcOffset(raw) {
  if (!raw) return "";
  let s = raw.trim().replace(/\u00A0/g, " "); // NBSP -> space
  s = s.replace(/[.\s]/g, ":"); // dot or space -> colon
  // If only digits like +0530 or -1130 or 0530
  const mDigits = s.match(/^([+-])?(\d{1,2}):?(\d{2})?$/);
  if (mDigits) {
    const sign = mDigits[1] || "+";
    const hh = String(mDigits[2]).padStart(2, "0");
    const mm = String(mDigits[3] ?? "00").padStart(2, "0");
    return `${sign}${hh}:${mm}`;
  }
  // If already like +H:MM or +HH:MM
  const mColon = s.match(/^([+-])?(\d{1,2}):(\d{2})$/);
  if (mColon) {
    const sign = mColon[1] || "+";
    const hh = String(mColon[2]).padStart(2, "0");
    const mm = mColon[3];
    return `${sign}${hh}:${mm}`;
  }
  return s;
}

/** Validate offset in range -12:00 .. +14:00 */
function isValidUtc(offset) {
  const m = offset.match(/^([+-])(0\d|1[0-4]):([0-5]\d)$/);
  if (!m) return false;
  const hh = parseInt(m[2], 10), mm = parseInt(m[3], 10);
  if (hh === 14 && mm !== 0) return false;
  return true;
}

function saveLocal(fields) {
  try { localStorage.setItem("kpChartForm", JSON.stringify(fields)); } catch (e) {}
}
function loadLocal() {
  try { return JSON.parse(localStorage.getItem("kpChartForm") || "{}"); }
  catch { return {}; }
}

function readForm() {
  const fullName = document.getElementById("fullName").value.trim();
  const dob = document.getElementById("dob").value;      // yyyy-mm-dd
  const tob = document.getElementById("tob").value;      // HH:MM
  let utcOffset = normalizeUtcOffset(document.getElementById("utcOffset").value);

  // write back normalized text so user sees the fix
  document.getElementById("utcOffset").value = utcOffset;

  const errors = [];
  if (!fullName) errors.push("Full Name is required.");
  if (!dob) errors.push("Date of Birth is required.");
  if (!tob) errors.push("Time of Birth is required.");
  if (!isValidUtc(utcOffset)) errors.push("UTC Offset must be like +05:30 and within -12:00..+14:00.");

  return { ok: errors.length === 0, errors, data: { fullName, dob, tob, utcOffset } };
}

/* ----------------- Preview & PDF hook ----------------- */

function showPreview({ fullName, dob, tob, utcOffset }) {
  const msg =
`KP Input Preview

Name        : ${fullName}
Birth Date  : ${dob}
Birth Time  : ${tob}
UTC Offset  : ${utcOffset}

(Next: plug into NASA/Swiss-Eph/KP calc.)`;
  alert(msg);
}

// lightweight jsPDF usage previously added via CDN; makePdf kept minimal
async function makePdf(filename, payload, { watermark } = {}) {
  const { jsPDF } = window.jspdf || {};
  if (!jsPDF) { alert("PDF engine not loaded."); return; }

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text("Sathyadarshana – KP Horoscope", 40, 60);
  doc.setFontSize(11);

  let y = 100;
  for (const line of payload.split("\n")) {
    doc.text(line, 40, y);
    y += 18;
  }

  if (watermark) {
    doc.setFontSize(60);
    doc.setTextColor(200, 200, 200);
    doc.text(watermark, 60, 500, { angle: 30, opacity: 0.25 });
    doc.setTextColor(0, 0, 0);
  }
  doc.save(filename);
}

/* ---------------- SVG Wheel utilities ----------------- */

/* degToXY: convert degree to SVG x,y around center
   Convention: 0° = top (12 o'clock), clockwise positive */
function degToXY(cx, cy, r, deg) {
  const rad = (Math.PI / 180) * (deg - 90);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function makeSvgEl(tag, attrs = {}) {
  const ns = "http://www.w3.org/2000/svg";
  const el = document.createElementNS(ns, tag);
  for (const k in attrs) {
    el.setAttribute(k, attrs[k]);
  }
  return el;
}

/* drawBaseWheel: draws outer/inner circles, 12 divisions, and sign glyphs */
function drawBaseWheel(svgId, options = {}) {
  const svg = document.getElementById(svgId);
  if (!svg) return;
  // clear
  while (svg.firstChild) svg.removeChild(svg.firstChild);

  // configurable
  const W = options.width || 600;
  const H = options.height || 600;
  const CX = W / 2, CY = H / 2;
  const R_OUT = options.rOut || Math.min(W, H) * 0.46;
  const R_IN = options.rIn || R_OUT * 0.5;

  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("width", options.width || 600);
  svg.setAttribute("height", options.height || 600);

  // background transparent rect (so mobile can tap)
  svg.appendChild(makeSvgEl("rect", { x: 0, y: 0, width: W, height: H, fill: "transparent" }));

  // outer/inner circles
  svg.appendChild(makeSvgEl("circle", { cx: CX, cy: CY, r: R_OUT, fill: "none", stroke: "#ffffff", "stroke-width": 2 }));
  svg.appendChild(makeSvgEl("circle", { cx: CX, cy: CY, r: R_IN, fill: "none", stroke: "#ffffff55", "stroke-width": 1 }));

  // 12 division lines
  for (let i = 0; i < 12; i++) {
    const deg = i * 30;
    const p1 = degToXY(CX, CY, R_OUT, deg);
    const p2 = degToXY(CX, CY, R_IN, deg);
    svg.appendChild(makeSvgEl("line", { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, stroke: "#ffffff88", "stroke-width": 1 }));
  }

  // Sign glyphs (use common unicode glyphs)
  const signs = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
  for (let i = 0; i < 12; i++) {
    const midDeg = i * 30 + 15; // center of sector
    const p = degToXY(CX, CY, (R_OUT + R_IN) / 2, midDeg);
    const t = makeSvgEl("text", { x: p.x, y: p.y, fill: "#2df3c2", "font-size": 22, "text-anchor": "middle", "dominant-baseline": "middle" });
    t.textContent = signs[i];
    svg.appendChild(t);
  }

  // inner labels: optionally numbers 1..12 at inner ring
  for (let i = 0; i < 12; i++) {
    const midDeg = i * 30 + 15;
    const p = degToXY(CX, CY, R_IN - 18, midDeg);
    const t = makeSvgEl("text", { x: p.x, y: p.y, fill: "#e2f0ff", "font-size": 12, "text-anchor": "middle", "dominant-baseline": "middle" });
    t.textContent = String(i + 1);
    svg.appendChild(t);
  }

  // optional center title
  svg.appendChild(makeSvgEl("text", { x: CX, y: CY, fill: "#ffffffaa", "font-size": 12, "text-anchor": "middle", "dominant-baseline": "middle" })).textContent = "Sathyadarshana";
}

/* plotPlanets: takes array [{name, deg}] deg in 0..360
   plots dots and labels at radius between R_IN and R_OUT */
function plotPlanets(svgId, planetList, options = {}) {
  const svg = document.getElementById(svgId);
  if (!svg || !Array.isArray(planetList)) return;
  // remove previous planet group if exists
  const prev = svg.querySelector("#planetGroup");
  if (prev) prev.remove();

  const W = parseFloat(svg.getAttribute("width")) || 600;
  const H = parseFloat(svg.getAttribute("height")) || 600;
  const CX = W / 2, CY = H / 2;
  const R_OUT = options.rOut || Math.min(W, H) * 0.46;
  const R_IN = options.rIn || R_OUT * 0.5;
  const R_DOT = (R_IN + R_OUT) / 2;

  const g = makeSvgEl("g", { id: "planetGroup" });
  svg.appendChild(g);

  planetList.forEach((p, idx) => {
    const deg = ((p.deg % 360) + 360) % 360;
    const pos = degToXY(CX, CY, R_DOT, deg);
    const dot = makeSvgEl("circle", { cx: pos.x, cy: pos.y, r: 6, fill: "#60a5fa", stroke: "#fff", "stroke-width": 1 });
    g.appendChild(dot);
    const label = makeSvgEl("text", { x: pos.x, y: pos.y - 10, fill: "#e2f0ff", "font-size": 12, "text-anchor": "middle" });
    label.textContent = p.name;
    g.appendChild(label);
  });
}

/* Utility: get SVG string (for server fallback or export) */
function getSvgString(svgId) {
  const svg = document.getElementById(svgId);
  if (!svg) return "";
  // clone to avoid modifying on-screen
  const clone = svg.cloneNode(true);
  // inline styles if needed (we rely on attributes so okay)
  const serializer = new XMLSerializer();
  const str = serializer.serializeToString(clone);
  return '<?xml version="1.0" encoding="UTF-8"?>' + str;
}

/* ---------------- Vimshottari Dasha ------------------ */
/* Dasha durations (years) */
const DashaYears = { "Ketu":7, "Venus":20, "Sun":6, "Moon":10, "Mars":7, "Rahu":18, "Jupiter":16, "Saturn":19, "Mercury":17 };
const DashaOrder = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];

/**
 * calcVimshottari: quick approximation
 * - moonDeg: ecliptic longitude of Moon in degrees (0..360)
 * - birthISO: ISO date string "YYYY-MM-DD"
 * returns array of dashas with from/to (ISO date strings) and years
 *
 * Note: This is a straightforward algorithm for sequence and durations.
 * For production-grade dates (exact day precision with fractional years),
 * use high-precision date arithmetic / astronomical libraries.
 */
function calcVimshottari(moonDeg, birthISO) {
  const nakSize = 360 / 27; // 13.333...
  // nakIndex 0..26
  const nakIndex = Math.floor(((moonDeg % 360) + 360) % 360 / nakSize);
  // Mapping of nakIndex to lord uses repeating 9-lord sequence
  // sequence of lords across 27 stars = (Ketu,Venus,Sun,Moon,Mars,Rahu,Jupiter,Saturn,Mercury) repeated 3 times
  const lordCycle = ["Ketu","Venus","Sun","Moon","Mars","Rahu","Jupiter","Saturn","Mercury"];
  const starLord = lordCycle[nakIndex % 9];

  const partInStar = ((moonDeg % nakSize) + nakSize) % nakSize; // degrees into the star
  const partFrac = partInStar / nakSize; // 0..1
  const balanceYears = (1 - partFrac) * DashaYears[starLord];

  const results = [];
  // cursor date as Date object
  let cursor = new Date(birthISO + "T00:00:00Z"); // treat as UTC midnight (approx)
  // first dasha
  const firstTo = new Date(cursor);
  firstTo.setUTCFullYear(firstTo.getUTCFullYear() + Math.floor(balanceYears));
  // add fractional years as days
  const fracYears = balanceYears - Math.floor(balanceYears);
  if (fracYears > 0) {
    const extraDays = Math.round(fracYears * 365.2425);
    firstTo.setUTCDate(firstTo.getUTCDate() + extraDays);
  }
  results.push({ lord: starLord, from: cursor.toISOString().slice(0,10), to: firstTo.toISOString().slice(0,10), years: Number(balanceYears.toFixed(6)) });

  // remaining sequence (we'll append next 8 dashas for a full cycle sample)
  let idx = (DashaOrder.indexOf(starLord) + 1) % DashaOrder.length;
  let lastTo = new Date(firstTo);
  for (let k = 0; k < 8; k++) {
    const lord = DashaOrder[idx];
    const yrs = DashaYears[lord];
    const from = new Date(lastTo);
    const to = new Date(from);
    to.setUTCFullYear(to.getUTCFullYear() + yrs);
    results.push({ lord, from: from.toISOString().slice(0,10), to: to.toISOString().slice(0,10), years: yrs });
    lastTo = to;
    idx = (idx + 1) % DashaOrder.length;
  }

  return results;
}

/* ---------------- Opera Mini detection ---------------- */
/* Opera Mini uses window.operamini or UA contain "Opera Mini" */
function isOperaMini() {
  try {
    if (typeof window.operamini !== "undefined") return true;
    return /Opera Mini/i.test(navigator.userAgent);
  } catch (e) {
    return false;
  }
}

/* ----------------- Wire up (DOMContentLoaded) ---------- */

window.addEventListener("DOMContentLoaded", () => {
  // Prefill form
  const saved = loadLocal();
  if (saved.fullName) document.getElementById("fullName").value = saved.fullName;
  if (saved.dob) document.getElementById("dob").value = saved.dob;
  if (saved.tob) document.getElementById("tob").value = saved.tob;
  if (saved.utcOffset) document.getElementById("utcOffset").value = saved.utcOffset;

  // Draw base wheel at load
  // If Opera Mini detected we'll rely on fallback image route (server) if implemented.
  const wheelWrap = document.getElementById("wheelWrap");
  if (isOperaMini()) {
    // show a placeholder and attempt to load server-side SVG image if route exists
    if (wheelWrap) {
      const fallback = document.createElement("img");
      fallback.alt = "KP Wheel (static fallback)";
      fallback.src = "/wheel-svg"; // server route must serve SVG; optional
      fallback.style.width = "100%";
      // remove any empty svg (if present)
      const existingSvg = document.getElementById("kpWheel");
      if (existingSvg && existingSvg.parentNode) existingSvg.parentNode.removeChild(existingSvg);
      wheelWrap.insertBefore(fallback, wheelWrap.firstChild);
    }
  } else {
    // non-mini: draw client-side wheel
    drawBaseWheel("kpWheel");
  }

  // normalize utc on blur
  const utcEl = document.getElementById("utcOffset");
  if (utcEl) {
    utcEl.addEventListener("blur", () => {
      utcEl.value = normalizeUtcOffset(utcEl.value);
    });
  }

  // Analyze/preview button
  const analyzeBtn = document.getElementById("analyzeBtn");
  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
      const state = readForm();
      if (!state.ok) return alert(state.errors.join("\n"));
      saveLocal(state.data);
      showPreview(state.data);

      // DEMO: temporary planet positions (replace with API/calculation)
      const demoPlanets = [
        { name: "Sun", deg: 123.45 },
        { name: "Moon", deg: 200.12 },
        { name: "Merc", deg: 15.6 },
        { name: "Venus", deg: 47.9 },
        { name: "Mars", deg: 302.3 },
        { name: "Jupiter", deg: 88.7 },
        { name: "Saturn", deg: 255.2 }
      ];

      // draw & plot
      drawBaseWheel("kpWheel");
      plotPlanets("kpWheel", demoPlanets);

      // show Vimshottari example using Moon deg
      const dashas = calcVimshottari(demoPlanets[1].deg, state.data.dob);
      // display in simple modal/alert or render below
      let txt = "Vimshottari (demo)\\n";
      dashas.forEach(d => txt += `${d.lord} : ${d.from} → ${d.to} (${d.years} y)\\n`);
      // small on-screen area preferred, but using alert for now:
      console.log(txt);
      // create a lightweight results area
      let out = document.getElementById("kpResults");
      if (!out) {
        out = document.createElement("pre");
        out.id = "kpResults";
        out.style.background = "rgba(255,255,255,0.04)";
        out.style.padding = "10px";
        out.style.borderRadius = "8px";
        out.style.margin = "12px auto";
        out.style.maxWidth = "700px";
        out.style.color = "#e2f0ff";
        document.body.insertBefore(out, document.querySelector(".container").nextSibling);
      }
      out.textContent = txt;
    });
  }

  // Free PDF button
  const freePdfBtn = document.getElementById("freePdfBtn");
  if (freePdfBtn) {
    freePdfBtn.addEventListener("click", async () => {
      const state = readForm();
      if (!state.ok) return alert(state.errors.join("\\n"));
      saveLocal(state.data);
      const { fullName, dob, tob, utcOffset } = state.data;
      const text = [
        `Name: ${fullName}`,
        `Birth: ${dob} ${tob} (${utcOffset})`,
        ``,
        "This is a FREE summary. Detailed KP Sub-Lord, Star-Lord,",
        "Ruling Planets, Bhava cusps, Vimshottari, and predictions",
        "will appear in the Full Life Report."
      ].join("\\n");
      await makePdf(`KP_Free_${fullName || "Report"}.pdf`, text, { watermark: "FREE" });
    });
  }

  // Life PDF button
  const lifePdfBtn = document.getElementById("lifePdfBtn");
  if (lifePdfBtn) {
    lifePdfBtn.addEventListener("click", async () => {
      const state = readForm();
      if (!state.ok) return alert(state.errors.join("\\n"));
      saveLocal(state.data);
      const { fullName, dob, tob, utcOffset } = state.data;

      // If you later compute real KP analysis, replace the placeholder lines below
      const text = [
        `Full Life Report – Input`,
        `Name: ${fullName}`,
        `Birth: ${dob} ${tob} (${utcOffset})`,
        ``,
        "• KP Sub-Lord analysis",
        "• Nakshatra & Star-Lord",
        "• Ruling Planets",
        "• Cuspal Interlinks",
        "• Vimshottari Dasha timeline",
        "• Prediction summary",
        ``,
        "© Sathyadarshana · All rights reserved."
      ].join("\\n");

      await makePdf(`KP_Life_${fullName || "Report"}.pdf`, text);
    });
  }
});
