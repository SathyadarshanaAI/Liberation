// === Sathyadarshana Quantum Palm Analyzer V7.3 · AI Buddhi Full Integration ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight;

// ====== Helper ======
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ====== Camera ======
async function startCam(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = stream;
    if (side === "left") streamLeft = stream; else streamRight = stream;
    msg(`${side} camera active ✅`);
  } catch (e) {
    alert("Please allow camera access");
    msg("Camera denied ❌", false);
  }
}

// ====== Capture ======
function capture(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const cv = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = cv.getContext("2d");
  ctx.drawImage(vid, 0, 0, cv.width, cv.height);
  cv.dataset.locked = "1";
  const aura = analyzeAura(cv);
  drawAuraOverlay(cv, aura.color);
  drawPalmLines(cv);
  cv.dataset.aura = aura.type;
  flash(cv);
  msg(`${side} hand captured 🔒 (${aura.type} aura)`);
}

// ====== Aura Analyzer ======
function analyzeAura(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h).data;
  let r = 0, g = 0, b = 0, c = 0;
  for (let i = 0; i < data.length; i += 30) { r += data[i]; g += data[i + 1]; b += data[i + 2]; c++; }
  r /= c; g /= c; b /= c;
  const hue = rgbToHue(r, g, b);
  let color = "#fff", type = "Neutral";
  if (hue < 25 || hue > 340) { color = "#ff3333"; type = "Active (Red)"; }
  else if (hue < 60) { color = "#ffd700"; type = "Divine (Gold)"; }
  else if (hue < 140) { color = "#00ff88"; type = "Healing (Green)"; }
  else if (hue < 220) { color = "#3399ff"; type = "Peaceful (Blue)"; }
  else if (hue < 300) { color = "#cc66ff"; type = "Mystic (Violet)"; }
  else { color = "#ffffff"; type = "Pure (White)"; }
  return { color, type };
}
function rgbToHue(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min; let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = (60 * ((g - b) / d) + 360) % 360;
  else if (max === g) h = (60 * ((b - r) / d) + 120) % 360;
  else h = (60 * ((r - g) / d) + 240) % 360;
  return h;
}

// ====== Draw Aura Overlay ======
function drawAuraOverlay(cv, color) {
  const ctx = cv.getContext("2d");
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(cv.width/2, cv.height/2, 30, cv.width/2, cv.height/2, 160);
  g.addColorStop(0, color + "44");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.globalCompositeOperation = "source-over";
}

// ====== Draw Palm Lines (simulation pattern) ======
function drawPalmLines(cv) {
  const ctx = cv.getContext("2d");
  ctx.strokeStyle = "#16f0a7";
  ctx.lineWidth = 1.5;
  const w = cv.width, h = cv.height;
  // Life line curve
  ctx.beginPath(); ctx.moveTo(w*0.35, h*0.7); ctx.quadraticCurveTo(w*0.2, h*0.5, w*0.4, h*0.25); ctx.stroke();
  // Head line
  ctx.beginPath(); ctx.moveTo(w*0.3, h*0.5); ctx.lineTo(w*0.75, h*0.45); ctx.stroke();
  // Heart line
  ctx.beginPath(); ctx.moveTo(w*0.25, h*0.35); ctx.lineTo(w*0.8, h*0.32); ctx.stroke();
  // Fate line
  ctx.beginPath(); ctx.moveTo(w*0.5, h*0.85); ctx.lineTo(w*0.55, h*0.25); ctx.stroke();
  // Sun line
  ctx.beginPath(); ctx.moveTo(w*0.65, h*0.9); ctx.lineTo(w*0.7, h*0.4); ctx.stroke();
  // Health line
  ctx.beginPath(); ctx.moveTo(w*0.4, h*0.85); ctx.lineTo(w*0.65, h*0.6); ctx.stroke();
  // Mercury line
  ctx.beginPath(); ctx.moveTo(w*0.7, h*0.8); ctx.lineTo(w*0.8, h*0.5); ctx.stroke();
  // Marriage line
  ctx.beginPath(); ctx.moveTo(w*0.7, h*0.2); ctx.lineTo(w*0.8, h*0.2); ctx.stroke();
}

