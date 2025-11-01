import { initHandAI, detectHands } from "./handAI.js";

const statusEl = document.getElementById("status");
const vidLeft = document.getElementById("vidLeft");
const vidRight = document.getElementById("vidRight");

async function startCam(side) {
  const vid = side === "left" ? vidLeft : vidRight;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = stream;
    statusEl.textContent = `✅ ${side} camera started`;
  } catch (err) {
    statusEl.textContent = `❌ Camera error: ${err.message}`;
  }
}

async function initAI() {
  statusEl.textContent = "🔄 Initializing AI Hand Detector...";
  await initHandAI();
  statusEl.textContent = "✨ AI Hand Detector Active";
}

document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("startCamRight").onclick = () => startCam("right");

window.addEventListener("load", initAI);
