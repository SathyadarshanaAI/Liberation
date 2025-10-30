export function drawPalm(ctx, side = "left") {
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const imgData = ctx.getImageData(0, 0, w, h);
  const px = imgData.data;
  let total = 0;

  for (let i = 0; i < px.length; i += 4) {
    total += (px[i] + px[i + 1] + px[i + 2]) / 3;
  }
  const avg = total / (px.length / 4);

  // === Brightness check ===
  if (avg < 45 || avg > 230) {
    ctx.fillStyle = "#ff6666";
    ctx.font = "14px Segoe UI";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 10;
    ctx.fillText("⚠️ Hand not detected — please recapture", 20, 30);
    ctx.shadowBlur = 0;
    console.warn("No valid hand region found. Avg brightness:", avg);
    return;
  }

  // === Simple auto-orientation assist ===
  const thumb = avgBrightnessRegion(ctx, 0, h * 0.5, w * 0.3, h);
  const pinky = avgBrightnessRegion(ctx, w * 0.7, h * 0.5, w, h);
  let mirrored = false;
  if (thumb < pinky) {
    mirrored = true;
    console.log("⚙️ Auto-orientation: image appears flipped, correcting...");
  }

  // === Draw palm lines ===
  const glow = "#FFD700", neon = "#00FFFF";
  const lines = [
    { n: "Life", p: [[w * 0.25, h * 0.85], [w * 0.05, h * 0.45], [w * 0.45, h * 0.75]] },
    { n: "Head", p: [[w * 0.20, h * 0.55], [w * 0.55, h * 0.40], [w * 0.85, h * 0.45]] },
    { n: "Heart", p: [[w * 0.25, h * 0.40], [w * 0.55, h * 0.30], [w * 0.85, h * 0.25]] },
    { n: "Fate", p: [[w * 0.50, h * 0.95], [w * 0.55, h * 0.60], [w * 0.50, h * 0.15]] },
    { n: "Sun", p: [[w * 0.70, h * 0.90], [w * 0.75, h * 0.55], [w * 0.80, h * 0.20]] },
    { n: "Health", p: [[w * 0.40, h * 0.95], [w * 0.55, h * 0.70], [w * 0.80, h * 0.45]] },
    { n: "Marriage", p: [[w * 0.78, h * 0.25], [w * 0.85, h * 0.27], [w * 0.90, h * 0.30]] },
    { n: "Manikanda", p: [[w * 0.35, h * 0.20], [w * 0.50, h * 0.35], [w * 0.65, h * 0.55]] }
  ];

  lines.forEach(L => {
    ctx.beginPath();
    const grad = ctx.createLinearGradient(L.p[0][0], L.p[0][1], L.p[2][0], L.p[2][1]);
    grad.addColorStop(0, glow);
    grad.addColorStop(1, neon);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = glow;
    ctx.shadowBlur = 6;

    const p = mirrored ? L.p.map(([x, y]) => [w - x, y]) : L.p;
    ctx.moveTo(...p[0]);
    ctx.bezierCurveTo(...p[0], ...p[1], ...p[2]);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#00e5ff";
    ctx.font = "10px Segoe UI";
    ctx.fillText(L.n, p[2][0] - 25, p[2][1] - 3);
  });
}

// === Helper: region brightness ===
function avgBrightnessRegion(ctx, x1, y1, x2, y2) {
  const img = ctx.getImageData(x1, y1, x2 - x1, y2 - y1).data;
  let total = 0;
  for (let i = 0; i < img.length; i += 4) {
    total += (img[i] + img[i + 1] + img[i + 2]) / 3;
  }
  return total / (img.length / 4);
}
