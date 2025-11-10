// 🪷 Highlight true palm lines
cv.Canny(blur, edges, 30, 120);
let contours = new cv.MatVector();
let hierarchy = new cv.Mat();
cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

let color = new cv.Scalar(0, 255, 255, 255); // yellow glow
for (let i = 0; i < contours.size(); i++) {
  cv.drawContours(edges, contours, i, color, 1);
}

// Convert to RGB overlay
cv.cvtColor(edges, edges, cv.COLOR_GRAY2RGBA);
cv.imshow(canvas, edges);
