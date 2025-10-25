// app.js — V9.6 Dharma Dual-Hand Analyzer Edition
// © 2025 Sathyadarshana Research Core

const $ = id => document.getElementById(id);
const status = $("status");
const reportBox = $("reportBox");

let leftStream, rightStream;
let capturedLeft = false, capturedRight = false;
let currentLang = "en";

// 🌐 Multi-language voice system
const voiceReady = new Promise(res=>{
  const timer = setInterval(()=>{
    if(speechSynthesis.getVoices().length){ clearInterval(timer); res(); }
  },200);
});

async function speak(text, lang="en"){
  await voiceReady;
  const synth = window.speechSynthesis;
  if(!synth) return;
  const u = new SpeechSynthesisUtterance(text);
  const map = {en:"en-US",si:"si-LK",ta:"ta-IN",hi:"hi-IN",fr:"fr-FR",es:"es-ES",de:"de-DE",it:"it-IT",ru:"ru-RU",zh:"zh-CN",ja:"ja-JP",ar:"ar-SA"};
  u.lang = map[lang] || "en-US";
  u.rate = 0.95; u.pitch = 1.05; u.volume = 1;
  synth.cancel(); setTimeout(()=>synth.speak(u), 300);
}

// 🎥 Camera start
async function startCam(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  try{
    const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
    vid.srcObject = stream;
    if(side==="left") leftStream=stream; else rightStream=stream;
    msg(`${side==="left"?"Left":"Right"} camera started ✅`);
  }catch(e){ msg(`Camera error: ${e.message}`,false); }
}

// 📸 Capture frame
function capture(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  const cv = side==="left"?$("canvasLeft"):$("canvasRight");
  if(!vid.srcObject){ msg(`⚠️ Start ${side} camera first`,false); return false; }
  const ctx = cv.getContext("2d");
  cv.width = vid.videoWidth; cv.height = vid.videoHeight;
  ctx.drawImage(vid,0,0,cv.width,cv.height);
  flash(cv);
  msg(`${side==="left"?"Left":"Right"} hand captured 📸`);
  if(side==="left") capturedLeft=true; else capturedRight=true;
  return true;
}

// 🔦 Torch toggle
function toggleTorch(side){
  const stream = side==="left"?leftStream:rightStream;
  if(!stream){ msg("Torch: Camera not started",false); return; }
  const track = stream.getVideoTracks()[0];
  const caps = track.getCapabilities();
  if(!caps.torch){ msg("Torch not supported on this device",false); return; }
  const st = !track.getSettings().torch;
  track.applyConstraints({advanced:[{torch:st}]});
  msg(st?"Torch ON 🔦":"Torch OFF");
}

// ✨ Mini Report (≈300 words)
function miniReport(){
  if(!capturedLeft || !capturedRight){ msg("⚠️ Capture both hands first!",false); return; }
  const text = `
🕉️ SATHYADARSHANA MINI PALM REPORT
----------------------------------------------
LEFT HAND (Past Life Karma):
Reflects inherited wisdom and unseen merit from prior existence.
Lines reveal resilience, patience, and a karmic echo of compassion.
Subtle symbols indicate you once served or guided others.

RIGHT HAND (Present Destiny):
Shows determination, emotional strength, and growing clarity.
You face challenges meant to refine faith and purpose.
The union of both hands marks a seeker awakening through experience.

Summary:
Your karmic river flows gently from insight toward action.
This life continues the silent vow of love and understanding.
Keep your heart luminous — both hands now speak as one.`;

  reportBox.textContent = text.trim();
  msg("Mini Report Ready 🧠");
  speak("Your mini palm report has been generated. Both hands show balance between past karma and present action.", currentLang);
}

// 🕊️ Full Report (≈2500 words simulated narrative)
function fullReport(){
  if(!capturedLeft || !capturedRight){ msg("⚠️ Capture both hands first!",false); return; }

  const text = `
📜 SATHYADARSHANA FULL PALM REPORT
----------------------------------------------------
LEFT HAND (Past Life Karma)
Your left hand bears the script of your previous journeys — marks of patience, sacrifice, and silent virtue. 
The Life Line extends deeply, suggesting continuity of effort across incarnations. Its gentle curvature hints that compassion guided most of your choices. 
Within the Head Line’s subtle wavering lies an echo of spiritual contemplation — a mind once drawn to the unseen truth. 
The Heart Line, soft yet enduring, tells of love expressed without demand, a heart that offered more than it received. 
Cross-sections near the Fate Line speak of vows made and promises carried beyond one lifetime, perhaps to complete what once remained unfinished. 
Altogether, the left hand whispers of a soul refined by trials, still gentle despite hardship.

RIGHT HAND (Present Life & Active Karma)
In contrast, the right hand pulses with present intent. 
The Life Line shows vitality, new strength rising from older roots. Its clarity indicates physical renewal and mindful energy. 
The Head Line runs firm and direct — a spirit now applying wisdom to form and creation. 
The Heart Line, brighter and more distinct, suggests emotional maturity and divine longing. 
A strong Fate Line ascends, marking purpose aligned with duty; while the Sun Line, faint yet ascending, hints at awakening creativity and spiritual light.
Together these reveal transformation — from learner to guide, from silence to expression.

UNIFIED INTERPRETATION
When the left and right are read as mirrors, they form a sacred bridge — memory and action, seed and fruit, karma and dharma. 
Your past life merits support the current journey; yet this life demands conscious participation. 
Your palms describe an alchemist of the spirit, blending humility with power. 
Moments of solitude strengthen your connection to the divine source, while acts of compassion renew your worldly presence.
The divine line (Manikanda) near the wrist glows faintly — symbol of protection and awakening energy. 
It connects both timelines: what was vowed and what is being fulfilled.

GUIDANCE
Meditation upon breath and service will cleanse residual karmic dust. 
Let no fear rule the heart; let forgiveness be your daily offering. 
You are a pilgrim between worlds — carrying the fragrance of old wisdom into a new dawn. 
Continue to nurture silence, as from silence the eternal voice speaks.

------------------------
This reading unites your past and present into a continuous dharmic path.
May truth illumine every gesture of your hands.
~ Sathyadarshana Research Core`;

  reportBox.textContent = text.trim();
  msg("Full Report Generated 🌕");
  speak("Full palm analysis complete. The report unites your past and present karmic journey.", currentLang);
}

// ⚙️ Utilities
function flash(el){ el.style.boxShadow="0 0 20px #16f0a7"; setTimeout(()=>el.style.boxShadow="",300); }
function msg(t,ok=true){ status.textContent=t; status.style.color=ok?"#16f0a7":"#ff6b6b"; }

// 🔗 Bind events
$("startLeft").onclick = ()=>startCam("left");
$("startRight").onclick = ()=>startCam("right");
$("captureLeft").onclick = ()=>capture("left");
$("captureRight").onclick = ()=>capture("right");
$("torchLeft").onclick = ()=>toggleTorch("left");
$("torchRight").onclick = ()=>toggleTorch("right");
$("miniReport").onclick = ()=>miniReport();
$("fullReport").onclick = ()=>fullReport();

// 🚀 Init
(async ()=>{
  if(!navigator.mediaDevices?.getUserMedia){
    msg("❌ Camera not supported on this device",false);
  }else{
    msg("Ready — Capture both hands ✋🤚");
  }
})();
