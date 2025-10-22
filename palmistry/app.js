// === Quantum Palm Analyzer V6.7 ===
// Global AI Buddhi Multilingual Dual-Report Edition · Part 1
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight;

function msg(t, ok = true){ statusEl.textContent=t; statusEl.style.color=ok?"#16f0a7":"#ff6b6b"; }

// --- Camera control ---
async function startCam(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  try{
    const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:640,height:480}});
    vid.srcObject=s; if(side==="left")streamLeft=s; else streamRight=s;
    msg(`${side} camera started ✅`);
  }catch(e){ alert("⚠️ Please allow camera access"); msg("Camera blocked ❌",false); }
}

// --- Capture + Smart Hand Detection ---
function detectHandSide(cv){
  const ctx=cv.getContext("2d"),img=ctx.getImageData(0,0,cv.width,cv.height);
  let L=0,R=0;
  for(let y=0;y<img.height;y+=10){
    for(let x=0;x<img.width/2;x+=10){const i=(y*img.width+x)*4;L+=img.data[i]+img.data[i+1]+img.data[i+2];}
    for(let x=img.width/2;x<img.width;x+=10){const i=(y*img.width+x)*4;R+=img.data[i]+img.data[i+1]+img.data[i+2];}
  }
  const d=L>R?"right":"left"; cv.dataset.detected=d; return d;
}
function capture(side){
  const vid=side==="left"?$("vidLeft"):$("vidRight");
  const cv=side==="left"?$("canvasLeft"):$("canvasRight");
  const ctx=cv.getContext("2d"); ctx.drawImage(vid,0,0,cv.width,cv.height);
  cv.dataset.locked="1"; const d=detectHandSide(cv); flash(cv);
  msg(`${side} locked (${d} hand detected) ✅`);
}
function flash(el){ el.style.boxShadow="0 0 15px #16f0a7"; setTimeout(()=>el.style.boxShadow="none",800); }

// --- Torch Feature ---
async function toggleTorch(side){
  const s=side==="left"?streamLeft:streamRight; if(!s)return msg("Start camera first!",false);
  const t=s.getVideoTracks()[0],cap=t.getCapabilities();
  if(!cap.torch)return msg("Torch not supported",false);
  const on=!t.getConstraints().advanced?.[0]?.torch;
  await t.applyConstraints({advanced:[{torch:on}]});
  msg(`Torch ${on?"ON":"OFF"} 💡`);
}

// --- Verify & Swap Check ---
function verifyLock(){const L=$("canvasLeft").dataset.locked==="1",R=$("canvasRight").dataset.locked==="1";
  if(!L&&!R){alert("🛑 Capture at least one hand!");return"none";} if(L&&R)return"both"; return L?"left":"right";}
function validateSwap(){const l=$("canvasLeft").dataset.detected,r=$("canvasRight").dataset.detected;
  if(l&&r&&l==="right"&&r==="left"){alert("⚠️ Hands appear swapped!");msg("Swap detected ⚠️",false);return false;} return true;}

// --- Analyzer Animation + Mini Report ---
function startAnalyzer(){
  const mode=verifyLock(); if(mode==="none")return; if(!validateSwap())return;
  msg("🌀 Scanning beams activated…");
  const beam=document.createElement("div");
  beam.style="position:fixed;top:0;left:0;width:100%;height:4px;background:#00e5ff;box-shadow:0 0 20px #00e5ff;z-index:9999";
  document.body.appendChild(beam); let y=0,d=1;
  const a=setInterval(()=>{y+=6*d;beam.style.top=y+"px";if(y>window.innerHeight-8||y<0)d*=-1;},10);
  setTimeout(()=>{clearInterval(a);beam.remove();msg("✅ Mini Report ready"); generateMiniReport(mode);},3500);
}

// --- 10-Point Mini Report (≈ 480 words) ---
const MINI_REPORT = [
`1. Origin of Self – The crossing of Life and Head lines reveals enduring awareness and visionary faith.`,
`2. Mind Path – A balanced Head line shows clarity and creative logic guided by reason.`,
`3. Vital Flow – A wide Life line suggests resilience and sensitivity to environmental change.`,
`4. Emotional Logic – Heart line under Jupiter implies warmth tempered by discipline.`,
`5. Faith and Intuition – A sister line beside Life line signifies divine guardianship.`,
`6. Karma and Purpose – Fate line from Life line shows self-made destiny through intentional choice.`,
`7. Solar Will – Sun line joining Fate line indicates recognition earned by clarity and effort.`,
`8. Relationship Logic – Heart line branches toward Mercury mean dialogue and truth-based connection.`,
`9. Health and Equilibrium – Cross marks near base signal periodic fatigue yet strong recovery.`,
`10. Final Synthesis – Left hand mirrors potential, right hand reveals application; together they form a logical portrait of conscious growth.`
].join("\n\n");

