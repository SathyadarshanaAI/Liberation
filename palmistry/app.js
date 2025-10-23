// === Quantum Bio-Aura Analyzer V1.2.1 — Aura Stability Patch ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let stream, vid, cv, ctx;

function msg(t, ok=true){statusEl.textContent=t;statusEl.style.color=ok?"#16f0a7":"#ff6b6b";}

// CAMERA
async function startCam(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video:{facingMode:"environment",width:{ideal:1280},height:{ideal:720}},
      audio:false
    });
    vid = $("vid"); vid.srcObject = stream; await vid.play();
    cv = $("cv"); ctx = cv.getContext("2d",{willReadFrequently:true});
    msg("Camera active ✅ Lighting adjust for best result");
  }catch(e){ msg("Camera access denied ❌",false); }
}

// CAPTURE (guarded)
function capture(){
  if(!vid || vid.readyState < 2){
    msg("Camera not ready — wait a moment then capture",false);
    return;
  }
  const vw = vid.videoWidth, vh = vid.videoHeight;
  if(vw===0||vh===0){ msg("Frame not available — try again",false); return; }

  const ratio = Math.min(cv.width/vw, cv.height/vh);
  const newW = vw*ratio, newH = vh*ratio;
  const offX = (cv.width-newW)/2, offY = (cv.height-newH)/2;
  ctx.drawImage(vid,offX,offY,newW,newH);
  cv.dataset.locked="1";
  pulseAura(cv);
  msg("Frame locked 🔒 Ready for analysis");
}

// ANALYZE HEATMAP
function analyze(){
  if(!cv) return;
  const img = ctx.getImageData(0,0,cv.width,cv.height);
  const data = img.data;
  const w=cv.width,h=cv.height;
  const heat = ctx.createImageData(w,h);

  for(let i=0;i<data.length;i+=4){
    const avg=(data[i]+data[i+1]+data[i+2])/3;
    const boosted=Math.pow(avg/255,0.6)*100; // boost dark details
    const col=tempToRGB(boosted);
    heat.data[i]=col[0];
    heat.data[i+1]=col[1];
    heat.data[i+2]=col[2];
    heat.data[i+3]=180;
  }
  ctx.putImageData(heat,0,0);
  msg("Aura map generated 🌈 (low-light enhanced)");
}

// TEMP → COLOR
function tempToRGB(t){
  if(t<20) return [0,0,255];
  else if(t<40) return [0,255,255];
  else if(t<60) return [0,255,0];
  else if(t<80) return [255,255,0];
  else return [255,80,0];
}

// PULSE EFFECT
function pulseAura(cv){
  cv.style.boxShadow="0 0 25px #16f0a7";
  setTimeout(()=>cv.style.boxShadow="none",900);
}

$("startBtn").onclick=startCam;
$("captureBtn").onclick=capture;
$("analyzeBtn").onclick=analyze;
