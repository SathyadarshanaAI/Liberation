// 🧠 brain.js – Sathyadarshana Neural Palm Core V29.3
export function estimatePalmRegion(frame) {
  const { data, width, height } = frame;
  let score = 0, count = 0;

  for (let i = 0; i < data.length; i += 4 * 20) { // sample pixels
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const avg = (r + g + b) / 3;
    const hueScore = (r > g && r > b) ? 1 : 0; // reddish tones (skin)
    const brightness = avg > 80 && avg < 210 ? 1 : 0;
    score += hueScore * brightness;
    count++;
  }

  const ratio = score / count;
  return ratio > 0.25 ? "palm" : "background";
}
