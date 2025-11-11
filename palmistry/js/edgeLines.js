// 🧠 Sathyadarshana Quantum Palm Analyzer – V28.5 ColorMap Analyzer Edition
// Detects palm edges, applies color segmentation for key lines (Life, Heart, Fate)

export async function detectPalmEdges(frame, canvas) {
  const ctx = canvas.getContext("2d");
  const mat = cv.matFromImageData(frame);

  // --- Convert to gray ---
  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, gray, new cv.Size(3, 3), 0);

  // --- Detect edges ---
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 70, 160);

  // --- Create colored canvas ---
  const colorMat = new cv.Mat();
  cv.cvtColor(edges, colorMat, cv.COLOR_GRAY2BGR, 0);

  // --- Simulated palm line zones ---
  const height = canvas.height;
  const width = canvas.width;

  // Life line → lower-left curve region
  const lifeMask = new cv.Mat.zeros(height, width, cv.CV_8UC3);
  cv.rectangle(lifeMask, new cv.Point(20, height * 0.6), new cv.Point(width / 2, height), [0, 0, 255, 255], -1);

  // Heart line → upper part
  const heartMask = new cv.Mat.zeros(height, width, cv.CV_8UC3);
  cv.rectangle(heartMask, new cv.Point(0, 0), new cv.Point(width, height * 0.4), [0, 255, 0, 255], -1);

  // Fate line → center vertical band
  const fateMask = new cv.Mat.zeros(height, width, cv.CV_8UC3);
  cv.rectangle(fateMask, new cv.Point(width * 0.45, 0), new cv.Point(width * 0.55, height), [255, 0, 0, 255], -1);

  // Apply color overlay (Life = red, Heart = green, Fate = blue)
  const colorResult = new cv.Mat();
  cv.addWeighted(colorMat, 1, lifeMask, 0.4, 0, colorResult);
  cv.addWeighted(colorResult, 1, heartMask, 0.4, 0, colorResult);
  cv.addWeighted(colorResult, 1, fateMask, 0.4, 0, colorResult);

  // Display final result
  cv.imshow(canvas, colorResult);

  // --- Label Texts ---
  ctx.font = "bold 14px Segoe UI";
  ctx.fillStyle = "#FF4D4D";
  ctx.fillText("Life Line", 25, height * 0.9);
  ctx.fillStyle = "#4DFF4D";
  ctx.fillText("Heart Line", 30, height * 0.1 + 20);
  ctx.fillStyle = "#4DB8FF";
  ctx.fillText("Fate Line", width / 2 - 20, height / 2);

  // --- Cleanup ---
  mat.delete(); gray.delete(); edges.delete();
  colorMat.delete(); colorResult.delete();
  lifeMask.delete(); heartMask.delete(); fateMask.delete();
}
