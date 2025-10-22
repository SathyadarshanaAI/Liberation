const $ = id => document.getElementById(id);
const statusEl = $("status");

let camLeft, camRight;
let streamLeft, streamRight;

// --- Setup cameras ---
async function startCam(side){
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
    vid.srcObject = stream;
    if(side==="left") streamLeft = stream; else streamRight = stream;
    msg(`${side} camera started ✅`);
  }catch(e){
    msg(`Error: ${e.message}`, false);
  }
}

function capture(side){
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const canvas = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid,0,0,canvas.width,canvas.height);
  canvas.dataset.locked="1";
  flash(canvas);
  msg(`${side} hand locked 🔒`);
}

function flash(el){
  el.style.boxShadow="0 0 15px #16f0a7";
  setTimeout(()=>el.style.boxShadow="none",800);
}

function msg(t,ok=true){
  statusEl.textContent=t;
  statusEl.style.color=ok?"#16f0a7":"#ff6b6b";
}

// --- Torch toggle ---
async function toggleTorch(side){
  const stream = side==="left"?streamLeft:streamRight;
  if(!stream){msg("Start camera first!",false);return;}
  const track = stream.getVideoTracks()[0];
  const cap = track.getCapabilities();
  if(!cap.torch){msg("Torch not supported",false);return;}
  const torchOn = !track.getConstraints().advanced?.[0]?.torch;
  await track.applyConstraints({advanced:[{torch:torchOn}]});
  msg(`Torch ${torchOn?"ON":"OFF"} 💡`);
}

// --- Verify locks before analysis ---
function verifyLock(){
  const L = $("canvasLeft").dataset.locked==="1";
  const R = $("canvasRight").dataset.locked==="1";
  if(!L||!R){
    alert("🛑 Capture both Left and Right hands before Analyze!");
    return false;
  }
  return true;
}

// --- Analyzer simulation ---
function startAnalyzer(){
  msg("🌀 Scanning beams activated...");
  const beam = document.createElement("div");
  beam.style.position="fixed";beam.style.top="0";beam.style.left="0";
  beam.style.width="100%";beam.style.height="4px";
  beam.style.background="#00e5ff";beam.style.boxShadow="0 0 20px #00e5ff";
  document.body.appendChild(beam);
  let y=0,dir=1;
  const anim=setInterval(()=>{
    y+=4*dir;
    beam.style.top=y+"px";
    if(y>window.innerHeight-10||y<0)dir*=-1;
  },8);
  setTimeout(()=>{
    clearInterval(anim);
    beam.remove();
    msg("✅ Report Generated Successfully – Truth Guard Verified");
  },3000);
}

// --- Event binds ---
$("startLeft").onclick = ()=>startCam("left");
$("startRight").onclick= ()=>startCam("right");
$("captureLeft").onclick= ()=>capture("left");
$("captureRight").onclick= ()=>capture("right");
$("torchLeft").onclick= ()=>toggleTorch("left");
$("torchRight").onclick= ()=>toggleTorch("right");
$("analyzeBtn").onclick= ()=>{ if(verifyLock()) startAnalyzer(); };
$("saveBtn").onclick= ()=>msg("💾 PDF Saved (simulation)");
$("speakBtn").onclick= ()=>msg("🔊 Voice summary ready");

// --- 12 Language switching ---
$("language").addEventListener("change",(e)=>{
  const lang=e.target.value;
  msg(`🌐 Language changed to ${lang}`);
  document.documentElement.lang=lang;
});
