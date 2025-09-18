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

// ---- Helpers ---------------------------------------------------------------

/** Normalize user-typed UTC offset like "+5 30", "+5.30", "0530" -> "+05:30" */
function normalizeUtcOffset(raw) {
  if (!raw) return "";
  let s = raw.trim().replace(/\u00A0/g, " "); // NBSP -> space
  // Replace dot or space with colon
  s = s.replace(/[.\s]/g, ":");
  // If only digits like +0530 or -1130
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
  localStorage.setItem("kpChartForm", JSON.stringify(fields));
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

// Simple PDF with jsPDF (very light)
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

// ---- Wire up ---------------------------------------------------------------

window.addEventListener("DOMContentLoaded", () => {
  // Prefill from local storage (nice on mobile)
  const saved = loadLocal();
  if (saved.fullName) document.getElementById("fullName").value = saved.fullName;
  if (saved.dob) document.getElementById("dob").value = saved.dob;
  if (saved.tob) document.getElementById("tob").value = saved.tob;
  if (saved.utcOffset) document.getElementById("utcOffset").value = saved.utcOffset;

  // Normalize offset live (space -> colon etc.)
  const utcEl = document.getElementById("utcOffset");
  utcEl.addEventListener("blur", () => {
    utcEl.value = normalizeUtcOffset(utcEl.value);
  });

  document.getElementById("analyzeBtn").addEventListener("click", () => {
    const state = readForm();
    if (!state.ok) return alert(state.errors.join("\n"));
    saveLocal(state.data);
    showPreview(state.data);
  });

  document.getElementById("freePdfBtn").addEventListener("click", async () => {
    const state = readForm();
    if (!state.ok) return alert(state.errors.join("\n"));
    saveLocal(state.data);

    const { fullName, dob, tob, utcOffset } = state.data;
    const text = [
      `Name: ${fullName}`,
      `Birth: ${dob} ${tob} (${utcOffset})`,
      "",
      "This is a FREE summary. Detailed KP Sub-Lord, Star-Lord,",
      "Ruling Planets, Bhava cusps, Vimshottari, and predictions",
      "will appear in the Full Life Report."
    ].join("\n");
    await makePdf(`KP_Free_${fullName || "Report"}.pdf`, text, { watermark: "FREE" });
  });

  document.getElementById("lifePdfBtn").addEventListener("click", async () => {
    const state = readForm();
    if (!state.ok) return alert(state.errors.join("\n"));
    saveLocal(state.data);

    // TODO: plug real KP calculations here, then build rich PDF
    const { fullName, dob, tob, utcOffset } = state.data;
    const text = [
      `Full Life Report – Input`,
      `Name: ${fullName}`,
      `Birth: ${dob} ${tob} (${utcOffset})`,
      "",
      "• KP Sub-Lord analysis",
      "• Nakshatra & Star-Lord",
      "• Ruling Planets",
      "• Cuspal Interlinks",
      "• Vimshottari Dasha timeline",
      "• Prediction summary",
      "",
      "© Sathyadarshana · All rights reserved."
    ].join("\n");

    await makePdf(`KP_Life_${fullName || "Report"}.pdf`, text);
  });
});
