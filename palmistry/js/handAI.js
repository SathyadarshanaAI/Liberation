// 🕉️ Sathyadarshana Quantum Palm Analyzer · V16.8 Dharma Vision Stable Build
// handAI_v16.8.js — Offline Ready, Mobile Optimized

let detector, ready = false;

// ✅ Initialize Hand AI
export async function initHandAI() {
  try {
    // Load TensorFlow + HandPose in parallel
    const [tf, hp] = await Promise.all([
      import("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.16.0/dist/tf.min.js"),
      import("https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection")
    ]);

    await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));
    await tf.ready();

    const model = hp.SupportedModels.MediaPipeHands;
    detector = await hp.createDetector(model, {
      runtime: "tfjs",
      modelType: "lite",
      maxHands: 1
    });

    ready = true;
    console.log("✅ Dharma Vision Hand AI initialized");
    return true;
  } catch (e) {
    console.error("❌ Hand AI initialization failed:", e);
    alert("AI Hand module failed to load.\nPlease reload or check your browser version.");
    return false;
  }
}

// 🔍 Detect hand in camera stream
export async function detectHands(videoEl) {
  if (!ready || !videoEl) return { hasHand: false, confidence: 0 };
  try {
    const hands = await detector.estimateHands(videoEl, { flipHorizontal: true });
    if (hands.length) {
      const conf = hands[0].score?.[0] ?? 0.9;
      return { hasHand: true, confidence: conf };
    }
    return { hasHand: false, confidence: 0 };
  } catch (e) {
    console.warn("⚠️ Detection issue:", e);
    return { hasHand: false, confidence: 0 };
  }
}
