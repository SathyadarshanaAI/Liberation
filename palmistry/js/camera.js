// 📸 Sathyadarshana Quantum Palm Analyzer · V16.8 Camera Core
// Auto handles both Left & Right hand streams safely (Mobile Ready)

export let streamL = null;
export let streamR = null;

// --- Start camera ---
export async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const status = document.getElementById("status");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });

    vid.srcObject = stream;
    if (side === "left") streamL = stream;
    else streamR = stream;

    status.textContent = `✅ ${side} camera started`;
  } catch (err) {
    console.error("Camera error:", err);
    status.textContent = `❌ ${side} camera error: ${err.message}`;
  }
}

// --- Capture current frame to canvas ---
export function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");

  if (!vid.srcObject) {
    alert("Please start the camera first.");
    return;
  }

  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  canvas.dataset.locked = "1";

  // 🔆 Visual effect
  canvas.style.boxShadow = "0 0 20px #16f0a7";
  setTimeout(() => (canvas.style.boxShadow = "none"), 600);

  document.getElementById("status").textContent = `📸 ${side} hand captured`;
}
