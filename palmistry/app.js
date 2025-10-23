// === Quantum Bio-Aura Analyzer V1.2 · Dynamic Heat-Map Aura Edition ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let stream, vid, cv, ctx;

// STATUS
function msg(t, ok=true){statusEl.textContent=t;statusEl.style.color=ok?"#16f0a7":"#ff6b6b";}

// CAMERA
async function startCam(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video:{width:{ideal:1280},height:{ideal:720},facingMode:"environment"},audio:false
    });
    vid = $("vid"); vid.srcObject = stream; await vid.play();
    cv = $("cv"); ctx = cv.getContext("2d");
    msg("Camera active ✅");
  }catch(e){ msg("Camera access denied ❌",false); }
}

// CAPTURE FRAME (keep aspect ratio)
function capture(){
  if(!vid) return;
  const vw = vid.videoWidth, vh = vid.videoHeight;
  const ratio = Math.min(cv.width / vw, cv.height / vh);
  const newW = vw * ratio, newH = vh * ratio;
  const offsetX = (cv.width - newW) / 2, offsetY = (cv.height - newH) / 2;
  ctx.drawImage(vid, offsetX, offsetY, newW, newH);
  cv.dataset.locked="1"; vid.pause();
  msg("Frame locked 🔒 Ready for aura scan");
}

// ANALYZE HEAT-MAP AURA
function analyze(){
  if(!cv) return;
  const image = ctx.getImageData(0,0,cv.width,cv.height);
  const data = image.data;
  const w=cv.width,h=cv.height;
  const heat = ctx.createImageData(w,h);

  // Compute pixel intensity for simulated heat
  for(let i=0;i<data.length;i+=4){
    const avg=(data[i]+data[i+1]+data[i+2])/3;
    const temp=(avg/255)*100; // pseudo temperature
    const col=temperatureToColor(temp);
    heat.data[i]=col[0];
    heat.data[i+1]=col[1];
    heat.data[i+2]=col[2];
    heat.data[i+3]=180; // transparency
  }

  ctx.putImageData(heat,0,0);
  pulseAura(cv);
  msg("Dynamic aura heat-map visualized 🌈");
}

// Temperature → RGB color mapping
function temperatureToColor(t){
  if(t<20) return [0,0,255];        // cold → blue
  else if(t<40) return [0,255,255]; // cool → cyan
  else if(t<60) return [0,255,0];   // neutral → green
  else if(t<80) return [255,255,0]; // warm → yellow
  else return [255,0,0];            // hot → red
}

// GLOW EFFECT
function pulseAura(cv){
  cv.style.boxShadow="0 0 25px #16f0a7";
  setTimeout(()=>cv.style.boxShadow="none",900);
}

// EVENTS
$("startBtn").onclick=startCam;
$("captureBtn").onclick=capture;
$("analyzeBtn").onclick=analyze;
