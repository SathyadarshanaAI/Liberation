// app.js — Sathyadarshana Quantum Palm Analyzer V8.7 Final Standalone Edition
// © 2025 Buddhi

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportBox = $("reportBox");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

let torchState = false;

// 🔊 Voice System — 12 Language auto-detect
function speakReport(text, lang = "en") {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(text);
    const langMap = {
      en: "en-US", si: "si-LK", ta: "ta-IN", hi: "hi-IN",
      fr: "fr-FR", de: "de-DE", es: "es-ES", zh: "zh-CN",
      ja: "ja-JP", ko: "ko-KR", ar: "ar-SA", ru: "ru-RU"
    };
    u.lang = langMap[lang] || "en-US";
    u.rate = 0.95;
    u.pitch = 1.0;
    u.volume = 1;
    synth.cancel();
    setTimeout(() => synth.speak(u), 300);
  } catch (e) {
    console.warn("Voice error:", e);
  }
}

// 🌐 Auto language detect
function detectLang() {
  const l = navigator.language?.slice(0, 2);
  const supported = ["en", "si", "ta", "hi", "fr", "de", "es", "zh", "ja", "ko", "ar", "ru"];
  return supported.includes(l) ? l : "en";
}

// 💡 Torch toggle (if supported)
async function toggleTorch(side = "left") {
  try {
    const video = side === "left" ? leftVid : rightVid;
    const stream = video.srcObject;
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

// 🎥 Camera start
async function startCam(side) {
  const video = side === "left" ? leftVid : rightVid;
  msg(`Requesting ${side} camera...`);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = stream;
    await video.play();
    await new Promise(res => {
      if (video.readyState >= 2) res();
      else video.onloadedmetadata = () => res();
    });
    msg(`${side} camera started ✅`);
  } catch (err) {
    msg(`❌ Camera Error: ${err.message}`, false);
  }
}

// 📸 Capture frame
function capture(side) {
  const video = side === "left" ? leftVid : rightVid;
  const canvas = side === "left" ? leftCv : rightCv;
  if (!video.srcObject) { msg("⚠️ Start camera first!", false); return false; }
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  msg(`${side} hand captured 🔒`);
  return true;
}

// 🧠 Fake AI Analyzer (demo logic)
async function analyze(side) {
  if (!capture(side)) return;
  msg(`Analyzing ${side} hand...`);
  await new Promise(r => setTimeout(r, 800)); // simulate delay

  const time = new Date().toLocaleTimeString();
  const lang = detectLang();
  const summary = side === "left"
    ? "Past life skills and karmic influences detected. Strong intuition present."
    : "Current destiny line active. Creative and spiritual tendencies visible.";
  const lines = [
    "• Life Line: Deep and long — strong vitality",
    "• Head Line: Steady — clarity of thought",
    "• Heart Line: Balanced — calm emotion",
    "• Fate Line: Moderate — self-made path"
  ].join("\n");

  reportBox.textContent =
    `🕒 ${time}\n${side.toUpperCase()} HAND REPORT\n${summary}\n${"-".repeat(40)}\n${lines}`;

  speakReport(summary, lang);
  msg(`✅ ${side} hand analyzed`);
}

// UI bindings
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => analyze("left");
$("captureRight").onclick = () => analyze("right");

// Optional Torch buttons (if you add <button id="torchLeft">Torch</button>)
if ($("torchLeft")) $("torchLeft").onclick = () => toggleTorch("left");
if ($("torchRight")) $("torchRight").onclick = () => toggleTorch("right");

// 🪷 Status helper
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// Init check
(async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    msg("❌ Camera not supported on this device", false);
  } else {
    msg("Ready — Tap Start → Analyze ✨");
  }
})();
