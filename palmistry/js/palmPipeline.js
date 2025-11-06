// palmPipeline.js — V24.5 Neural Pipeline Edition (simulate + link)
import { initNaturalPalm3D } from "./naturalPalm3D.js";
import { drawPalm } from "./lines.js";

export const BuddhiPipeline = {
  sensors: {},
  depthMap: null,
  palmMesh: null,
  overlayCtx: null,
  isLinked: false
};

export async function initBuddhiPipeline() {
  console.log("🔌 Initializing Buddhi–Palm Neural Pipeline...");

  // ensure 3D palm present (initNaturalPalm3D can be idempotent)
  initNaturalPalm3D("canvasRight");

  setTimeout(() => {
    const canvas = document.getElementById("canvasRight");
    if (!canvas) {
      console.warn("canvasRight not found for pipeline overlay linking.");
      return;
    }
    BuddhiPipeline.overlayCtx = canvas.getContext("2d");
    BuddhiPipeline.palmMesh = true;
    BuddhiPipeline.isLinked = true;
    console.log("🌐 Pipeline Linked: Buddhi ↔ Palm 3D ↔ Overlay");
    simulateSignalFlow();
  }, 1800);
}

function simulateSignalFlow() {
  if (!BuddhiPipeline.isLinked) return;

  console.log("🔄 Energy flow: Camera → AI Brain → Palm Surface → Overlay");

  const aiSignal = {
    pulse: Math.random(),
    focus: "life_line",
    state: "active",
    ts: Date.now()
  };

  BuddhiPipeline.sensors = aiSignal;

  // Use available overlayCtx — if not available fallback to left/right canvas contexts
  const ctx = BuddhiPipeline.overlayCtx ||
              document.getElementById("canvasLeft")?.getContext("2d") ||
              document.getElementById("canvasRight")?.getContext("2d");

  if (ctx) {
    try {
      drawPalm(ctx);
      console.log("✨ Buddhi AI signal transmitted to palm surface:", aiSignal);
    } catch (e) {
      console.error("⚠️ Pipeline overlay draw error:", e);
    }
  } else {
    console.warn("No drawing context available for pipeline overlay.");
  }
}
