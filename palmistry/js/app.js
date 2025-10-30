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

// 🖐️ Capture buttons with confirmation popup
$("captureLeft").onclick = async () => {
  const ok = confirm("🖐️ Confirm: Is this your LEFT hand?");
  if (!ok) return;
  await capture("left", runSequence);
};
$("captureRight").onclick = async () => {
  const ok = confirm("🖐️ Confirm: Is this your RIGHT hand?");
  if (!ok) return;
  await capture("right", runSequence);
};

// === AI MINI INSIGHT DATABASE ===
const insights = {
  Career: "Your palm shows strong determination and logical focus. Success favors persistence.",
  Love: "Emotional warmth and deep connection are visible. True harmony comes through trust.",
  Health: "Energy flow is balanced. Maintain rest, hydration, and inner calm for stability.",
  "Spiritual Path": "Lines reveal awakening wisdom. Meditation strengthens divine awareness.",
  General: "Balanced aura detected. You are walking in harmony with universal energy."
};

// === MAIN SEQUENCE ===
async function runSequence() {
  $("status").textContent = "🧠 AI analyzing both palms...";
  await pause(800);

  animateBeam("canvasLeft");
  animateBeam("canvasRight");
  await pause(2500);

  const leftPalm = localStorage.getItem("palmLeft");
  const rightPalm = localStorage.getItem("palmRight");
  if (!leftPalm || !rightPalm) {
    $("status").textContent = "⚠️ Please capture BOTH hands before analysis.";
    return;
  }

  // 🖐️ Draw palms (with orientation detection built-in)
  drawPalm($("canvasLeft").getContext("2d"), "left");
  drawPalm($("canvasRight").getContext("2d"), "right");

  $("status").textContent = "✨ Beam Aura complete — main palm lines detected!";
  await pause(600);

  const u = JSON.parse(localStorage.getItem("userData") || "{}");
  const focus = u.f || "General";
  const name = u.n || "User";
  const msg = insights[focus] || insights.General;

  $("report").innerHTML = `
  ⚡ ${name}, your dual-hand scan is complete.<br>
  Energy lines mapped successfully for <b>${focus}</b> focus.<br><br>
  <b>AI Insight:</b> ${msg}<br>
  🌟 Wisdom Level: <b>High</b><br>
  <small>(Awaiting AI Deep Palmistry Module…)</small>
  `;

  speak(`${name}, your ${focus} reading is ready. ${msg}`);
}

// === BEAM EFFECT ===
function animateBeam(canvasId) {
  const canvas = $(canvasId);
  const beam = document.createElement("div");
  beam.className = "beam";
  canvas.parentElement.appendChild(beam);
  setTimeout(() => beam.remove(), 2800);
}

// === PAUSE ===
function pause(ms) {
  return new Promise(r => setTimeout(r, ms));
}
