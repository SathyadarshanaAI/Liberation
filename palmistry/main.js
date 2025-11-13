// ===============================
// 🌱 THE SEED · Palmistry Engine
// Master Pipeline Loader (V1.0)
// ===============================

// --- Core ---
import { initWisdomCore } from "./core/wisdom-core.js";
import { PRINCIPLES } from "./core/principles.js";
import { generateHealingAdvice } from "./core/self-heal.js";

// --- Vision ---
import { detectPalm } from "./vision/palm-detect.js";
import { detectAura } from "./vision/aura-detect.js";
import { detectLines } from "./vision/line-detect.js";

// --- Analysis ---
import { analyzeKarma } from "./analysis/karma-engine.js";
import { detectPastLifeSignature } from "./analysis/pastlife-engine.js";
import { mapTendencies } from "./analysis/tendency-map.js";

// --- Render ---
import { createTruthReport } from "./render/truth-output.js";
import { renderPalm3D } from "./render/palm-3d-render.js";


// ===============================
// 🚀 START ENGINE
// ===============================

async function startPalmistryEngine(imageData, handLandmarks) {
    
    console.log("🌱 Initializing THE SEED...");

    // 1. Core
    const wisdom = initWisdomCore();

    // 2. Vision
    const palm = await detectPalm(imageData);
    const aura = detectAura(imageData);
    const lines = detectLines(handLandmarks);

    // 3. Analysis
    const karma = analyzeKarma(lines);
    const pastlife = detectPastLifeSignature(lines);
    const tendencies = mapTendencies(lines, palm.mounts ?? []);

    // 4. Healing
    const heal = generateHealingAdvice(karma.karmicCycle);

    // 5. Final Truth Output
    const truth = createTruthReport({
        wisdom, palm, aura, lines, karma, pastlife, tendencies, heal
    });

    console.log("🌟 FINAL TRUTH REPORT:");
    console.log(truth);

    return truth;
}


// Export globally (if used in HTML)
window.startPalmistryEngine = startPalmistryEngine;
