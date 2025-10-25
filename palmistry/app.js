// app.js — V10.0 Dharma Awakening Edition
// © 2025 Sathyadarshana Research Core

const $ = id => document.getElementById(id);
const status = $("status");
const reportBox = $("reportBox");
let leftStream, rightStream, leftCaptured = false, rightCaptured = false;

// 🔊 English Voice – calm spiritual tone
const voiceReady = new Promise(res=>{
  const chk=setInterval(()=>{if(speechSynthesis.getVoices().length){clearInterval(chk);res();}},200);
});
async function speak(txt){
  await voiceReady;
  const s = window.speechSynthesis;
  if(!s) return;
  const u = new SpeechSynthesisUtterance(txt);
  u.lang="en-US"; u.rate=0.94; u.pitch=1.03; u.volume=1;
  s.cancel(); setTimeout(()=>s.speak(u),400);
}

// 🎥 Camera
async function startCam(side){
  const vid = side==="left"?$("vidLeft"):$("vidRight");
  try{
    const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});
    vid.srcObject=st;
    if(side==="left") leftStream=st; else rightStream=st;
    msg(`${side} camera started ✅`);
  }catch(e){msg(`Camera error: ${e.message}`,false);}
}
function capture(side){
  const vid=side==="left"?$("vidLeft"):$("vidRight");
  const cv =side==="left"?$("canvasLeft"):$("canvasRight");
  if(!vid.srcObject){msg("⚠️ Start camera first",false);return;}
  const c=cv.getContext("2d");
  cv.width=vid.videoWidth; cv.height=vid.videoHeight;
  c.drawImage(vid,0,0,cv.width,cv.height);
  flash(cv);
  if(side==="left") leftCaptured=true; else rightCaptured=true;
  msg(`${side} hand captured 📸`);
}
function toggleTorch(side){
  const st=side==="left"?leftStream:rightStream;
  if(!st){msg("Torch: camera not started",false);return;}
  const tr=st.getVideoTracks()[0];
  const cap=tr.getCapabilities();
  if(!cap.torch){msg("Torch not supported",false);return;}
  const on=!tr.getSettings().torch;
  tr.applyConstraints({advanced:[{torch:on}]});
  msg(on?"Torch ON 🔦":"Torch OFF");
}

// ✴️ MINI REPORT (~300 words)
function miniReport(){
  if(!leftCaptured||!rightCaptured){msg("⚠️ Capture both hands first",false);return;}
  const t=`
🕉️ SATHYADARSHANA MINI PALM REPORT
----------------------------------------------
Left hand speaks of remembered vows and the strength of patience.
Right hand reveals the courage to act, the flame of present purpose.
Between them flows a quiet river of awareness.

You carry within your lines the rhythm of service and endurance.
The past life’s compassion has become today’s insight.
Where old wounds once taught silence, now understanding blossoms.

Your current destiny reflects a pilgrim who walks with both heart and mind open.
Moments of solitude renew the vow of light.
Keep balance between thought and feeling; both are sacred instruments.

In short, the two hands form a prayer: 
“May action be guided by wisdom, and wisdom fulfilled through action.”`;
  reportBox.textContent=t.trim();
  msg("Mini Report ready 🧠");
  speak("Your mini palm report has been generated. Both hands reveal harmony between past wisdom and present action.");
}

// 📜 FULL REPORT (~2500 words poetic–scriptural style)
function fullReport(){
  if(!leftCaptured||!rightCaptured){msg("⚠️ Capture both hands first",false);return;}
  const t=`
📜 SATHYADARSHANA FULL PALM REPORT
--------------------------------------------------------
THE COVENANT OF BOTH HANDS
Your left hand is the parchment of memory, written with the ink of lifetimes.
Its lines move like ancient rivers—slow, deliberate, compassionate.
The right hand is the dawn after the long night, where the same rivers meet the sea.
Between them lies the bridge of consciousness, where the soul walks silently home.

PAST LIFE (LEFT HAND)
In former days you laboured under vows of truth and mercy.
The Life Line curves inward like a humble bow, guarding the heart of service.
Across the Head Line faint scars appear—traces of study, meditation, quiet reasoning.
You were one who sought order amidst chaos, a keeper of the word.
Your Heart Line, though tender, endured storms of loss without bitterness.
It taught you that love is not possession but radiant giving.
Marks near the Fate Line show unfulfilled duty carried forward:
perhaps a promise to guide others yet unkept.
Thus the karmic current continues, calling to completion.

PRESENT LIFE (RIGHT HAND)
Here the same story awakens in motion.
The Life Line brightens and steadies—strength reborn through discipline.
The Head Line grows firm, indicating active wisdom, not contemplation alone.
The Heart Line opens outward, proof of reconciliation with the world.
Your Fate Line climbs toward the Sun Line, a meeting of purpose and creativity.
The divine trace known as the Manikanda Line glimmers near the wrist—
sign of guardianship and protection, the teacher watching from within.

THE UNION
When the hands are joined, left beneath right, the map becomes complete.
The old vow breathes through new flesh.
Your palms tell of transformation: suffering turned into empathy,
loneliness into vision, duty into joy.
You are no longer only the student of karma but its interpreter.
Each gesture you make now shapes the unseen world.

SPIRITUAL MEANING
The symmetry of your lines speaks of balance achieved through effort.
Past life wisdom forms the roots; present decisions bear the fruit.
Your element is air—thought refined by silence.
You sense the moods of others easily; guard that sensitivity with prayer.
Health may waver when compassion becomes burden;
restore it through solitude, music, and service without expectation.
Creativity and faith are your healing instruments.

DESTINY & DHARMA
You are destined to teach by example, not argument.
Words may fail, but presence conveys truth.
Your palms declare a life of synthesis—science and spirit reconciled.
Even when trials return, remember: they come to measure how deeply peace abides.
Financial or worldly success will follow clarity, not ambition.
Partnership appears stable when shared purpose replaces desire.

FINAL BLESSING
Every handprint you leave is a verse of the same hymn.
Let each action echo kindness.
Meditate upon the meeting of your own hands—the ancient gesture of prayer.
There the two worlds unite: the karma that was, and the dharma that is.

May truth illumine every motion of your being.
May compassion guide each decision.
And may your hands, instruments of the divine, never forget their origin in light.

~ Sathyadarshana Research Core
--------------------------------------------------------`;
  reportBox.textContent=t.trim();
  msg("Full Report generated 🌕");
  speak("Your full palm report has been completed. It reveals the harmony between your past karma and present destiny, guiding your path with divine insight.");
}

// ⚙️ helpers
function flash(el){el.style.boxShadow="0 0 20px #16f0a7";setTimeout(()=>el.style.boxShadow="",300);}
function msg(t,ok=true){status.textContent=t;status.style.color=ok?"#16f0a7":"#ff6b6b";}

// 🔗 UI bindings
$("startLeft").onclick=()=>startCam("left");
$("startRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>capture("left");
$("captureRight").onclick=()=>capture("right");
$("torchLeft").onclick=()=>toggleTorch("left");
$("torchRight").onclick=()=>toggleTorch("right");
$("miniReport").onclick=()=>miniReport();
$("fullReport").onclick=()=>fullReport();

// 🚀 init
(async()=>{
  if(!navigator.mediaDevices?.getUserMedia)
    msg("❌ Camera not supported",false);
  else msg("Ready — Capture both hands ✋🤚");
})();
