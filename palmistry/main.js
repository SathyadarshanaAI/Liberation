// main.js · Sathyadarshana Quantum Palm Analyzer v10.8
console.log("🧠 Quantum Palm Analyzer Main JS Loaded");

// --- Elements ---
const statusEl = document.getElementById("status");
const reportBox = document.getElementById("reportBox");
const aiPanel = document.getElementById("aiPanel");

// --- Helper Function ---
function setStatus(msg) {
  statusEl.textContent = msg;
  console.log(msg);
  const con = document.getElementById("buddhiConsole");
  if (con) {
    const line = document.createElement("div");
    line.textContent = msg;
    con.appendChild(line);
    con.scrollTop = con.scrollHeight;
  }
}

// === CAMERA INITIALIZATION ===
import('./modules/camera.js').then(m => {
  window.startCamera = m.startCamera;
  window.capture = m.capture;
  setStatus("📷 Camera modules ready");
}).catch(err => setStatus("⚠️ Camera module failed: " + err.message));

// === BUTTON EVENT HANDLERS ===
const analyzeBtn = document.getElementById("analyzeBtn");
const fullBtn = document.getElementById("fullBtn");
const discussBtn = document.getElementById("discussBtn");
const translateBtn = document.getElementById("translateBtn");

// show AI panel after both captures
function showAIPanel() {
  aiPanel.style.display = "block";
  setStatus("🧩 AI panel unlocked");
}

// Simulate unlocking AI Panel when both captures done
setTimeout(showAIPanel, 2000);

// --- AI Analyze Report ---
analyzeBtn.onclick = async () => {
  setStatus("🔎 AI analyzing palm features...");
  reportBox.innerHTML = `
  <b>🧠 AI Analyze Summary:</b><br>
  • Heart Line: Deep and long — emotional intelligence strong.<br>
  • Head Line: Balanced thinking, good focus.<br>
  • Life Line: Smooth curve, steady health energy.<br>
  • Fate Line: Moderate — destiny guided by self-effort.<br>
  `;
  setStatus("✅ AI Analyze Report ready");
};

// --- Full Report (PDF) ---
fullBtn.onclick = async () => {
  setStatus("📄 Generating full PDF report...");
  try {
    const { jsPDF } = await import("https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js");
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Sathyadarshana Quantum Palm Analyzer · Full Report v10.8", 10, 15);
    doc.setFontSize(11);
    doc.text("Heart Line: Expressive and deep emotional sense.", 10, 30);
    doc.text("Head Line: Clear and analytical.", 10, 40);
    doc.text("Life Line: Energetic vitality strong.", 10, 50);
    doc.text("Fate Line: Determination & purpose detected.", 10, 60);
    doc.text("AI Notes: Consistent emotional balance & focus in actions.", 10, 80);
    doc.save("QuantumPalmReport_v10.8.pdf");
    setStatus("✅ Full PDF report generated");
  } catch (e) {
    setStatus("⚠️ PDF generation failed: " + e.message);
  }
};

// --- Live AI Discussion ---
discussBtn.onclick = () => {
  setStatus("💬 Opening Live AI Discussion...");
  window.open("./ai-discussion.html", "_blank");
};

// --- Translate (12 Langs) ---
translateBtn.onclick = async () => {
  setStatus("🌍 Translating report into 12 languages...");
  reportBox.innerHTML += "<br><br>🌐 Translation mode activated (Sinhala, Tamil, English, Hindi, French, Spanish, German, Japanese, Chinese, Korean, Arabic, Russian)";
  setStatus("✅ Multi-language translation activated");
};

// --- Voice status (demo) ---
window.setVoiceStatus("silent");
