// edgeLines.js — V1.0 (Palm Edge + Line Detection Visualization)

export async function drawPalmEdges(canvas, imageData) {
  if (!canvas || !imageData) return;

  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;

  // === STEP 1: Convert image to grayscale ===
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height * 4; i += 4) {
    const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    gray[i / 4] = avg;
  }

  // === STEP 2: Simple Sobel edge detection ===
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  const edges = new Uint8ClampedArray(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = (y + ky) * width + (x + kx);
          const wIdx = (ky + 1) * 3 + (kx + 1);
          gx += gray[idx] * sobelX[wIdx];
          gy += gray[idx] * sobelY[wIdx];
        }
      }
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      edges[y * width + x] = magnitude > 100 ? 255 : 0; // threshold
    }
  }

  // === STEP 3: Draw glowing edges ===
  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(imageData, 0, 0); // background image

  ctx.lineWidth = 1.2;
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 6;
  ctx.strokeStyle = "#00e5ff";

  ctx.beginPath();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const val = edges[y * width + x];
      if (val > 0) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + 0.5, y + 0.5);
      }
    }
  }
  ctx.stroke();

  // === STEP 4: Label overlay ===
  ctx.font = "14px Segoe UI";
  ctx.fillStyle = "#FFD700";
  ctx.shadowBlur = 0;
  ctx.fillText("✨ Palm Line Visualization Active", 10, 20);
}
