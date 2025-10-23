// === Sathyadarshana Quantum Palmistry V8.2 – Dual Intelligent Analyzer Edition ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight, trackLeft, trackRight;
let torchLeftOn = false, torchRightOn = false;

// ===== STATUS =====
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ===== CAMERA =====
async function startCam(side) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" },
      audio: false
    });
    const vid = side === "left" ? $("vidLeft") : $("vidRight");
    vid.srcObject = stream;
    await vid.play();
    if (side === "left") { streamLeft = stream; trackLeft = stream.getVideoTracks()[0]; }
    else { streamRight = stream; trackRight = stream.getVideoTracks()[0]; }
    msg(`${side} camera active ✅`);
  } catch (e) {
    msg(`Camera error (${side}) ❌`, false);
  }
}

// ===== TORCH =====
async function toggleTorch(side) {
  const track = side === "left" ? trackLeft : trackRight;
  if (!track) return msg(`No camera for ${side}`, false);
  const state = side === "left" ? torchLeftOn : torchRightOn;
  try {
    const next = !state;
    await track.applyConstraints({ advanced: [{ torch: next }] });
    if (side === "left") torchLeftOn = next; else torchRightOn = next;
    msg(`${side} torch ${next ? "ON 💡" : "OFF 🌑"}`);
  } catch (e) {
    msg(`Torch failed (${side})`, false);
  }
}

// ===== CAPTURE =====
function capture(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const cv = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = cv.getContext("2d");
  ctx.drawImage(vid, 0, 0, cv.width, cv.height);
  flash(cv);
  msg(`${side} hand captured 🔒`);
}

// ===== AURA ANALYZER =====
function analyzeAura(canvas) {
  const ctx = canvas.getContext("2d");
  const { width: w, height: h } = canvas;
  const data = ctx.getImageData(0, 0, w, h).data;
  let r = 0, g = 0, b = 0, c = 0;
  for (let i = 0; i < data.length; i += 50) {
    r += data[i]; g += data[i + 1]; b += data[i + 2]; c++;
  }
  r /= c; g /= c; b /= c;
  const hue = rgbToHue(r, g, b);
  let color = "#fff", type = "Neutral";
  if (hue < 25 || hue > 340) { color = "#ff3333"; type = "Active (Red)"; }
  else if (hue < 60) { color = "#ffd700"; type = "Divine (Gold)"; }
  else if (hue < 140) { color = "#00ff88"; type = "Healing (Green)"; }
  else if (hue < 220) { color = "#3399ff"; type = "Peaceful (Blue)"; }
  else if (hue < 300) { color = "#cc66ff"; type = "Mystic (Violet)"; }
  drawAuraOverlay(canvas, color);
  return type;
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
function drawAuraOverlay(cv, color) {
  const ctx = cv.getContext("2d");
  ctx.globalCompositeOperation = "lighter";
  const g = ctx.createRadialGradient(cv.width / 2, cv.height / 2, 10, cv.width / 2, cv.height / 2, 160);
  g.addColorStop(0, color + "55");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.globalCompositeOperation = "source-over";
}

// ===== ANALYZE =====
function analyze() {
  const left = analyzeAura($("canvasLeft"));
  const right = analyzeAura($("canvasRight"));
  const report = `
AI Buddhi Dual Analysis Report
--------------------------------------------
Left Aura : ${left}
Right Aura: ${right}

Interpretation:
${left === right
    ? "Your energies are balanced across both aspects of life."
    : "There is a shift between inner awareness and outer action. Maintain harmony."}

Guidance:
Left hand (past & inner self) and right hand (present & outer self)
together define your evolving divine pattern.
--------------------------------------------
Sathyadarshana Quantum Palmistry · Dual Intelligent Analyzer Edition
`;
  $("reportBox").textContent = report;
  speak(report);
  msg("🧠 Dual analysis complete ✅");
}

// ===== PDF + SPEECH =====
function makePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.text("Sathyadarshana Quantum Palmistry V8.2 – Dual Intelligent Analyzer Edition", 10, 10);
  pdf.text($("reportBox").textContent, 10, 20, { maxWidth: 180 });
  pdf.save("Sathyadarshana_Dual_Report.pdf");
}
function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  speechSynthesis.speak(u);
}

// ===== FLASH =====
function flash(cv) {
  cv.style.boxShadow = "0 0 20px #16f0a7";
  setTimeout(() => (cv.style.boxShadow = "none"), 900);
}

// ===== EVENTS =====
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");
$("torchLeft").onclick = () => toggleTorch("left");
$("torchRight").onclick = () => toggleTorch("right");
$("analyzeBtn").onclick = analyze;
$("saveBtn").onclick = makePDF;
$("speakBtn").onclick = () => speak($("reportBox").textContent);
