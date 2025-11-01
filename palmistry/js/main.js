// 🕉️ Sathyadarshana Quantum Palm Analyzer · V16.6 Dharma AI Analyzer
// ---------------------------------------------------------------
// Built by Anuruddha & AI Buddhi 🪷

import { analyzePalm } from "./brain.js";

document.addEventListener("DOMContentLoaded", () => {
  const status = document.getElementById("status");
  status.textContent = "🧠 Initializing AI Modules...";

  // --- create AI Analyze button dynamically ---
  const aiBtn = document.createElement("button");
  aiBtn.textContent = "🧘‍♂️ AI Analyze Palm";
  aiBtn.style.background = "#00e5ff";
  aiBtn.style.border = "none";
  aiBtn.style.color = "#0b0f16";
  aiBtn.style.padding = "12px 22px";
  aiBtn.style.borderRadius = "14px";
  aiBtn.style.fontWeight = "bold";
  aiBtn.style.boxShadow = "0 0 12px #00e5ff";
  aiBtn.style.marginTop = "25px";
  aiBtn.style.fontSize = "1.1rem";
  document.body.appendChild(aiBtn);

  // --- create output box ---
  const output = document.createElement("pre");
  output.style.whiteSpace = "pre-wrap";
  output.style.textAlign = "center";
  output.style.fontSize = "1rem";
  output.style.marginTop = "30px";
  output.style.padding = "10px";
  output.style.borderRadius = "12px";
  output.style.background = "rgba(255,255,255,0.05)";
  output.style.boxShadow = "0 0 15px #16f0a7";
  document.body.appendChild(output);

  // --- Button Logic ---
  aiBtn.addEventListener("click", () => {
    status.textContent = "🔍 Scanning palm aura...";
    aiBtn.disabled = true;
    aiBtn.style.opacity = "0.7";
    output.textContent = "🤖 Reading hand energy, please wait...";

    setTimeout(() => {
      const report = analyzePalm();
      output.textContent = report;
      aiBtn.disabled = false;
      aiBtn.style.opacity = "1";
      aiBtn.style.boxShadow = "0 0 20px #16f0a7";
      status.textContent = "✅ Analysis complete — Dharma Report Ready";
    }, 1500);
  });
});
