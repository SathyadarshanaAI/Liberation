// 🕉️ Sathyadarshana Quantum Palm Analyzer · V16.6 Dharma Recovery Build
// handAI.js — Universal Mobile Loader (Offline-safe)

let detector, tf, handPoseDetection, ready = false;

export async function initHandAI() {
  try {
    // --- Step 1: Dynamically import TensorFlow & MediaPipe ---
    tf = await import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.16.0/dist/tf.min.js");
    handPoseDetection = await import("https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection");

    // --- Step 2: Initialize backend ---
    await tf.tf.setBackend("webgl").catch(() => tf.tf.setBackend("cpu"));
    await tf.tf.ready();

    // --- Step 3: Create detector ---
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    detector = await handPoseDetection.createDetector(model, {
      runtime: "tfjs",
      modelType: "lite",
      maxHands: 1,
    });

    ready = true;
    console.log("✅ Hand AI initialized successfully!");
  } catch (err) {
    console.error("❌ Hand AI initialization failed:", err);
    alert("AI Hand module could not load. Check your internet or try desktop mode.");
  }
}

// 🔍 Detect Hand Presence
export async function detectHands(videoEl) {
  if (!ready || !videoEl) return { hasHand: false, confidence: 0 };
  try {
    const result = await detector.estimateHands(videoEl, { flipHorizontal: true });
    if (result.length > 0) {
      const conf = result[0].score ? result[0].score[0] : 0.95;
      return { hasHand: true, confidence: conf };
    }
    return { hasHand: false, confidence: 0 };
  } catch (err) {
    console.warn("⚠️ Detection failed:", err);
    return { hasHand: false, confidence: 0 };
  }
}
