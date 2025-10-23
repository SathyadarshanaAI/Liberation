// === Quantum Bio-Aura Analyzer V1.1.1 · Smart Lock Aura Edition ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let stream, ctx, cv, vid, hands, handResults = [];

// STATUS
function msg(t, ok=true){
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// CAMERA
async function startCam(){
  try{
    stream = await navigator.mediaDevices.getUserMedia({
      video:{width:{ideal:1280},height:{ideal:720},facingMode:"environment"},audio:false
    });
    vid = $("vid");
    vid.srcObject = stream;
    await vid.play();
    cv = $("cv");
    ctx = cv.getContext("2d");
    msg("Camera active ✅");
  }catch(e){ msg("Camera access denied ❌",false); }
}

// LOCK FRAME
function capture(){
  if(!vid) return;
  ctx.drawImage(vid,0,0,cv.width,cv.height);
  cv.dataset.locked="1";
  vid.pause(); // freeze live feed
  pulseAura(cv);
  msg("Frame locked 🔒");
}

// MEDIAPIPE HANDS INIT
async function initHands(){
  hands = new Hands.Hands({
    locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
  });
  hands.setOptions({
    maxNumHands:1,modelComplexity:1,
    minDetectionConfidence:0.6,minTrackingConfidence:0.6
  });
  hands.onResults(r => { handResults = r.multiHandLandmarks; });
  msg("AI hand detection ready 🧠");
}

// ANALYZE AURA
async function analyze(){
  if(!hands){ await initHands(); }
  ctx.drawImage(cv,0,0,cv.width,cv.height); // use locked frame
  await hands.send({image:cv});
  if(handResults.length){
    const pts = handResults[0];
    const avgX = pts.reduce((s,p)=>s+p.x,0)/pts.length*cv.width;
    const avgY = pts.reduce((s,p)=>s+p.y,0)/pts.length*cv.height;
    const g = ctx.createRadialGradient(avgX,avgY,10,avgX,avgY,160);
    g.addColorStop(0,"rgba(0,229,255,0.45)");
    g.addColorStop(0.5,"rgba(22,240,167,0.3)");
    g.addColorStop(1,"transparent");
    ctx.globalCompositeOperation="lighter";
    ctx.fillStyle=g;
    ctx.fillRect(0,0,cv.width,cv.height);
    ctx.globalCompositeOperation="source-over";
    pulseAura(cv);
    msg("Hand aura visualized 🌌");
  }else{
    msg("No hand detected – adjust position ⚠️",false);
  }
}

// GLOW EFFECT
function pulseAura(cv){
  cv.style.boxShadow="0 0 25px #16f0a7";
  setTimeout(()=>cv.style.boxShadow="none",900);
}

// EVENTS
$("startBtn").onclick = startCam;
$("captureBtn").onclick = capture;
$("analyzeBtn").onclick = analyze;
