export function drawAIOverlay(canvas, side) {
  const ctx = canvas.getContext("2d");
  const colors = ["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00", "#ff8800", "#ffffff"];

  for (let i = 0; i < 8; i++) {
    ctx.strokeStyle = colors[i];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20 + i * 30, canvas.height * 0.2);
    ctx.lineTo(100 + i * 20, canvas.height * 0.8);
    ctx.stroke();
  }
}
