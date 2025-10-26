// modules/core.js — Sathyadarshana Modular Core V10.4
import { on, emit } from './bus.js';
import { speak } from './ai.js';
import { generateReport } from './report.js';
import { startCamera, capture } from './camera.js';

console.log("🧠 Core system initializing...");

// --- INITIALIZE ---
document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  status.textContent = "Modules loaded ✅";
  speak("Sathyadarshana Quantum Core online.");
  emit("core:ready");
});

// --- EVENT CONNECTIONS ---
on("camera:ready", e => {
  const msg = `✅ ${e.side} camera active`;
  document.getElementById("status").textContent = msg;
  speak(`${e.side} camera ready.`);
});

on("capture:done", e => {
  generateReport(e.side);
  speak(`${e.side} hand captured successfully.`);
});

on("report:done", e => {
  speak(`${e.side} hand report complete.`);
  emit("ai:reportComplete", { side: e.side });
});

// --- Error Monitor ---
window.addEventListener("error", (err) => {
  console.warn("⚠️ Module error:", err.message);
  speak("System detected an error. Attempting recovery.");
  emit("core:error", { error: err });
});
