// modules/camera.js · Quantum Palm Analyzer v10.8
export async function startCamera(side) {
  const vid = document.getElementById(`vid-${side}`);
  if (!vid) return `❌ No video element for ${side}`;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
    vid.srcObject = stream;
    vid.dataset.active = "1";
    return `✅ ${side.toUpperCase()} camera started`;
  } catch (e) {
    return `⚠️ Camera start failed (${side}): ${e.message}`;
  }
}

export function capture(side) {
  const vid = document.getElementById(`vid-${side}`);
  const canvas = document.getElementById(`canvas-${side}`);
  if (!vid || !canvas) return `❌ Missing elements for ${side}`;
  try {
    const ctx = canvas.getContext("2d");
    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    canvas.style.display = "block";
    canvas.classList.add("flash");
    setTimeout(() => canvas.classList.remove("flash"), 600);
    // Optionally pause video for snapshot
    vid.pause?.();
    return `📸 ${side.toUpperCase()} hand captured`;
  } catch (e) {
    return `⚠️ Capture failed (${side}): ${e.message}`;
  }
}
