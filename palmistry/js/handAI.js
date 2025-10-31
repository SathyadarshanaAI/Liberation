// 🕉️ Sathyadarshana Quantum Palm Analyzer · V16.5
// handAI.js — Stable Hand Detection (WebGL Safe Mode)

import * as handPoseDetection from "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection";
import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.16.0";

let detector, ready = false;

// ⚙️ Initialize AI Engine
export async function initHandAI() {
  try {
    await tf.setBackend("webgl"); // fallback automatic
    await tf.ready();

    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    detector = await handPoseDetection.createDetector(model, {
      runtime: "tfjs",
      modelType: "lite", // lightweight for mobile
      maxHands: 1,
    });

    ready = true;
    console.log("✅ Hand AI initialized successfully!");
  } catch (err) {
    console.error("❌ Hand AI initialization failed:", err);
    alert("AI Hand module could not load. Please check your internet and reload.");
  }
}

// 🔎 Detect hand presence
export async function detectHands(videoEl) {
  if (!ready || !videoEl) return { hasHand: false, confidence: 0 };
  try {
    const results = await detector.estimateHands(videoEl, { flipHorizontal: true });
    if (results.length > 0) {
      const conf = results[0].score ? results[0].score[0] : 0.95;
      return { hasHand: true, confidence: conf };
    } else {
      return { hasHand: false, confidence: 0 };
    }
  } catch (err) {
    console.warn("Detection failed:", err);
    return { hasHand: false, confidence: 0 };
  }
}
