import { colorMap } from "./ai-segmentation.js";

export function renderOverlay(overlay, edges, result) {
  overlay.width = edges.width;
  overlay.height = edges.height;
  const ctx = overlay.getContext("2d");
  ctx.putImageData(edges, 0, 0);

  // AI result color bands (symbolic overlay)
  const lines = ["life", "head", "heart", "fate"];
  lines.forEach((ln, i) => {
    const c = colorMap[ln];
    ctx.strokeStyle = c;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const y = overlay.height * (0.3 + i * 0.1);
    ctx.moveTo(overlay.width * 0.2, y);
    ctx.lineTo(overlay.width * 0.8, y);
    ctx.stroke();
  });
}
