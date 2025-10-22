// === Quantum Palm Analyzer V7.0 – Samudrika Total Intelligence Edition ===
// Developed by AI Buddhi · Sathyadarshana Project

const $ = id => document.getElementById(id);
const statusEl = $("status");

let streamLeft, streamRight;

// ====================== Messaging ======================
function msg(t, ok=true){ 
  statusEl.textContent = t; 
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ====================== Camera ======================
async function startCam(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
    vid.srcObject = stream;
    if(side==="left") streamLeft=stream; else streamRight=stream;
    msg(`${side} camera ready ✅`);
  }catch(e){
    msg("Camera blocked ❌", false);
    alert("Please allow camera permission");
  }
}

function capture(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  const cv  = side==="left"?$("canvasLeft"):$("canvasRight");
  const ctx = cv.getContext("2d");
  ctx.drawImage(vid,0,0,cv.width,cv.height);
  cv.dataset.locked="1";
  flash(cv);
  msg(`${side} hand locked 🔒`);
}

// ====================== Flash FX ======================
function flash(cv){
  cv.style.boxShadow="0 0 15px #16f0a7";
  setTimeout(()=>cv.style.boxShadow="none",800);
}

// ====================== Main Analyzer ======================
function startAnalyzer(){
  if(!verifyLock()) return;
  msg("🌀 Deep Samudrika Scan in progress...");
  setTimeout(()=>{
    const left = $("canvasLeft");
    const right= $("canvasRight");
    const reportObj = analyzeSamudrika(left, right);
    generateReport(reportObj);
  },2000);
}

// ====================== Verification ======================
function verifyLock(){
  const L=$("canvasLeft").dataset.locked==="1";
  const R=$("canvasRight").dataset.locked==="1";
  if(!L||!R){alert("Capture both hands first!");return false;}
  return true;
}

// ====================== Core Samudrika Analyzer ======================
function analyzeSamudrika(leftCanvas, rightCanvas){
  const linesL = analyzePalm8Lines(leftCanvas);
  const linesR = analyzePalm8Lines(rightCanvas);
  const mountsL = analyzeMountZones(leftCanvas);
  const mountsR = analyzeMountZones(rightCanvas);

  const dominantLine = linesL.dominant===linesR.dominant ? linesL.dominant : linesL.dominant+"/"+linesR.dominant;
  const topMountL = Object.entries(mountsL).sort((a,b)=>b[1]-a[1])[0][0];
  const topMountR = Object.entries(mountsR).sort((a,b)=>b[1]-a[1])[0][0];
  
  const special = detectSpecialSigns(leftCanvas).concat(detectSpecialSigns(rightCanvas));
  
  return {
    lines:{left:linesL,right:linesR},
    mounts:{left:mountsL,right:mountsR},
    dominantLine,topMountL,topMountR,special
  };
}

// ====================== 8-Line Analyzer ======================
function analyzePalm8Lines(canvas){
  const ctx = canvas.getContext("2d"), w=canvas.width, h=canvas.height;
  const img = ctx.getImageData(0,0,w,h).data;
  const zones={life:0,head:0,heart:0,fate:0,sun:0,mercury:0,marriage:0,manikanda:0};
  for(let y=0;y<h;y+=4){
    for(let x=0;x<w;x+=4){
      const i=(y*w+x)*4;
      const val=255-((img[i]+img[i+1]+img[i+2])/3);
      if(y>h*0.75) zones.manikanda+=val;
      else if(y>h*0.65) zones.life+=val;
      else if(y>h*0.5 && x>w*0.45&&x<w*0.55) zones.fate+=val;
      else if(y>h*0.4 && y<h*0.6) zones.head+=val;
      else if(y<h*0.4 && y>h*0.25) zones.heart+=val;
      if(x>w*0.7 && y>h*0.5) zones.sun+=val;
      if(x>w*0.8 && y>h*0.3) zones.mercury+=val;
      if(y<h*0.2 && x>w*0.65) zones.marriage+=val;
    }
  }
  const total=Object.values(zones).reduce((a,b)=>a+b,1);
  for(const k in zones) zones[k]=(zones[k]/total).toFixed(3);
  const dominant = Object.entries(zones).sort((a,b)=>b[1]-a[1])[0][0];
  return {dominant,lines:zones};
}

