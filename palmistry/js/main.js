// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.2 Dharma Aura Edition
// main.js — Integrated Controller (Camera + Aura + Dharma + Voice)

import { startCam, capture } from "./camera.js";
import { drawPalm } from "./drawPalm.js";
import { handleUserForm } from "./userForm.js";
import { speak } from "./voice.js";
import { activateDharmaMode, describeLineDhamma } from "./dharmaMode.js";
import { drawAura } from "./aura.js"; // ✅ new import for glowing Dharma aura

// === Short helper ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportEl = $("report");

// === Camera Controls ===
$("startCamLeft").onclick = () => startCam("left", statusEl);
$("startCamRight").onclick = () => startCam("right", statusEl);

// === Capture Left Hand ===
$("captureLeft").onclick = () => {
  capture("left", ctx => {
    drawPalm(ctx);
    drawAura($("canvasLeft"), "#00e5ff"); // cyan aura for left hand
    const msg = describeLineDhamma("Life");
    reportEl.innerHTML = `🧠 Left hand captured.<br>${msg}`;
    speak("Left hand captured. AI Buddhi analyzing your life line in Dharma light.");
  });
};

// === Capture Right Hand ===
$("captureRight").onclick = () => {
  capture("right", ctx => {
    drawPalm(ctx);
    drawAura($("canvasRight"), "#FFD700"); // golden aura for right hand
    const msg = describeLineDhamma("Fate");
    reportEl.innerHTML = `✨ Right hand captured.<br>${msg}`;
    speak("Right hand captured. AI Buddhi analyzing your fate line with divine energy.");
    activateDharmaMode(reportEl);
  });
};

// === User Form Logic ===
handleUserForm();

// === Initial Greeting ===
statusEl.textContent = "✅ System initialized. Ready for Dharma Scan.";
speak("Welcome to Sathyadarshana Quantum Palm Analyzer Dharma Aura Edition. Please begin your scan to reveal the law of truth.");

// === Subtle Status Animation ===
let dots = 0;
setInterval(() => {
  dots = (dots + 1) % 4;
  statusEl.textContent = "AI Buddhi preparing Dharma vision" + ".".repeat(dots);
}, 1800);

// === Debug Confirmation ===
console.log("✅ Sathyadarshana V15.2 main.js loaded successfully");
