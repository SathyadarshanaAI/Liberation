import { detectPalmEdges } from "./edgeLines.js";
import { detectHandLandmarks } from "./handpose.js";
import { analyzePalmAI } from "./palmPipeline.js";

const hands = ["left", "right"];

hands.forEach(side => {
  const vid = document.getElementById(`vid${side.charAt(0).toUpperCase() + side.slice(1)}`);
  const canvas = document.getElementById(`canvas${side.charAt(0).toUpperCase() + side.slice(1)}`);
  const ctx = canvas.getContext("2d");

  document.getElementById(`startCam${side.charAt(0).toUpperCase() + side.slice(1)}`).onclick = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      vid.srcObject = stream;
      vid.play();
      document.getElementById("status").textContent = `📷 ${side.toUpperCase()} Camera Active`;
    } catch (err) {
      alert("Camera Error: " + err.message);
    }
  };

  document.getElementById(`capture${side.charAt(0).toUpperCase() + side.slice(1)}`).onclick = async () => {
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    document.getElementById("status").textContent = `🧠 Analyzing ${side} Hand...`;

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Step 1️⃣ – detect skin line edges
    const edges = await detectPalmEdges(frame, canvas);

    // Step 2️⃣ – detect anatomical landmarks (fingers, wrist, palm center)
    const landmarks = await detectHandLandmarks(vid);

    // Step 3️⃣ – Deep AI Fusion Analysis
    const result = await analyzePalmAI(edges, landmarks);

    document.getElementById(`analysisText${side.charAt(0).toUpperCase() + side.slice(1)}`).textContent =
      JSON.stringify(result, null, 2);

    document.getElementById("status").textContent = "✨ Real AI Analysis Complete!";
  };
});
