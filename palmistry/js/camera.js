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

  // 🧠 Brightness Detection (avoid dark/wall capture)
  const img = ctx.getImageData(0, 0, cvs.width, cvs.height);
  let total = 0;
  for (let i = 0; i < img.data.length; i += 4) {
    total += (img.data[i] + img.data[i + 1] + img.data[i + 2]) / 3;
  }
  const avg = total / (img.data.length / 4);
  if (avg < 35) {
    document.getElementById("status").textContent = `⚠️ ${side} hand not visible (too dark or wall detected)`;
    return;
  }

  // ✅ Capture success
  cvs.classList.add("lockedImg");
  document.getElementById("status").textContent = `${side} hand captured 🔒`;
  vid.pause();
  vid.srcObject?.getTracks().forEach((t) => t.stop());

  // If both hands captured, trigger AI sequence
  if (
    document.getElementById("canvasLeft").classList.contains("lockedImg") &&
    document.getElementById("canvasRight").classList.contains("lockedImg")
  ) {
    callback();
  }
}
