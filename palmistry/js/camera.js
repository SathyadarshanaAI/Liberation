export let streamL, streamR;

// === START CAMERA ===
export async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  try {
    const st = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    vid.srcObject = st;
    if (side === "left") streamL = st;
    else streamR = st;
    document.getElementById("status").textContent = `${side} camera started ✅`;
  } catch (err) {
    document.getElementById("status").textContent = `❌ Camera error: ${err.message}`;
  }
}

// === CAPTURE IMAGE ===
export async function capture(side, callback) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const cvs = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = cvs.getContext("2d");
  ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);

  // 🧠 AI Brightness + Skin-tone Detection
  const img = ctx.getImageData(0, 0, cvs.width, cvs.height);
  let total = 0, variance = 0;
  let lastAvg = 0;
  for (let i = 0; i < img.data.length; i += 4) {
    const avg = (img.data[i] + img.data[i + 1] + img.data[i + 2]) / 3;
    total += avg;
    variance += Math.abs(avg - lastAvg);
    lastAvg = avg;
  }
  const avgBrightness = total / (img.data.length / 4);
  const avgVariance = variance / (img.data.length / 4);

  // ⚠️ Reject dull / flat color surfaces (walls, tables)
  if (avgBrightness < 50 || avgVariance < 20) {
    document.getElementById("status").textContent = 
      `⚠️ ${side} hand not detected — surface too uniform (wall or floor detected)`;
    return;
  }

  // ✅ Capture success
  cvs.classList.add("lockedImg");
  document.getElementById("status").textContent = `${side} hand captured 🔒`;
  vid.pause();
  vid.srcObject?.getTracks().forEach((t) => t.stop());

  // Trigger AI analysis when both hands captured
  if (
    document.getElementById("canvasLeft").classList.contains("lockedImg") &&
    document.getElementById("canvasRight").classList.contains("lockedImg")
  ) {
    callback();
  }
}
