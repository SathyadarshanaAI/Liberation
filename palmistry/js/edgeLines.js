// edgeLines.js — V26.3 (Palm Line Edge Detection + Overlay System)

/**
 * Apply a simple edge detection + palm line overlay
 * to visualize captured palm images in the canvas.
 * (This is a simulation / pre-AI visualization layer)
 */

export function drawPalmEdges(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;

  // Extract pixel data
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Create a copy for convolution
  const gray = new Uint8ClampedArray(width * height);
  for (let i = 0; i < data.length; i += 4) {
    gray[i / 4] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // Sobel kernels for edge detection
  const gx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const gy = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  const edge = new Uint8ClampedArray(width * height);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let sumX = 0, sumY = 0;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const pixel = gray[(y + ky) * width + (x + kx)];
          const idx = (ky + 1) * 3 + (kx + 1);
          sumX += gx[idx] * pixel;
          sumY += gy[idx] * pixel;
        }
      }
      const mag = Math.sqrt(sumX * sumX + sumY * sumY);
      edge[y * width + x] = mag > 60 ? 255 : 0;
    }
  }

  // Draw edges (lines) back to canvas
  const edgeImg = ctx.createImageData(width, height);
  for (let i = 0; i < edge.length; i++) {
    const v = edge[i];
    edgeImg.data[i * 4] = 0;       // red
    edgeImg.data[i * 4 + 1] = v;   // green (glow effect)
    edgeImg.data[i * 4 + 2] = v;   // blue
    edgeImg.data[i * 4 + 3] = v > 0 ? 255 : 0;
  }

  // Overlay edge map
  ctx.putImageData(edgeImg, 0, 0);

  // Draw neon-style lines
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    ctx.moveTo(Math.random() * width, Math.random() * height * 0.3 + height * 0.4);
    ctx.lineTo(Math.random() * width, Math.random() * height * 0.6 + height * 0.2);
  }
  ctx.stroke();

  // Add glow text
  ctx.font = "14px Segoe UI";
  ctx.fillStyle = "rgba(0,255,255,0.7)";
  ctx.fillText("✨ Quantum Edge Overlay Active", 10, height - 12);
}
