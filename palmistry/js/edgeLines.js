// 🧠 Advanced Palm Edge Detection (V28.2)
export async function detectPalmEdges(frame, canvas) {
  const mat = cv.matFromImageData(frame);

  // Convert to HSV color space for skin detection
  const hsv = new cv.Mat();
  cv.cvtColor(mat, hsv, cv.COLOR_RGBA2RGB);
  cv.cvtColor(hsv, hsv, cv.COLOR_RGB2HSV);

  // Define skin color range (works for most skin tones)
  const low = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [0, 30, 60, 0]);
  const high = new cv.Mat(hsv.rows, hsv.cols, hsv.type(), [20, 150, 255, 255]);
  const mask = new cv.Mat();
  cv.inRange(hsv, low, high, mask);

  // Morphological operations (clean mask)
  const kernel = cv.Mat.ones(5, 5, cv.CV_8U);
  cv.morphologyEx(mask, mask, cv.MORPH_CLOSE, kernel);
  cv.morphologyEx(mask, mask, cv.MORPH_OPEN, kernel);

  // Apply mask to original
  const skinOnly = new cv.Mat();
  cv.bitwise_and(mat, mat, skinOnly, mask);

  // Convert to gray for edge detection
  const gray = new cv.Mat();
  cv.cvtColor(skinOnly, gray, cv.COLOR_RGBA2GRAY, 0);

  // Slight blur to smooth lines
  cv.GaussianBlur(gray, gray, new cv.Size(3, 3), 0);

  // Detect edges only on palm area
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 70, 150);

  // Show on canvas
  cv.imshow(canvas, edges);

  // Cleanup memory
  mat.delete(); hsv.delete(); gray.delete();
  low.delete(); high.delete(); mask.delete();
  kernel.delete(); skinOnly.delete(); edges.delete();

  return true;
}
