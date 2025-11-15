// render/a4-builder.js
// Simple A4 builder: draws lines and text on a printable canvas, then triggers download

export function buildA4Sheet(lines) {
  // Create canvas sized similar to A4 at 150 dpi for simplicity
  const dpi = 150;
  const widthInch = 8.27; // A4 width (inches) portrait 8.27 x 11.69
  const heightInch = 11.69;
  const w = Math.round(widthInch * dpi);
  const h = Math.round(heightInch * dpi);

  const cvs = document.createElement("canvas");
  cvs.width = w;
  cvs.height = h;
  const ctx = cvs.getContext("2d");

  // Background
  ctx.fillStyle = "#fff";
  ctx.fillRect(0,0,w,h);

  // Title
  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText("THE SEED · Palmistry AI — A4 Report", 40, 60);

  // draw tiny palm sample — a set of lines
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, 140);
  ctx.quadraticCurveTo(200, 220, 160, 420);
  ctx.stroke();

  // lines summary
  ctx.font = "14px Arial";
  let y = 90;
  lines.forEach((l, i) => {
    ctx.fillText(`${i+1}. ${l.name} — confidence ${Math.round((l.confidence||0)*100)}%`, 40, y+40 + i*22);
  });

  // convert to blob and download
  cvs.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palmistry-report.png";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, "image/png", 0.95);
}
