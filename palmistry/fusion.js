import { speak } from "./voice.js";

export async function analyzePalm(imgData, side) {
  console.log(`✨ Analyzing ${side} hand...`);
  const overlay = document.createElement("canvas");
  overlay.width = 320; overlay.height = 240;
  const ctx = overlay.getContext("2d");
  const img = new Image();
  img.src = imgData;
  await new Promise(r => img.onload = r);
  ctx.drawImage(img, 0, 0);
  const gradient = ctx.createLinearGradient(0,0,320,240);
  gradient.addColorStop(0,"#00e5ff55");
  gradient.addColorStop(1,"#ff00ff33");
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  for(let i=0;i<5;i++){
    ctx.beginPath();
    ctx.moveTo(20+i*50,220);
    ctx.bezierCurveTo(80+i*40,120,180+i*30,100,300,30+i*15);
    ctx.stroke();
  }
  console.log(`💫 Glow overlay rendered for ${side} hand`);

  const report = `
  <h3>🪷 ${side.toUpperCase()} HAND REPORT</h3>
  <p>The ${side} hand reveals harmony between <b>intuition</b> and <b>logic</b>. 
  The life line shows stability, vitality, and endurance. 
  The heart line indicates emotional clarity, while the head line reflects analytical wisdom.</p>
  <p><b>Summary:</b> A balanced, insightful, and spiritually awakened nature.</p>
  `;
  speak(`Your ${side} hand shows balance, clarity and calm energy.`, window.currentLang);
  return report;
}
