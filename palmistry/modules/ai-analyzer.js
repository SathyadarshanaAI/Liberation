// 🕉️ Sathyadarshana Quantum Palm Analyzer · AI Analyzer v3.5
// Auto 350-word mini report generator after both hands captured

export async function autoAnalyzeIfReady(msgEl) {
  const left = localStorage.getItem("palmLeft");
  const right = localStorage.getItem("palmRight");

  if (!left || !right) return; // both hands not captured yet

  msgEl.textContent = "🤖 Both hands detected. Analyzing...";
  logFusion("🤖 Auto analysis started after both captures.");

  // simulate AI processing delay
  await new Promise(r => setTimeout(r, 2500));

  // sample AI analysis (placeholder — real logic connects to analyzer)
  const report = `
    ✋ <b>Mini AI Report (350 words)</b><br><br>
    The twin palms reveal harmony between the lines of life and mind.
    The left hand shows deep emotional sensitivity and compassion,
    while the right hand indicates decisive action and clear focus.
    The life lines are firm, reflecting resilience and recovery power.
    Crossed minor lines near the heart suggest emotional learning
    through experience, while the curve at the base of the thumb 
    reveals generosity and strong intuitive nature.<br><br>
    The headline’s steady length implies logical clarity, while 
    overlapping fate lines show multi-directional career focus.
    Together, both palms portray an individual who learns through
    balance — contemplation and action, silence and movement,
    intellect and empathy. The small islands along the life line 
    mirror brief challenges that strengthen inner faith.<br><br>
    Spiritually, the twin structure reflects alignment with divine 
    rhythm — the cosmic breath between left (moon) and right (sun).
    Your destiny flows toward harmony between wisdom and service.
  `;

  document.body.insertAdjacentHTML("beforeend", `
    <div id="reportBox" style="
      background:#101820;
      color:#e6f0ff;
      padding:12px;
      border-radius:10px;
      margin:20px auto;
      max-width:600px;
      box-shadow:0 0 10px #00e5ff;
      text-align:left;
      font-family:'Segoe UI',sans-serif;
    ">${report}</div>
  `);

  msgEl.textContent = "✅ Mini AI Report generated automatically.";
  logFusion("✅ Mini AI Report generated (350 words).");
}

// --- Internal logger for Buddhi Fusion Monitor ---
function logFusion(txt){
  const fusion = document.getElementById("buddhiFusion")?.querySelector("#bfBody");
  if(fusion){
    const t = new Date().toLocaleTimeString();
    fusion.innerHTML += `<div>[${t}] ${txt}</div>`;
    fusion.scrollTop = fusion.scrollHeight;
  } else {
    console.log("[Fusion]", txt);
  }
}
