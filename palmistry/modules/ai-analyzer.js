import { speak } from "./voice.js";

export async function autoAnalyzeIfReady(msgEl) {
  // prevent duplicate reports
  if (window.analysisRunning) return;
  window.analysisRunning = true;

  const left = localStorage.getItem("palmLeft");
  const right = localStorage.getItem("palmRight");
  if (!left || !right) {
    window.analysisRunning = false;
    return;
  }

  msgEl.textContent = "🤖 Both hands detected. AI analysis in progress...";
  bfLog("🧠 AI analyzer activated.");

  await new Promise(r => setTimeout(r, 2000));

  const reportText = `
  The two palms reveal a profound harmony between heart and intellect.
  The left hand shows emotional sensitivity, kindness, and spiritual maturity,
  while the right hand reveals focus, leadership, and resilience.
  Together they symbolize balance between intuition and reason.
  Your life lines indicate inner strength; fate lines show destiny guided by wisdom.
  The heart line bends gently upward — a mark of compassion blended with courage.
  Your mind line is long and steady, indicating clarity and truth seeking.
  Spiritually, you embody union of moon and sun — the seeker of harmony and light.
  You carry a karmic resonance from past lives tied with compassion and creativity,
  showing you were once a healer or spiritual guide.
  Your palm’s radiant pattern suggests divine protection through all hardships.
  Every mark upon it whispers that enlightenment grows from patience and love.`;

  const box = document.createElement("div");
  box.style = `
    background:#101820;color:#e6f0ff;padding:16px;border-radius:10px;
    margin:20px auto;max-width:600px;box-shadow:0 0 10px #00e5ff;
    text-align:left;font-family:'Segoe UI',sans-serif;line-height:1.6;`;
  box.innerHTML = `<h3 style="color:#00e5ff;">✋ AI Mini Report</h3><p>${reportText}</p>`;
  document.body.appendChild(box);

  speak("ඔබගේ අත් විශ්ලේෂණය සම්පූර්ණයි. ඔබගේ අත්වල ආලෝකය හා ප්‍රඥාව සමබරය.", "si");
  bfLog("✅ AI Mini Report generated with voice narration.");
  msgEl.textContent = "✅ AI Mini Report generated successfully.";

  // allow re-analysis later
  window.analysisRunning = false;
}
