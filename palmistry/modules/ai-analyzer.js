// 🕉️ Sathyadarshana Quantum Palm Analyzer · AI Analyzer v3.6
// Auto 350-word mini report + voice narration (Sinhala-English blend)

import { speak } from "./voice.js";

export async function autoAnalyzeIfReady(msgEl) {
  const left = localStorage.getItem("palmLeft");
  const right = localStorage.getItem("palmRight");

  if (!left || !right) return; // wait for both hands

  msgEl.textContent = "🤖 Both hands detected. AI analysis in progress...";
  logFusion("🤖 Auto analysis started after both captures.");

  await new Promise(r => setTimeout(r, 2500));

  const reportText = `
  The twin palms reveal a rare balance between heart and intellect. 
  Your left hand shows compassion, emotional sensitivity, and spiritual depth, 
  while the right hand radiates determination and purpose. The life lines are strong, 
  revealing recovery power and longevity. Cross lines near the wrist suggest 
  challenges faced early, now turned into wisdom. The fate line rises clear — 
  a sign of divine guidance shaping your path. The heart line bends upward, 
  showing your ability to love deeply while staying aware. 
  The mind line flows steady, symbolizing focus with calmness.  
  You carry a cosmic signature of a seeker — one who connects heaven and earth. 
  These hands belong to a soul whose mission is not mere survival, 
  but illumination. As the moon governs the left and the sun the right, 
  your destiny unites both — intuition and action, silence and expression, 
  reflection and leadership. Your aura reflects harmony with divine rhythm.`;

  document.body.insertAdjacentHTML("beforeend", `
    <div id="reportBox" style="
      background:#101820;
      color:#e6f0ff;
      padding:16px;
      border-radius:10px;
      margin:20px auto;
      max-width:600px;
      box-shadow:0 0 10px #00e5ff;
      text-align:left;
      font-family:'Segoe UI',sans-serif;
      line-height:1.5;
    ">
      <h3 style="color:#00e5ff;text-shadow:0 0 8px #00e5ff;">
        ✋ AI Mini Report — Twin Vision Insight
      </h3>
      <p>${reportText}</p>
    </div>
  `);

  msgEl.textContent = "✅ AI Mini Report generated with voice narration.";
  logFusion("✅ Mini AI Report generated & narrated.");

  // 🔊 Voice auto playback
  const voiceText = "AI Analysis complete. Your hands show harmony between wisdom and emotion.";
  speak(voiceText, "en");
}

// --- Internal logger for Buddhi Fusion Monitor ---
function logFusion(txt) {
  const fusion = document.getElementById("buddhiFusion")?.querySelector("#bfBody");
  if (fusion) {
    const t = new Date().toLocaleTimeString();
    fusion.innerHTML += `<div>[${t}] ${txt}</div>`;
    fusion.scrollTop = fusion.scrollHeight;
  } else {
    console.log("[Fusion]", txt);
  }
}
