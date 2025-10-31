function capture(side) {
  const vid = document.getElementById(side === "left" ? "vidLeft" : "vidRight");
  const cvs = document.getElementById(side === "left" ? "canvasLeft" : "canvasRight");
  const ctx = cvs.getContext("2d");
  ctx.drawImage(vid, 0, 0, cvs.width, cvs.height);

  animateBeam(cvs);

  // After 2 seconds, fade the canvas to black
  setTimeout(() => {
    cvs.style.transition = "filter 1.5s ease";
    cvs.style.filter = "brightness(0%)"; // fade effect
  }, 1800);

  // Generate report with small delay
  setTimeout(() => {
    generateReport(side);
  }, 2200);
}

function animateBeam(canvas) {
  const beam = document.createElement("div");
  beam.className = "beam";
  beam.style.position = "absolute";
  beam.style.left = "0";
  beam.style.width = "100%";
  beam.style.height = "4px";
  beam.style.background = "linear-gradient(90deg, #FFD700, #00e5ff, #16f0a7)";
  beam.style.top = "0";
  beam.style.animation = "scan 2s linear infinite";
  beam.style.borderRadius = "4px";
  canvas.parentElement.style.position = "relative";
  canvas.parentElement.appendChild(beam);
  setTimeout(() => beam.remove(), 2000);
}
