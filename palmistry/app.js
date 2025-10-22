// === Quantum Palm Analyzer V6.6 ===
// Global AI Buddhi Edition – Full English Logical Analysis Report
const $ = id => document.getElementById(id);
const statusEl = $("status");
let streamLeft, streamRight;

function msg(t, ok = true){ statusEl.textContent = t; statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b"; }

// --- Camera control ---
async function startCam(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  try{
    const s = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:640,height:480}});
    vid.srcObject = s; if(side==="left")streamLeft=s;else streamRight=s;
    msg(`${side} camera started ✅`);
  }catch(e){alert("⚠️ Allow camera access");msg("Camera blocked ❌",false);}
}

// --- Capture + hand detection ---
function detectHandSide(cv){
  const ctx=cv.getContext("2d"),img=ctx.getImageData(0,0,cv.width,cv.height);
  let L=0,R=0;for(let y=0;y<img.height;y+=10){for(let x=0;x<img.width/2;x+=10){const i=(y*img.width+x)*4;L+=img.data[i]+img.data[i+1]+img.data[i+2];}
    for(let x=img.width/2;x<img.width;x+=10){const i=(y*img.width+x)*4;R+=img.data[i]+img.data[i+1]+img.data[i+2];}}
  const d=L>R?"right":"left";cv.dataset.detected=d;return d;
}
function capture(side){
  const vid=side==="left"?$("vidLeft"):$("vidRight");
  const cv=side==="left"?$("canvasLeft"):$("canvasRight");
  const ctx=cv.getContext("2d");ctx.drawImage(vid,0,0,cv.width,cv.height);
  cv.dataset.locked="1";const d=detectHandSide(cv);flash(cv);msg(`${side} locked (${d} hand) ✅`);
}
function flash(el){el.style.boxShadow="0 0 15px #16f0a7";setTimeout(()=>el.style.boxShadow="none",800);}

// --- Torch ---
async function toggleTorch(side){
  const s=side==="left"?streamLeft:streamRight;if(!s)return msg("Start camera first!",false);
  const t=s.getVideoTracks()[0],cap=t.getCapabilities();if(!cap.torch)return msg("Torch not supported",false);
  const on=!t.getConstraints().advanced?.[0]?.torch;await t.applyConstraints({advanced:[{torch:on}]});
  msg(`Torch ${on?"ON":"OFF"} 💡`);
}

// --- Verify & swap check ---
function verifyLock(){const L=$("canvasLeft").dataset.locked==="1",R=$("canvasRight").dataset.locked==="1";
  if(!L&&!R){alert("Capture at least one hand first");return"none";}if(L&&R)return"both";return L?"left":"right";}
function validateSwap(){const l=$("canvasLeft").dataset.detected,r=$("canvasRight").dataset.detected;
  if(l&&r&&l==="right"&&r==="left"){alert("⚠️ Hands swapped!");msg("Swap detected ⚠️",false);return false;}return true;}

// --- Analyzer animation ---
function startAnalyzer(){
  const mode=verifyLock();if(mode==="none")return;if(!validateSwap())return;
  msg("🌀 Scanning beams activated...");const beam=document.createElement("div");
  beam.style="position:fixed;top:0;left:0;width:100%;height:4px;background:#00e5ff;box-shadow:0 0 20px #00e5ff;z-index:9999";
  document.body.appendChild(beam);let y=0,d=1;const a=setInterval(()=>{y+=6*d;beam.style.top=y+"px";if(y>window.innerHeight-8||y<0)d*=-1;},10);
  setTimeout(()=>{clearInterval(a);beam.remove();msg("✅ Report ready");generateReport(mode);},3500);
}

