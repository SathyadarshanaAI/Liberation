// 🧠 Sathyadarshana Quantum Palm Analyzer – Main Controller
import { detectPalmEdges } from "./edgeLines.js";
import { detectHandLandmarks } from "./handpose.js";
import { analyzePalmAI } from "./palmPipeline.js";

const hands = ["left", "right"];

// === Initialize TensorFlow backend ===
async function initTensorFlow() {
  if (typeof tf === "undefined") {
    console.error("❌ TensorFlow.js not loaded. Check your CDN imports.");
    document.getElementById("status").textContent = "⚠️ TensorFlow not loaded!";
    return;
  }

  await tf.setBackend("webgl");
  await tf.ready();
  console.log("✅ TensorFlow WebGL backend ready");
  document.getElementById("status").textContent = "🧠 TensorFlow WebGL Ready";
}
initTensorFlow();

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
    } catch (err) {
      alert("Camera Error: " + err.message);
    }
  };

  // === 📸 Capture & Analyze ===
  document.getElementById(`capture${name}`).onclick = async () => {
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    document.getElementById("status").textContent = `🧠 Analyzing ${name} Hand...`;

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Step 1️⃣ – detect skin & palm edges
    const edges = await detectPalmEdges(frame, canvas);

    // Step 2️⃣ – detect anatomical landmarks (fingers, wrist, palm center)
    const landmarks = await detectHandLandmarks(vid);

    // Step 3️⃣ – Deep AI Fusion Analysis
    const result = await analyzePalmAI(edges, landmarks);

    document.getElementById(`analysisText${name}`).textContent =
      JSON.stringify(result, null, 2);

    document.getElementById("status").textContent = "✨ Real AI Analysis Complete!";
  };
});
