// paintLayer.js — AI Buddhi Digital Surface Paint Prototype
export async function paintPalmLines(ctx, imgData) {
  const { width:w, height:h } = imgData;
  const data = imgData.data;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowBlur = 6;
  ctx.shadowColor = "#00ffff99";

  for (let y = 0; y < h; y += 3) {
    for (let x = 0; x < w; x += 3) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      const brightness = (r + g + b) / 3;

      // detect natural palm ridges (low brightness)
      if (brightness < 90) {
        const strokeColor = brightness < 60 ? "#00FFFF" : "#16F0A7";
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2 + Math.random() * 1.8;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 1, y + 1);
        ctx.stroke();
      }
    }
  }
}
