// main.js — V26.0 (Camera + AI Analyzer)
import { analyzePalmAI } from "./palmPipeline.js";

let useFrontCam = true;
let capturedImage = null;

// === CAMERA ===
document.getElementById("startCamLeft").onclick = startCam;
document.getElementById("captureLeft").onclick = capture;
document.getElementById("analyzeBtn").onclick = deepAnalyze;

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
    document.getElementById("status").textContent = "📷 Camera Active";
  } catch (err) {
    alert("Camera access denied!");
    console.error(err);
  }
}

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
  document.getElementById("status").textContent = "✨ Analysis complete!";
}
