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

  const img = ctx.getImageData(0, 0, cvs.width, cvs.height);
  const { data } = img;

  // --- AI Brightness + Skin-tone detection ---
  let total = 0, variance = 0, skinCount = 0;
  let lastAvg = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const avg = (r + g + b) / 3;
    total += avg;
    variance += Math.abs(avg - lastAvg);
    lastAvg = avg;

    // 🧠 Skin tone detection (approximate human range)
    if (r > 80 && g > 30 && b > 20 && r > g && r > b && r < 255 && g < 180 && b < 160) {
      skinCount++;
    }
  }

  const avgBrightness = total / (data.length / 4);
  const avgVariance = variance / (data.length / 4);
  const skinRatio = (skinCount / (data.length / 4)) * 100;

  // ⚠️ Reject dull or wall-like captures
  if (avgBrightness < 50 || avgVariance < 20) {
    document.getElementById("status").textContent = 
      `⚠️ ${side} hand not detected — surface too uniform (wall or floor detected)`;
    return;
  }

  // ⚠️ Reject non-skin captures
  if (skinRatio < 4 || skinRatio > 35) {
    document.getElementById("status").textContent =
      `⚠️ ${side} hand not detected — please show your palm clearly.`;
    return;
  }

  // ✅ Capture success
  cvs.classList.add("lockedImg");
  document.getElementById("status").textContent = `${side} hand detected & captured 🔒`;

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
