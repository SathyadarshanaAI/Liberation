// === Sathyadarshana Quantum Palm Analyzer V7.2 · AI Buddhi Stable ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight;

// ====== Helper for Status ======
function msg(text, ok = true) {
  statusEl.textContent = text;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ====== Camera Control ======
async function startCam(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = stream;
    if (side === "left") streamLeft = stream; else streamRight = stream;
    msg(`${side} camera started ✅`);
  } catch (e) {
    alert("Please allow camera access in site settings.");
    msg("Camera blocked ❌", false);
  }
}

// ====== Capture Hand ======
function capture(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const canvas = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  canvas.dataset.locked = "1";
  flash(canvas);
  const aura = analyzeAura(canvas);
  drawAuraOverlay(canvas, aura.color);
  canvas.dataset.aura = aura.type;
  msg(`${side} hand locked 🔒 (${aura.type} aura)`);
}

// ====== Flash Animation ======
function flash(cv) {
  cv.style.boxShadow = "0 0 18px #16f0a7";
  setTimeout(() => (cv.style.boxShadow = "none"), 700);
}

// ====== Aura Detection ======
function analyzeAura(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h).data;
  let r = 0, g = 0, b = 0, count = 0;
  for (let i = 0; i < data.length; i += 20) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
  }
  r /= count; g /= count; b /= count;
  const hue = rgbToHue(r, g, b);
  let color = "#ffffff", type = "Neutral";
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
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = (60 * ((g - b) / d) + 360) % 360;
  else if (max === g) h = (60 * ((b - r) / d) + 120) % 360;
  else h = (60 * ((r - g) / d) + 240) % 360;
  return h;
}

// ====== Aura Overlay ======
function drawAuraOverlay(canvas, color) {
  const ctx = canvas.getContext("2d");
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 30,
    canvas.width / 2, canvas.height / 2, 160
  );
  g.addColorStop(0, color + "33");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = "source-over";
}

// ====== Verify both hands ======
function verifyLock() {
  const L = $("canvasLeft").dataset.locked === "1";
  const R = $("canvasRight").dataset.locked === "1";
  if (!L || !R) { alert("Capture both Left and Right hands before Analyze!"); return false; }
  return true;
}

// ====== Analyzer ======
function startAnalyzer() {
  if (!verifyLock()) return;
  const aL = $("canvasLeft").dataset.aura || "Unknown";
  const aR = $("canvasRight").dataset.aura || "Unknown";
  const report = generateAuraReport(aL, aR);
  showReport(report);
  translateAndSpeak(report);
  makePDF(report);
  msg("✅ AI Buddhi Report ready.");
}

// ====== Report Builder ======
function generateAuraReport(aL, aR) {
  return `
AI Buddhi Palm & Aura Report (Mini Mode)
----------------------------------------
Left Aura  : ${aL}
Right Aura : ${aR}

Interpretation:
Your left hand represents inner potential, memory, and inherited karma.
Your right hand mirrors your conscious actions and spiritual progress.

If your left aura differs from right, transformation is active.
If both harmonize, balance and awakening are near.

© 2025 Sathyadarshana Quantum Division · AI Buddhi
  `.trim();
}

// ====== Report Display ======
function showReport(text) {
  $("reportBox").textContent = text;
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// ====== Translation + Voice + PDF ======
async function translateAndSpeak(text) {
  const lang = $("language").value;
  const translated = await translateText(text, lang);
  speak(translated, lang);
}

async function translateText(text, lang) {
  if (lang === "en") return text;
  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
    const json = await res.json();
    return json[0].map(x => x[0]).join("");
  } catch {
    msg("🌐 Offline mode – translation skipped.", false);
    return text;
  }
}

function speak(t, lang) {
  const utter = new SpeechSynthesisUtterance(t);
  utter.lang = langMap(lang);
  utter.rate = 1;
  speechSynthesis.speak(utter);
}
function langMap(l) {
  const m = { si: "si-LK", ta: "ta-IN", hi: "hi-IN", zh: "zh-CN", ja: "ja-JP", fr: "fr-FR", de: "de-DE", es: "es-ES", it: "it-IT", ru: "ru-RU", ar: "ar-SA" };
  return m[l] || "en-US";
}

function makePDF(text) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  doc.setFontSize(12);
  doc.text("Sathyadarshana Quantum Palm Analyzer V7.2", 10, 10);
  doc.text(text, 10, 20, { maxWidth: 180 });
  doc.save("QuantumPalm_AuraReport.pdf");
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
