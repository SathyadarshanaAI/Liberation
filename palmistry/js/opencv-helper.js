// 🧠 Sathyadarshana OpenCV Helper — V19.0 True Line Bezier Analyzer Edition
// Purpose: Detect true palm line curvature using Bezier path tracing

export async function detectPalmLines(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const edges = new cv.Mat();

  try {
    // 1️⃣ Convert to grayscale and reduce noise
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 1.4, 1.4, cv.BORDER_DEFAULT);

    // 2️⃣ Detect edges
    cv.Canny(blur, edges, 50, 130, 3, false);

    // 3️⃣ Find contours (potential palm lines)
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // 4️⃣ Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow(canvas, src);

    // 5️⃣ Draw filtered contours as smooth Bezier curves
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(0,255,255,0.6)";
    ctx.globalAlpha = 0.85;

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      if (cv.arcLength(cnt, false) < 80) continue; // ignore short noise lines

      const points = [];
      for (let j = 0; j < cnt.data32S.length; j += 2) {
        points.push({ x: cnt.data32S[j], y: cnt.data32S[j + 1] });
      }

      // Convert points to smooth Bezier curve
      if (points.length > 3) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let k = 1; k < points.length - 2; k++) {
          const xc = (points[k].x + points[k + 1].x) / 2;
          const yc = (points[k].y + points[k + 1].y) / 2;
          ctx.quadraticCurveTo(points[k].x, points[k].y, xc, yc);
        }

        // Finish curve
        const last = points.length - 1;
        ctx.quadraticCurveTo(
          points[last - 1].x,
          points[last - 1].y,
          points[last].x,
          points[last].y
        );

        // Dynamic color based on length
        const hue = 40 + Math.min(points.length * 0.3, 200);
        ctx.strokeStyle = `hsl(${hue}, 100%, 60%)`;
        ctx.stroke();
      }
    }

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    console.log("✅ True Line Bezier Palm tracing complete.");
  } catch (err) {
    console.error("⚠️ OpenCV Bezier tracing error:", err);
  } finally {
    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
  }
}
