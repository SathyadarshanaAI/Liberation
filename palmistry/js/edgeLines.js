export async function detectPalmEdges(frame, canvas) {
  return new Promise((resolve, reject) => {
    try {
      const mat = cv.matFromImageData(frame);
      let gray = new cv.Mat(), blur = new cv.Mat(), edges = new cv.Mat();
      cv.cvtColor(mat, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 0);
      cv.Canny(blur, edges, 40, 150);
      cv.imshow(canvas, edges);
      mat.delete(); gray.delete(); blur.delete(); edges.delete();
      resolve({
        life: "clear and deep",
        heart: "curved with warmth",
        fate: "steady and firm"
      });
    } catch (e) { reject(e); }
  });
}
