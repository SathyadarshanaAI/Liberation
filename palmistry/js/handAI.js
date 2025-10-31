// 🧠 Hand AI — Safe Init Version (works on mobile browsers)
import * as handPoseDetection from "https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection";
import * as tf from "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-core";
import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl";

let detector;
let ready = false;

export async function initHandAI() {
  try {
    // wait until backend fully loaded
    await tf.ready();
    await tf.setBackend("webgl");

    detector = await handPoseDetection.createDetector(
      handPoseDetection.SupportedModels.MediaPipeHands,
      {
        runtime: "tfjs",
        modelType: "lite",
        maxHands: 1
      }
    );

    ready = true;
    console.log("✅ Hand AI initialized successfully");
  } catch (err) {
    console.error("❌ Hand AI initialization failed:", err);
  }
}

export async function detectHands(videoEl) {
  if (!ready || !videoEl) return { hasHand: false, confidence: 0 };
  try {
    const hands = await detector.estimateHands(videoEl, { flipHorizontal: true });
    if (hands.length > 0) {
      const conf = hands[0].score ? hands[0].score[0] : 0.9;
      return { hasHand: true, confidence: conf };
    }
    return { hasHand: false, confidence: 0 };
  } catch (err) {
    console.warn("Detection error:", err);
    return { hasHand: false, confidence: 0 };
  }
}
