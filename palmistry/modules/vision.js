    // modules/vision.js — Sathyadarshana Quantum Palm Analyzer · V10.2
import { on, emit } from './bus.js';

// --- Listen for captured image event ---
on("capture:done", ({ side, time }) => {
  const reportBox = document.getElementById("reportBox");
  const status = document.getElementById("status");

  status.textContent = `🔍 Analyzing ${side} hand...`;
  reportBox.innerHTML = `
    <span style="color:#16f0a7">🖐️ ${side.toUpperCase()} HAND</span><br>
    Captured at ${new Date(time).toLocaleTimeString()}<br>
    <i>Processing palm lines, curves, and energy points...</i>
  `;

  // Simulated analysis delay
  setTimeout(() => {
    const result = generateAIInsight(side);
    emit("vision:ready", { side, result });
    status.textContent = `✅ ${side} hand analysis complete`;
  }, 1800);
});

// --- Generate AI insight (simulation for now) ---
function generateAIInsight(side) {
  const insights = [
    "Strong Life Line indicates balanced vitality and longevity.",
    "Heart Line suggests deep emotional intelligence and empathy.",
    "Head Line shows clarity and spiritual insight developing.",
    "Fate Line reveals unique destiny path unfolding.",
    "Mount of Venus glows with compassion and universal love."
  ];

  // Random insight set for now
  const randomSet = insights
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .join("<br>• ");

  return `✨ ${side.toUpperCase()} HAND INSIGHT ✨<br>• ${randomSet}`;
}
