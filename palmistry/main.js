import { autoAnalyzeIfReady } from "./modules/ai-analyzer.js";

const vLeft = document.getElementById("videoLeft");
const vRight = document.getElementById("videoRight");
const cLeft = document.getElementById("canvasLeft");
const cRight = document.getElementById("canvasRight");
const msg = document.getElementById("msg");

async function startCam(video) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:true });
    video.srcObject = stream;
    bfLog("📸 Camera started: " + video.id);
  } catch (e) {
    bfLog("❌ Camera error: " + e.message,"#ff5555");
    msg.textContent = "Camera permission denied!";
  }
}

function capture(video, canvas, side) {
  try {
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    localStorage.setItem(side, canvas.toDataURL("image/png"));
    msg.textContent = `${side} captured.`;
    bfLog(`✋ ${side} captured.`);
    autoAnalyzeIfReady(msg);
  } catch (e) {
    bfLog("❌ Capture failed: " + e.message,"#ff4444");
  }
}

document.getElementById("startLeft").onclick = ()=>startCam(vLeft);
document.getElementById("startRight").onclick = ()=>startCam(vRight);
document.getElementById("captureLeft").onclick = ()=>capture(vLeft, cLeft, "palmLeft");
document.getElementById("captureRight").onclick = ()=>capture(vRight, cRight, "palmRight");
