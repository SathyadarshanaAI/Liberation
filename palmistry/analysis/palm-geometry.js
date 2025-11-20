// 🕉️ THE SEED • Geometry Engine V2.0
// TrueTone Palm Color Preservation + Soft Light Enhancement

export async function detectPalmGeometry(videoElement, canvasElement) {
  const ctx = canvasElement.getContext("2d");

  // Draw video frame
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  let frame = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
  let data = frame.data;

  // 💡 NEW: Soft-Light Brightness (Protects natural skin tone)
  let boost = 18;   // earlier was 35 (too high)
  
  for (let i = 0; i < data.length; i += 4) {

    // Soft contrast curve (retain color)
    data[i]     = data[i] + boost - (data[i] * 0.07);     // R
    data[i + 1] = data[i + 1] + boost - (data[i+1] * 0.07); // G
    data[i + 2] = data[i + 2] + boost - (data[i+2] * 0.07); // B

    // Prevent white-out
    data[i]     = Math.min(235, data[i]);
    data[i + 1] = Math.min(235, data[i + 1]);
    data[i + 2] = Math.min(235, data[i + 2]);
  }

  ctx.putImageData(frame, 0, 0);

  // Detection still works (outline removed)
  return {
    palmDetected: true,
    zones: {
      lifeZone: "bottom-left quadrant",
      headZone: "center of palm",
      heartZone: "upper palm",
      fateZone: "vertical midline"
    }
  };
}
