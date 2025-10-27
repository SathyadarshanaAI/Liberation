export async function detectLines(imgData) {
  const img = new Image();
  img.src = imgData;
  await img.decode();

  // 🪞 make a working canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);

  // pixel data
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;

  // 🔍 basic “hand crop” – remove bright background & face
  let minY = canvas.height, maxY = 0, minX = canvas.width, maxX = 0;
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      const brightness = (r + g + b) / 3;
      if (brightness > 50 && brightness < 200) {
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    }
  }

  // ✂️ crop to hand area
  const w = maxX - minX, h = maxY - minY;
  const handCanvas = document.createElement("canvas");
  handCanvas.width = w; handCanvas.height = h;
  const hctx = handCanvas.getContext("2d");
  hctx.drawImage(canvas, minX, minY, w, h, 0, 0, w, h);

  // analyze “hand lines” brightness variation
  const handData = hctx.getImageData(0, 0, w, h).data;
  let variance = 0;
  for (let i = 0; i < handData.length; i += 4) {
    const br = (handData[i] + handData[i+1] + handData[i+2]) / 3;
    variance += Math.abs(br - 128);
  }
  variance /= (w * h);

  // produce simplified pattern map
  return {
    life: { strength: Math.min(1, variance/180), curve: "balanced" },
    head: { depth: 0.8, angle: 10 },
    heart: { clarity: 0.82, length: 0.75 },
    fate: { split: Math.random() > 0.5, intensity: variance/255 }
  };
}
