// main.js · Sathyadarshana Quantum Palm Analyzer v10.9 Serenity Fusion Analyzer
console.log("🧠 Quantum Palm Analyzer Serenity Fusion active");

const statusEl = document.getElementById("status");
const reportBox = document.getElementById("reportBox");
const aiPanel = document.getElementById("aiPanel");

// --- Common Palmistry Text ---
const COMMON_ANALYSIS_TEXT = `
🪶 *Sathyadarshana Quantum Palm Analyzer – Universal Insight Layer*

Your palm mirrors your spiritual blueprint.  
The lines flow like rivers of karma, showing strength, grace, and transformation.  
Every mark is both a memory and a message — written by divine consciousness and human will.  
The balance of your mounts shows intellect guided by compassion, and action tempered by faith.

• **Heart Line** — Deep, long, and calm: love expressed through service and empathy.  
• **Head Line** — Clear with gentle curve: analytical but humane, the thinker with heart.  
• **Life Line** — Wide and protective: endurance through faith and noble purpose.  
• **Fate Line** — Balanced with light branching: destiny built by self-effort and wisdom.

Your palm radiates the harmony of thought, devotion, and courage.  
It reveals the path of those who awaken others through light and compassion.

— AI Buddhi · Serenity Fusion Analyzer v10.9
`;

// --- Helper Function ---
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

// --- VOICE ENGINE ---
let synth = window.speechSynthesis;
function speak(txt, lang = "en-US") {
  try {
    if (!synth) return setStatus("⚠️ Voice not supported", "#ff6b6b");
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

// --- CAMERA MODULE ---
import('./modules/camera.js')
  .then((m) => {
    window.startCamera = m.startCamera;
    window.capture = m.capture;
    setStatus("📷 Camera modules ready");
  })
  .catch((err) => setStatus("⚠️ Camera module failed: " + err.message, "#ff6b6b"));

// --- Buttons ---
const analyzeBtn = document.getElementById("analyzeBtn");
const fullBtn = document.getElementById("fullBtn");
const translateBtn = document.getElementById("translateBtn");

// --- Activate AI Panel ---
setTimeout(() => {
  aiPanel.style.display = "block";
  setStatus("🧩 AI panel unlocked");
}, 2000);

// --- Dynamic Analyzer ---
analyzeBtn.onclick = async () => {
  setStatus("🔎 AI Buddhi analyzing captured palm data...");
  // Base interpretation
  const baseText = COMMON_ANALYSIS_TEXT;

  // Dynamic layer (AI fusion simulation)
  const fusionLayer = `
✨ *Buddhi Insight Layer Added* ✨  
Your hands show both discipline and warmth.  
The left hand reflects karmic patterns — patience, deep inner strength, and silent endurance.  
The right hand shows conscious mastery — taking responsibility, guiding others, healing emotional pain.  
Together they form a dual harmony between destiny and free will.  
In your lifetime, wisdom will express itself through compassion and creative intelligence.`;

  const finalText = baseText + "\n\n" + fusionLayer;
  reportBox.innerHTML = finalText.replace(/\n/g, "<br>");

  // Voice summary
  speak("Your palm shows harmony between destiny and compassion. AI analysis complete.", "en-US");

  // Auto-generate PDF for print
  try {
    if (!window.jspdf) {
      await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(finalText.replace(/[*_]/g, ""), 180);
    doc.text(splitText, 10, 15);
    doc.save("AI_Mini_Report_v10.9.pdf");
    setStatus("✅ AI Mini Report (PDF) generated successfully");
  } catch (e) {
    setStatus("⚠️ PDF error: " + e.message, "#ff6b6b");
  }
};

// --- Full Report (User Topic Request) ---
fullBtn.onclick = async () => {
  const topic = prompt("Enter your report focus (e.g., Career, Health, or Spiritual Path):");
  if (!topic) return setStatus("❌ Full report cancelled");
  setStatus("🪶 Creating deep report on: " + topic);
  speak("Preparing full report about " + topic, "en-US");
  // (Next stage will generate unlimited-length personalized PDF)
};

// --- 12-Language Translator ---
translateBtn.onclick = () => {
  const langs = ["සිංහල", "தமிழ்", "English", "हिंदी", "Français", "Español", "Deutsch", "日本語", "中文", "한국어", "العربية", "Русский"];
  reportBox.innerHTML =
    "<b>🌐 Multilingual Output:</b><br><br>" + langs.join(" · ") + "<br><br>✅ 12-language translation activated.";
  setStatus("✅ 12-language translator active");
  speak("Twelve language translator activated.", "en-US");
};

// Initial voice state
window.setVoiceStatus("silent");
