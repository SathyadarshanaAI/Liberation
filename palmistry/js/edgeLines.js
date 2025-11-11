// 🔮 Sathyadarshana Divyajnana Insight Analyzer – V29.0 (Preview Build)
export async function detectPalmEdges(frame, canvas) {
  const ctx = canvas.getContext("2d");
  const mat = cv.matFromImageData(frame);
  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, gray, new cv.Size(3, 3), 0);

  const edges = new cv.Mat();
  cv.Canny(gray, edges, 70, 160);

  const colorMat = new cv.Mat();
  cv.applyColorMap(edges, colorMat, cv.COLORMAP_JET); // 🌡️ Heat color overlay

  // Detect intensity (Energy zones)
  let total = 0, strong = 0;
  for (let i = 0; i < edges.rows; i += 5) {
    for (let j = 0; j < edges.cols; j += 5) {
      const val = edges.ucharPtr(i, j)[0];
      total++;
      if (val > 150) strong++;
    }
  }
  const energyRatio = (strong / total).toFixed(2);
  const intensity = energyRatio > 0.15 ? "high" : "low";

  cv.imshow(canvas, colorMat);

  // Label
  ctx.font = "bold 14px Segoe UI";
  ctx.fillStyle = "#FFD700";
  ctx.fillText(`Energy Flow: ${intensity}`, 10, 20);

  mat.delete(); gray.delete(); edges.delete(); colorMat.delete();
  return { intensity, energyRatio };
}
