export async function detectPalmEdges(frame, canvas) {
  const src = cv.matFromImageData(frame);
  let gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.GaussianBlur(gray, gray, new cv.Size(3, 3), 0);
  let edges = new cv.Mat();
  cv.Canny(gray, edges, 50, 120);

  // visualize
  cv.imshow(canvas, edges);

  src.delete(); gray.delete();
  return edges;
}
