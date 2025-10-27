import { checkModules, checkVersion } from "./modules/integrity-monitor.js";
checkModules();
checkVersion("v3.9");
import { startCamera, captureFrame } from "./modules/camera.js";
import { analyzeAI } from "./modules/ai-segmentation.js";
import { generateReport } from "./modules/report.js";
import { speak } from "./modules/voice.js";
import { compareHands } from "./modules/compare.js";
import { autoUpdate } from "./modules/updater.js";

const L = { video: videoLeft, canvas: canvasLeft };
const R = { video: videoRight, canvas: canvasRight };
const msg = document.getElementById("msg");

document.getElementById("startLeft").onclick = () => startCamera(L.video,msg);
document.getElementById("startRight").onclick = () => startCamera(R.video,msg);

document.getElementById("captureLeft").onclick = ()=>capture(L);
document.getElementById("captureRight").onclick = ()=>capture(R);

function capture(side){
  const ctx = side.canvas.getContext("2d");
  side.canvas.width = side.video.videoWidth;
  side.canvas.height = side.video.videoHeight;
  ctx.drawImage(side.video,0,0,side.canvas.width,side.canvas.height);
  localStorage.setItem(side===L?"palmLeft":"palmRight",side.canvas.toDataURL("image/png"));
  msg.textContent = "✅ "+(side===L?"Left":"Right")+" captured.";
}

document.getElementById("analyzeBtn").onclick = async ()=>{
  msg.textContent = "🤖 Analyzing both hands...";
  const leftFrame = captureFrame(L.video);
  const rightFrame = captureFrame(R.video);

  const left = await analyzeAI(leftFrame);
  const right = await analyzeAI(rightFrame);

  await generateReport(left,"en",{hand:"Left"});
  await generateReport(right,"en",{hand:"Right"});

  const comparison = compareHands(left,right);
  speak(comparison.summary,"en");
  msg.textContent = "✅ Dual report generated successfully.";
  autoUpdate(); // check for new AI seed version
};
