// 🔥 THE SEED — Full Pipeline Loader

// Core
import { initWisdomCore } from "./core/wisdom-core.js";
import { generateHealingAdvice } from "./core/self-heal.js";

// Vision
import { detectPalm } from "./vision/palm-detect.js";
import { detectAura } from "./vision/aura-detect.js";
import { detectLines } from "./vision/line-detect.js";

// Analysis
import { analyzeKarma } from "./analysis/karma-engine.js";
import { detectPastLifeSignature } from "./analysis/pastlife-engine.js";
import { mapTendencies } from "./analysis/tendency-map.js";

// Render
import { createTruthReport } from "./render/truth-output.js";


// 🧠 Start Engine
export async function startPalmistryEngine(imageData, handLandmarks) {

  console.log("🌱 Starting THE SEED Quantum Engine...");

  // Core
  const wisdom = initWisdomCore();

  // Vision
  const palm = await detectPalm(imageData);
  const aura = detectAura(imageData);
  const lines = detectLines(handLandmarks);

  // Analysis
  const karma = analyzeKarma(lines);
  const pastlife = detectPastLifeSignature(lines);
  const tendencies = mapTendencies(lines, palm.mounts);

  // Healing
  const heal = generateHealingAdvice(karma.karmicCycle);

  // Final Truth Output
  const truth = createTruthReport({
    palm,
    aura,
    lines,
    karma,
    pastlife,
    tendencies,
    heal
  });

  console.log("🌟 FINAL REPORT:", truth);
  return truth;
}

window.startPalmistryEngine = startPalmistryEngine;
