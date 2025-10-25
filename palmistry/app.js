// app.js — V11.0 Quantum Analyzer (Vision + Wisdom + Voice)
// © 2025 Sathyadarshana Research Core

import { generateWisdomReport } from "./modules/vision-fusion.js";
import { emit } from "./modules/bus.js";

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportBox = $("reportBox");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");

let torchState = false;

// 🌐 Start Camera
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
    msg(`Camera Error: ${e.message}`, false);
  }
}

// 📸 Capture photo to canvas
function capture(side) {
  const video = side === "left" ? leftVid : rightVid;
  const canvas = $(side === "left" ? "canvasLeft" : "canvasRight");
  if (!video.srcObject) return msg("⚠️ Start camera first!", false);

  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  msg(`${side} hand captured 🔒`);
  return true;
}

// 🔦 Torch toggle
async function toggleTorch(side) {
  try {
    const vid = side === "left" ? leftVid : rightVid;
    const track = vid.srcObject.getVideoTracks()[0];
    const caps = track.getCapabilities();
    if (!caps.torch) throw new Error("Torch not supported");
    torchState = !torchState;
    await track.applyConstraints({ advanced: [{ torch: torchState }] });
    msg(torchState ? "🔦 Torch ON" : "💡 Torch OFF");
  } catch (err) {
    msg(`Torch: ${err.message}`, false);
  }
}

// 🧠 Generate report
async function generateReport() {
  msg("🔮 Analyzing both hands…");
  try {
    capture("left");
    capture("right");

    const report = await generateWisdomReport();
    reportBox.textContent = report;
    msg("✅ Report generated successfully");

    // voice output
    speak(report);
  } catch (err) {
    msg(`❌ Report generation failed: ${err.message}`, false);
  }
}

// 🗣️ Voice synthesis
function speak(text) {
  const synth = window.speechSynthesis;
  if (!synth) return;
  const u = new SpeechSynthesisUtterance(text.slice(0, 300));
  u.lang = "en-US"; u.rate = 1; u.pitch = 1; u.volume = 1;
  synth.cancel(); synth.speak(u);
}

// 🩵 Helpers
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// 🔘 UI Binding
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("torchLeft").onclick = () => toggleTorch("left");
$("torchRight").onclick = () => toggleTorch("right");
$("captureLeft").onclick = generateReport;

// 🔁 Init
(() => {
  if (!navigator.mediaDevices?.getUserMedia) msg("❌ Camera not supported", false);
  else msg("Ready — Start both cameras ✨");
})();
