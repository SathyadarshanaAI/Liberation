// ✨ opencv-helper.js — No Aura Version
export async function analyzeEdges(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // 🟢 Convert to grayscale
  const gray = new Uint8ClampedArray(imgData.data.length / 4);
  for (let i = 0; i < imgData.data.length; i += 4) {
    gray[i / 4] =
      0.299 * imgData.data[i] +
      0.587 * imgData.data[i + 1] +
      0.114 * imgData.data[i + 2];
  }

  // 🟡 Basic Edge Detection (No glow, no overlay)
  const edges = new Uint8ClampedArray(gray.length);
  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < canvas.width - 1; x++) {
      const i = y * canvas.width + x;
      const gx =
        -gray[i - canvas.width - 1] -
        2 * gray[i - 1] -
        gray[i + canvas.width - 1] +
        gray[i - canvas.width + 1] +
        2 * gray[i + 1] +
        gray[i + canvas.width + 1];
      const gy =
        -gray[i - canvas.width - 1] -
        2 * gray[i - canvas.width] -
        gray[i - canvas.width + 1] +
        gray[i + canvas.width - 1] +
        2 * gray[i + canvas.width] +
        gray[i + canvas.width + 1];
      edges[i] = Math.sqrt(gx * gx + gy * gy) > 100 ? 255 : 0;
    }
  }

  // 🖤 Clean background before drawing
  ctx.putImageData(imgData, 0, 0);
  ctx.globalCompositeOperation = "source-over";

  // ✨ Draw only thin green edges (no yellow glow)
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "#00ffcc";
  ctx.beginPath();
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const i = y * canvas.width + x;
      if (edges[i] > 200) ctx.lineTo(x, y);
    }
  }
  ctx.stroke();

  console.log("✅ Aura layer removed — showing only edge lines.");
}
