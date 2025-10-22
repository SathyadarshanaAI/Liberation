// === Quantum Palm Analyzer V6.1c ===
// Truth Guard · Dual Mode (Full + Partial)
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

  if(!L && !R){
    alert("🛑 Please capture at least one hand before Analyze!");
    msg("⚠️ No hand captured", false);
    return "none";
  }
  if(L && R) return "both";
  return L ? "left" : "right";
}

// ====== Analyzer Animation ======
function startAnalyzer(){
  const mode = verifyLock();
  if(mode === "none") return;

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
    showReport(mode);
  }, 3500);
}

// ====== Report Generator ======
function showReport(mode){
  let div = document.getElementById("report");
  if(!div){
    div = document.createElement("div");
    div.id = "report";
    div.style = `
      background:#101820;color:#e6f0ff;padding:15px;border-radius:10px;
      width:80%;margin:20px auto;box-shadow:0 0 12px #00e5ff;line-height:1.6;
    `;
    document.body.appendChild(div);
  }

  if(mode === "both"){
    div.innerHTML = `
      <h3 style="color:#00e5ff;">Full Report</h3>
      <p>🖐️ Both hands analyzed successfully.</p>
      <p>Balance of intellect and intuition detected — strong personality stability and clear future direction.</p>
      <p>Truth Guard Result: ✅ Balanced and Harmonized.</p>`;
  } else {
    div.innerHTML = `
      <h3 style="color:#00e5ff;">Partial Report (${mode === "left" ? "Left Hand" : "Right Hand"})</h3>
      <p>Only one hand analyzed.</p>
      <p>${mode === "left"
        ? "Left hand indicates past emotions, spiritual depth, and inner reflection."
        : "Right hand indicates current drive, willpower, and life strength."}</p>
      <p>Truth Guard Result: ⚠️ Partial Analysis (Awaiting other hand).</p>`;
  }

  // Auto voice
  const text = div.innerText;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en";
  speechSynthesis.speak(u);
  msg("🔊 Voice summary ready");
}

// ====== Event Bindings ======
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");
$("torchLeft").onclick = () => toggleTorch("left");
$("torchRight").onclick = () => toggleTorch("right");
$("analyzeBtn").onclick = startAnalyzer;
$("saveBtn").onclick = () => msg("💾 PDF Saved (simulation)");
$("language").addEventListener("change", e => {
  msg(`🌐 Language set to ${e.target.value}`);
});

// ====== Registry ======
App.add("torch", toggleTorch);
App.add("analyzer", startAnalyzer);
App.add("capture", capture);
App.add("verify", verifyLock);
App.add("camera", startCam);
App.add("message", msg);

console.log("Modules loaded:", Object.keys(App.modules));
