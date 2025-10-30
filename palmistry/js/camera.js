export let streamL, streamR;

// === START CAMERA (AUTO HD / 4K DETECTION) ===
export async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  try {
    const constraints = {
      audio: false,
      video: {
        facingMode: "environment",     // use back camera if available
        width: { ideal: 1920 },        // Full HD target
        height: { ideal: 1080 },
        frameRate: { ideal: 30 }
      }
    };

    const st = await navigator.mediaDevices.getUserMedia(constraints);
    vid.srcObject = st;

    const track = st.getVideoTracks()[0];
    const settings = track.getSettings();
    const resText = settings.width && settings.height 
      ? ` (${settings.width}x${settings.height})`
      : "";

    if (side === "left") streamL = st;
    else streamR = st;

    document.getElementById("status").textContent =
      `${side} camera started ✅${resText}`;
  } catch (err) {
    document.getElementById("status").textContent =
      `❌ Camera error: ${err.message}`;
  }
}

// === CAPTURE IMAGE + SMART DETECTION ===
export async function capture(side, callback) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const cvs = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = cvs.getContext("2d");
  ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);

  const img = ctx.getImageData(0, 0, cvs.width, cvs.height);
  const data = img.data;

  let total = 0, variance = 0, skinCount = 0, darkCount = 0;
  let lastAvg = 0;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const avg = (r + g + b) / 3;
    total += avg;
    variance += Math.abs(avg - lastAvg);
    lastAvg = avg;

    // 🖐️ Skin-tone detection (broad safe range)
    if (r > 70 && g > 30 && b > 20 && r > g && r > b) skinCount++;
    if (avg < 40) darkCount++;
  }

  const avgBrightness = total / (data.length / 4);
  const avgVariance = variance / (data.length / 4);
  const skinRatio = (skinCount / (data.length / 4)) * 100;
  const darkRatio = (darkCount / (data.length / 4)) * 100;

  // ⚠️ Reject truly blank/flat surfaces
  if (avgVariance < 5 && skinRatio < 3) {
    document.getElementById("status").textContent =
      `⚠️ ${side} side not showing palm — wall/floor detected`;
    return;
  }

  // ✅ Accept dark / brown skin tones safely
  if (skinRatio < 2 && avgBrightness < 60 && darkRatio > 30) {
    document.getElementById("status").textContent =
      `✅ ${side} dark-skinned palm detected successfully`;
  }

  // ✅ Successful capture
  cvs.classList.add("lockedImg");
  document.getElementById("status").textContent = `${side} hand captured 🔒`;

  // stop camera stream
  vid.pause();
  vid.srcObject?.getTracks().forEach(t => t.stop());

  // when both hands captured → run analyzer
  if (
    document.getElementById("canvasLeft").classList.contains("lockedImg") &&
    document.getElementById("canvasRight").classList.contains("lockedImg")
  ) {
    callback();
  }
}
