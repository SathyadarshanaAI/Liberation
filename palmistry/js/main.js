// js/main.js — V26.4 (Dual Hand + Mobile Friendly + Palm Overlay)
import { analyzePalmAI } from "./palmPipeline.js";
import { drawPalmEdges } from "./edgeLines.js";

let useFrontCam = true;
let capturedImages = { left: null, right: null };

document.addEventListener("DOMContentLoaded", () => {
  // === GLOBAL CAMERA TOGGLE BUTTON ===
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "🔄 Switch to Back Camera";
  toggleBtn.style = `
    position: fixed;
    top: 12px; right: 12px;
    background: rgba(0, 229, 255, 0.15);
    color: #00e5ff;
    border: 1px solid #00e5ff;
    border-radius: 50px;
    padding: 10px 18px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    z-index: 999;
    box-shadow: 0 0 8px rgba(0,229,255,0.4);
    backdrop-filter: blur(8px);
    transition: all 0.2s ease-in-out;
  `;
  toggleBtn.onpointerdown = e => e.stopPropagation(); // prevent accidental double-touch
  toggleBtn.onpointerup = e => e.stopPropagation();
  toggleBtn.onmouseenter = () => (toggleBtn.style.background = "rgba(0,229,255,0.25)");
  toggleBtn.onmouseleave = () => (toggleBtn.style.background = "rgba(0,229,255,0.15)");

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

  // ✅ Apply palm edge overlay effect
  drawPalmEdges(canvas);

  document.getElementById("status").textContent =
    `✅ ${capitalize(side)} palm captured + overlay applied`;
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
