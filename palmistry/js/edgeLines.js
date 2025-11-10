export function detectPalmEdges(frame, canvas) {
  const mat = cv.matFromImageData(frame);
  const gray = new cv.Mat();
  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  const blur = new cv.Mat();
  cv.GaussianBlur(gray, blur, new cv.Size(3,3), 0);
  const edges = new cv.Mat();
  cv.Canny(blur, edges, 60, 140);

  // Line segment detection
  const lines = new cv.Mat();
  cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 50, 50, 10);

  // Draw color overlay
  const color = new cv.Mat.zeros(edges.rows, edges.cols, cv.CV_8UC3);
  for (let i = 0; i < lines.rows; ++i) {
    let [x1, y1, x2, y2] = lines.intPtr(i);
    cv.line(color, new cv.Point(x1, y1), new cv.Point(x2, y2), [0,255,255,255], 1);
  }

  cv.addWeighted(color, 1, mat, 0.7, 0, mat);
  cv.imshow(canvas, mat);

  mat.delete(); gray.delete(); blur.delete(); edges.delete(); lines.delete(); color.delete();
}
