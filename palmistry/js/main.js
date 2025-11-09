// 🧠 Sathyadarshana Palm Analyzer Main Controller

const cams = {
  left: { vid: "vidLeft", canvas: "canvasLeft", capture: "captureLeft" },
  right: { vid: "vidRight", canvas: "canvasRight", capture: "captureRight" }
};

async function startCamera(side) {
  const video = document.getElementById(cams[side].vid);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
    video.srcObject = stream;
    video.onloadedmetadata = () => video.play();
    document.getElementById("status").textContent = `📷 ${side.toUpperCase()} camera active`;
  } catch (err) {
    alert("Camera error: " + err.message);
  }
}

function captureFrame(side) {
  const video = document.getElementById(cams[side].vid);
  const canvas = document.getElementById(cams[side].canvas);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = "block";

  document.getElementById("status").textContent = `🖐️ ${side.toUpperCase()} hand captured`;
  console.log(`✅ ${side} hand frame captured`);

  // Future: OpenCV line detection call here
  // detectPalmEdges(canvas);
}

document.getElementById("startCamLeft").onclick = () => startCamera("left");
document.getElementById("startCamRight").onclick = () => startCamera("right");
document.getElementById("captureLeft").onclick = () => captureFrame("left");
document.getElementById("captureRight").onclick = () => captureFrame("right");
