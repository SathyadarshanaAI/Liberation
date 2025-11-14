/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   palm-detect.js — Hand Region Detection Engine (v1.0)
   Purpose:
   - Detect palm area from raw camera frame
   - Auto-crop palm region
   - Normalize brightness + contrast
   - Return cleaned palm image for line detection
----------------------------------------------------------*/

export function detectPalm(frameData) {

  const { data, width, height } = frameData;

  // Create blank output canvas
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  // Draw raw frame
  ctx.putImageData(frameData, 0, 0);

  /* ---------------------------------------------------------
     STEP 1 — Convert to grayscale
  ----------------------------------------------------------*/
  const gray = ctx.getImageData(0, 0, width, height);
  const d = gray.data;

  for (let i = 0; i < d.length; i += 4) {
    const avg = (d[i] + d[i + 1] + d[i + 2]) / 3;
    d[i] = d[i + 1] = d[i + 2] = avg;
  }
  ctx.putImageData(gray, 0, 0);

  /* ---------------------------------------------------------
     STEP 2 — Basic threshold for hand region
     (Simple + stable for mobile/low light)
  ----------------------------------------------------------*/
  const threshold = 120;
  const bin = ctx.getImageData(0, 0, width, height);
  const b = bin.data;

  for (let i = 0; i < b.length; i += 4) {
    const v = b[i];
    const pixel = v < threshold ? 0 : 255;
    b[i] = b[i+1] = b[i+2] = pixel;
  }
  ctx.putImageData(bin, 0, 0);

  /* ---------------------------------------------------------
     STEP 3 — Calculate bounding box of the "hand shape"
  ----------------------------------------------------------*/
  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {

      const idx = (y * width + x) * 4;
      if (b[idx] === 0) { // black → detected hand region
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  /* ---------------------------------------------------------
     STEP 4 — Crop the palm area
  ----------------------------------------------------------*/
  const palmWidth = maxX - minX;
  const palmHeight = maxY - minY;

  const palmCanvas = document.createElement("canvas");
  palmCanvas.width = palmWidth;
  palmCanvas.height = palmHeight;
  const palmCtx = palmCanvas.getContext("2d");

  palmCtx.drawImage(
    canvas,
    minX, minY, palmWidth, palmHeight,
    0, 0, palmWidth, palmHeight
  );

  /* ---------------------------------------------------------
     STEP 5 — Normalize contrast for line detection
  ----------------------------------------------------------*/
  const palmData = palmCtx.getImageData(0, 0, palmWidth, palmHeight);
  const pd = palmData.data;

  for (let i = 0; i < pd.length; i += 4) {
    let v = pd[i];
    v = (v - 30) * 1.5;   // reduce brightness + increase contrast
    if (v < 0) v = 0;
    if (v > 255) v = 255;
    pd[i] = pd[i+1] = pd[i+2] = v;
  }

  palmCtx.putImageData(palmData, 0, 0);

  /* ---------------------------------------------------------
     RETURN CLEAN PALM IMAGE for next module
  ----------------------------------------------------------*/
  return {
    palmCanvas,          // full canvas
    palmData,            // pixel data
    width: palmWidth,
    height: palmHeight
  };
}
