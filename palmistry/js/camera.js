export async function startCam(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const status = document.getElementById("status");
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = stream;
    await vid.play();
    status.textContent = `✅ ${side.toUpperCase()} camera started`;
  } catch (err) {
    status.textContent = `❌ Camera error (${side}): ${err.message}`;
  }
}

export function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const canvas = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  canvas.style.boxShadow = "0 0 18px #00ffff";
  setTimeout(() => (canvas.style.boxShadow = "none"), 500);
  document.getElementById("status").textContent = `📸 ${side.toUpperCase()} hand captured`;
}
