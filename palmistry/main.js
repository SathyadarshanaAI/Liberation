// === Sathyadarshana Quantum Palm Analyzer V7.4.5 · Torch + Voice Stable Edition ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight, torchTrack = null, torchOn = false;

// ===== STATUS =====
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ===== CAMERA =====
async function startCam(side){
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try{
    const stream = await navigator.mediaDevices.getUserMedia({
      video:{facingMode:"environment"},
      audio:false
    });
    vid.srcObject = stream;
    await vid.play();
    if(side==="left") streamLeft=stream; else streamRight=stream;
    msg(`${side} camera active ✅`);

    // Torch detect
    const track = stream.getVideoTracks()[0];
    const caps = track.getCapabilities?.() || {};
    const btn = $("torchBtn");
    if(caps.torch){
      torchTrack = track;
      btn.style.display="inline-block";
      btn.onclick = async()=>{
        torchOn=!torchOn;
        await track.applyConstraints({advanced:[{torch:torchOn}]});
        btn.textContent=torchOn?"💡 Torch ON":"🔦 Torch";
        msg(torchOn?"Torch ON":"Torch OFF");
      };
    }else{
      // fallback screen-torch
      btn.style.display="inline-block";
      btn.onclick=()=>{
        torchOn=!torchOn;
        document.body.style.background=torchOn?"#ffffff":"#0b0f16";
        btn.textContent=torchOn?"💡 Screen Light":"🔦 Torch";
        msg(torchOn?"Screen light ON":"Screen light OFF");
      };
    }
  }catch(e){
    msg("Camera access denied ❌",false);
  }
}

// ===== CAPTURE =====
function capture(side){
  const vid= side==="left"?$("vidLeft"):$("vidRight");
  const cv = side==="left"?$("canvasLeft"):$("canvasRight");
  const ctx=cv.getContext("2d");
  ctx.drawImage(vid,0,0,cv.width,cv.height);
  flash(cv);

  const aura = analyzeAura(cv);
  drawAuraOverlay(cv,aura.color);
  drawPalmLines(cv);
  msg(`${side} hand captured 🔒 (${aura.type})`);

  // 🎙️ voice feedback
  try{
    const u = new SpeechSynthesisUtterance(`${side} hand captured, aura ${aura.type}`);
    u.lang="en-US";
    speechSynthesis.speak(u);
  }catch(err){console.warn("Voice blocked",err);}
}

// ===== AURA =====
function analyzeAura(cv){
  const ctx=cv.getContext("2d");
  const {width:w,height:h}=cv;
  const data=ctx.getImageData(0,0,w,h).data;
  let r=0,g=0,b=0,c=0;
  for(let i=0;i<data.length;i+=60){r+=data[i];g+=data[i+1];b+=data[i+2];c++;}
  r/=c;g/=c;b/=c;
  const hue=rgbToHue(r,g,b);
  let color="#fff",type="Neutral";
  if(hue<25||hue>340){color="#ff3333";type="Active (Red)";}
  else if(hue<60){color="#ffd700";type="Divine (Gold)";}
  else if(hue<140){color="#00ff88";type="Healing (Green)";}
  else if(hue<220){color="#3399ff";type="Peaceful (Blue)";}
  else if(hue<300){color="#cc66ff";type="Mystic (Violet)";}
  return {color,type};
}
function rgbToHue(r,g,b){
  r/=255;g/=255;b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b),d=max-min;
  let h=0;
  if(d===0)h=0;
  else if(max===r)h=(60*((g-b)/d)+360)%360;
  else if(max===g)h=(60*((b-r)/d)+120)%360;
  else h=(60*((r-g)/d)+240)%360;
  return h;
}

// ===== DRAW =====
function drawAuraOverlay(cv,color){
  const ctx=cv.getContext("2d");
  ctx.globalCompositeOperation="lighter";
  const g=ctx.createRadialGradient(cv.width/2,cv.height/2,20,cv.width/2,cv.height/2,160);
  g.addColorStop(0,color+"55");
  g.addColorStop(1,"transparent");
  ctx.fillStyle=g;
  ctx.fillRect(0,0,cv.width,cv.height);
  ctx.globalCompositeOperation="source-over";
}
function drawPalmLines(cv){
  const ctx=cv.getContext("2d");
  ctx.strokeStyle="#16f0a7";ctx.lineWidth=1.4;
  const w=cv.width,h=cv.height;
  const lines=[
    [[w*0.35,h*0.7],[w*0.2,h*0.5,w*0.4,h*0.25]],
    [[w*0.3,h*0.5],[w*0.75,h*0.45]],
    [[w*0.25,h*0.35],[w*0.8,h*0.32]],
    [[w*0.5,h*0.85],[w*0.55,h*0.25]]
  ];
  for(const [a,b] of lines){
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    if(b.length===4)ctx.quadraticCurveTo(b[0],b[1],b[2],b[3]);
    else ctx.lineTo(b[0],b[1]);
    ctx.stroke();
  }
}

// ===== FLASH =====
function flash(cv){
  cv.style.boxShadow="0 0 20px #16f0a7";
  setTimeout(()=>cv.style.boxShadow="none",900);
}

// ===== EVENTS =====
$("startLeft").onclick=()=>startCam("left");
$("startRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>capture("left");
$("captureRight").onclick=()=>capture("right");
