import { CameraCard } from './modules/camera.js';
import { exportPalmPDF } from './modules/pdf.js';
import { analyzePalm } from './modules/analyzer.js';
import { speakText } from './modules/voice.js';
import { translateUI } from './modules/translator.js';
import { emit, on } from './modules/bus.js';
import { loadI18N } from './modules/i18n.js';

const $ = id => document.getElementById(id);
const statusEl = $("status");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// --- Camera setup ---
let camLeft, camRight;

async function startCam(side) {
  const video = side === "left" ? leftVid : rightVid;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    msg(`${side} camera started ✅`);
  } catch (e) {
    msg(`Error: ${e.message}`, false);
  }
}

function capture(side) {
  const video = side === "left" ? leftVid : rightVid;
  const canvas = side === "left" ? leftCv : rightCv;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  emit("photo:captured", { side, canvas });
  msg(`${side} hand locked 🔒`);
}

// --- Event handling ---
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");

// --- Palm analysis logic ---
on("photo:captured", async ({ side, canvas }) => {
  msg(`Analyzing ${side} hand...`);
  const report = await analyzePalm(canvas, side);
  console.log(report);
  await exportPalmPDF(report, side);
  speakText(`Palm analysis for ${side} hand complete.`);
  msg(`✅ ${side} hand analysis complete`);
});

// --- I18N & translator setup ---
(async () => {
  await loadI18N();
  await translateUI();
  msg("Palmistry Analyzer Ready ✨");
})();
