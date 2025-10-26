// analyzer.js · v10.9 safe base

import { analyzePalm } from "./vision.js";
import { emit } from "./bus.js";

console.log("🧠 Analyzer.js module loaded successfully");

export async function runAnalysis({ hand = "left" } = {}) {
  try {
    emit("analyzer:status", { level: "info", msg: `Analyzing ${hand} hand...` });

    const canvasId = hand === "left" ? "canvas-left" : "canvas-right";
    const canvas = document.getElementById(canvasId);

    if (!canvas) throw new Error("Canvas not found for " + hand);

    const vision = await analyzePalm(canvas);

    if (!vision || !vision.interpretation) {
      emit("analyzer:status", { level: "error", msg: "Vision data missing" });
      return { summary: "No valid palm data detected", all: [] };
    }

    const lines = vision.interpretation.map(f => `• ${f.name}: ${f.meaning}`);
    const summary =
      hand === "left"
        ? "Left hand shows karmic imprints and past energy lines."
        : "Right hand reveals active destiny and future trends.";

    const report = `${summary}\n\n${lines.join("\n\n")}`;
    emit("analyzer:status", { level: "ok", msg: `${hand} analysis complete` });

    return { summary, all: vision.interpretation, report };
  } catch (err) {
    console.error("❌ Analyzer internal error:", err);
    emit("analyzer:status", { level: "error", msg: err.message });
    return { summary: "Analyzer failed: " + err.message, all: [] };
  }
}
