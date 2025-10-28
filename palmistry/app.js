// 🕉️ app.js — Sathyadarshana Quantum Palm Analyzer V14
import { speak } from "./voice.js";

const langSelect = document.getElementById("langSelect");
window.currentLang = "en";
langSelect.onchange = () => {
  window.currentLang = langSelect.value;
};

const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight"),
};
const beams = {
  left: document.getElementById("beamLeft"),
  right: document.getElementById("beamRight"),
};
const reportBox = document.getElementById("reportBox");

async function startCamera(side) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    vids[side].srcObject = stream;
    vids[side].dataset.streamActive = "1";
    console.log(`📷 ${side} camera started`);
  } catch (err) {
    console.error("Camera error:", err);
    alert("Camera permission denied or unavailable.");
  }
}

function stopCamera(side) {
  const vid = vids[side];
  const stream = vid.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    vid.srcObject = null;
    vid.dataset.streamActive = "0";
    console.log(`🛑 ${side} camera stopped`);
  }
}

// Beam animation (scanner line)
function playBeam(side) {
  const beam = beams[side];
  beam.style.opacity = 1;
  beam.animate(
    [
      { top: "-10%", opacity: 1 },
      { top: "100%", opacity: 0.2 },
      { top: "110%", opacity: 0 },
    ],
    { duration: 2500, easing: "ease-in-out" }
  );
  setTimeout(() => (beam.style.opacity = 0), 2500);
}

// Capture & analysis logic
function captureHand(side) {
  const vid = vids[side];
  if (!vid.srcObject) {
    alert("Please allow camera access first.");
    return;
  }

  // Beam animation
  playBeam(side);

  // Shutter effect
  document.body.style.transition = "background 0.3s";
  document.body.style.background = "#fff";
  setTimeout(() => (document.body.style.background = "#0b0f16"), 200);

  // Auto stop after capture
  setTimeout(() => {
    stopCamera(side);
    const msg = `✅ ${side} hand scan complete. Generating analysis...`;
    console.log(msg);
    speak(msg, window.currentLang);
    reportBox.innerHTML = `<b>${msg}</b><br><br><i>AI report will appear shortly...</i>`;
  }, 1800);
}

// Event setup
document.getElementById("capLeft").onclick = () => {
  if (vids.left.dataset.streamActive !== "1") startCamera("left");
  else captureHand("left");
};
document.getElementById("capRight").onclick = () => {
  if (vids.right.dataset.streamActive !== "1") startCamera("right");
  else captureHand("right");
};

// Stop all voices
document.getElementById("stopVoice").onclick = () => speechSynthesis.cancel();
