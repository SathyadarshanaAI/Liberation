// 🕉️ Sathyadarshana • THE SEED Palmistry Engine
// Mount Analyzer V1.0 – Energy Density Mapping

export function analyzeMounts(canvasElement) {
  const ctx = canvasElement.getContext("2d");
  const w = canvasElement.width;
  const h = canvasElement.height;

  const frame = ctx.getImageData(0, 0, w, h);
  const data = frame.data;

  // Convert to grayscale (for depth energy)
  let gray = [];
  for (let i = 0; i < data.length; i += 4) {
    gray.push((data[i] + data[i+1] + data[i+2]) / 3);
  }

  function zoneEnergy(x1, y1, x2, y2) {
    let total = 0;
    let count = 0;

    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        const idx = y * w + x;
        total += gray[idx];
        count++;
      }
    }
    return total / count;
  }

  // Mount zones (relative to palm anatomy)
  const zones = {
    jupiter: { x1: w*0.15, x2: w*0.35, y1: h*0.10, y2: h*0.28 },
    saturn:  { x1: w*0.40, x2: w*0.60, y1: h*0.10, y2: h*0.28 },
    apollo:  { x1: w*0.65, x2: w*0.85, y1: h*0.10, y2: h*0.28 },
    mercury: { x1: w*0.70, x2: w*0.92, y1: h*0.28, y2: h*0.45 },

    mars_upper: { x1: w*0.10, x2: w*0.30, y1: h*0.30, y2: h*0.50 },
    moon:       { x1: w*0.05, x2: w*0.28, y1: h*0.50, y2: h*0.90 },
    venus:      { x1: w*0.70, x2: w*0.98, y1: h*0.50, y2: h*0.95 },

    mars_lower: { x1: w*0.40, x2: w*0.60, y1: h*0.55, y2: h*0.90 }
  };

  function normalize(v) {
    return Math.min(1, parseFloat((v / 255).toFixed(3)));
  }

  return {
    mounts: {
      jupiter: normalize(zoneEnergy(zones.jupiter.x1, zones.jupiter.y1, zones.jupiter.x2, zones.jupiter.y2)),
      saturn:  normalize(zoneEnergy(zones.saturn.x1,  zones.saturn.y1,  zones.saturn.x2,  zones.saturn.y2)),
      apollo:  normalize(zoneEnergy(zones.apollo.x1,  zones.apollo.y1,  zones.apollo.x2,  zones.apollo.y2)),
      mercury: normalize(zoneEnergy(zones.mercury.x1, zones.mercury.y1, zones.mercury.x2, zones.mercury.y2)),
      mars_upper: normalize(zoneEnergy(zones.mars_upper.x1, zones.mars_upper.y1, zones.mars_upper.x2, zones.mars_upper.y2)),
      moon:       normalize(zoneEnergy(zones.moon.x1,       zones.moon.y1,       zones.moon.x2,       zones.moon.y2)),
      venus:      normalize(zoneEnergy(zones.venus.x1,      zones.venus.y1,      zones.venus.x2,      zones.venus.y2)),
      mars_lower: normalize(zoneEnergy(zones.mars_lower.x1, zones.mars_lower.y1, zones.mars_lower.x2, zones.mars_lower.y2))
    },
    status: "Mount analysis completed"
  };
}
