export async function detectLines(imgDataURL) {
  const img = new Image();
  img.src = imgDataURL;
  await img.decode();

  // 🪄 Create canvas to isolate hand region
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;

  // Simple AI-like hand mask detection (based on brightness + skin tone)
  let avgR = 0, avgG = 0, avgB = 0, count = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const brightness = (r + g + b) / 3;
    if (brightness > 50 && brightness < 210) { // rough skin zone
      avgR += r; avgG += g; avgB += b; count++;
    }
  }
  avgR /= count; avgG /= count; avgB /= count;
  const skinTone = (avgR + avgG + avgB) / 3;

  // Estimate line contrast & depth (temporary simulation)
  const clarity = Math.random() * 0.2 + 0.8;
  const intensity = 1 - Math.abs(0.5 - (skinTone / 255));
  const splitChance = Math.random() > 0.6;

  return {
    life: { strength: clarity, curve: "broad" },
    head: { depth: clarity * 0.9, angle: 12 },
    heart: { clarity, length: 0.75 },
    fate: { split: splitChance, intensity },
  };
}
