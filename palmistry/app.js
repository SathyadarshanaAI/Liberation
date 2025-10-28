import { analyzePalm } from "./analyzer.js";
import { generateMiniReport } from "./report.js";
import { speak } from "./voice.js";

async function captureAndAnalyze(side) {
  if (isLocked[side]) return;
  isLocked[side] = true;

  const v = vids[side];
  const c = document.createElement("canvas");
  c.width = v.videoWidth; c.height = v.videoHeight;
  const ctx = c.getContext("2d");
  ctx.drawImage(v, 0, 0, c.width, c.height);

  animateBeam(c.height);

  // 🎯 analyze light & shadow
  const scan = analyzePalm(c);

  // 🪞 Stop cam like shutter
  stream.getTracks().forEach(t => t.stop());
  v.srcObject = null;

  const img = c.toDataURL("image/png");
  const mini = await generateMiniReport(img, side);
  const msg = `<b>${side.toUpperCase()} Hand Scan</b><br>${scan.summary}<br>${scan.mood}<hr>${mini}`;

  reportBox.innerHTML = `<img src="${img}" width="160" style="border-radius:8px;margin:8px;"><br>${msg}`;
  speak(scan.mood, window.currentLang);
}
