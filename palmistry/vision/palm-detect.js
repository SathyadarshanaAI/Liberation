// =======================================================
// PALM DETECT ENGINE (lightweight version)
// Detects hand area -> returns cropped palm frame
// =======================================================

export async function detectPalm(frame) {
  // Convert to canvas
  const c = document.createElement("canvas");
  c.width = frame.width;
  c.height = frame.height;
  const ctx = c.getContext("2d");
  ctx.putImageData(frame, 0, 0);

  // Basic threshold to isolate brightest skin area
  const imageData = ctx.getImageData(0, 0, c.width, c.height);
  const pixels = imageData.data;

  let minX = Infinity, minY = Infinity;
  let maxX = 0, maxY = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    // Simple skin detection
    if (r > 140 && g > 90 && b < 120) {
      const index = i / 4;
      const x = index % c.width;
      const y = Math.floor(index / c.width);

      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }

  // Return crop
  const w = maxX - minX;
  const h = maxY - minY;

  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = w;
  cropCanvas.height = h;

  const cropCtx = cropCanvas.getContext("2d");
  cropCtx.drawImage(c, minX, minY, w, h, 0, 0, w, h);

  return cropCanvas;
}
