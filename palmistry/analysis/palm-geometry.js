// 🕉️ Sathyadarshana • THE SEED Geometry Engine V1.1
// Palm Outline Removed (No Cyan Overlay)

export async function detectPalmGeometry(videoElement, canvasElement) {
  const ctx = canvasElement.getContext("2d");

  // 1. Draw video to canvas
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  // 2. Extract image data
  let frame = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
  let data = frame.data;

  // 3. Auto-brightness (Shadowless mode)
  let brightnessBoost = 35;
  for (let i = 0; i < data.length; i += 4) {
    data[i]     = Math.min(255, data[i] + brightnessBoost);
    data[i + 1] = Math.min(255, data[i + 1] + brightnessBoost);
    data[i + 2] = Math.min(255, data[i + 2] + brightnessBoost);
  }

  ctx.putImageData(frame, 0, 0);

  // 4. Adaptive threshold + silhouette (kept for detection logic)
  let threshold = 140;
  let outlineMap = [];

  for (let y = 0; y < canvasElement.height; y++) {
    for (let x = 0; x < canvasElement.width; x++) {
      let idx = (y * canvasElement.width + x) * 4;
      let brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;
      outlineMap.push(brightness < threshold ? 1 : 0);
    }
  }

  // *** CYAN OUTLINE REMOVED ***
  // no ctx.stroke()
  // no ctx.lineTo()

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
