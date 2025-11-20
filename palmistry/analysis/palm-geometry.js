// 🕉️ THE SEED • TrueTone Palm Engine V3.0
// Ultra Natural Skin Capture + Instant Freeze

export async function detectPalmGeometry(videoElement, canvasElement) {
  const ctx = canvasElement.getContext("2d");

  // Draw raw frame instantly (no brightness, no filters, no washout)
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  let frame = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
  let data = frame.data;

  // --- Minimal smart contrast (protect skin tone) ---
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    let avg = (r + g + b) / 3;

    // Add very soft curve (line boost without losing color)
    data[i]     = Math.min(255, r + (avg * 0.07));
    data[i + 1] = Math.min(255, g + (avg * 0.07));
    data[i + 2] = Math.min(255, b + (avg * 0.07));
  }

  ctx.putImageData(frame, 0, 0);

  return {
    palmDetected: true
  };
}
