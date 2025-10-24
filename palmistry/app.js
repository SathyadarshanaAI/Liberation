// app.js — V8.6 Camera + Voice Tuned Edition
// © 2025 Sathyadarshana Research Core

import { runAnalysis } from "./modules/analyzer.js";
import { emit, on } from "./modules/bus.js";
import "./modules/ui-aura.js"; // glow + scroll effect

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportBox = $("reportBox");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

let torchState = false;

// 🗣️ Multilingual Voice system
function speakReport(text, lang = "en") {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const voices = synth.getVoices();
    const u = new SpeechSynthesisUtterance(text);

    const langMap = {
      en: "en-US", si: "si-LK", ta: "ta-IN", hi: "hi-IN",
      fr: "fr-FR", de: "de-DE", es: "es-ES", zh: "zh-CN",
      ja: "ja-JP", ko: "ko-KR", ar: "ar-SA", ru: "ru-RU"
    };
    u.lang = langMap[lang] || "en-US";
    u.rate = 0.95; u.pitch = 1.05; u.volume = 1;
    synth.cancel(); setTimeout(() => synth.speak(u), 300);
  } catch (e) {
    console.warn("Voice Error:", e);
  }
}

// 🌐 detect browser language
function detectLang() {
  const l = navigator.language?.slice(0, 2);
  const supported = ["en", "si", "ta", "hi", "fr", "de", "es", "zh", "ja", "ko", "ar", "ru"];
  return supported.includes(l) ? l : "en";
}

// 🔦 Torch control
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
  } catch (err) {
    msg(`Torch: ${err.message}`, false);
  }
}

// 🎥 Camera startup
async function startCam(side) {
  const video = side === "left" ? leftVid : rightVid;
  try {
    // request permission
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, audio: false
    });
    video.srcObject = stream;
    await video.play();

    // Ensure metadata ready
    await new Promise(r => {
      if (video.readyState >= 2) r();
      else video.onloadedmetadata = () => r();
    });

    msg(`${side} camera started ✅`);
  } catch (err) {
    msg(`Camera Error: ${err.message}`, false);
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

// 🔮 Analyze
async function analyze(side) {
  if (!capture(side)) return;
  msg(`Analyzing ${side} hand...`);
  const start = performance.now();
  try {
    const result = await runAnalysis({ hand: side });
    const ms = (performance.now() - start).toFixed(0);
    const stamp = new Date().toLocaleTimeString();
    const summary = result?.summary || "Analysis complete.";
    const lines = (result.all || []).map(x => `• ${x.meaning} (${(x.weight * 100 | 0)}%)`).join("\n");

    reportBox.textContent = `🕒 ${stamp}\n${side.toUpperCase()} HAND REPORT\n${summary}\n${"-".repeat(40)}\n${lines}`;
    msg(`✅ ${side} hand analyzed (${ms} ms)`);

    const lang = detectLang();
    const intro = side === "left"
      ? "Left hand shows past karmic flow and inherited skill."
      : "Right hand shows present destiny and current life path.";
    speakReport(`${intro} ${summary}`, lang);
  } catch (err) {
    msg(`❌ Analyzer error: ${err.message}`, false);
    console.error(err);
  }
}

// UI Bindings
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => analyze("left");
$("captureRight").onclick = () => analyze("right");

// --- Optional Torch Buttons (add if present in HTML)
if ($("torchLeft")) $("torchLeft").onclick = () => toggleTorch("left");
if ($("torchRight")) $("torchRight").onclick = () => toggleTorch("right");

// Status & event logs
function msg(text, ok = true) {
  statusEl.textContent = text;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

on("analyzer:status", e => console.log(`[${e.level}] ${e.msg}`));
on("analyzer:step", e => console.log(`[STEP] ${e.tag}: ${e.msg}`));
on("analyzer:metric", e => console.log(`[METRIC] ${e.key}=${e.val}`));

// Init
(async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    msg("❌ Camera not supported on this device", false);
  } else {
    msg("Ready — Tap Start → Analyze ✨");
  }
})();
