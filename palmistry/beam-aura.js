// ===========================================================
// 🖐️ SATHYADARSHANA QUANTUM PALM ANALYZER · V12.7 Beam Aura Edition
// ===========================================================
// This version works without modules folder or ES6 imports.
// Just add <script src="beam-aura.js"></script> after your main.js
// ===========================================================

window.beamAuraSequence = async function(leftCanvas, rightCanvas) {
  // --- Step 1: Golden Beam Animation ---
  const beam = document.createElement("div");
  beam.style.position = "absolute";
  beam.style.top = "0";
  beam.style.left = "0";
  beam.style.width = "100%";
  beam.style.height = "8px";
  beam.style.background = "linear-gradient(to bottom, rgba(255,215,0,0), rgba(255,215,0,1), rgba(255,215,0,0))";
  beam.style.boxShadow = "0 0 25px 5px gold";
  beam.style.animation = "beamMove 3s linear forwards";
  beam.style.borderRadius = "4px";
  beam.style.pointerEvents = "none";
  leftCanvas.parentElement.appendChild(beam);

  const style = document.createElement("style");
  style.textContent = `
    @keyframes beamMove {
      0% { transform: translateY(0); opacity: 1; }
      100% { transform: translateY(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  await pause(3000);
  beam.remove();

  // --- Step 2: Show both palm photos below ---
  const printZone = document.createElement("div");
  printZone.style.display = "flex";
  printZone.style.justifyContent = "center";
  printZone.style.gap = "20px";
  printZone.style.marginTop = "20px";

  const leftImg = new Image();
  leftImg.src = leftCanvas.toDataURL("image/png");
  const rightImg = new Image();
  rightImg.src = rightCanvas.toDataURL("image/png");

  leftImg.style.width = rightImg.style.width = "160px";
  leftImg.style.border = rightImg.style.border = "2px solid gold";
  leftImg.style.borderRadius = rightImg.style.borderRadius = "12px";

  printZone.appendChild(leftImg);
  printZone.appendChild(rightImg);
  document.body.appendChild(printZone);

  await pause(3000);

  // --- Step 3: Draw main 8 palm lines ---
  drawPalmLines(leftCanvas.getContext("2d"), "#FFD700");
  drawPalmLines(rightCanvas.getContext("2d"), "#FFD700");

  console.log("✨ Beam Aura sequence complete — 8 palm lines rendered.");
};

// === Helper: 8 symbolic lines on each canvas ===
function drawPalmLines(ctx, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  const w = ctx.canvas.width, h = ctx.canvas.height;
  const lines = [
    [[w*0.2,h*0.7],[w*0.8,h*0.5]],   // Life Line
    [[w*0.3,h*0.8],[w*0.7,h*0.6]],   // Fate Line
    [[w*0.2,h*0.4],[w*0.8,h*0.4]],   // Head Line
    [[w*0.3,h*0.3],[w*0.8,h*0.2]],   // Heart Line
    [[w*0.6,h*0.2],[w*0.8,h*0.1]],   // Sun Line
    [[w*0.5,h*0.9],[w*0.6,h*0.7]],   // Health Line
    [[w*0.7,h*0.6],[w*0.9,h*0.7]],   // Marriage Line
    [[w*0.4,h*0.1],[w*0.6,h*0.3]]    // Manikanda Line
  ];
  lines.forEach(([a,b])=>{
    ctx.beginPath();
    ctx.moveTo(...a);
    ctx.lineTo(...b);
    ctx.stroke();
  });
}

// === Small helper for timed delays ===
function pause(ms){ return new Promise(res => setTimeout(res, ms)); }
