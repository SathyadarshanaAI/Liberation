import { analyzePalmPatterns, brainInsight } from "./brain.js";
import { initHandAI, detectHands } from "./handAI.js";

let streamL, streamR;

// --- CAMERA CONTROL ---
async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  try {
    const st = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = st;
    if (side === "left") streamL = st; else streamR = st;
    setStatus(`${side.toUpperCase()} camera started ✅`);
  } catch (err) {
    setStatus(`❌ Camera error: ${err.message}`, false);
  }
}

function setStatus(msg, ok = true) {
  const el = document.getElementById("status");
  el.textContent = msg;
  el.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// --- CAPTURE & ANALYZE ---
async function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const cvs = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = cvs.getContext("2d");

  // ✋ Real hand detection check
  const detection = await detectHands(vid);
  if (!detection.hasHand) {
    setStatus(`❌ No hand detected on ${side} camera. Try again.`, false);
    speak("No hand detected. Please show your palm clearly.");
    return;
  }

  // draw locked frame
  ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);

  // stop live feed and hide
  const stream = vid.srcObject;
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    vid.srcObject = null;
  }
  vid.style.opacity = "0";
  cvs.style.visibility = "visible";

  animateBeam(cvs);

  setTimeout(() => {
    generateReport(side, detection.confidence);
  }, 2000);
}

// --- AURA SCAN LINE ---
function animateBeam(canvas) {
  const beam = document.createElement("div");
  beam.className = "beam";
  canvas.parentElement.appendChild(beam);
  setTimeout(() => beam.remove(), 2000);
}

// --- AI DHARMA ANALYZER (BRAIN + CONFIDENCE) ---
function generateReport(side, conf = 0.9) {
  const cvs = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = cvs.getContext("2d");
  const brainMsg = analyzePalmPatterns(ctx);

  const baseDharma = [
    "Your heart line glows with compassion and inner strength.",
    "Your head line reveals clarity guided by divine intuition.",
    "Fate aligns with your karma — a new path is opening.",
    "You carry a radiant aura — wisdom and emotion in balance."
  ];

  let msg = brainInsight(
    baseDharma[Math.floor(Math.random() * baseDharma.length)],
    brainMsg
  );

  msg += conf > 0.8
    ? " (✨ High confidence: Real palm detected clearly.)"
    : " (⚠️ Low visibility detected, try brighter lighting.)";

  const box = document.getElementById("reportBox");
  box.innerHTML = `📜 ${side.toUpperCase()} hand captured.<br><b>Dharma Insight:</b> ${msg}`;
  speak(msg);
}

// --- VOICE SYNTHESIS ---
function speak(text) {
  if (!window.speechSynthesis) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "en-US";
  utter.pitch = 1;
  utter.rate = 0.9;
  speechSynthesis.speak(utter);
}

// --- BUTTON LINKS ---
document.getElementById("startCamLeft").onclick = () => startCam("left");
document.getElementById("startCamRight").onclick = () => startCam("right");
document.getElementById("captureLeft").onclick = () => capture("left");
document.getElementById("captureRight").onclick = () => capture("right");

// --- INIT SYSTEM ---
setStatus("System initializing... 🔄");
initHandAI().then(() => {
  setStatus("System ready ✨ AI Hand Detector Active");
}).catch(err => {
  console.warn("AI init error:", err);
  setStatus("⚠️ AI Module Failed to Initialize", false);
});
