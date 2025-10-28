// 🧠 analyzer.js — Real Sensor Logic (V13.1)
export function analyzePalm(canvas) {
  const ctx = canvas.getContext("2d");
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = data.data;
  let light = 0, dark = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const brightness = (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3;
    if (brightness > 180) light++;
    else dark++;
  }

  const ratio = light / (light + dark);
  const contrast = Math.abs(light - dark) / (light + dark);

  let mood = "";
  if (ratio > 0.65) mood = "Enlightened, soft-hearted, peaceful spirit.";
  else if (ratio > 0.45) mood = "Balanced thinker with emotional depth.";
  else mood = "Profound seeker — silent, deep, and intense energy.";

  return {
    ratio: ratio.toFixed(2),
    contrast: contrast.toFixed(2),
    mood,
    summary: `Light Ratio: ${Math.round(ratio * 100)}%, 
              Contrast: ${Math.round(contrast * 100)}%`
  };
}
