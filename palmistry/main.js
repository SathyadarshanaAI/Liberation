// 🧠 Sathyadarshana Modular Core Main — V10.7.2 Serenity Fusion Edition
import { on, emit } from "./modules/bus.js";
import { speak } from "./modules/ai.js";
import { generateReport } from "./modules/report.js";
import { runAnalysis } from "./modules/analyzer.js";

console.log("🧠 Main core V10.7 running");

const status = document.getElementById("status");
const panel  = document.getElementById("aiPanel");
const reportBox = document.getElementById("reportBox");

// === Camera Status ===
on("camera:ready", e => {
  status.textContent = `✅ ${e.side} camera active`;
  speak(`${e.side} camera ready`);
});

// === Capture Event ===
on("capture:done", e => {
  status.textContent = `🖐 ${e.side} hand captured — analyzing…`;
  speak(`${e.side} hand captured, analyzing palm lines.`);
  document.getElementById(`${e.side}Hand`).classList.add("flash");
  
  setTimeout(() => {
    generateReport(e.side);
    emit("report:done", { side: e.side });
  }, 1500);
});

// === Report Ready ===
on("report:done", e => {
  document.getElementById(`${e.side}Hand`).classList.remove("flash");
  status.textContent = `✨ ${e.side} hand report ready!`;
  speak(`${e.side} hand report complete.`);
  panel.style.display = "block";
});

// === AI Analyze Button ===
const analyzeBtn = document.getElementById("analyzeBtn");
if (analyzeBtn) {
  analyzeBtn.onclick = async () => {
    speak("Analyzing your palm, please wait...");
    reportBox.innerHTML = "🔮 AI Buddhi analyzing palm lines... ⏳";

    try {
      const result = await runAnalysis({ hand: "right", mode: "mini" });
      reportBox.innerHTML = `<b>${result.summary}</b><br><pre>${result.report}</pre>`;
      speak("Palm analysis complete.");
    } catch (err) {
      reportBox.innerHTML = "⚠️ Error during AI analysis.";
      speak("System error while analyzing the palm.");
    }
  };
}

// === Full Report (PDF) ===
document.getElementById("fullBtn").onclick = () => {
  speak("Generating full report PDF.");
  emit("pdf:generate");
};

// === Live AI Discussion ===
document.getElementById("discussBtn").onclick = () => {
  speak("Opening live AI discussion mode.");
  alert("💬 Live AI discussion will open soon...");
};

// === Translation ===
document.getElementById("translateBtn").onclick = () => {
  speak("Translating report into twelve languages.");
  alert("🌐 12-language translation module loading...");
};

// === Error Monitor ===
window.addEventListener("error", err => {
  console.warn("⚠️ Error detected:", err.message);
  speak("System encountered an error.");
});
