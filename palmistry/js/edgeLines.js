export async function detectPalmEdges(frame, canvas) {
  const mat = cv.matFromImageData(frame);
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const adaptive = new cv.Mat();
  const morph = new cv.Mat();
  const edges = new cv.Mat();

  // 1️⃣ Convert to grayscale + smooth
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);

  // 2️⃣ Adaptive threshold to highlight palm lines
  cv.adaptiveThreshold(blur, adaptive, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY_INV, 25, 5);

  // 3️⃣ Morphology to clean background & keep fine lines
  const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(2, 2));
  cv.erode(adaptive, morph, kernel);
  cv.dilate(morph, morph, kernel);

  // 4️⃣ Canny detection (reduced thresholds)
  cv.Canny(morph, edges, 40, 100);

  // 5️⃣ Remove outer contour (non-hand area)
  const contours = new cv.MatVector();
  const hierarchy = new cv.Mat();
  cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  for (let i = 0; i < contours.size(); ++i) {
    const area = cv.contourArea(contours.get(i));
    if (area > 40000) {
      cv.drawContours(edges, contours, i, new cv.Scalar(0, 0, 0, 255), -1);
    }
  }

  // 6️⃣ Draw to canvas with soft neon
  const colorEdges = new cv.Mat();
  cv.cvtColor(edges, colorEdges, cv.COLOR_GRAY2RGBA);
  const ctx = canvas.getContext("2d");
  const imgData = new ImageData(new Uint8ClampedArray(colorEdges.data), canvas.width, canvas.height);
  ctx.putImageData(imgData, 0, 0);

  mat.delete(); gray.delete(); blur.delete(); adaptive.delete(); morph.delete();
  edges.delete(); contours.delete(); hierarchy.delete(); colorEdges.delete();

  return imgData;
}
