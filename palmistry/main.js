// main.js
window.modulesLoaded = {};

async function startCamera(video, msg, name){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    msg.textContent = "✅ " + name + " camera started.";
    window.modulesLoaded[name] = true;
  } catch (err) {
    msg.textContent = "❌ " + name + " camera error: " + err.message;
    document.dispatchEvent(new CustomEvent("buddhi-error", {
      detail: { type: "camera", file: name + ".js", line: 6, message: err.message }
    }));
  }
}

function captureFrame(video){
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas;
}

// ===== DOM Setup =====
const L = { video: document.getElementById("videoLeft"), name: "Left" };
const R = { video: document.getElementById("videoRight"), name: "Right" };
const msg = document.getElementById("msg");

document.getElementById("startLeft").onclick = () => startCamera(L.video, msg, "Left");
document.getElementById("startRight").onclick = () => startCamera(R.video, msg, "Right");

document.getElementById("captureLeft").onclick = () => capture("Left");
document.getElementById("captureRight").onclick = () => capture("Right");

function capture(side){
  const video = side === "Left" ? L.video : R.video;
  const canvas = captureFrame(video);
  const data = canvas.toDataURL("image/png");
  localStorage.setItem("palm" + side, data);
  msg.textContent = `📸 ${side} hand captured.`;
  document.dispatchEvent(new CustomEvent("buddhi-log",{detail:{message:`${side} hand captured.`}}));
}

// Analyze button
document.getElementById("analyzeBtn").onclick = () => {
  msg.textContent = "🤖 Analyzing captured images...";
  try{
    const left = localStorage.getItem("palmLeft");
    const right = localStorage.getItem("palmRight");
    if(!left || !right) throw new Error("Missing capture images.");
    msg.textContent = "✅ Both hands ready for AI analysis.";
  }catch(e){
    msg.textContent = "❌ "+e.message;
    document.dispatchEvent(new CustomEvent("buddhi-error",{detail:{type:"analyze",file:"main.js",line:60,message:e.message}}));
  }
};
