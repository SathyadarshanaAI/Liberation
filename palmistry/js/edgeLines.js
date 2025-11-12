export async function detectPalmEdges(frame, canvas) {
  const mat = cv.matFromImageData(frame);
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const edges = new cv.Mat();

  cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY, 0);
  cv.GaussianBlur(gray, blur, new cv.Size(3, 3), 0);
  cv.Canny(blur, edges, 60, 130);

  // Soft natural overlay
  const colorEdges = new cv.Mat();
  cv.cvtColor(edges, colorEdges, cv.COLOR_GRAY2RGBA);
  const ctx = canvas.getContext("2d");
  const imgData = new ImageData(new Uint8ClampedArray(colorEdges.data), canvas.width, canvas.height);
  ctx.putImageData(imgData, 0, 0);

  mat.delete(); gray.delete(); blur.delete(); edges.delete(); colorEdges.delete();
  return imgData;
}
