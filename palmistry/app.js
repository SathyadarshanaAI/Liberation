// === Sathyadarshana Quantum Palm Analyzer V7.3.3 · Divine Energy Wave Edition ===
import { translateReport } from './translator.js';

const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight;

// ===== STATUS HELPER =====
function msg(text, ok = true) {
  statusEl.textContent = text;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ===== CAMERA =====
async function startCam(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = stream;
    if (side === "left") streamLeft = stream; else streamRight = stream;
    msg(`${side} camera active ✅`);
  } catch (e) {
    alert("Please allow camera access.");
    msg("Camera permission denied ❌", false);
  }
}

// ===== TORCH =====
async function toggleTorch(side) {
  const stream = side === "left" ? streamLeft : streamRight;
  if (!stream) return alert("Start camera first!");
  const track = stream.getVideoTracks()[0];
  const caps = track.getCapabilities();
  if (!caps.torch) return alert("Torch not supported on this device");
  const settings = track.getSettings();
  const torch = !settings.torch;
  await track.applyConstraints({ advanced: [{ torch }] });
  msg(torch ? "💡 Torch On" : "Torch Off");
}

// ===== CAPTURE =====
function capture(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const cv = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = cv.getContext("2d");
  ctx.drawImage(vid, 0, 0, cv.width, cv.height);
  cv.dataset.locked = "1";
  const aura = analyzeAura(cv);
  drawAuraOverlay(cv, aura.color);
  drawPalmLines(cv);
  setAuraRing(side, aura.color);
  cv.dataset.aura = aura.type;
  flash(cv);
  msg(`${side} hand captured 🔒 (${aura.type})`);
}

// ===== AURA ANALYZER =====
function analyzeAura(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h).data;
  let r = 0, g = 0, b = 0, c = 0;
  for (let i = 0; i < data.length; i += 40) { r += data[i]; g += data[i + 1]; b += data[i + 2]; c++; }
  r /= c; g /= c; b /= c;
  const hue = rgbToHue(r, g, b);
  let color = "#ffffff", type = "Neutral";
  if (hue < 25 || hue > 340) { color = "#ff3333"; type = "Active (Red)"; }
  else if (hue < 60) { color = "#ffd700"; type = "Divine (Gold)"; }
  else if (hue < 140) { color = "#00ff88"; type = "Healing (Green)"; }
  else if (hue < 220) { color = "#3399ff"; type = "Peaceful (Blue)"; }
  else if (hue < 300) { color = "#cc66ff"; type = "Mystic (Violet)"; }
  return { color, type };
}
function rgbToHue(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = (60 * ((g - b) / d) + 360) % 360;
  else if (max === g) h = (60 * ((b - r) / d) + 120) % 360;
  else h = (60 * ((r - g) / d) + 240) % 360;
  return h;
}

// ===== AURA OVERLAY =====
function drawAuraOverlay(cv, color) {
  const ctx = cv.getContext("2d");
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(cv.width / 2, cv.height / 2, 20, cv.width / 2, cv.height / 2, 160);
  g.addColorStop(0, color + "55");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.globalCompositeOperation = "source-over";
}
function setAuraRing(side, color) {
  const ring = side === "left" ? $("auraLeft") : $("auraRight");
  ring.style.boxShadow = `0 0 40px 15px ${color}`;
}

// ===== PALM LINES =====
function drawPalmLines(cv) {
  const ctx = cv.getContext("2d");
  ctx.strokeStyle = "#16f0a7";
  ctx.lineWidth = 1.4;
  const w = cv.width, h = cv.height;
  const lines = [
    [[w * 0.35, h * 0.7], [w * 0.2, h * 0.5, w * 0.4, h * 0.25]],
    [[w * 0.3, h * 0.5], [w * 0.75, h * 0.45]],
    [[w * 0.25, h * 0.35], [w * 0.8, h * 0.32]],
    [[w * 0.5, h * 0.85], [w * 0.55, h * 0.25]],
    [[w * 0.65, h * 0.9], [w * 0.7, h * 0.4]],
    [[w * 0.4, h * 0.85], [w * 0.65, h * 0.6]],
    [[w * 0.7, h * 0.8], [w * 0.8, h * 0.5]],
    [[w * 0.7, h * 0.2], [w * 0.8, h * 0.2]]
  ];
  for (const [a, b] of lines) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    if (b.length === 4) ctx.quadraticCurveTo(b[0], b[1], b[2], b[3]);
    else ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  }
}

// ===== VERIFY =====
function verifyLock() {
  const L = $("canvasLeft").dataset.locked === "1";
  const R = $("canvasRight").dataset.locked === "1";
  if (!L || !R) { alert("Capture both Left & Right hands first!"); return false; }
  return true;
}

// ===== ANALYZER =====
async function startAnalyzer() {
  if (!verifyLock()) return;
  const aL = $("canvasLeft").dataset.aura || "Unknown";
  const aR = $("canvasRight").dataset.aura || "Unknown";
  const report = generateFullReport(aL, aR);
  $("reportBox").textContent = report;

  const lang = $("language").value;
  const translated = await translateReport(report, lang);
  $("reportBox").textContent += "\n\n" + translated;
  msg("🧠 Divine Energy Report Generated");
}

// ===== REPORTS =====
function generateFullReport(aL, aR) {
  return `
AI Buddhi Deep Palm Analysis – Divine Energy Wave Edition
---------------------------------------------------------
Life Line: Strength, vitality, self-healing.
Head Line: Vision & clarity of thought.
Heart Line: Compassion and emotional truth.
Fate Line: Direction and karmic purpose.
Sun Line: Recognition through wisdom.
Mercury Line: Communication and intuition.
Health Line: Sensitivity and renewal.
Marriage Line: Trust, harmony, and continuity.
Left Aura: ${aL}
Right Aura: ${aR}
When auras pulse together, divine equilibrium manifests.`;
}

// ===== PDF + VOICE =====
function makePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.text("Sathyadarshana Quantum Palm Analyzer V7.3.3 · Divine Energy Wave Edition", 10, 10);
  pdf.text($("reportBox").textContent, 10, 20, { maxWidth: 180 });
  pdf.save("DivineEnergyWave_Report.pdf");
}
function speak() {
  const t = $("reportBox").textContent, lang = $("language").value;
  const u = new SpeechSynthesisUtterance(t);
  u.lang = lang === "si" ? "si-LK" : "en-US";
  speechSynthesis.speak(u);
}

// ===== FLASH =====
function flash(cv) {
  cv.style.boxShadow = "0 0 15px #16f0a7";
  setTimeout(() => (cv.style.boxShadow = "none"), 900);
}

// ===== EVENTS =====
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");
$("torchLeft").onclick = () => toggleTorch("left");
$("torchRight").onclick = () => toggleTorch("right");
$("analyzeBtn").onclick = startAnalyzer;
$("saveBtn").onclick = makePDF;
$("speakBtn").onclick = speak;
$("language").onchange = e => msg(`🌐 Language: ${e.target.value}`);// --- CAMERA DEBUG TEST ---
(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    console.log("✅ Camera stream obtained:", stream);
    msg("✅ Camera access OK");
  } catch (e) {
    console.error("❌ Camera error:", e);
    msg("❌ Camera error: " + e.message, false);
  }
})();
