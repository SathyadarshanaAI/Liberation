import { drawPalm } from './drawPalm.js';
import { startCam, capture } from './camera.js';
import { saveUser, clearUser, loadUser } from './userForm.js';
import { speak } from './voice.js';

const $ = id => document.getElementById(id);

// === INITIAL SETUP ===
loadUser();
$("saveBtn").onclick = saveUser;
$("clearBtn").onclick = clearUser;
$("startCamLeft").onclick = () => startCam("left");
$("startCamRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left", runSequence);
$("captureRight").onclick = () => capture("right", runSequence);

// === AI MINI INSIGHT DATABASE ===
const insights = {
  Career: "Your palm shows strong determination and logical focus. Success favors persistence.",
  Love: "Emotional warmth and deep connection are visible. True harmony comes through trust.",
  Health: "Energy flow is balanced. Maintain rest, hydration, and inner calm for stability.",
  "Spiritual Path": "Lines reveal awakening wisdom. Meditation strengthens divine awareness.",
  General: "Balanced aura detected. You are walking in harmony with universal energy."
};

// === AI MAIN ANALYSIS SEQUENCE ===
async function runSequence() {
  $("status").textContent = "🧠 AI analyzing both palms...";
  await pause(800);

  // 🟡 Animate scanning beam
  animateBeam("canvasLeft");
  animateBeam("canvasRight");

  await pause(2500);

  // 🖐️ Draw detected palm lines
  drawPalm($("canvasLeft").getContext("2d"));
  drawPalm($("canvasRight").getContext("2d"));

  $("status").textContent = "✨ Beam Aura complete — main palm lines detected!";
  await pause(500);

  // === AI Insight Report ===
  const u = JSON.parse(localStorage.getItem("userData") || "{}");
  const focus = u.f || "General";
  const name = u.n || "User";
  const msg = insights[focus] || insights.General;

  $("report").innerHTML = `
    ⚡ ${name}, your dual-hand scan is complete.<br>
    Energy lines mapped successfully for <b>${focus}</b> focus.<br><br>
    <b>AI Insight:</b> ${msg}<br>
    🌟 Wisdom Level: <b>High</b> <br>
    <small>(Awaiting AI Deep Palmistry Module...)</small>
  `;

  // 🔊 Voice feedback
  speak(`${name}, your ${focus} reading is ready. ${msg}`);

  // === API Hook Placeholder ===
  // Future: integrate real AI API here
  // const aiResponse = await fetch('/api/palmistry', {method:'POST', body: palmData});
  // const json = await aiResponse.json();
}

// === BEAM EFFECT ===
function animateBeam(canvasId) {
  const canvas = $(canvasId);
  const beam = document.createElement("div");
  beam.className = "beam";
  canvas.parentElement.appendChild(beam);
  setTimeout(() => beam.remove(), 2800);
}

// === DELAY FUNCTION ===
function pause(ms) {
  return new Promise(r => setTimeout(r, ms));
}
