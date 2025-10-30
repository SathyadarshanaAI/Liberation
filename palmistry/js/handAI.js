// 🕉️ Sathyadarshana Quantum Palm Analyzer · V14.0 Real Detection Edition
// handAI.js — Real-Time Palm Detection (Optimized for Mobile)

import * as handPoseDetection from "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection";
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core";
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl";

let detector;
let ready = false;

// ⚡ Initialize AI Engine
export async function initHandAI() {
  try {
    await tf.setBackend("webgl");
    await tf.ready();

    detector = await handPoseDetection.createDetector(
      handPoseDetection.SupportedModels.MediaPipeHands,
      {
        runtime: "tfjs",
        modelType: "lite", // 👈 lightweight version for mobile
        maxHands: 1
      }
    );

    ready = true;
    console.log("✅ AI Hand Detector ready (mobile optimized)");
  } catch (err) {
    console.warn("❌ Hand AI initialization failed:", err);
  }
}

// 🔍 Detect human hand presence
export async function detectHands(videoEl) {
  if (!ready || !videoEl) return { hasHand: false, confidence: 0 };

  try {
    const hands = await detector.estimateHands(videoEl, { flipHorizontal: true });
    if (hands.length > 0) {
      const conf = hands[0].score ? hands[0].score[0] : 0.9;
      return { hasHand: true, confidence: conf };
    } else {
      return { hasHand: false, confidence: 0 };
    }
  } catch (err) {
    console.warn("Detection error:", err);
    return { hasHand: false, confidence: 0 };
  }
}
