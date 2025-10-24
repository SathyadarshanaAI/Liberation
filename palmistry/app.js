// app.js — V8.6 Multilingual Voice Edition
// © 2025 Sathyadarshana Research Core

import { runAnalysis } from "./modules/analyzer.js";
import { emit, on } from "./modules/bus.js";
import "./modules/ui-aura.js"; // aura + glow + scroll effect

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportBox = $("reportBox");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

let activeLang = "en"; // default
let torchState = false;

// === 🔊 12-Language Buddhi Voice System ====================================
function speakReport(text, langCode = "en") {
  const synth = window.speechSynthesis;
  if (!synth) return;

  const voices = synth.getVoices();
  const u = new SpeechSynthesisUtterance(text);

  // map 12 languages
  const langMap = {
    en: "en-US",
    si: "si-LK",
    ta: "ta-IN",
    hi: "hi-IN",
    fr: "fr-FR",
    de: "de-DE",
    es: "es-ES",
    zh: "zh-CN",
    ja: "ja-JP",
    ko: "ko-KR",
    ar: "ar-SA",
    ru: "ru-RU"
  };

  u.lang = langMap[langCode] || "en-US";
  u.rate = 0.95;
  u.pitch = 1.1;
  u.volume = 1;

  synth.cancel();
  setTimeout(() => synth.speak(u), 400);
}

function detectLanguage() {
  const lang = navigator.language?.slice(0, 2);
  const supported = ["en", "si", "ta", "hi", "fr", "de", "es", "zh", "ja", "ko", "ar", "ru"];
  activeLang = supported.includes(lang) ? lang : "en";
  return activeLang;
}

// === 🔦 Torch toggle ========================================================
async function toggleTorch(side = "left") {
  try {
    const video = side === "left" ? leftVid : rightVid;
    const stream = video.srcObject;
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

// === 📷 Camera system ======================================================
async function startCam(side) {
  const video = side === "left" ? leftVid : rightVid;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }, audio: false
    });
    video.srcObject = stream;
    await video.play();
    msg(`${side} camera started ✅`);
  } catch (e) {
    msg(`Camera error: ${e.message}`, false);
  }
}

function capture(side) {
  const video = side === "left" ? leftVid : rightVid;
  const canvas = side === "left" ? leftCv : rightCv;
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  msg(`${side} hand captured 🔒`);
}

// === 🔮 AI Analyzer =========================================================
async function analyze(side) {
  capture(side);
  msg(`Analyzing ${side} hand...`);
  const start = performance.now();
  try {
    const result = await runAnalysis({ hand: side });
    const ms = (performance.now() - start).toFixed(0);
    const stamp = new Date().toLocaleTimeString();

    const summary = result?.summary || "Analysis complete.";
    const detail = (result.all || [])
      .map(x => `• ${x.meaning} (${(x.weight * 100 | 0)}%)`)
      .join("\n");

    const fullText =
      `🕒 ${stamp}\n${side === "left" ? "LEFT (Past Karma)" : "RIGHT (Present Destiny)"}\n` +
      `${summary}\n${"-".repeat(40)}\n${detail}`;

    reportBox.textContent = fullText;
    msg(`✅ ${side} hand analyzed (${ms} ms)`);

    const speakText =
      side === "left"
        ? "Left hand represents your karmic past and spiritual memory."
        : "Right hand reflects your active destiny and life direction.";

    // 🈯 Detect browser language for speech
    const lang = detectLanguage();
    speakReport(`${speakText} ${summary}`, lang);
  } catch (err) {
    console.error(err);
    msg(`❌ Analysis failed: ${err.message}`, false);
  }
}

// === 🖱 Button bindings =====================================================
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => analyze("left");
$("captureRight").onclick = () => analyze("right");

if ($("torchLeft")) $("torchLeft").onclick = () => toggleTorch("left");
if ($("torchRight")) $("torchRight").onclick = () => toggleTorch("right");

// === 🧠 Helper functions ====================================================
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// === 📡 Analyzer event bus feedback ========================================
on("analyzer:status", e => console.log(`[${e.level}] ${e.msg}`));
on("analyzer:step", e => console.log(`[STEP] ${e.tag}: ${e.msg}`));
on("analyzer:metric", e => console.log(`[METRIC] ${e.key}=${e.val}`));

// === 🚀 Init ===============================================================
(async () => {
  if (!navigator.mediaDevices) msg("❌ Camera not supported", false);
  else msg("Ready. Tap Start → Analyze ✨");
})();
