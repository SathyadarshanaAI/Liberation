import { initMonitor } from "./modules/integrity-monitor.js";
initMonitor(); // start Buddhi Monitor

import { startCamera, captureFrame } from "./modules/camera.js";
import { analyzeAI } from "./modules/ai-segmentation.js";
import { generateReport } from "./modules/report.js";
import { speak } from "./modules/voice.js";
import { compareHands } from "./modules/compare.js";
import { autoUpdate } from "./modules/updater.js";

const L = { video: videoLeft, canvas: canvasLeft };
const R = { video: videoRight, canvas: canvasRight };
const msg = document.getElementById("msg");

document.getElementById("startLeft").onclick = () => startCamera(L.video, msg, "camera.js");
document.getElementById("startRight").onclick = () => startCamera(R.video, msg, "camera.js");
document.getElementById("captureLeft").onclick = ()=>capture(L,"Left");
document.getElementById("captureRight").onclick = ()=>capture(R,"Right");

function capture(side,label){
  try{
    const ctx=side.canvas.getContext("2d");
    side.canvas.width=side.video.videoWidth;
    side.canvas.height=side.video.videoHeight;
    ctx.drawImage(side.video,0,0,side.canvas.width,side.canvas.height);
    localStorage.setItem(label==="Left"?"palmLeft":"palmRight",side.canvas.toDataURL("image/png"));
    msg.textContent=`✅ ${label} captured.`;
  }catch(err){
    document.dispatchEvent(new CustomEvent("buddhi-error",{detail:{
      type:"capture",file:"main.js",line:33,message:err.message
    }}));
  }
}

document.getElementById("analyzeBtn").onclick = async ()=>{
  try{
    msg.textContent="🤖 Analyzing both hands...";
    const left=await analyzeAI(captureFrame(L.video));
    const right=await analyzeAI(captureFrame(R.video));
    await generateReport(left,"en",{hand:"Left"});
    await generateReport(right,"en",{hand:"Right"});
    const comparison=compareHands(left,right);
    speak(comparison.summary,"en");
    msg.textContent="✅ Dual report generated successfully.";
    autoUpdate();
  }catch(err){
    document.dispatchEvent(new CustomEvent("buddhi-error",{detail:{
      type:"analysis",file:"main.js",line:55,message:err.message
    }}));
  }
};
