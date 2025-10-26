try {
  console.log("🧠 Analyzer module initializing...");
} catch (err) {
  console.warn("⚠️ Analyzer log init failed:", err);
}

try {
  // === Main analyzer logic here ===
  import { analyzePalm } from "./vision.js";
  import { emit } from "./bus.js";

  export async function runAnalysis({ hand = "left", mode = "mini" } = {}) {
    try {
      emit("analyzer:status", { level: "info", msg: `Start analyzing ${hand} hand` });
      const canvas = document.getElementById(hand === "left" ? "canvasLeft" : "canvasRight");
      const vision = await analyzePalm(canvas);
      if (!vision || !vision.interpretation) {
        emit("analyzer:status", { level: "error", msg: "Vision module failed" });
        return { summary: "No valid data", all: [] };
      }
      const reportParts = [];
      for (const f of vision.interpretation) {
        reportParts.push(`• ${f.name}: ${f.meaning}`);
      }
      const summary =
        hand === "left"
          ? "Left hand reveals karmic imprints — the memory of spiritual evolution."
          : "Right hand displays present destiny — the map of active will.";
      const fullText = `${summary}\n\n${reportParts.join("\n\n")}`;
      emit("analyzer:status", { level: "ok", msg: `Analysis complete for ${hand}` });
      return { summary, all: vision.interpretation, report: fullText };
    } catch (err) {
      console.error("❌ Analyzer internal error:", err);
      emit("analyzer:status", { level: "error", msg: "Analyzer failed internally" });
      return { summary: "Error during analysis", all: [] };
    }
  }
} catch (err) {
  console.error("❌ Analyzer Syntax/Load Error:", err);
  const panel = document.getElementById("buddhiConsole");
  if (panel) {
    const msg = document.createElement("div");
    msg.style.color = "#ff6b6b";
    msg.style.fontFamily = "monospace";
    msg.textContent = "⚠️ Analyzer.js failed to load — syntax or token error: " + err.message;
    panel.appendChild(msg);
  }
}
