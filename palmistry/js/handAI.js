// 🕉️ Sathyadarshana Quantum Palm Analyzer · V14.0 Real Detection Edition
// handAI.js — Detects if a real human hand is visible

import * as handPoseDetection from "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";

let detector;
let ready = false;

export async function initHandAI() {
  await handPoseDetection.createDetector(handPoseDetection.SupportedModels.MediaPipeHands, {
    runtime: "tfjs",
    modelType: "full",
  }).then(det => {
    detector = det;
    ready = true;
    console.log("🧠 Hand AI initialized.");
  });
}

export async function detectHands(videoEl) {
  if (!ready || !videoEl) return { hasHand: false, confidence: 0 };
  const hands = await detector.estimateHands(videoEl);
  if (hands.length > 0) {
    const conf = hands[0].score || 0.9;
    return { hasHand: true, confidence: conf };
  } else {
    return { hasHand: false, confidence: 0 };
  }
}
