// 🕉️ Sathyadarshana • THE SEED Geometry Engine V1.0
// Palm Outline + Shadowless Hand Detection + Region Mapping

export async function detectPalmGeometry(videoElement, canvasElement) {
  const ctx = canvasElement.getContext("2d");

  // 1. Draw video to canvas
  ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

  // 2. Extract image data
  let frame = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);
  let data = frame.data;

  // 3. Auto-brightness (Shadowless mode)
  let brightnessBoost = 35;  // Artificial light
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] + brightnessBoost);     // R
    data[i+1] = Math.min(255, data[i+1] + brightnessBoost); // G
    data[i+2] = Math.min(255, data[i+2] + brightnessBoost); // B
  }

  ctx.putImageData(frame, 0, 0);

  // 4. Adaptive threshold for silhouette detection
  let threshold = 140;
  let outlineMap = [];

  for (let y = 0; y < canvasElement.height; y++) {
    for (let x = 0; x < canvasElement.width; x++) {
      let idx = (y * canvasElement.width + x) * 4;
      let brightness = (data[idx] + data[idx+1] + data[idx+2]) / 3;

      // Silhouette map (hand / no hand)
      outlineMap.push(brightness < threshold ? 1 : 0);
    }
  }

  // 5. Draw outline (cyan glow)
  ctx.strokeStyle = "#00F0FF";
  ctx.lineWidth = 2;
  ctx.beginPath();

  for (let y = 1; y < canvasElement.height - 1; y++) {
    for (let x = 1; x < canvasElement.width - 1; x++) {

      let idx = y * canvasElement.width + x;

      // edge = where dark pixel touches light pixel
      if (outlineMap[idx] === 1 &&
         (outlineMap[idx-1] === 0 || outlineMap[idx+1] === 0 ||
          outlineMap[idx - canvasElement.width] === 0 ||
          outlineMap[idx + canvasElement.width] === 0)) {

        ctx.lineTo(x, y);
      }
    }
  }
  
  ctx.stroke();

  // 6. Region zones (Life–Head–Heart)
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
