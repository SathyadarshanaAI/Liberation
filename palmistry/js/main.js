// js/main.js — V26.3 (Dual Hand + Single Camera Selector)
import { analyzePalmAI } from "./palmPipeline.js";

let useFrontCam = true;
let capturedImages = { left: null, right: null };

document.addEventListener("DOMContentLoaded", () => {
  // === GLOBAL CAMERA TOGGLE BUTTON ===
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

  // === SETUP BUTTONS FOR BOTH HANDS ===
  ["left", "right"].forEach(side => {
    document.getElementById(`startCam${capitalize(side)}`).onclick = () => startCam(side);
    document.getElementById(`capture${capitalize(side)}`).onclick = () => capture(side);
    document.getElementById(`analyze${capitalize(side)}`).onclick = () => deepAnalyze(side);
  });
});

// === CAMERA START ===
async function startCam(side) {
  const vid = document.getElementById(`vid${capitalize(side)}`);
  const canvas = document.getElementById(`canvas${capitalize(side)}`);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: useFrontCam ? "user" : "environment" },
      audio: false
    });

    vid.srcObject = stream;
    await vid.play();
    vid.style.display = "block";
    canvas.style.display = "none";
    document.getElementById("status").textContent =
      `📸 ${capitalize(side)} camera active (${useFrontCam ? "Front" : "Back"})`;
  } catch (err) {
    alert("Camera access denied or unavailable!");
    console.error(err);
  }
}

// === CAPTURE PALM ===
function capture(side) {
  const vid = document.getElementById(`vid${capitalize(side)}`);
  const canvas = document.getElementById(`canvas${capitalize(side)}`);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);

  const stream = vid.srcObject;
  if (stream) stream.getTracks().forEach(t => t.stop());
  vid.style.display = "none";
  canvas.style.display = "block";

  capturedImages[side] = canvas.toDataURL("image/png");
  document.getElementById("status").textContent = `✅ ${capitalize(side)} palm captured`;
}

// === DEEP AI ANALYZE ===
async function deepAnalyze(side) {
  const img = capturedImages[side];
  if (!img) {
    alert(`Please capture your ${side} palm first!`);
    return;
  }

  document.getElementById("status").textContent = `🧠 Analyzing ${side} palm...`;
  const result = await analyzePalmAI(img);
  document.getElementById(`analysisText${capitalize(side)}`).textContent =
    JSON.stringify(result, null, 2);
  document.getElementById("status").textContent = `✨ ${capitalize(side)} analysis complete!`;
}

function capitalize(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}
