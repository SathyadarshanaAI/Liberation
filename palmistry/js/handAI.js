// 🕉️ Sathyadarshana Quantum Palm Analyzer · V16.9 Universal Mobile Fix
// works on Android Chrome 70+, Samsung Internet, Edge, Opera Mini (fallback)

let detector, ready = false;

// 🌐 Load external scripts safely (no import syntax)
async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = url;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ⚙️ Initialize AI
export async function initHandAI() {
  try {
    if (!window.tf) {
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.21.0/dist/tf.min.js");
    }
    if (!window.handPoseDetection) {
      await loadScript("https://cdn.jsdelivr.net/npm/@tensorflow-models/hand-pose-detection");
    }

    const tf = window.tf;
    const hp = window.handPoseDetection;

    await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));
    await tf.ready();

    const model = hp.SupportedModels.MediaPipeHands;
    detector = await hp.createDetector(model, {
      runtime: "tfjs",
      modelType: "lite",
      maxHands: 1,
    });

    ready = true;
    console.log("✅ Hand AI initialized");
    return true;
  } catch (err) {
    console.error("❌ Hand AI initialization failed:", err);
    alert("AI Hand module failed to load.\nPlease check your browser version or network.");
    return false;
  }
}

// 🖐️ Detect Hand
export async function detectHands(videoEl) {
  if (!ready || !videoEl) return { hasHand: false, confidence: 0 };
  try {
    const hands = await detector.estimateHands(videoEl, { flipHorizontal: true });
    if (hands.length > 0) {
      const conf = hands[0].score?.[0] ?? 0.9;
      return { hasHand: true, confidence: conf };
    }
    return { hasHand: false, confidence: 0 };
  } catch (err) {
    console.warn("⚠️ Detection error:", err);
    return { hasHand: false, confidence: 0 };
  }
}
