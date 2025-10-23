// === Sathyadarshana Quantum Palm Analyzer V7.4.2 · Light Adaptive Stable Edition ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight;

// ===== STATUS =====
function msg(text, ok = true) {
  statusEl.textContent = text;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ===== CAMERA =====
async function startCam(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" },
      audio: false
    });
    vid.srcObject = stream;
    await vid.play().catch(() => msg("Tap to start video ▶️", false));
    if (side === "left") streamLeft = stream; else streamRight = stream;
    msg(`${side} camera active ✅`);
  } catch (e) {
    msg("Camera access denied ❌", false);
  }
}

// ===== AUTO HAND DETECTOR (V3 – Light Adaptive AI Logic) =====
function detectHandSide(cv) {
  const w = cv.width, h = cv.height;
  const ctx = cv.getContext("2d");
  const img = ctx.getImageData(0, 0, w, h).data;
  let leftSum = 0, rightSum = 0, totalLight = 0;

  for (let y = 0; y < h; y += 4) {
    for (let x = 0; x < 40; x++) {
      const i = (y * w + x) * 4;
      const lum = img[i] + img[i + 1] + img[i + 2];
      leftSum += lum; totalLight += lum;
    }
    for (let x = w - 40; x < w; x++) {
      const i = (y * w + x) * 4;
      const lum = img[i] + img[i + 1] + img[i + 2];
      rightSum += lum; totalLight += lum;
    }
  }

  const diff = rightSum - leftSum;
  const avgLight = totalLight / (w * h);

  // Adaptive threshold based on brightness
  let threshold = 700000;
  if (avgLight > 150) threshold = 1200000;   // daylight
  else if (avgLight < 60) threshold = 400000; // low light

  if (Math.abs(diff) < threshold) {
    msg("🤖 Hand orientation unclear – retry capture", false);
    return "Unknown";
  }
  return diff > 0 ? "Right Hand" : "Left Hand";
}

// ===== CAPTURE + ANALYZE =====
function capture(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const cv = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = cv.getContext("2d");
  ctx.drawImage(vid, 0, 0, cv.width, cv.height);
  flash(cv);

  const hand = detectHandSide(cv);
  if (hand === "Unknown") return; // skip unclear captures

  const aura = analyzeAura(cv);
  drawAuraOverlay(cv, aura.color);
  drawPalmLines(cv);

  cv.dataset.locked = "1";
  cv.dataset.aura = aura.type;
  msg(`${hand} captured 🔒 (${aura.type})`);

  if (hand === "Right Hand") startAnalyzer(); // auto trigger
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
  let color = "#fff", type = "Neutral";
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

// ===== OVERLAYS =====
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
    [[w * 0.65, h * 0.9], [w * 0.7, h * 0.4]]
  ];
  for (const [a, b] of lines) {
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    if (b.length === 4) ctx.quadraticCurveTo(b[0], b[1], b[2], b[3]);
    else ctx.lineTo(b[0], b[1]);
    ctx.stroke();
  }
}

// ===== REPORT =====
function startAnalyzer() {
  const L = $("canvasLeft").dataset.aura || "Unknown";
  const R = $("canvasRight").dataset.aura || "Unknown";
  const mini = generateMiniReport(L, R);
  const full = generateFullReport(L, R);
  $("reportBox").textContent = mini + "\n\n" + full;
  msg("🧠 Divine Energy Report Generated");
}
function generateMiniReport(L, R) {
  return `
AI Buddhi Mini Report
---------------------
Left Aura : ${L}
Right Aura: ${R}
Balance between memory & awareness defines your light.`;
}
function generateFullReport(L, R) {
  return `
AI Buddhi Deep Palm Analysis – Light Adaptive Edition
----------------------------------------------------
Life Line : Vital energy & endurance.
Head Line : Thought clarity & wisdom.
Heart Line : Compassion & emotional truth.
Fate Line : Karma & purpose alignment.
Sun Line  : Inner recognition of light.
Left Aura : ${L}
Right Aura: ${R}
Together they reveal equilibrium between soul & action.`;
}

// ===== PDF + SPEECH =====
function makePDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({ unit: "mm", format: "a4" });
  pdf.text("Sathyadarshana Quantum Palm Analyzer V7.4.2 · Light Adaptive Stable Edition", 10, 10);
  pdf.text($("reportBox").textContent, 10, 20, { maxWidth: 180 });
  pdf.save("LightAdaptive_Report.pdf");
}
function speak() {
  const t = $("reportBox").textContent;
  const u = new SpeechSynthesisUtterance(t);
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
$("saveBtn").onclick = makePDF;
$("speakBtn").onclick = speak;
