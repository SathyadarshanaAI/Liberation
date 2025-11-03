// 🕉️ Sathyadarshana Palm Analyzer - Pure Line Final Edition
export async function analyzeEdges(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = img.data;

  // Grayscale convert
  const gray = new Uint8ClampedArray(canvas.width * canvas.height);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] =
      0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
  }

  // Sobel edge detection
  const edge = new Uint8ClampedArray(gray.length);
  const w = canvas.width;
  for (let y = 1; y < canvas.height - 1; y++) {
    for (let x = 1; x < canvas.width - 1; x++) {
      const i = y * w + x;
      const gx =
        -gray[i - w - 1] - 2 * gray[i - 1] - gray[i + w - 1] +
        gray[i - w + 1] + 2 * gray[i + 1] + gray[i + w + 1];
      const gy =
        -gray[i - w - 1] - 2 * gray[i - w] - gray[i - w + 1] +
        gray[i + w - 1] + 2 * gray[i + w] + gray[i + w + 1];
      edge[i] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  // Draw clean thin lines only
  ctx.putImageData(img, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "#FFD700"; // pure gold lines
  ctx.lineWidth = 1.1;
  ctx.beginPath();
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      const i = y * w + x;
      if (edge[i] > 180) ctx.moveTo(x, y), ctx.lineTo(x + 1, y + 1);
    }
  }
  ctx.stroke();

  console.log("✅ Clean golden line rendering — aura and noise removed.");
}
