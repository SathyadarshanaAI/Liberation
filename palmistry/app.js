import { CameraCard } from "./camara.js";
import { analyzePalm } from "./moduler.js";

const camBoxLeft = document.getElementById("camLeft");
const camBoxRight = document.getElementById("camRight");
const canvasLeft = document.getElementById("canvasLeft");
const canvasRight = document.getElementById("canvasRight");
const statusEl = document.getElementById("status");

const camLeft = new CameraCard(camBoxLeft, msg => (statusEl.textContent = msg));
const camRight = new CameraCard(camBoxRight, msg => (statusEl.textContent = msg));

function setStatus(msg) {
  statusEl.textContent = msg;
}

[ [camBoxLeft, canvasLeft], [camBoxRight, canvasRight] ].forEach(([box, cvs]) => {
  if (getComputedStyle(box).position === 'static') box.style.position = 'relative';
  Object.assign(cvs.style, { position:'absolute', inset:0, width:'100%', height:'100%', borderRadius:'16px', zIndex:2 });
  box.style.backgroundImage = 'none';
});

document.getElementById("startCamLeft").onclick = async () => {
  const g = canvasLeft.getContext("2d");
  g.clearRect(0, 0, canvasLeft.width, canvasLeft.height);
  await camLeft.start();
  setStatus("Left hand camera started.");
};

document.getElementById("startCamRight").onclick = async () => {
  const g = canvasRight.getContext("2d");
  g.clearRect(0, 0, canvasRight.width, canvasRight.height);
  await camRight.start();
  setStatus("Right hand camera started.");
};

document.getElementById("captureLeft").onclick = () => camLeft.captureTo(canvasLeft);
document.getElementById("captureRight").onclick = () => camRight.captureTo(canvasRight);

document.getElementById("torchLeft").onclick = () => camLeft.toggleTorch();
document.getElementById("torchRight").onclick = () => camRight.toggleTorch();

document.getElementById("analyzeBtn").onclick = async () => {
  setStatus("Analyzing palms...");
  const left = await analyzePalm(canvasLeft, "left");
  const right = await analyzePalm(canvasRight, "right");
  setStatus("Analysis complete ✅");

  const report = `
    🖐️ Left Hand → ${left.summary}
    🖐️ Right Hand → ${right.summary}
    Lines detected: ${right.lines.length}
  `;
  document.getElementById("reportBox").innerText = report;
};
