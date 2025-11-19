// 🕉️ Sathyadarshana • THE SEED Palmistry Engine • Line Extractor V2
// Life, Head, Heart & Fate Lines + Line Strength Mapping

export function extractPalmLines(canvasElement) {
  const ctx = canvasElement.getContext("2d");
  const w = canvasElement.width;
  const h = canvasElement.height;

  // 1. Read image pixels
  const frame = ctx.getImageData(0, 0, w, h);
  const data = frame.data;

  // 2. Convert to grayscale for line detection
  let gray = [];
  for (let i = 0; i < data.length; i += 4) {
    let g = (data[i] + data[i+1] + data[i+2]) / 3;
    gray.push(g);
  }

  // 3. Sobel edge detection (detects line energy)
  function sobelEdge(x, y) {
    const idx = y * w + x;

    const gx =
      -1*gray[idx-w-1] + 1*gray[idx-w+1] +
      -2*gray[idx-1]     + 2*gray[idx+1] +
      -1*gray[idx+w-1]   + 1*gray[idx+w+1];

    const gy =
       1*gray[idx-w-1] + 2*gray[idx-w] + 1*gray[idx-w+1] +
      -1*gray[idx+w-1] - 2*gray[idx+w] - 1*gray[idx+w+1];

    return Math.sqrt(gx*gx + gy*gy);
  }

  // 4. Scan palm area for strong line patterns
  let scanEnergy = Array(w * h).fill(0);

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let edge = sobelEdge(x, y);
      scanEnergy[y * w + x] = edge;
    }
  }

  // 5. Define anatomical zones for line separation
  const zones = {
    life:  { y1: h*0.45, y2: h*0.95, x1: w*0.10, x2: w*0.45 },
    head:  { y1: h*0.35, y2: h*0.55, x1: w*0.15, x2: w*0.85 },
    heart: { y1: h*0.18, y2: h*0.38, x1: w*0.18, x2: w*0.85 },
    fate:  { y1: h*0.20, y2: h*0.95, x1: w*0.48, x2: w*0.60 }
  };

  function zoneStrength(zone) {
    let total = 0;
    let count = 0;
    for (let y = zone.y1; y < zone.y2; y++) {
      for (let x = zone.x1; x < zone.x2; x++) {
        let idx = Math.floor(y) * w + Math.floor(x);
        total += scanEnergy[idx];
        count++;
      }
    }
    return total / count;
  }

  // 6. Calculate strengths
  const lifeStrength  = zoneStrength(zones.life);
  const headStrength  = zoneStrength(zones.head);
  const heartStrength = zoneStrength(zones.heart);
  const fateStrength  = zoneStrength(zones.fate);

  // 7. Normalize values 0.00 – 1.00
  function normalize(v) {
    return Math.min(1, parseFloat((v / 255).toFixed(3)));
  }

  return {
    lines: {
      life:  normalize(lifeStrength),
      head:  normalize(headStrength),
      heart: normalize(heartStrength),
      fate:  normalize(fateStrength)
    },
    status: "Palm lines extracted successfully"
  };
}
