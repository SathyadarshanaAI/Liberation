// main.js — Quantum Palm Analyzer v3.3 Secure Lock Edition
window.modulesLoaded = {};

const msg = document.getElementById("msg");
const L = { video: $("videoLeft"), canvas: $("canvasLeft"), name: "Left" };
const R = { video: $("videoRight"), canvas: $("canvasRight"), name: "Right" };

function $(id){ return document.getElementById(id); }

async function startCamera(video, side){
  try{
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    video.srcObject = stream;
    msg.textContent = `✅ ${side} camera started.`;
    window.modulesLoaded[side] = true;
    document.dispatchEvent(new CustomEvent("buddhi-log",{detail:{message:`${side} camera started`}}));
  }catch(err){
    msg.textContent = `❌ ${side} camera error: ${err.message}`;
    document.dispatchEvent(new CustomEvent("buddhi-error",{detail:{file:`camera.js`,line:14,message:err.message}}));
  }
}

function capture(sideObj){
  try{
    const v = sideObj.video, c = sideObj.canvas;
    if(!v.srcObject){ throw new Error(`${sideObj.name} camera not active`); }
    c.width = v.videoWidth; c.height = v.videoHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(v, 0, 0, c.width, c.height);
    const data = c.toDataURL("image/png");
    localStorage.setItem("palm" + sideObj.name, data);
    msg.textContent = `📸 ${sideObj.name} hand locked 🔒`;
    flash(sideObj.canvas);
    document.dispatchEvent(new CustomEvent("buddhi-log",{detail:{message:`${sideObj.name} hand captured successfully`}}));
  }catch(e){
    msg.textContent = "❌ " + e.message;
    document.dispatchEvent(new CustomEvent("buddhi-error",{detail:{file:"main.js",line:28,message:e.message}}));
  }
}

function flash(el){
  el.style.boxShadow = "0 0 20px #16f0a7";
  setTimeout(()=>el.style.boxShadow="none",600);
}

$("startLeft").onclick = ()=>startCamera(L.video,"Left");
$("startRight").onclick = ()=>startCamera(R.video,"Right");
$("captureLeft").onclick = ()=>capture(L);
$("captureRight").onclick = ()=>capture(R);

$("analyzeBtn").onclick = ()=>{
  msg.textContent = "🔮 Analyzing both hands...";
  try{
    const left = localStorage.getItem("palmLeft");
    const right = localStorage.getItem("palmRight");
    if(!left || !right) throw new Error("Both hands not captured yet.");
    msg.textContent = "✅ Both hands ready for AI analysis.";
    document.dispatchEvent(new CustomEvent("buddhi-log",{detail:{message:"Dual capture verified, proceeding to AI stage"}}));
    // 🔮 Future AI Seed Sync (auto update)
    setTimeout(()=>{
      msg.textContent = "🧠 AI Seed Sync pending...";
    },1500);
  }catch(e){
    msg.textContent = "❌ "+e.message;
    document.dispatchEvent(new CustomEvent("buddhi-error",{detail:{file:"main.js",line:48,message:e.message}}));
  }
};
