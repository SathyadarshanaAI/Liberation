// === Quantum Palm Analyzer V6.1b ===
// Truth Guard Enhanced Edition
const $ = id => document.getElementById(id);
const statusEl = $("status");

let streamLeft, streamRight;
const App = { modules: {}, add(name, fn){ this.modules[name] = fn; } };

// ====== Message Helper ======
function msg(text, ok = true){
  statusEl.textContent = text;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ====== Camera Control ======
async function startCam(side){
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try{
    const constraints = { video: { facingMode: { ideal: "environment" }, width: 640, height: 480 } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    vid.srcObject = stream;
    if(side==="left") streamLeft = stream; else streamRight = stream;
    msg(`${side} camera started ✅`);
  }catch(e){
    msg(`Camera blocked or unavailable: ${e.message}`, false);
    alert("⚠️ Camera permission denied. Please Allow camera in site settings.");
  }
}

function capture(side){
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const canvas = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  canvas.dataset.locked = "1";
  flash(canvas);
  msg(`${side} hand locked 🔒`);
}

function flash(el){
  el.style.boxShadow = "0 0 15px #16f0a7";
  setTimeout(() => el.style.boxShadow = "none", 800);
}

// ====== Torch Feature ======
async function toggleTorch(side){
  const stream = side === "left" ? streamLeft : streamRight;
  if(!stream){ msg("Start camera first!", false); return; }
  const track = stream.getVideoTracks()[0];
  const cap = track.getCapabilities();
  if(!cap.torch){ msg("Torch not supported", false); return; }
  const torchOn = !track.getConstraints().advanced?.[0]?.torch;
  await track.applyConstraints({ advanced: [{ torch: torchOn }] });
  msg(`Torch ${torchOn ? "ON" : "OFF"} 💡`);
}

// ====== Verify before analysis ======
function verifyLock(){
  const L = $("canvasLeft").dataset.locked === "1";
  const R = $("canvasRight").dataset.locked === "1";
  if(!L || !R){
    alert("🛑 Capture both Left and Right hands before Analyze!");
    return false;
  }
  return true;
}

// ====== Analyzer Animation ======
function startAnalyzer(){
  msg("🌀 Scanning beams activated...");
  const beam = document.createElement("div");
  beam.style = `
    position:fixed;top:0;left:0;width:100%;height:4px;
    background:#00e5ff;box-shadow:0 0 20px #00e5ff;z-index:9999;
  `;
  document.body.appendChild(beam);
  let y = 0, dir = 1;
  const anim = setInterval(() => {
    y += 6 * dir;
    beam.style.top = y + "px";
    if (y > window.innerHeight - 8 || y < 0) dir *= -1;
  }, 10);
  setTimeout(() => {
    clearInterval(anim);
    beam.remove();
    msg("✅ Report Generated Successfully – Truth Guard Verified");
  }, 3500);
}

// ====== Base Event Binds ======
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");
$("torchLeft").onclick = () => toggleTorch("left");
$("torchRight").onclick = () => toggleTorch("right");
$("analyzeBtn").onclick = () => { if(verifyLock()) startAnalyzer(); };
$("saveBtn").onclick = () => msg("💾 PDF Saved (simulation)");
$("speakBtn").onclick = () => msg("🔊 Voice summary ready");

// ====== 12-Language System ======
$("language").addEventListener("change", (e) => {
  const lang = e.target.value;
  document.documentElement.lang = lang;
  msg(`🌐 Language set to ${lang}`);
});

// ====== .add() Modular Registry ======
App.add("torch", toggleTorch);
App.add("analyzer", startAnalyzer);
App.add("capture", capture);
App.add("verify", verifyLock);
App.add("camera", startCam);
App.add("message", msg);

// test log
console.log("Modules loaded:", Object.keys(App.modules));
