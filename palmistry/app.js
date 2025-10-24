const $ = id => document.getElementById(id);
const statusEl = $("status");
const leftVid = $("vidLeft");
const rightVid = $("vidRight");
const leftCv = $("canvasLeft");
const rightCv = $("canvasRight");

function msg(t, ok=true){
  statusEl.textContent=t;
  statusEl.style.color=ok?"#16f0a7":"#ff6b6b";
}

// --- Camera Setup ---
async function startCam(side){
  const video = side==="left"?leftVid:rightVid;
  try{
    const stream = await navigator.mediaDevices.getUserMedia({
      video:{facingMode:"environment"}, audio:false
    });
    video.srcObject = stream;
    await video.play();
    msg(`${side} camera started ✅`);
  }catch(e){
    console.error(e);
    msg(`Camera Error: ${e.message}`, false);
  }
}

// --- Capture with natural ratio ---
function capture(side){
  const video = side==="left"?leftVid:rightVid;
  const canvas = side==="left"?leftCv:rightCv;
  const ctx = canvas.getContext("2d");

  // set canvas size same as video frame
  const w = video.videoWidth;
  const h = video.videoHeight;
  canvas.width = w;
  canvas.height = h;
  ctx.drawImage(video, 0, 0, w, h);

  msg(`${side} hand captured 🔒`);
}

// --- Bind ---
$("startLeft").onclick=()=>startCam("left");
$("startRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>capture("left");
$("captureRight").onclick=()=>capture("right");

// --- Init ---
(async()=>{
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    msg("Camera not supported ❌", false);
  }else{
    msg("Ready. Click Start to begin 🎥");
  }
})();
