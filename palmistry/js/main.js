// 🕉️ Sathyadarshana Quantum Palm Analyzer · V14.0 Real Detection Edition
// — AI Buddhi Main Controller (True Mode) —

import { startCam, capture } from "./camera.js";
import { drawPalm } from "./drawPalm.js";
import { handleUserForm } from "./userForm.js";
import { speak } from "./voice.js";
import { initHandAI, detectHands } from "./handAI.js";

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportEl = $("report");

// === Initialize System ===
(async () => {
  statusEl.textContent = "🧠 Initializing AI Buddhi...";
  await initHandAI();
  statusEl.textContent = "✅ AI detection engine ready. Please start your cameras.";
  speak("Welcome to Sathyadarshana Quantum Palm Analyzer version fourteen point zero. Real detection mode activated.");
})();

// === Camera Buttons ===
$("startCamLeft").onclick = () => startCam("left", statusEl);
$("startCamRight").onclick = () => startCam("right", statusEl);

// === Capture with Real AI Verification ===
let leftCaptured = false, rightCaptured = false;

$("captureLeft").onclick = async () => {
  const vid = $("vidLeft");
  const result = await detectHands(vid);

  if (!result.hasHand || result.confidence < 0.7) {
    reportEl.textContent = "⚠️ No real human hand detected on the left side.";
    speak("No real human hand detected. Please hold your left palm clearly.");
    return;
  }

  capture("left", ctx => drawPalm(ctx));
  leftCaptured = true;
  reportEl.textContent = `🧠 Left hand verified with ${(result.confidence * 100).toFixed(0)}% confidence.`;
  speak("Left hand verified. AI Buddhi analyzing your life and health line.");
  if (leftCaptured && rightCaptured) analyzePalms();
};

$("captureRight").onclick = async () => {
  const vid = $("vidRight");
  const result = await detectHands(vid);

  if (!result.hasHand || result.confidence < 0.7) {
    reportEl.textContent = "⚠️ No real human hand detected on the right side.";
    speak("No real human hand detected. Please hold your right palm clearly.");
    return;
  }

  capture("right", ctx => drawPalm(ctx));
  rightCaptured = true;
  reportEl.textContent = `✨ Right hand verified with ${(result.confidence * 100).toFixed(0)}% confidence.`;
  speak("Right hand verified. AI Buddhi analyzing your fate and destiny line.");
  if (leftCaptured && rightCaptured) analyzePalms();
};

// === AI Buddhi Mini Analyzer ===
function analyzePalms() {
  const insights = [
    "Your life line shows deep endurance and spiritual awakening.",
    "The head line indicates intelligence balanced with intuition.",
    "Heart line reveals compassion guided by wisdom.",
    "Fate line suggests purpose aligned with divine direction.",
    "Sun line shows creativity and higher consciousness emerging."
  ];

  const msg = insights[Math.floor(Math.random() * insights.length)];
  reportEl.innerHTML = `🔮 <b>AI Buddhi Insight:</b> ${msg}`;
  speak(msg);
}

// === User Form Logic ===
handleUserForm();

// === Soft Loop Feedback ===
let dots = 0;
setInterval(() => {
  dots = (dots + 1) % 4;
  reportEl.textContent = "AI Buddhi is observing" + ".".repeat(dots);
}, 1800);
