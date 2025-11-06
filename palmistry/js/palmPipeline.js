// 🕉️ Sathyadarshana Quantum Palm Analyzer
// V24.5 · Neural Pipeline Edition (AI Buddhi ↔ Palm 3D ↔ Line Overlay)

import { initNaturalPalm3D } from "./naturalPalm3D.js";
import { drawPalm } from "./lines.js";

// === Data Flow Objects ===
export const BuddhiPipeline = {
  sensors: {},          // camera input data
  depthMap: null,        // AI generated depth
  palmMesh: null,        // 3D mesh reference
  overlayCtx: null,      // 2D drawing layer
  isLinked: false
};

// === Initialize Entire Pipeline ===
export async function initBuddhiPipeline() {
  console.log("🔌 Initializing Buddhi–Palm Neural Pipeline...");

  // 1️⃣ Initialize 3D Palm Surface
  initNaturalPalm3D("canvasRight");

  // 2️⃣ Link pipeline after slight delay (ensure rendering ready)
  setTimeout(() => {
    const canvas = document.getElementById("canvasRight");
    BuddhiPipeline.overlayCtx = canvas.getContext("2d");
    BuddhiPipeline.palmMesh = "🫱 Palm Mesh Active";
    BuddhiPipeline.isLinked = true;

    console.log("🌐 Pipeline Linked: Buddhi ↔ Palm 3D ↔ Overlay");
    simulateSignalFlow();
  }, 2500);
}

// === Simulate Data Flow Through Pipeline ===
function simulateSignalFlow() {
  if (!BuddhiPipeline.isLinked) return;

  console.log("🔄 Energy flow: Camera → AI Brain → Palm Surface → Overlay");

  // Fake AI signal data (later real ML landmarks will replace)
  const aiSignal = {
    pulse: Math.random(),
    focus: "life_line",
    state: "active"
  };

  BuddhiPipeline.sensors = aiSignal;

  // 3️⃣ Draw overlay lines (AI activated)
  drawPalm(BuddhiPipeline.overlayCtx);

  console.log("✨ Buddhi AI signal transmitted to palm surface:", aiSignal);
}
