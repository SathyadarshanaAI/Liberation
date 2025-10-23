// === Sathyadarshana Quantum Palmistry V8.0 – Single Intelligent Scanner Edition ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamMain, track, torchOn = false;

// ===== STATUS =====
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ===== CAMERA =====
async function startCam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" },
      audio: false
    });
    streamMain = stream;
    const vid = $("vidMain");
    vid.srcObject = stream;
    await vid.play();
    msg("Camera active ✅");
    const tracks = stream.getVideoTracks();
    if (tracks[0].getCapabilities().torch) track = tracks[0];
  } catch (e) {
    msg("Camera access denied ❌", false);
  }
}

// ===== TORCH CONTROL =====
async function toggleTorch() {
  if (!track) return msg("Torch not supported 🔦", false);
  try {
    torchOn = !torchOn;
    await track.applyConstraints({ advanced: [{ torch: torchOn }] });
    msg(torchOn ? "Torch ON 💡" : "Torch OFF 🌑");
  } catch (e) {
    msg("Torch control error ⚠️", false);
  }
}

// ===== CAPTURE =====
function capture() {
  const vid = $("vidMain");
  const cv = $("canvasMain");
  const ctx = cv.getContext("2d");
  ctx.drawImage(vid, 0, 0, cv.width, cv.height);
  flash(cv);
  msg("Image captured 🔒");
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
  const g = ctx.createRadialGradient(cv.width / 2, cv.height / 2, 10, cv.width / 2, cv.height / 2, 180);
  g.addColorStop(0, color + "55");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.globalCompositeOperation = "source-over";
}

// ===== ANALYZE & REPORT =====
function analyze() {
  const aura = analyzeAura($("canvasMain"));
  const report = `
AI Buddhi Report — Single Intelligent Scanner
--------------------------------------------
Aura Type : ${aura}
Meaning   : ${(aura==="Healing (Green)")?"Balance, recovery, and renewal.":(aura==="Active (Red)")?"Vital drive and courage.":"Inner harmony and intuition."}
--------------------------------------------
Sathyadarshana Quantum Palmistry · Divine Structure of Life
`;
  $("reportBox").textContent = report;
  speak(report);
  msg("🧠 Analysis complete");
}

// ===== PDF + SPEECH =====
function makePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.text("Sathyadarshana Quantum Palmistry V8.0 – Single Intelligent Scanner Edition", 10, 10);
  pdf.text($("reportBox").textContent, 10, 20, { maxWidth: 180 });
  pdf.save("Sathyadarshana_Report.pdf");
}

function speak(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  speechSynthesis.speak(u);
}

// ===== FLASH EFFECT =====
function flash(cv) {
  cv.style.boxShadow = "0 0 20px #16f0a7";
  setTimeout(() => (cv.style.boxShadow = "none"), 900);
}

// ===== EVENTS =====
$("startBtn").onclick = startCam;
$("captureBtn").onclick = capture;
$("torchBtn").onclick = toggleTorch;
$("analyzeBtn").onclick = analyze;
$("saveBtn").onclick = makePDF;
$("speakBtn").onclick = () => speak($("reportBox").textContent);
