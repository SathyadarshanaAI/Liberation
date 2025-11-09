// 🕉️ Sathyadarshana Quantum Palm Analyzer · V26.7 Quantum Core
// — Main Controller integrating OpenCV + TensorFlow Fusion —

import { detectPalmEdges } from "./edgeLines.js";
import { detectHandLandmarks } from "./handpose.js";
import { analyzePalmAI } from "./palmPipeline.js";

const hands = ["left", "right"];

// === Initialize TensorFlow backend ===
async function initTensorFlow() {
  try {
    if (typeof tf === "undefined") {
      console.error("❌ TensorFlow.js not loaded. Check your CDN link.");
      document.getElementById("status").textContent = "⚠️ TensorFlow not loaded!";
      return;
    }

    await tf.setBackend("webgl");
    await tf.ready();
    console.log("✅ TensorFlow WebGL backend ready");
    document.getElementById("status").textContent = "🧠 TensorFlow WebGL Ready";
  } catch (err) {
    console.error("TensorFlow Init Error:", err);
    document.getElementById("status").textContent = "⚠️ TensorFlow Initialization Failed";
  }
}
initTensorFlow();

// === Main Logic for Both Hands ===
hands.forEach(side => {
  const name = side.charAt(0).toUpperCase() + side.slice(1);
  const vid = document.getElementById(`vid${name}`);
  const canvas = document.getElementById(`canvas${name}`);
  const ctx = canvas.getContext("2d");

  // === 🎥 Start Camera ===
  document.getElementById(`startCam${name}`).onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      vid.srcObject = stream;
      await vid.play();
      document.getElementById("status").textContent = `📷 ${name} Camera Active`;
      console.log(`🎦 ${name} camera started successfully`);
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Camera Error: " + err.message);
    }
  };

  // === 📸 Capture & Analyze ===
  document.getElementById(`capture${name}`).onclick = async () => {
    try {
      ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
      canvas.style.display = "block";
      document.getElementById("status").textContent = `🧠 Analyzing ${name} Hand...`;

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Step 1️⃣ – Detect palm edges (OpenCV-based)
      const edges = await detectPalmEdges(frame, canvas);

      // Step 2️⃣ – Detect hand landmarks (TensorFlow / MediaPipe hybrid)
      const landmarks = await detectHandLandmarks(vid);

      // Step 3️⃣ – Deep AI Fusion Analysis
      const result = await analyzePalmAI(edges, landmarks);

      // Display Output
      document.getElementById(`analysisText${name}`).textContent =
        JSON.stringify(result, null, 2);

      document.getElementById("status").textContent = "✨ Real AI Analysis Complete!";
      console.log(`✅ ${name} hand analysis complete`);
    } catch (err) {
      console.error(`❌ ${name} Analysis Error:`, err);
      document.getElementById("status").textContent = `⚠️ ${name} Analysis Failed`;
    }
  };
});
