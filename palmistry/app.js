// app.js — V8.3 Camera Fixed + Analyzer Integration
import { runAnalysis } from "./modules/analyzer.js";
import { emit, on } from "./modules/bus.js";

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportBox = $("reportBox");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// --- Start Camera ---
async function startCam(side) {
  const video = side === "left" ? leftVid : rightVid;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasVideo = devices.some(d => d.kind === "videoinput");
    if (!hasVideo) {
      msg("No camera detected 🚫", false);
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
    video.srcObject = stream;
    await video.play();

    // wait for metadata to get actual dimensions
    await new Promise(r => {
      if (video.readyState >= 2) r();
      else video.onloadedmetadata = () => r();
    });

    msg(`${side} camera started ✅`);
  } catch (e) {
    console.error("Camera Error:", e);
    msg(`Camera Error: ${e.message}`, false);
  }
}

// --- Capture ---
function capture(side) {
  const video = side === "left" ? leftVid : rightVid;
  const canvas = side === "left" ? leftCv : rightCv;
  try {
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    msg(`${side} hand captured 🔒`);
  } catch (e) {
    msg(`Capture failed: ${e.message}`, false);
  }
}

// --- Analyze (connects to analyzer.js) ---
async function analyze(side) {
  capture(side);
  msg(`Running AI analysis for ${side} hand...`);
  try {
    const fusion = await runAnalysis({ hand: side });
    if (fusion?.summary) {
      reportBox.textContent =
        `📊 ${side} hand summary:\n${fusion.summary}\n\n` + reportBox.textContent;
    }
  } catch (err) {
    console.error(err);
    msg("Analyzer error ❌", false);
  }
}

// --- Bind buttons ---
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => analyze("left");
$("captureRight").onclick = () => analyze("right");

// --- Live log listener from analyzer.js ---
on("analyzer:status", e => {
  console.log(`[${e.level}] ${e.msg}`);
});
on("analyzer:step", e => {
  console.log(`[STEP] ${e.tag}: ${e.msg}`);
});
on("analyzer:metric", e => {
  console.log(`[METRIC] ${e.key}=${e.val}`);
});

// --- Initialize ---
(async () => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    msg("Camera not supported ❌", false);
  } else {
    msg("Ready. Click Start → Analyze ✨");
  }
})();
