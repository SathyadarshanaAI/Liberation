// === Sathyadarshana Quantum Palm Analyzer V7.4.5 – Torch + Voice Stable Edition ===
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight, trackLeft, trackRight;

// === STATUS MESSAGE ===
function msg(t, ok = true) {
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// === CAMERA START ===
async function startCam(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = stream;
    await vid.play();

    if (side === "left") { streamLeft = stream; trackLeft = stream.getVideoTracks()[0]; }
    else { streamRight = stream; trackRight = stream.getVideoTracks()[0]; }

    msg(`${side} camera started ✅`);
    setupTorch(side);
  } catch (e) {
    msg(`Camera blocked ❌ ${e.message}`, false);
  }
}

// === TORCH CONTROL ===
function setupTorch(side) {
  const btn = side === "left" ? $("torchLeft") : $("torchRight");
  const track = side === "left" ? trackLeft : trackRight;
  const caps = track.getCapabilities?.() || {};
  if (caps.torch) {
    btn.style.display = "inline-block";
    btn.onclick = async () => {
      const current = btn.dataset.on === "1";
      await track.applyConstraints({ advanced: [{ torch: !current }] });
      btn.dataset.on = current ? "0" : "1";
      btn.textContent = current ? "💡 Torch" : "💥 Torch ON";
      msg(`${side} torch ${current ? "OFF" : "ON"}`);
    };
  } else {
    btn.onclick = () => {
      const on = document.body.style.background === "white";
      document.body.style.background = on ? "#0b0f16" : "white";
      btn.textContent = on ? "💡 Torch" : "💥 Screen Light";
      msg(`${side} screen light ${on ? "OFF" : "ON"}`);
    };
  }
}

// === CAPTURE ===
function capture(side) {
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const canvas = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  canvas.dataset.locked = "1";
  flash(canvas);
  const aura = analyzeAura(canvas);
  drawAura(canvas, aura.color);
  drawPalmLines(canvas);
  msg(`${side} hand captured 🔒 (${aura.type})`);
  speak(`${side} hand captured, aura ${aura.type}`);
}

// === ANALYZE ===
function analyzeAura(cv) {
  const ctx = cv.getContext("2d");
  const { width:w, height:h } = cv;
  const data = ctx.getImageData(0, 0, w, h).data;
  let r=0,g=0,b=0,c=0;
  for (let i=0;i<data.length;i+=60){r+=data[i];g+=data[i+1];b+=data[i+2];c++;}
  r/=c;g/=c;b/=c;
  const hue = rgbToHue(r,g,b);
  let color="#fff",type="Neutral";
  if (hue<25||hue>340){color="#ff3333";type="Active (Red)";}
  else if (hue<60){color="#ffd700";type="Divine (Gold)";}
  else if (hue<140){color="#00ff88";type="Healing (Green)";}
  else if (hue<220){color="#3399ff";type="Peaceful (Blue)";}
  else if (hue<300){color="#cc66ff";type="Mystic (Violet)";}
  return { color, type };
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

// === DRAW AURA ===
function drawAura(cv, color) {
  const ctx = cv.getContext("2d");
  ctx.globalCompositeOperation="lighter";
  const g = ctx.createRadialGradient(cv.width/2, cv.height/2, 20, cv.width/2, cv.height/2, 160);
  g.addColorStop(0, color+"55");
  g.addColorStop(1, "transparent");
  ctx.fillStyle = g;
  ctx.fillRect(0,0,cv.width,cv.height);
  ctx.globalCompositeOperation="source-over";
}

// === DRAW PALM LINES ===
function drawPalmLines(cv) {
  const ctx = cv.getContext("2d");
  ctx.strokeStyle="#16f0a7";
  ctx.lineWidth=1.2;
  const w=cv.width,h=cv.height;
  const lines=[
    [[w*0.3,h*0.7],[w*0.2,h*0.5,w*0.45,h*0.3]],
    [[w*0.4,h*0.55],[w*0.75,h*0.45]],
    [[w*0.25,h*0.35],[w*0.8,h*0.3]],
    [[w*0.45,h*0.85],[w*0.55,h*0.25]]
  ];
  for(const [a,b] of lines){
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    if(b.length===4)ctx.quadraticCurveTo(b[0],b[1],b[2],b[3]);
    else ctx.lineTo(b[0],b[1]);
    ctx.stroke();
  }
}

// === FLASH EFFECT ===
function flash(cv){
  cv.style.boxShadow="0 0 20px #16f0a7";
  setTimeout(()=>cv.style.boxShadow="none",800);
}

// === SPEECH ===
function speak(text){
  try{
    const u=new SpeechSynthesisUtterance(text);
    u.lang="en-US";
    speechSynthesis.speak(u);
  }catch(e){console.warn("Voice error",e);}
}

// === BUTTONS ===
$("startLeft").onclick = ()=>startCam("left");
$("startRight").onclick = ()=>startCam("right");
$("captureLeft").onclick = ()=>capture("left");
$("captureRight").onclick = ()=>capture("right");

$("analyzeBtn").onclick = ()=>{
  speak("Analyzing captured palms, generating divine report");
  msg("Analyzing... 🌈");
  setTimeout(()=>msg("Report ready ✨"),2500);
};

$("speakBtn").onclick = ()=>speak("This is the Quantum Palm Analyzer. Your hands are windows to the soul.");
