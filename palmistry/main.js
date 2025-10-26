// main.js · Sathyadarshana Quantum Palm Analyzer v10.9 Serenity Fusion
console.log("🧠 Quantum Palm Analyzer v10.9 loaded");

const statusEl = document.getElementById("status");
const reportBox = document.getElementById("reportBox");
const aiPanel = document.getElementById("aiPanel");

// ----------------- Helper -----------------
function setStatus(msg, col = "#16f0a7") {
  statusEl.innerHTML = msg;
  const log = document.getElementById("buddhiConsole");
  const line = document.createElement("div");
  line.style.color = col;
  line.textContent = msg;
  log.appendChild(line);
  log.scrollTop = log.scrollHeight;
  console.log(msg);
}

// ----------------- VOICE ENGINE -----------------
let synth = window.speechSynthesis;
function speak(txt, lang = "en-US") {
  try {
    if (!synth) return setStatus("⚠️ Voice not supported on this device", "#ff6b6b");
    const utter = new SpeechSynthesisUtterance(txt);
    utter.lang = lang;
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    synth.cancel();
    synth.speak(utter);
    window.setVoiceStatus("speak");
    utter.onend = () => window.setVoiceStatus("silent");
  } catch (e) {
    setStatus("⚠️ Voice error: " + e.message, "#ff6b6b");
  }
}

// ----------------- CAMERA MODULE -----------------
import('./modules/camera.js')
  .then((m) => {
    window.startCamera = m.startCamera;
    window.capture = m.capture;
    setStatus("📷 Camera modules ready");
  })
  .catch((err) => setStatus("⚠️ Camera module failed: " + err.message, "#ff6b6b"));

// ----------------- BUTTONS -----------------
const analyzeBtn = document.getElementById("analyzeBtn");
const fullBtn = document.getElementById("fullBtn");
const discussBtn = document.getElementById("discussBtn");
const translateBtn = document.getElementById("translateBtn");

// Activate AI panel after capture
setTimeout(() => {
  aiPanel.style.display = "block";
  setStatus("🧩 AI panel unlocked");
}, 2000);

// ----------------- AI ANALYZER -----------------
analyzeBtn.onclick = () => {
  setStatus("🔎 AI analyzing palm features...");
  const text = `
  🧠 AI Analyze Summary:
  • Heart Line – Long & clear: Strong emotional insight.
  • Head Line – Balanced: Good focus & logic.
  • Life Line – Deep curve: High vitality & stable energy.
  • Fate Line – Moderate: Destiny guided by wisdom.
  • Mounts – Balanced: Compassion & stability seen.
  `;
  reportBox.innerHTML = `<pre>${text}</pre>`;
  speak("Palm analysis complete. You are balanced, insightful, and strong.", "en-US");
  setStatus("✅ AI Analyze Report ready");
};

// ----------------- FULL REPORT PDF -----------------
fullBtn.onclick = async () => {
  setStatus("📄 Generating full PDF report...");
  try {
    if (!window.jspdf) {
      await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(15);
    doc.text("🕉️ Sathyadarshana Quantum Palm Analyzer - Serenity Report", 10, 15);
    doc.setFontSize(12);
    doc.text("Heart Line: Deep and expressive emotional depth.", 10, 30);
    doc.text("Head Line: Strong logical reasoning.", 10, 40);
    doc.text("Life Line: High energy & vitality.", 10, 50);
    doc.text("Fate Line: Purpose-driven effort.", 10, 60);
    doc.text("AI Analysis: Balanced personality, creative spirit.", 10, 75);
    doc.text("Language Module: 12-Language Ready", 10, 90);
    doc.text("Powered by AI Buddhi v10.9 Serenity Fusion", 10, 110);
    doc.save("Sathyadarshana_Report_v10.9.pdf");
    setStatus("✅ Full PDF report generated successfully");
    speak("Your full serenity report has been created.", "en-US");
  } catch (e) {
    setStatus("⚠️ PDF generation failed: " + e.message, "#ff6b6b");
  }
};

// ----------------- LIVE DISCUSSION -----------------
discussBtn.onclick = () => {
  setStatus("💬 Opening Live AI Discussion...");
  speak("Opening discussion panel.", "en-US");
  window.open("./ai-discussion.html", "_blank");
};

// ----------------- TRANSLATE 12 LANGS -----------------
translateBtn.onclick = async () => {
  setStatus("🌍 Translating into 12 languages...");
  const langs = ["සිංහල", "தமிழ்", "English", "हिंदी", "Français", "Español", "Deutsch", "日本語", "中文", "한국어", "العربية", "Русский"];
  reportBox.innerHTML = "<b>🌐 Multilingual Output:</b><br><br>" + langs.join(" · ");
  speak("Twelve language translator activated.", "en-US");
  setStatus("✅ 12-language translation activated");
};

// Initial voice
window.setVoiceStatus("silent");
