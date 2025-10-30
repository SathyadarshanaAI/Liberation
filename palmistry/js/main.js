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

// === MINI AI INSIGHT REPORT ===
const insights = {
  Career: "Your palm shows strong determination and logical focus. Success favors persistence.",
  Love: "Emotional warmth and deep connection are visible. True harmony comes through trust.",
  Health: "Energy flow is balanced. Maintain rest and hydration for stability.",
  "Spiritual Path": "Lines reveal inner wisdom awakening. Meditation enhances your divine link.",
  General: "Balanced aura detected. You are walking in harmony with universal energy."
};

// === RUN SEQUENCE ===
async function runSequence() {
  $("status").textContent = "🧠 AI pre-analyzing palms...";
  await pause(1000);

  // Draw main golden lines on both hands
  drawPalm($("canvasLeft").getContext("2d"));
  drawPalm($("canvasRight").getContext("2d"));

  // Generate AI report
  const u = JSON.parse(localStorage.getItem("userData") || "{}");
  const focus = u.f || "General";
  const msg = insights[focus] || insights["General"];
  const name = u.n || "User";

  $("status").textContent = "✨ Analysis complete — generating AI insight...";
  await pause(600);

  $("report").innerHTML = `
    ⚡ ${name}, your dual-hand scan is complete.<br>
    Energy lines mapped for <b>${focus}</b> focus.<br><br>
    <b>AI Insight:</b> ${msg}<br>
    🌟 Wisdom Level: <b>High</b>
  `;

  speak(`${name}, your ${focus} reading is ready. ${msg}`);
}

function pause(ms) {
  return new Promise(r => setTimeout(r, ms));
}
