// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.1 True Vision Build
// main.js — Integrated Controller (Camera + Dharma + AI Voice)

import { startCam, capture } from "./camera.js";
import { drawPalm } from "./drawPalm.js";
import { handleUserForm } from "./userForm.js";
import { speak } from "./voice.js";
import { activateDharmaMode, describeLineDhamma } from "./dharmaMode.js";

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportEl = $("report");

// === Camera Controls ===
$("startCamLeft").onclick = () => startCam("left", statusEl);
$("startCamRight").onclick = () => startCam("right", statusEl);

$("captureLeft").onclick = () => {
  capture("left", ctx => {
    drawPalm(ctx);
    const msg = describeLineDhamma("Life");
    reportEl.innerHTML = `🧠 Left hand captured.<br>${msg}`;
    speak("Left hand captured. AI Buddhi analyzing your life line.");
  });
};

$("captureRight").onclick = () => {
  capture("right", ctx => {
    drawPalm(ctx);
    const msg = describeLineDhamma("Fate");
    reportEl.innerHTML = `✨ Right hand captured.<br>${msg}`;
    speak("Right hand captured. AI Buddhi analyzing your fate line.");
    activateDharmaMode(reportEl);
  });
};

// === User Form Logic ===
handleUserForm();

// === Initial Greeting ===
statusEl.textContent = "✅ System initialized. Ready for Dharma Scan.";
speak("Welcome to Sathyadarshana Quantum Palm Analyzer True Vision Edition. Please begin your Dharma scan.");

// === Subtle auto-feedback animation ===
let dots = 0;
setInterval(() => {
  dots = (dots + 1) % 4;
  statusEl.textContent = "AI Buddhi preparing Dharma vision" + ".".repeat(dots);
}, 1800);
