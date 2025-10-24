// app.js — Sathyadarshana Quantum Palm Analyzer V8.8 Divine Analyzer Edition
// © 2025 Buddhi

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportBox = $("reportBox");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

let torchState = false;

// === Language Auto Detect + Voice ===
function detectLang() {
  const l = navigator.language?.slice(0, 2);
  const supported = ["en", "si", "ta", "hi", "fr", "de", "es", "zh", "ja", "ko", "ar", "ru"];
  return supported.includes(l) ? l : "en";
}
function speakReport(text, lang = "en") {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(text);
    const map = {
      en: "en-US", si: "si-LK", ta: "ta-IN", hi: "hi-IN", fr: "fr-FR",
      de: "de-DE", es: "es-ES", zh: "zh-CN", ja: "ja-JP",
      ko: "ko-KR", ar: "ar-SA", ru: "ru-RU"
    };
    u.lang = map[lang] || "en-US";
    u.rate = 0.95; u.pitch = 1.0; u.volume = 1;
    synth.cancel(); setTimeout(() => synth.speak(u), 300);
  } catch (e) { console.warn("Voice Error:", e); }
}

// === Torch Toggle ===
async function toggleTorch(side = "left") {
  try {
    const vid = side === "left" ? leftVid : rightVid;
    const stream = vid.srcObject;
    if (!stream) throw new Error("Camera not started");
    const track = stream.getVideoTracks()[0];
    const caps = track.getCapabilities();
    if (!caps.torch) throw new Error("Torch not supported");
    torchState = !torchState;
    await track.applyConstraints({ advanced: [{ torch: torchState }] });
    msg(torchState ? "🔦 Torch ON" : "💡 Torch OFF");
  } catch (e) {
    msg(`Torch: ${e.message}`, false);
  }
}

// === Camera Control ===
async function startCam(side) {
  const vid = side === "left" ? leftVid : rightVid;
  msg(`Requesting ${side} camera...`);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, audio: false
    });
    vid.srcObject = stream;
    await vid.play();
    await new Promise(r => { if (vid.readyState >= 2) r(); else vid.onloadedmetadata = () => r(); });
    msg(`${side} camera started ✅`);
  } catch (err) {
    msg(`❌ Camera Error: ${err.message}`, false);
  }
}

// === Capture Frame ===
function capture(side) {
  const vid = side === "left" ? leftVid : rightVid;
  const cv = side === "left" ? leftCv : rightCv;
  if (!vid.srcObject) { msg("⚠️ Start camera first!", false); return false; }
  const ctx = cv.getContext("2d");
  cv.width = vid.videoWidth; cv.height = vid.videoHeight;
  ctx.drawImage(vid, 0, 0, cv.width, cv.height);
  msg(`${side} hand captured 🔒`);
  return true;
}

// === Analyzer Core ===
async function analyze(side, mode = "mini") {
  if (!capture(side)) return;
  msg(`Analyzing ${side} hand (${mode})...`);
  await new Promise(r => setTimeout(r, 1000)); // simulate delay
  const now = new Date().toLocaleTimeString();
  const lang = detectLang();

  const baseSummary = side === "left"
    ? "Past karmic flow, talents, and soul memory."
    : "Present life path and active destiny patterns.";

  const baseLines = [
    "• Life Line: strong vitality, balanced energy",
    "• Head Line: clear and practical thought",
    "• Heart Line: stable emotions with empathy",
    "• Fate Line: gradual rise through self-effort",
    "• Sun Line: artistic vision awakening",
    "• Health Line: steady balance and recovery",
    "• Marriage Line: karmic connection influence",
    "• Manikanda Ring: spiritual awakening sign"
  ];

  const miniText = `${side.toUpperCase()} HAND SUMMARY\n${baseSummary}`;
  const fullText =
    `${side.toUpperCase()} HAND FULL REPORT\n${baseSummary}\n${"-".repeat(40)}\n` +
    baseLines.join("\n");

  const out = (mode === "full" ? fullText : miniText);
  reportBox.textContent = `🕒 ${now}\n${out}`;
  msg(`✅ ${side} hand ${mode} report ready`);
  speakReport(baseSummary, lang);
}

// === Bindings ===
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => analyze("left", "mini");
$("captureRight").onclick = () => analyze("right", "mini");

// Optional: if you add two new buttons for Full Report
if ($("fullLeft")) $("fullLeft").onclick = () => analyze("left", "full");
if ($("fullRight")) $("fullRight").onclick = () => analyze("right", "full");

// Optional Torch buttons
if ($("torchLeft")) $("torchLeft").onclick = () => toggleTorch("left");
if ($("torchRight")) $("torchRight").onclick = () => toggleTorch("right");

// === Message Helper ===
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// === Init ===
(async () => {
  if (!navigator.mediaDevices?.getUserMedia)
    msg("❌ Camera not supported", false);
  else msg("Ready — Tap Start → Analyze ✨");
})();
