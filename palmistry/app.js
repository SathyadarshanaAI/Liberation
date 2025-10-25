import { CameraUnit } from './modules/camera.js';
import { generateFusionReport } from './report.js';

const statusEl = document.getElementById("status");
const reportBox = document.getElementById("reportBox");

const camLeft  = new CameraUnit("vidLeft", "canvasLeft", "LEFT");
const camRight = new CameraUnit("vidRight", "canvasRight", "RIGHT");

function setStatus(msg){ statusEl.textContent = msg; console.log(msg); }

// === CAMERA EVENTS ===
document.getElementById("startLeft").onclick   = async()=> setStatus(await camLeft.start());
document.getElementById("startRight").onclick  = async()=> setStatus(await camRight.start());
document.getElementById("captureLeft").onclick = ()=> setStatus(camLeft.capture());
document.getElementById("captureRight").onclick= ()=> setStatus(camRight.capture());
document.getElementById("torchLeft").onclick   = async()=> setStatus(await camLeft.toggleTorch());
document.getElementById("torchRight").onclick  = async()=> setStatus(await camRight.toggleTorch());

// === REPORT EVENTS ===
document.getElementById("miniReport").onclick = ()=>{
  reportBox.textContent =
  "🪶 Mini Report:\nHeart Line: Expressive nature.\nHead Line: Balanced reason.\nLife Line: Vital energy strong.";
  setStatus("✅ Mini Report generated");
};

document.getElementById("fullReport").onclick = ()=>{
  setStatus("🔮 Analyzing dual-hand intelligence...");
  const data = {
    lines:[
      {name:"heart",strength:85},
      {name:"head",strength:73},
      {name:"life",strength:91},
      {name:"fate",strength:67}
    ]
  };
  setTimeout(()=>{
    reportBox.innerHTML = generateFusionReport(data);
    setStatus("✅ Full Fusion Report ready");
  },1200);
};
