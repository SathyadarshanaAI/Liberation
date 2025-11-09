import { detectPalmEdges } from "./edgeLines.js";
import { analyzePalmAI } from "./palmPipeline.js";

let streamLeft, streamRight;

const vids = {
  left: document.getElementById("vidLeft"),
  right: document.getElementById("vidRight")
};
const canvases = {
  left: document.getElementById("canvasLeft"),
  right: document.getElementById("canvasRight")
};
const ctxL = canvases.left.getContext("2d");
const ctxR = canvases.right.getContext("2d");

const status = document.getElementById("status");

// ====== CAMERA CONTROLS ======
async function startCamera(side) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    if (side === "left") {
      vids.left.srcObject = stream;
      streamLeft = stream;
    } else {
      vids.right.srcObject = stream;
      streamRight = stream;
    }
    status.textContent = `📷 ${side === "left" ? "Left" : "Right"} camera ready`;
  } catch (e) {
    console.error(e);
    alert("Camera access error!");
  }
}

// ====== CAPTURE FRAME ======
function captureFrame(side) {
  const video = side === "left" ? vids.left : vids.right;
  const canvas = side === "left" ? canvases.left : canvases.right;
  const ctx = side === "left" ? ctxL : ctxR;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

// ====== ANALYZE FUNCTION ======
async function analyzePalm(side) {
  status.textContent = `🔎 Analyzing ${side} hand...`;
  const frame = captureFrame(side);

  // 🧠 Step 1: Edge Detection (real palm lines)
  const edges = await detectPalmEdges(frame, canvases[side]);

  // 🧬 Step 2: AI Deep Analysis
  const result = await analyzePalmAI(edges);

  // 📝 Step 3: Display Result
  document.getElementById(`analysisText${side === "left" ? "Left" : "Right"}`).textContent =
    JSON.stringify(result, null, 2);
  status.textContent = `✨ ${side} hand analysis complete!`;
}

// ====== EVENT BINDINGS ======
document.getElementById("startCamLeft").onclick = () => startCamera("left");
document.getElementById("captureLeft").onclick = () => captureFrame("left");
document.getElementById("analyzeLeft").onclick = () => analyzePalm("left");

document.getElementById("startCamRight").onclick = () => startCamera("right");
document.getElementById("captureRight").onclick = () => captureFrame("right");
document.getElementById("analyzeRight").onclick = () => analyzePalm("right");

// ====== STATUS INIT ======
status.textContent = "🧠 Ready for palm analysis...";
