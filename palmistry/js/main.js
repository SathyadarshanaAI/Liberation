import { detectPalmEdges } from "./edgeLines.js";
import { detectHandLandmarks } from "./handpose.js";
import { analyzePalmAI } from "./palmPipeline.js";

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let stream;

document.getElementById("startCam").onclick = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    document.getElementById("status").textContent = "📷 Camera Ready";
  } catch (e) {
    alert("Camera error");
  }
};

document.getElementById("capture").onclick = async () => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  
  // 1️⃣ Detect palm edges (real skin lines)
  const edges = await detectPalmEdges(frame, canvas);
  
  // 2️⃣ Detect hand landmarks (skeleton points)
  const landmarks = await detectHandLandmarks(video);
  
  // 3️⃣ Combine + Analyze
  const result = await analyzePalmAI(edges, landmarks);
  
  document.getElementById("output").textContent = JSON.stringify(result, null, 2);
  document.getElementById("status").textContent = "✨ Real Palm Analysis Complete!";
};
