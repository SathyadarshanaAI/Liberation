// app.js — V9.0 Truth-Line Final Edition
// © 2025 Sathyadarshana Research Core

const $ = id => document.getElementById(id);
const statusEl = $("status");
const reportBox = $("reportBox");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

let torchState = false;

// === 12-language Voice ===
function detectLang(){
  const l = navigator.language?.slice(0,2);
  const langs = ["en","si","ta","hi","fr","de","es","zh","ja","ko","ar","ru"];
  return langs.includes(l)?l:"en";
}
function speak(text,lang="en"){
  try{
    const synth=window.speechSynthesis; if(!synth)return;
    const u=new SpeechSynthesisUtterance(text);
    const map={en:"en-US",si:"si-LK",ta:"ta-IN",hi:"hi-IN",fr:"fr-FR",de:"de-DE",es:"es-ES",zh:"zh-CN",ja:"ja-JP",ko:"ko-KR",ar:"ar-SA",ru:"ru-RU"};
    u.lang=map[lang]||"en-US"; u.rate=0.95; u.pitch=1; u.volume=1;
    synth.cancel(); setTimeout(()=>synth.speak(u),300);
  }catch(e){console.warn("Speech error",e);}
}

// === Torch Control ===
async function toggleTorch(side="left"){
  try{
    const vid=side==="left"?leftVid:rightVid;
    const stream=vid.srcObject; if(!stream)throw new Error("Camera not started");
    const track=stream.getVideoTracks()[0];
    const caps=track.getCapabilities(); if(!caps.torch)throw new Error("Torch not supported");
    torchState=!torchState;
    await track.applyConstraints({advanced:[{torch:torchState}]});
    msg(torchState?"🔦 Torch ON":"💡 Torch OFF");
  }catch(e){msg(`Torch: ${e.message}`,false);}
}

// === Camera Start ===
async function startCam(side){
  const vid=side==="left"?leftVid:rightVid;
  try{
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
    vid.srcObject=stream; await vid.play();
    msg(`${side} camera started ✅`);
  }catch(e){msg(`Camera Error: ${e.message}`,false);}
}

// === Capture ===
function capture(side){
  const vid=side==="left"?leftVid:rightVid;
  const cv=side==="left"?leftCv:rightCv;
  if(!vid.srcObject){msg("⚠️ Start camera first!",false);return false;}
  const ctx=cv.getContext("2d");
  cv.width=vid.videoWidth; cv.height=vid.videoHeight;
  ctx.drawImage(vid,0,0,cv.width,cv.height);
  msg(`${side} hand captured 🔒`);
  return true;
}

// === Analyzer ===
async function analyze(side,mode="mini"){
  if(!capture(side))return;
  msg(`Analyzing ${side} hand (${mode})...`);
  await new Promise(r=>setTimeout(r,800)); // demo delay
  const now=new Date().toLocaleTimeString();
  const lang=detectLang();

  const intro=side==="left"
    ?"Left hand shows past karmic flow and inherited memory."
    :"Right hand shows present destiny and current life pattern.";

  const lines=[
    "• Life Line: strong vitality, balanced energy",
    "• Head Line: clear and practical thought",
    "• Heart Line: stable emotions with empathy",
    "• Fate Line: gradual rise through self-effort",
    "• Sun Line: artistic vision awakening",
    "• Health Line: steady balance and recovery",
    "• Marriage Line: karmic connection influence",
    "• Manikanda Ring: spiritual awakening sign"
  ];

  let text="";
  if(mode==="mini"){
    text=`🕒 ${now}\n${side.toUpperCase()} HAND SUMMARY\n${intro}`;
  }else{
    text=`🕒 ${now}\n${side.toUpperCase()} HAND FULL REPORT\n${intro}\n${"-".repeat(40)}\n${lines.join("\n")}\n\n(Extended AI version coming soon...)`;
  }

  reportBox.textContent=text;
  glow();
  msg(`✅ ${side} hand ${mode} report ready`);
  speak(intro,lang);
}

// === Glow animation ===
function glow(){
  reportBox.style.transition="box-shadow 0.6s ease";
  reportBox.style.boxShadow="0 0 24px 8px #00e5ff";
  setTimeout(()=>reportBox.style.boxShadow="0 0 10px #00e5ff80",1500);
}

// === Bindings ===
$("startLeft").onclick=()=>startCam("left");
$("startRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>analyze("left","mini");
$("captureRight").onclick=()=>analyze("right","mini");
$("fullLeft").onclick=()=>analyze("left","full");
$("fullRight").onclick=()=>analyze("right","full");
$("torchLeft").onclick=()=>toggleTorch("left");
$("torchRight").onclick=()=>toggleTorch("right");

// === Status ===
function msg(t,ok=true){statusEl.textContent=t;statusEl.style.color=ok?"#16f0a7":"#ff6b6b";}

// === Init ===
(async()=>{
  if(!navigator.mediaDevices?.getUserMedia) msg("❌ Camera not supported",false);
  else msg("Ready — Tap Start → Analyze ✨");
})();