// --- Full English AI Buddhi report ---
const FULL_REPORT = [
`1. Origin of Self – The hand reveals the design of existence. The crossing of the Life and Head lines shows
a mind born with awareness of its own endurance. Because the root begins deep within the mount of Jupiter,
your motivation tends to come from vision and faith.`,
`2. Mind Path – The Head line’s horizontal run indicates clarity and reasoning. Its gradual descent implies a
creative but realistic nature. You think not only to survive but to refine truth, analyzing situations before
reacting.`,
`3. Vital Flow – The Life line curves widely, therefore the body responds easily to environment. Energy
fluctuates with emotional weather; your logical self observes these waves and often restores balance.`,
`4. Emotional Logic – The Heart line rises beneath Saturn yet curves under Jupiter, therefore affection is
tempered by discipline. You express warmth through responsibility; when reasoning meets compassion, harmony
emerges.`,
`5. Faith and Intuition – A faint Sister line beside the Life line denotes protection from unseen guidance. Your
instinct for timing and restraint builds inner safety.`,
`6. Karma and Purpose – The Fate line ascending from the Life line toward Saturn indicates self-made destiny.
It implies that your reasoning mind creates its own circumstances; every decision leaves an intentional trace.`,
`7. Solar Will – The Sun line joins near the Fate line, showing recognition through clarity rather than chance.
Because intellect and effort align, your work naturally earns respect.`,
`8. Relationship Logic – Minor branches from the Heart line toward Mercury reveal communication based on truth.
You seek connection that grows from dialogue, not illusion.`,
`9. Health and Equilibrium – Cross marks near the base show periodic exhaustion; still, your rational rhythm
restores recovery through reflection. You heal by understanding cause before cure.`,
`10. Final Synthesis – When both hands are read together, the left reflects inherited tendency and the right
reveals present command. Their combined geometry forms a logical mirror of consciousness itself: awareness
realizing pattern, pattern realizing purpose. Therefore, you are the witness of your own design.`
].join("\n\n");

// --- Generate full report + PDF + voice ---
function generateReport(mode){
  const div=document.createElement("div");
  div.id="report";
  div.style="background:#101820;color:#e6f0ff;padding:20px;border-radius:12px;width:85%;margin:20px auto;line-height:1.6;box-shadow:0 0 12px #00e5ff";
  div.innerHTML=`<h2 style='color:#00e5ff;text-align:center;'>AI Buddhi Deep Palm Analysis Report</h2>
  <p><b>Mode:</b> ${mode==="both"?"Full Analysis (Both Hands)":"Partial ("+mode+" hand)"}.</p>
  <pre style="white-space:pre-wrap;text-align:justify;">${FULL_REPORT}</pre>`;
  document.body.appendChild(div);
  speakReport(FULL_REPORT);
  exportPDF();
}

// --- Voice ---
function speakReport(text){
  const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=1;u.pitch=1;u.volume=1;
  speechSynthesis.cancel();speechSynthesis.speak(u);msg("🔊 Speaking report...");
}

// --- PDF Export ---
function exportPDF(){
  const { jsPDF } = window.jspdf;
  const pdf=new jsPDF({unit:"pt",format:"a4"});
  const left=$("canvasLeft"),right=$("canvasRight");
  try{
    pdf.text("Quantum Palm Analyzer – AI Buddhi Report",50,40);
    if(left.width)pdf.addImage(left.toDataURL("image/png"),"PNG",40,60,240,320);
    if(right.width)pdf.addImage(right.toDataURL("image/png"),"PNG",310,60,240,320);
    pdf.addPage();
    const textLines=pdf.splitTextToSize(FULL_REPORT,520);
    pdf.text(textLines,40,60);
    pdf.save("Palm_Report.pdf");
    msg("💾 PDF exported successfully!");
  }catch(e){console.error(e);msg("PDF export error",false);}
}

// --- Buttons ---
$("startLeft").onclick=()=>startCam("left");
$("startRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>capture("left");
$("captureRight").onclick=()=>capture("right");
$("torchLeft").onclick=()=>toggleTorch("left");
$("torchRight").onclick=()=>toggleTorch("right");
$("analyzeBtn").onclick=startAnalyzer;

console.log("✅ Quantum Palm Analyzer V6.6 – Global AI Buddhi Edition loaded");
