// 🕉️ edgeLines.js – Serenity + Neural Integration
import { estimatePalmRegion } from "./brain.js";

export async function detectPalmEdges(frame, canvas) {
  const ctx = canvas.getContext("2d");
  const mat = cv.matFromImageData(frame);
  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, gray, new cv.Size(3, 3), 0);

  const mask = new cv.Mat();
  cv.adaptiveThreshold(gray, mask, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 25, 10);

  const edges = new cv.Mat();
  cv.Canny(gray, edges, 70, 150);

  // AI filtering (remove background edges)
  const regionType = estimatePalmRegion(frame);
  if (regionType === "background") {
    ctx.fillStyle = "#f2f2f2"; // calm white-gray
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#777";
    ctx.font = "bold 14px Segoe UI";
    ctx.fillText("⚪ Adjust camera closer to palm", 10, 30);
    return { serenity: true, palmDetected: false };
  }

  const cleanEdges = new cv.Mat();
  cv.bitwise_and(edges, mask, cleanEdges);

  // serene white-gray background
  ctx.fillStyle = "#f0f1f3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // draw only hand lines (soft blue)
  const colorEdges = new cv.Mat();
  cv.cvtColor(cleanEdges, colorEdges, cv.COLOR_GRAY2BGR, 0);
  const blue = new cv.Scalar(0, 128, 255, 255);
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(cleanEdges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  for (let i = 0; i < contours.size(); ++i) {
    cv.drawContours(colorEdges, contours, i, blue, 1, cv.LINE_8, hierarchy, 0);
  }

  cv.imshow(canvas, colorEdges);
  ctx.font = "bold 14px Segoe UI";
  ctx.fillStyle = "#6a7a91";
  ctx.fillText("Palm Serenity View", 10, 20);

  mat.delete(); gray.delete(); edges.delete(); mask.delete();
  cleanEdges.delete(); colorEdges.delete(); contours.delete(); hierarchy.delete();

  return { serenity: true, palmDetected: true };
}
