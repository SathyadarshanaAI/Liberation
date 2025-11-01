// 🕉️ Sathyadarshana Quantum Palm Analyzer · V16.7 Offline Recovery Build
// handAI.js — Works on GitHub Pages, Netlify & Android Chrome (fallback loader)

let detector, tf, handPoseDetection, ready = false;

export async function initHandAI() {
  try {
    // try load TensorFlow
    if (!window.tf) {
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.16.0/dist/tf.min.js");
    }
    if (!window.handPoseDetection) {
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection");
    }

    tf = window.tf;
    handPoseDetection = window.handPoseDetection;

    if (!tf || !handPoseDetection) throw new Error("Modules missing");

    await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));
    await tf.ready();

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
    alert("AI Hand module could not load. Try again with strong internet or reload.");
  }
}

// dynamic loader
async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// 🔍 detect hand
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
    console.warn("⚠️ Detection failed:", err);
    return { hasHand: false, confidence: 0 };
  }
}
