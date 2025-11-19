// 🕉️ THE SEED • Mount Analyzer · V120
// Ultra-stable mount scanner using palm geometry + brightness gradients

export function analyzeMounts(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;

  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;

  // Brightness map
  let bright = new Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      bright[y * w + x] = (data[idx] + data[idx+1] + data[idx+2]) / 3;
    }
  }

  function zone(x1, y1, x2, y2) {
    let sum = 0;
    let count = 0;

    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        const idx = y * w + x;
        sum += bright[idx];
        count++;
      }
    }

    let avg = count ? (255 - (sum / count)) / 255 : 0;
    return parseFloat(avg.toFixed(3));
  }

  // Palm Mount Regions
  const mounts = {
    jupiter:      zone(w*0.25, h*0.05, w*0.45, h*0.20), // index finger base
    saturn:       zone(w*0.45, h*0.05, w*0.55, h*0.20), // middle finger base
    apollo:       zone(w*0.55, h*0.05, w*0.75, h*0.20), // ring finger base
    mercury:      zone(w*0.75, h*0.10, w*0.95, h*0.30), // small finger base
    mars_upper:   zone(w*0.15, h*0.20, w*0.35, h*0.45), // between thumb + index
    mars_lower:   zone(w*0.05, h*0.45, w*0.25, h*0.75), // inside base area
    venus:        zone(w*0.05, h*0.65, w*0.35, h*0.95), // thumb pad
    moon:         zone(w*0.65, h*0.60, w*0.95, h*0.95)  // lower outer palm
  };

  function interpretMount(v) {
    if (v < 0.12) return "Very low or blocked";
    if (v < 0.30) return "Weak, faint, inconsistent";
    if (v < 0.55) return "Moderate and steady";
    if (v < 0.75) return "Strong, stable, clearly expressed";
    return "Very strong, highly active";
  }

  const interpreted = {};
  for (let m in mounts) {
    interpreted[m] = {
      level: mounts[m],
      meaning: interpretMount(mounts[m])
    };
  }

  return { mounts: interpreted, status: "Mounts analyzed" };
}
