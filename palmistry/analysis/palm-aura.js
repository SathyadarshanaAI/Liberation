// 🕉️ Sathyadarshana • THE SEED Palmistry Engine
// Quantum Aura Scanner V1.0

export function scanAura(canvasElement) {
  const ctx = canvasElement.getContext("2d");
  const w = canvasElement.width;
  const h = canvasElement.height;

  const frame = ctx.getImageData(0, 0, w, h);
  const data = frame.data;

  // --- 1. Extract brightness map (Aura Base) ---
  let brightnessMap = [];
  for (let i = 0; i < data.length; i += 4) {
    let b = (data[i] + data[i+1] + data[i+2]) / 3;
    brightnessMap.push(b);
  }

  // --- 2. Aura Edge Glow detection (radiation) ---
  function localRadiation(index) {
    let sum = 0;
    let count = 0;

    const neighbors = [ -1, 1, -w, w, -w-1, -w+1, w-1, w+1 ];

    neighbors.forEach(n => {
      let idx = index + n;
      if (idx > 0 && idx < brightnessMap.length) {
        sum += Math.abs(brightnessMap[idx] - brightnessMap[index]);
        count++;
      }
    });

    return sum / count;
  }

  let radiationLevels = [];
  for (let i = 0; i < brightnessMap.length; i++) {
    radiationLevels.push(localRadiation(i));
  }

  // --- 3. Aura zones (upper, middle, lower palm) ---
  function zoneAvg(x1, y1, x2, y2) {
    let total = 0;
    let count = 0;

    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        let idx = y * w + x;
        total += radiationLevels[idx];
        count++;
      }
    }

    return total / count;
  }

  const zones = {
    upper:  zoneAvg(w*0.10, h*0.05, w*0.90, h*0.30),
    middle: zoneAvg(w*0.10, h*0.30, w*0.90, h*0.60),
    lower:  zoneAvg(w*0.10, h*0.60, w*0.90, h*0.95)
  };

  // --- 4. Normalize 0.00 – 1.00 ---
  function norm(v) {
    return parseFloat(Math.min(1, (v/180).toFixed(3)));
  }

  return {
    aura: {
      upper:  norm(zones.upper),   // Emotional Aura
      middle: norm(zones.middle),  // Mental Aura
      lower:  norm(zones.lower)    // Root-Life Aura
    },
    status: "Aura energy field scanned"
  };
}
