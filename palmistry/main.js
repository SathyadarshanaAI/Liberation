// main.js — V26.1 (Camera Selector + AI Analyzer)
import { analyzePalmAI } from "./palmPipeline.js";

let useFrontCam = true;
let capturedImage = null;

// === CAMERA BUTTONS ===
document.addEventListener("DOMContentLoaded", () => {
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

  // Link main buttons after DOM loaded
  document.getElementById("startCamLeft").onclick = startCam;
  document.getElementById("captureLeft").onclick = capture;
  document.getElementById("analyzeBtn").onclick = deepAnalyze;
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
    vid.play();
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
  document.getElementById("status").textContent = "🧠 Analyzing palm lines...";
  const result = await analyzePalmAI(capturedImage);
  document.getElementById("analysisText").textContent = JSON.stringify(result, null, 2);
  document.getElementById("status").textContent = "✨ Deep Analysis Complete!";
}
