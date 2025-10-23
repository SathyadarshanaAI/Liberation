// === Quantum Palm Analyzer V7.2 – Aura & Segmentation Edition ===
// Developed by AI Buddhi · Sathyadarshana Project

const $ = id => document.getElementById(id);
const statusEl = $("status");

let streamLeft, streamRight;

// ========== Helpers ==========
function msg(t, ok=true){
  statusEl.textContent = t;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ========== Camera ==========
async function startCam(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
    vid.srcObject = stream;
    if(side==="left") streamLeft=stream; else streamRight=stream;
    msg(`${side} camera active ✅`);
  }catch(e){
    alert("Please allow camera access");
    msg("Camera blocked ❌", false);
  }
}

// ========== Capture + Aura ==========
function capture(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  const cv  = side==="left"?$("canvasLeft"):$("canvasRight");
  const ctx = cv.getContext("2d");
  ctx.drawImage(vid,0,0,cv.width,cv.height);
  cv.dataset.locked="1";
  flash(cv);
  const aura = analyzeAura(cv);
  drawAuraOverlay(cv, aura.color);
  msg(`${side} hand locked 🔒 | Aura: ${aura.type}`);
  cv.dataset.aura = aura.type;
}

// ========== Flash FX ==========
function flash(cv){
  cv.style.boxShadow="0 0 15px #16f0a7";
  setTimeout(()=>cv.style.boxShadow="none",800);
}

// ========== Aura Analyzer ==========
function analyzeAura(canvas){
  const ctx=canvas.getContext("2d");
  const {width:w,height:h}=canvas;
  const img=ctx.getImageData(0,0,w,h).data;
  let r=0,g=0,b=0,count=0;
  for(let i=0;i<img.length;i+=20){r+=img[i];g+=img[i+1];b+=img[i+2];count++;}
  r/=count; g/=count; b/=count;
  const hue = rgbToHue(r,g,b);
  let type="Neutral",color="#ffffff";
  if(hue<25||hue>340){type="Active (Red)";color="#ff3333";}
  else if(hue<60){type="Divine (Gold)";color="#ffd700";}
  else if(hue<140){type="Healing (Green)";color="#00ff88";}
  else if(hue<220){type="Peaceful (Blue)";color="#33aaff";}
  else if(hue<300){type="Mystic (Violet)";color="#cc66ff";}
  else{type="Pure (White)";color="#ffffff";}
  return {type,color,hue:Math.round(hue)};
}
function rgbToHue(r,g,b){
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b),min=Math.min(r,g,b);
  const d=max-min;
  let h=0;
  if(d===0) h=0;
  else if(max===r) h=(60*((g-b)/d)+360)%360;
  else if(max===g) h=(60*((b-r)/d)+120)%360;
  else h=(60*((r-g)/d)+240)%360;
  return h;
}

// ========== Aura Overlay ==========
function drawAuraOverlay(canvas,color){
  const ctx=canvas.getContext("2d");
  const gradient=ctx.createRadialGradient(canvas.width/2,canvas.height/2,50,canvas.width/2,canvas.height/2,180);
  gradient.addColorStop(0,color+"cc");
  gradient.addColorStop(1,"transparent");
  ctx.fillStyle=gradient;
  ctx.globalAlpha=0.3;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.globalAlpha=1;
}

// ========== AI Segmentation Stub ==========
function segmentPalm(canvas){
  const ctx=canvas.getContext("2d");
  ctx.strokeStyle="#16f0a7";
  ctx.lineWidth=2;
  ctx.strokeRect(10,10,canvas.width-20,canvas.height-20);
  msg("🧠 Palm segmentation (stub) completed");
}

// ========== Analyzer ==========
function startAnalyzer(){
  if(!verifyLock()) return;
  msg("🌀 Aura–Geometry Integration...");
  const L=$("canvasLeft"), R=$("canvasRight");
  const auraL=L.dataset.aura||"Unknown", auraR=R.dataset.aura||"Unknown";
  const fullReport = generateAuraReport(auraL,auraR);
  translateAndExport(fullReport);
}

// ========== Verify ==========
function verifyLock(){
  const L=$("canvasLeft").dataset.locked==="1";
  const R=$("canvasRight").dataset.locked==="1";
  if(!L||!R){alert("Please capture both hands!");return false;}
  return true;
}

// ========== Report ==========
function generateAuraReport(aL,aR){
  return `
SATHYADARSHANA AURA PALM ANALYSIS REPORT
========================================
Left Aura  : ${aL}
Right Aura : ${aR}

Interpretation:
Your left hand reflects your spiritual inheritance and subconscious patterns.
Your right hand shows your current emotional and karmic state.

${aL.includes("Blue")?"A calm, spiritual resonance dominates.":" "}
${aR.includes("Red")?"Dynamic creative fire and determination are visible.":" "}
${aL.includes("Violet")||aR.includes("Violet")?"A mystic consciousness shines through, suggesting higher intuitive powers.":" "}
Overall energy balance appears harmonious with rising spiritual alignment.

© AI Buddhi – Quantum Palm Analyzer V7.2
  `.trim();
}

// ========== Translator + PDF + Voice ==========
async function translateAndExport(text){
  const lang=$("language").value;
  const translated=await translateText(text,lang);
  const final=translated||text;
  makePDF(final);
  speak(final,lang);
  msg("✅ Aura report translated, voiced & exported");
}
async function translateText(text,lang){
  if(lang==="en") return text;
  try{
    const res=await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
    const json=await res.json();
    return json[0].map(x=>x[0]).join("");
  }catch(e){console.warn("Offline translation",e);return text;}
}
function speak(t,lang){
  const u=new SpeechSynthesisUtterance(t);
  u.lang=langMap(lang);
  speechSynthesis.speak(u);
}
function langMap(l){
  const map={si:"si-LK",ta:"ta-IN",hi:"hi-IN",zh:"zh-CN",ja:"ja-JP",fr:"fr-FR",de:"de-DE",es:"es-ES",it:"it-IT",ru:"ru-RU",ar:"ar-SA"};
  return map[l]||"en-US";
}
async function makePDF(text){
  const {jsPDF}=window.jspdf;
  const pdf=new jsPDF({unit:"mm",format:"a4"});
  pdf.setFontSize(12);
  pdf.text("Sathyadarshana Quantum Palm Analyzer V7.2 – Aura Report",10,10);
  pdf.text(text,10,20,{maxWidth:180});
  pdf.save("Aura_Report.pdf");
}

// ========== Buttons ==========
$("startLeft").onclick=()=>startCam("left");
$("startRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>capture("left");
$("captureRight").onclick=()=>capture("right");
$("analyzeBtn").onclick=startAnalyzer;
$("saveBtn").onclick=()=>msg("📄 Manual Save");
$("speakBtn").onclick=()=>msg("🔊 Voice Ready");
$("language").onchange=e=>msg(`🌐 Language: ${e.target.value}`);
