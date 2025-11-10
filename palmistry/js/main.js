<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🕉️ TruePalm AI Analyzer · V35.0 Clean Free Build</title>

  <!-- 🧠 TensorFlow.js (Optional Future Model Support) -->
  <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js"></script>

  <!-- 🧩 OpenCV.js -->
  <script async src="https://docs.opencv.org/4.x/opencv.js"></script>

  <!-- ✅ Mobile Console (Eruda Debug Tool) -->
  <script src="https://cdn.jsdelivr.net/npm/eruda"></script>
  <script>eruda.init();</script>

  <style>
    body { background:#0a0a0a; color:#fff; font-family:sans-serif; text-align:center; }
    h1 { color:#00ffff; margin:10px; }
    .block { border:1px solid #0ff; border-radius:15px; margin:15px; padding:10px; }
    button {
      margin:6px; padding:8px 14px;
      border:none; border-radius:10px;
      background:#00ffff33; color:#fff; font-weight:bold;
    }
    canvas, video {
      width:90%; max-width:340px; border-radius:12px;
      margin-top:10px; border:1px solid #00ffff55;
    }
    pre {
      text-align:left; background:#0004;
      border-radius:10px; padding:8px;
      color:#0ff; font-size:0.9em;
    }
    #status { color:#0ff; margin-top:12px; font-weight:bold; }
  </style>
</head>
<body>
  <h1>🕉️ TruePalm AI Analyzer</h1>
  <div id="status">🧩 Initializing...</div>

  <!-- ✋ Left Hand -->
  <div class="block">
    <h3>✋ Left Hand</h3>
    <video id="vidLeft" autoplay muted playsinline></video><br/>
    <canvas id="canvasLeft" width="320" height="240"></canvas><br/>
    <button id="startCamLeft">Start Camera</button>
    <button id="captureLeft">Capture</button>
    <button id="analyzeLeft">Analyze</button>
    <pre id="reportLeft"></pre>
  </div>

  <!-- 🤚 Right Hand -->
  <div class="block">
    <h3>🤚 Right Hand</h3>
    <video id="vidRight" autoplay muted playsinline></video><br/>
    <canvas id="canvasRight" width="320" height="240"></canvas><br/>
    <button id="startCamRight">Start Camera</button>
    <button id="captureRight">Capture</button>
    <button id="analyzeRight">Analyze</button>
    <pre id="reportRight"></pre>
  </div>

<script>
/* ============================================================
   🕉️ TRUEPALM AI ANALYZER — ERROR-FREE CLEAN BUILD
   ============================================================ */

// ✅ Wait for OpenCV
async function waitForOpenCV() {
  return new Promise(resolve=>{
    const chk=setInterval(()=>{
      if(window.cv && cv.Mat){clearInterval(chk);resolve(true);}
    },500);
  });
}

// ✅ Start Camera
async function startCamera(videoId, side="environment"){
  const video=document.getElementById(videoId);
  try{
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:side}});
    video.srcObject=stream;
    await video.play();
    document.getElementById("status").textContent=`📷 ${side.toUpperCase()} camera active`;
    console.log(`✅ Camera started (${side})`);
  }catch(e){
    alert("⚠️ Camera error: "+e.message);
    console.error(e);
  }
}

// ✅ Capture Frame
function captureFrame(videoId,canvasId){
  const vid=document.getElementById(videoId);
  const can=document.getElementById(canvasId);
  const ctx=can.getContext("2d");
  if(!vid.srcObject)return alert("Start camera first!");
  ctx.drawImage(vid,0,0,can.width,can.height);
  vid.pause();
  document.getElementById("status").textContent="📸 Frame captured";
  console.log("🖼️ Captured frame:",videoId);
}

// ✅ Analyze Palm (Mock + Edge Visualization)
async function analyzePalm(canvasId,reportId,side){
  await waitForOpenCV();
  const canvas=document.getElementById(canvasId);
  const ctx=canvas.getContext("2d");
  const frame=ctx.getImageData(0,0,canvas.width,canvas.height);

  try{
    const mat=cv.matFromImageData(frame);
    let gray=new cv.Mat();
    cv.cvtColor(mat,gray,cv.COLOR_RGBA2GRAY);
    let blur=new cv.Mat();
    cv.GaussianBlur(gray,blur,new cv.Size(5,5),0);
    let edges=new cv.Mat();
    cv.Canny(blur,edges,40,150);
    cv.imshow(canvas,edges);

    mat.delete(); gray.delete(); blur.delete(); edges.delete();

    // Mock AI Report
    const life=["strong","balanced","soft"][Math.floor(Math.random()*3)];
    const heart=["deep","gentle","clear"][Math.floor(Math.random()*3)];
    const fate=["steady","uncertain","rising"][Math.floor(Math.random()*3)];

    const text=`Life line: ${life}\nHeart line: ${heart}\nFate line: ${fate}`;
    document.getElementById(reportId).textContent=text;

    // Sinhala Voice
    const msg=side==="left"
      ?`ඔයාගේ වම් අතේ ජීවිත රේඛාව ${life} ලෙස පෙනෙන්නෙ. හදවත ${heart}.`
      :`ඔයාගේ දකුණු අතේ විධානය ${fate} ලෙස පෙනෙන්නෙ. ආත්ම ශක්තිය ${life}.`;
    const sp=new SpeechSynthesisUtterance(msg);
    sp.lang="si-LK";sp.pitch=1;sp.rate=1;
    speechSynthesis.speak(sp);

    document.getElementById("status").textContent="✨ Analysis Complete!";
    console.log("✅ Palm analyzed:",text);

  }catch(err){
    alert("⚠️ Palm analysis error: "+err.message);
    console.error(err);
    document.getElementById("status").textContent="❌ Analysis failed.";
  }
}

// ✅ Event Listeners
document.getElementById("startCamLeft").onclick=()=>startCamera("vidLeft","user");
document.getElementById("startCamRight").onclick=()=>startCamera("vidRight","environment");

document.getElementById("captureLeft").onclick=()=>captureFrame("vidLeft","canvasLeft");
document.getElementById("captureRight").onclick=()=>captureFrame("vidRight","canvasRight");

document.getElementById("analyzeLeft").onclick=()=>analyzePalm("canvasLeft","reportLeft","left");
document.getElementById("analyzeRight").onclick=()=>analyzePalm("canvasRight","reportRight","right");

waitForOpenCV().then(()=>document.getElementById("status").textContent="✅ Ready for capture!");
</script>
</body>
</html>
