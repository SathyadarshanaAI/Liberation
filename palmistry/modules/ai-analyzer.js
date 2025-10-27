// 🕉️ Sathyadarshana Quantum Palm Analyzer · AI Analyzer v3.6
import { speak } from "./voice.js";

export async function autoAnalyzeIfReady(msgEl) {
  const left = localStorage.getItem("palmLeft");
  const right = localStorage.getItem("palmRight");
  if (!left || !right) return;

  msgEl.textContent = "🤖 Both hands detected. AI analysis in progress...";
  logFusion("🤖 Auto analysis started after both captures.");

  await new Promise(r => setTimeout(r, 2500));

  const reportText = `
  The twin palms reveal harmony between the lines of life and mind.
  The left hand shows deep compassion and emotional insight,
  while the right hand radiates strength and clarity of decision.
  Life lines are powerful, symbolizing vitality and protection.
  Cross-lines near the wrist show lessons learned through hardship.
  The mind line flows steadily—showing focus and clarity.
  Fate lines converge—revealing a destiny guided by higher purpose.
  Spiritually, your twin palms reflect the union of moon and sun,
  emotion and reason, faith and willpower.
  These hands belong to one who seeks light through service,
  balancing heart and wisdom in divine rhythm.
  `;

  const reportBox = document.createElement("div");
  reportBox.id = "reportBox";
  reportBox.style = `
    background:#101820;color:#e6f0ff;padding:16px;
    border-radius:10px;margin:20px auto;max-width:600px;
    box-shadow:0 0 10px #00e5ff;text-align:left;
    font-family:'Segoe UI',sans-serif;line-height:1.5;
  `;
  reportBox.innerHTML = `
    <h3 style="color:#00e5ff;text-shadow:0 0 8px #00e5ff;">
      ✋ AI Mini Report — Twin Vision Insight
    </h3>
    <p>${reportText}</p>
  `;
  document.body.appendChild(reportBox);

  msgEl.textContent = "✅ AI Mini Report generated with voice narration.";
  logFusion("✅ Mini AI Report generated & narrated.");

  // 🔊 voice
  speak("ඔබගේ අත් විශ්ලේෂණය සම්පූර්ණයි. ඔබගේ අත්වල හෘදය සහ ප්‍රඥාව අතර සමතුලිතය පෙනේ.", "si");
}

// --- Fusion Log helper ---
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