function generateMiniReport(mode){
  const div=document.createElement("div");
  div.id="report";
  div.style="background:#101820;color:#e6f0ff;padding:20px;border-radius:12px;width:85%;margin:20px auto;line-height:1.6;box-shadow:0 0 12px #00e5ff";
  div.innerHTML=`<h2 style='color:#00e5ff;text-align:center;'>AI Buddhi Mini Palm Analysis</h2>
  <p><b>Mode:</b> ${mode==="both"?"Full (Both Hands)":"Partial ("+mode+" hand)"}.</p>
  <pre style="white-space:pre-wrap;text-align:justify;">${MINI_REPORT}</pre>`;
  document.body.appendChild(div);
  speakReport(MINI_REPORT,"en");
}

// --- Voice Engine (Basic English for Mini Report) ---
function speakReport(text,lang="en"){
  const u=new SpeechSynthesisUtterance(text);
  u.lang=lang==="si"?"si-LK":lang==="ta"?"ta-IN":"en-US";
  u.rate=1; u.pitch=1; u.volume=1;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
  msg("🔊 Voice narration active…");
}

// --- Buttons ---
$("startLeft").onclick=()=>startCam("left");
$("startRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>capture("left");
$("captureRight").onclick=()=>capture("right");
$("torchLeft").onclick=()=>toggleTorch("left");
$("torchRight").onclick=()=>toggleTorch("right");
$("analyzeBtn").onclick=startAnalyzer;

console.log("✅ Quantum Palm Analyzer V6.7 · Part 1 (Mini Report Core) loaded");
/* === Part 2 — Deep AI Buddhi Report + Translator + PDF Export === */

// --- Deep-Sensitive 2500 word (10 Chapters) English Report ---
const FULL_REPORT_EN = `
1. ORIGIN OF SELF AND CONSCIOUSNESS
The Life and Head lines entwine beneath Jupiter, showing a being aware of its own endurance. Their geometry
implies memory through reason — the moment consciousness recognizes order inside chaos. From this point
the individual begins to measure the rhythm of life, building destiny with thought.

2. MIND AND REASONING PATH
The Head line flows in a stable horizontal arc. Its moderate descent indicates intelligence that unites
creativity with logic. Such minds act as translators between vision and method. Because the origin touches the
Life line, emotion and intellect cooperate, rarely contradict.

3. ENERGY FLOW AND LIFE FORCE
A broad Life line curves toward Venus mount. This width equals vitality mixed with empathy. The rhythm of
breath and decision coincide; fatigue appears only when compassion exceeds boundary. Recovery is rapid when
purpose is remembered.

4. EMOTIONAL ARCHITECTURE
The Heart line begins below Saturn and curves beneath Jupiter, a sign of affectionate discipline. Emotion here
does not overflow; it channels like water through a prepared canal. When this canal breaks, expression becomes
art — music, writing, or healing speech.

5. FAITH, INTUITION AND INNER GUIDE
A faint parallel sister line beside the Life line reveals unseen protection. Dreams often forecast events.
Meditation strengthens the cord between analytical mind and intuitive field, turning caution into foresight.

6. KARMIC PURPOSE AND DESTINY
The Fate line rises from the Life line toward Saturn: self-made destiny. Each decision carves visible pattern.
No external planet forces you; karma operates through reasoning choice. Therefore freedom and responsibility
are twins of one root.

7. SOLAR WILL AND CREATIVE RECOGNITION
The Sun line joins near the Fate line — success through clarity, not luck. Recognition comes when intellect
serves collective light. You earn visibility by aligning truth with usefulness.

8. RELATIONSHIP LOGIC AND COMMUNICATION
Branches from Heart line toward Mercury mark sincere communication. You value dialogue that refines mutual
understanding. Love without reasoning is attachment; reasoning without warmth is isolation — you balance both.

9. HEALTH AND EQUILIBRIUM
Minor crosses at the base of the palm show cycles of exhaustion. Yet your rational rhythm restores equilibrium.
Awareness of cause before cure is your medicine. You heal by observing pattern, not merely symptom.

10. FINAL SYNTHESIS — THE SELF AS WITNESS
Both hands together form the mirror of consciousness: left records inherited potential, right displays present
command. Geometry itself becomes scripture. When perception reads this scripture correctly, life appears as
logical compassion — mind realizing pattern, pattern realizing mind.
`;

// --- Create the Deep Report view ---
function generateFullReport(lang="en"){
  msg("🧠 Generating deep AI Buddhi report…");
  const div=document.createElement("div");
  div.id="fullReport";
  div.style="background:#0b0f16;color:#e6f0ff;padding:24px;border-radius:12px;width:88%;margin:25px auto;line-height:1.6;box-shadow:0 0 15px #00e5ff";
  div.innerHTML=`<h2 style='color:#00e5ff;text-align:center;'>AI Buddhi Deep-Sensitive Palm Report</h2>
  <pre style="white-space:pre-wrap;text-align:justify;">${FULL_REPORT_EN}</pre>`;
  document.body.appendChild(div);
  translateReport(lang);
}

// --- Translation API Stub (uses LibreTranslate if online, else placeholder) ---
async function translateText(text,target){
  try{
    const res=await fetch("https://libretranslate.de/translate",{
      method:"POST",
      body:JSON.stringify({q:text,source:"en",target}),
      headers:{"Content-Type":"application/json"}
    });
    const data=await res.json();
    return data.translatedText||text;
  }catch{ return "(Offline translation stub)\n"+text; }
}

// --- Map of Language Codes for Dropdown ---
const LANG_MAP={en:"English",si:"Sinhala",ta:"Tamil",hi:"Hindi",zh:"Chinese",ja:"Japanese",
  fr:"French",de:"German",es:"Spanish",it:"Italian",ru:"Russian",ar:"Arabic"};

// --- Translate & Display ---
async function translateReport(lang){
  if(lang==="en"){ speakReport(FULL_REPORT_EN,"en"); exportPDF(FULL_REPORT_EN,lang); return; }
  msg(`🌐 Translating report to ${LANG_MAP[lang]}…`);
  const translated=await translateText(FULL_REPORT_EN,lang);
  const existing=document.getElementById("fullReport");
  existing.innerHTML=`<h2 style='color:#00e5ff;text-align:center;'>AI Buddhi Report – ${LANG_MAP[lang]}</h2>
  <pre style="white-space:pre-wrap;text-align:justify;">${translated}</pre>`;
  speakReport(translated,lang);
  exportPDF(translated,lang);
}

// --- PDF Export A4 with Images ---
function exportPDF(text,lang){
  const { jsPDF } = window.jspdf;
  const pdf=new jsPDF({unit:"pt",format:"a4"});
  const left=$("canvasLeft"),right=$("canvasRight");
  pdf.setFontSize(12);
  pdf.text(`Quantum Palm Analyzer – AI Buddhi Report (${LANG_MAP[lang]||lang})`,50,40);
  try{
    if(left.width)pdf.addImage(left.toDataURL("image/png"),"PNG",40,60,240,320);
    if(right.width)pdf.addImage(right.toDataURL("image/png"),"PNG",310,60,240,320);
  }catch(e){console.warn("image error",e);}
  pdf.addPage();
  const lines=pdf.splitTextToSize(text,520);
  pdf.text(lines,40,60);
  pdf.save(`Palm_Report_${lang}.pdf`);
  msg("💾 Translated PDF exported successfully!");
}

// --- Hook Dropdown for Translation and Deep Report Buttons ---
$("language").addEventListener("change",e=>{
  const lang=e.target.value;
  const report=document.getElementById("fullReport");
  if(report){ translateReport(lang); }
  else msg(`🌐 Language set to ${LANG_MAP[lang]||lang}`);
});

// --- Extra Button for Deep Report ---
const deepBtn=document.createElement("button");
deepBtn.textContent="🌌 Deep Report";
deepBtn.onclick=()=>{ const lang=$("language").value||"en"; generateFullReport(lang); };
document.body.appendChild(deepBtn);

console.log("✅ Quantum Palm Analyzer V6.7 · Part 2 (Deep Report + Translator + PDF) loaded");