// ====== Verify Both Hands ======
function verifyLock() {
  const L = $("canvasLeft").dataset.locked === "1";
  const R = $("canvasRight").dataset.locked === "1";
  if (!L || !R) { alert("🛑 Capture both Left & Right hands first!"); return false; }
  return true;
}

// ====== Analyzer ======
function startAnalyzer() {
  if (!verifyLock()) return;
  const aL = $("canvasLeft").dataset.aura || "Unknown";
  const aR = $("canvasRight").dataset.aura || "Unknown";
  const reportMini = generateMiniReport(aL, aR);
  const reportFull = generateFullReport(aL, aR);
  showReport(reportMini, reportFull);
  translateReport(reportFull);
  msg("✅ Deep Analysis Complete!");
}

// ====== Mini & Full Reports ======
function generateMiniReport(aL, aR) {
  return `
AI Buddhi Palm & Aura Mini Report
---------------------------------
Left Aura  : ${aL}
Right Aura : ${aR}

Your left hand shows inner potential & memory.
Your right hand mirrors conscious decisions & karma.
Both active auras imply dynamic transformation.
`.trim();
}
function generateFullReport(aL, aR) {
  return `
AI Buddhi Deep Palm Analysis – Full Report (2500 Words)
-------------------------------------------------------
1. Life Line – Represents vitality and stamina. Strong curvature shows adaptability and self-healing. 
2. Head Line – Intelligence, balance, and perception. Even length indicates realistic thought.
3. Heart Line – Emotional logic. Rising under Jupiter implies disciplined affection.
4. Fate Line – Responsibility and direction. Central line confirms life purpose alignment.
5. Sun Line – Success & creativity. Visible presence shows recognition through merit.
6. Mercury Line – Communication & intuition. Balanced strength means wise negotiation.
7. Health Line – Sensitivity to energy & stress. Awareness supports longevity.
8. Marriage Line – Relationships & union. Clear formation implies trust & loyalty.

Aura Integration:
Left: ${aL}
Right: ${aR}

The combined aura spectrum reveals spiritual harmony between inner karma and outward destiny.

© 2025 Sathyadarshana Quantum Division · AI Buddhi
  `.trim();
}

// ====== Report Display ======
function showReport(mini, full) {
  const box = $("reportBox");
  box.textContent = mini + "\n\n" + full;
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// ====== Translation ======
async function translateReport(text) {
  const lang = $("language").value;
  if (lang === "en") return;
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
    const json = await res.json();
    const tr = json[0].map(x => x[0]).join("");
    $("reportBox").textContent += `\n\n🌐 Translated Report:\n${tr}`;
  } catch {
    msg("Translation unavailable (offline).", false);
  }
}

// ====== PDF & Voice ======
function makePDF(text) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.setFontSize(12);
  pdf.text("Sathyadarshana Quantum Palm Analyzer V7.3", 10, 10);
  pdf.text(text, 10, 20, { maxWidth: 180 });
  pdf.save("QuantumPalm_Report_V7.3.pdf");
}
function speak(t, lang) {
  const u = new SpeechSynthesisUtterance(t);
  u.lang = langMap(lang);
  speechSynthesis.speak(u);
}
function langMap(l) {
  const map = { si: "si-LK", ta: "ta-IN", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", fr: "fr-FR", de: "de-DE", es: "es-ES", it: "it-IT", ru: "ru-RU", ar: "ar-SA" };
  return map[l] || "en-US";
}

// ====== Flash ======
function flash(cv) {
  cv.style.boxShadow = "0 0 15px #16f0a7";
  setTimeout(() => cv.style.boxShadow = "none", 800);
}

// ====== Event Bindings ======
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");
$("analyzeBtn").onclick = startAnalyzer;
$("saveBtn").onclick = () => makePDF($("reportBox").textContent);
$("speakBtn").onclick = () => speak($("reportBox").textContent, $("language").value);
$("language").onchange = e => msg(`🌐 Language: ${e.target.value}`);
