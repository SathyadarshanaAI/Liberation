export async function detectPalmEdges(frame, canvas) {
  const mat = cv.matFromImageData(frame);
  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  const edges = new cv.Mat();
  cv.Canny(gray, edges, 80, 150);
  cv.imshow(canvas, edges);
  mat.delete();
  gray.delete();
  edges.delete();
  return true;
}
