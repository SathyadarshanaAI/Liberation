// main.js — V26.2 (Camera Selector + Deep AI Analyzer)
import { analyzePalmAI } from "./palmPipeline.js";

let useFrontCam = true;
let capturedImage = null;

document.addEventListener("DOMContentLoaded", () => {
  // === CAMERA TOGGLE BUTTON ===
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "🔄 Switch to Back Camera";
  toggleBtn.style = `
    position: fixed; top: 15px; right: 15px;
    background: #00e5ff22; color: #00e5ff;
    border: 1px solid #00e5ff; border-radius: 8px;
    padding: 8px 14px; cursor: pointer; z-index: 999;
  `;
  document.body.appendChild(toggleBtn);

  toggleBtn.onclick = () => {
    useFrontCam = !useFrontCam;
    toggleBtn.textContent = useFrontCam
      ? "🔄 Switch to Back Camera"
      : "🔄 Switch to Front Camera";
    document.getElementById("status").textContent = useFrontCam
      ? "📷 Front Camera Selected"
      : "📷 Back Camera Selected";
  };

  // === LINK MAIN BUTTONS ===
  const startBtn = document.getElementById("startCamLeft");
  const captureBtn = document.getElementById("captureLeft");
  const analyzeBtn = document.getElementById("analyzeBtn");

  if (!startBtn || !captureBtn || !analyzeBtn) {
    console.error("❌ Buttons not found in DOM!");
    return;
  }

  startBtn.onclick = startCam;
  captureBtn.onclick = capture;
  analyzeBtn.onclick = deepAnalyze;
});

// === START CAMERA ===
async function startCam() {
  const vid = document.getElementById("vidLeft");
  const canvas = document.getElementById("canvasLeft");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: useFrontCam ? "user" : "environment" },
      audio: false
    });
    vid.srcObject = stream;
    await vid.play();
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent = `📸 Camera Active (${useFrontCam ? "Front" : "Back"})`;
  } catch (err) {
    alert("Camera access denied or unavailable!");
    console.error(err);
  }
}

// === CAPTURE ===
function capture() {
  const vid = document.getElementById("vidLeft");
  const canvas = document.getElementById("canvasLeft");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.style.display = "none";
  canvas.style.display = "block";

  capturedImage = canvas.toDataURL("image/png");
  document.getElementById("status").textContent = "✅ Palm Captured";
}

// === DEEP AI ANALYSIS ===
async function deepAnalyze() {
  if (!capturedImage) {
    alert("Please capture your palm first!");
    return;
  }
  document.getElementById("status").textContent = "🧠 Performing Deep AI Analysis...";
  
  try {
    const result = await analyzePalmAI(capturedImage);
    document.getElementById("analysisText").textContent = JSON.stringify(result, null, 2);
    document.getElementById("status").textContent = "✨ Deep Analysis Complete!";
  } catch (err) {
    console.error("AI Analysis Failed:", err);
    document.getElementById("status").textContent = "❌ AI Analysis Error!";
  }
}