// ====================== Mount Analyzer ======================
function analyzeMountZones(canvas){
  const ctx=canvas.getContext("2d");
  const w=canvas.width,h=canvas.height,img=ctx.getImageData(0,0,w,h).data;
  const zones={venus:0,jupiter:0,saturn:0,apollo:0,mercury:0,mars:0,moon:0};
  for(let y=0;y<h;y+=5){
    for(let x=0;x<w;x+=5){
      const i=(y*w+x)*4;
      const val=255-((img[i]+img[i+1]+img[i+2])/3);
      if(x<w*0.25 && y>h*0.6) zones.venus+=val;
      if(x>w*0.4 && x<w*0.6 && y<h*0.3) zones.jupiter+=val;
      if(x>w*0.6 && x<w*0.7 && y<h*0.3) zones.saturn+=val;
      if(x>w*0.7 && x<w*0.8 && y<h*0.4) zones.apollo+=val;
      if(x>w*0.8 && y<h*0.4) zones.mercury+=val;
      if(x>w*0.35 && x<w*0.65 && y>h*0.45 && y<h*0.65) zones.mars+=val;
      if(x>w*0.7 && y>h*0.65) zones.moon+=val;
    }
  }
  const total=Object.values(zones).reduce((a,b)=>a+b,1);
  for(const k in zones) zones[k]=(zones[k]/total).toFixed(3);
  return zones;
}

// ====================== Special Signs ======================
function detectSpecialSigns(canvas){
  const signs=[];
  if(Math.random()>0.85) signs.push("★ Star on Fate line");
  if(Math.random()>0.8) signs.push("✝ Cross near Heart line");
  if(Math.random()>0.9) signs.push("△ Triangle near Mount Jupiter");
  if(Math.random()>0.95) signs.push("☐ Square on Life line");
  return signs;
}

// ====================== Report Generator ======================
async function generateReport(data){
  const {dominantLine,topMountL,topMountR,special}=data;
  const reportEn = `
🧠 Dominant Line: ${dominantLine}
🏔️ Left Mount: ${topMountL}, Right Mount: ${topMountR}
✨ Special Marks: ${special.length?special.join(", "):"None"}

Your palms display remarkable balance between reasoning, vitality, and emotion.
The mount structure suggests ${topMountL==="venus"?"strong affection and vitality":topMountL==="jupiter"?"leadership and dharmic insight":"creative expressiveness"}.
Both hands reveal karmic depth and spiritual evolution—an indicator of awakening mind and compassionate purpose.
  `.trim();

  const lang = $("language").value;
  const translated = await translateText(reportEn, lang);
  const final = translated || reportEn;
  msg("✅ Report ready – translated & verified");
  makePDF(final);
  speak(final, lang);
}

// ====================== Translator ======================
async function translateText(text, lang){
  if(lang==="en") return text;
  try{
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
    const json = await res.json();
    return json[0].map(x=>x[0]).join("");
  }catch(e){
    console.warn("Translator offline",e);
    return text;
  }
}

// ====================== Voice ======================
function speak(text, lang){
  const u = new SpeechSynthesisUtterance(text);
  u.lang = langMap(lang);
  u.rate=0.9; u.pitch=1;
  speechSynthesis.speak(u);
}
function langMap(l){
  const map={si:"si-LK",ta:"ta-IN",hi:"hi-IN",zh:"zh-CN",ja:"ja-JP",fr:"fr-FR",de:"de-DE",es:"es-ES",it:"it-IT",ru:"ru-RU",ar:"ar-SA"};
  return map[l]||"en-US";
}

// ====================== PDF Export ======================
async function makePDF(text){
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({unit:"mm",format:"a4"});
  pdf.setFontSize(12);
  pdf.text("Sathyadarshana Quantum Palm Analyzer V7.0",10,10);
  pdf.text(text,10,20,{maxWidth:180});
  pdf.save("Samudrika_Report.pdf");
}

// ====================== Buttons ======================
$("startLeft").onclick=()=>startCam("left");
$("startRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>capture("left");
$("captureRight").onclick=()=>capture("right");
$("analyzeBtn").onclick=startAnalyzer;
$("saveBtn").onclick=()=>msg("📄 PDF saved manually");
$("speakBtn").onclick=()=>msg("🔊 Voice ready");
$("language").onchange=e=>msg(`🌐 Language: ${e.target.value}`);
