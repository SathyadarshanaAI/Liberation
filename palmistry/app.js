// === Quantum Bio-Aura Analyzer V1.0 · AI Wisdom Amplifier Edition ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let stream;

// STATUS
function msg(t, ok=true){
  statusEl.textContent=t;
  statusEl.style.color=ok?"#16f0a7":"#ff6b6b";
}

// CAMERA
async function startCam(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video:{width:{ideal:1280},height:{ideal:720},facingMode:"environment"}, audio:false
    });
    $("vid").srcObject = stream;
    await $("vid").play();
    msg("Camera sensor active ✅");
  }catch(e){
    msg("Camera access denied ❌",false);
  }
}

// ANALYZE
function analyze(){
  const vid=$("vid"), cv=$("cv"), ctx=cv.getContext("2d");
  ctx.drawImage(vid,0,0,cv.width,cv.height);

  // 1. get pixels
  const img=ctx.getImageData(0,0,cv.width,cv.height);
  const d=img.data;

  // 2. simulate AI Wisdom boost – magnify subtle energy patterns
  for(let i=0;i<d.length;i+=4){
    const noise=(Math.sin(i*0.00007+Date.now()*0.002)*15);
    d[i]   = Math.min(255, d[i]   + noise);   // Red shift
    d[i+1] = Math.min(255, d[i+1] + noise/2); // Green shift
    d[i+2] = Math.min(255, d[i+2] + noise/3); // Blue shift
  }
  ctx.putImageData(img,0,0);

  // 3. apply aura glow overlay
  const g=ctx.createRadialGradient(cv.width/2,cv.height/2,20,cv.width/2,cv.height/2,180);
  g.addColorStop(0,"rgba(0,229,255,0.4)");
  g.addColorStop(0.5,"rgba(22,240,167,0.25)");
  g.addColorStop(1,"transparent");
  ctx.globalCompositeOperation="lighter";
  ctx.fillStyle=g;
  ctx.fillRect(0,0,cv.width,cv.height);
  ctx.globalCompositeOperation="source-over";

  // 4. visual pulse
  pulseAura(cv);
  msg("Bio-energy field visualized 🌌");
}

// Pulse animation glow
function pulseAura(cv){
  cv.style.boxShadow="0 0 25px #16f0a7";
  setTimeout(()=>cv.style.boxShadow="none",800);
}

// EVENTS
$("startBtn").onclick=startCam;
$("captureBtn").onclick=analyze;
