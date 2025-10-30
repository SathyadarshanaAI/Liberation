// 🕉️ Sathyadarshana Quantum Palm Analyzer · V13.7 Modular Edition
// — AI Buddhi Main Controller —

import { startCam, capture } from "./camera.js";
import { drawPalm } from "./drawPalm.js";
import { handleUserForm } from "./userForm.js";
import { speak } from "./voice.js";

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportEl = $("report");

// === Camera Buttons ===
$("startCamLeft").onclick = () => startCam("left", statusEl);
$("startCamRight").onclick = () => startCam("right", statusEl);

$("captureLeft").onclick = () => {
  capture("left", ctx => {
    drawPalm(ctx);
    speak("Left hand captured. AI Buddhi analyzing your life line.");
    reportEl.textContent = "🧠 Left hand captured successfully.";
  });
};

$("captureRight").onclick = () => {
  capture("right", ctx => {
    drawPalm(ctx);
    speak("Right hand captured. AI Buddhi analyzing your destiny.");
    reportEl.textContent = "✨ Right hand captured successfully.";
  });
};

// === User Form Logic ===
handleUserForm();

// === Initial Greeting ===
speak("Welcome to Sathyadarshana Quantum Palm Analyzer version thirteen point seven. Please start your camera.");
statusEl.textContent = "✅ System initialized. Ready for scan.";

// === Auto Feedback Animation ===
let dots = 0;
setInterval(() => {
  dots = (dots + 1) % 4;
  reportEl.textContent = "AI Buddhi is preparing" + ".".repeat(dots);
}, 1500);
