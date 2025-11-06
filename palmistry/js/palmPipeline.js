// 🕉️ Sathyadarshana Quantum Palm Analyzer
// V24.9 — Dual Neural Pipeline + Overlay Clear Edition

import { initNaturalPalm3D } from "./naturalPalm3D.js";
import { drawPalm } from "./lines.js";

export const BuddhiPipeline = {
  sensors: {},
  depthMap: null,
  palmMesh: null,
  overlayCtx: null,
  isLinked: false,
};

// === Initialize Neural Pipeline ===
export async function initBuddhiPipeline() {
  console.log("🔌 Initializing Buddhi–Palm Neural Pipeline...");

  // Initialize both hand canvases safely
  initNaturalPalm3D("canvasLeft");
  initNaturalPalm3D("canvasRight");

  // Wait a bit for canvases to mount before linking
  setTimeout(() => {
    const rightCanvas = document.getElementById("canvasRight");
    const leftCanvas = document.getElementById("canvasLeft");

    if (!rightCanvas && !leftCanvas) {
      console.warn("⚠️ No canvases found for pipeline overlay linking.");
      return;
    }

    BuddhiPipeline.overlayCtx =
      rightCanvas?.getContext("2d") || leftCanvas?.getContext("2d");

    BuddhiPipeline.palmMesh = true;
    BuddhiPipeline.isLinked = true;
    console.log("🌐 Pipeline Linked: Buddhi ↔ Palm 3D ↔ Overlay");

    simulateSignalFlow();
  }, 2000);
}

// === Signal Simulation ===
function simulateSignalFlow() {
  if (!BuddhiPipeline.isLinked) return;

  console.log("🔄 Energy flow: Camera → AI Brain → Palm Surface → Overlay");

  const aiSignal = {
    pulse: Math.random(),
    focus: "life_line",
    intensity: (Math.random() * 0.5 + 0.5).toFixed(2),
    ts: new Date().toLocaleTimeString(),
  };

  BuddhiPipeline.sensors = aiSignal;

  // Get correct context (right-hand prioritized)
  const ctx =
    BuddhiPipeline.overlayCtx ||
    document.getElementById("canvasRight")?.getContext("2d") ||
    document.getElementById("canvasLeft")?.getContext("2d");

  if (ctx) {
    try {
      // 🧽 Clear previous overlay before drawing new lines
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // 🖐️ Draw fresh palm overlay
      drawPalm(ctx);

      console.log("✨ Buddhi AI signal transmitted →", aiSignal);
    } catch (e) {
      console.error("⚠️ Pipeline overlay draw error:", e);
    }
  } else {
    console.warn("No drawing context found for pipeline overlay.");
  }

  // Continuous refresh (like live pulse)
  setTimeout(simulateSignalFlow, 4500);
}
