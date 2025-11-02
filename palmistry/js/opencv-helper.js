// 🕉️ Sathyadarshana OpenCV Helper — V19.1 Divine Halo Bezier Analyzer Edition
// ✨ Realistic glowing palm lines using Bezier path + aura halo effect

export async function analyzeEdges(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const src = cv.imread(canvas);
  const gray = new cv.Mat();
  const blur = new cv.Mat();
  const edges = new cv.Mat();

  try {
    // 🔹 Convert to grayscale + smooth noise
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 1.2, 1.2, cv.BORDER_DEFAULT);

    // 🔹 Edge detect
    cv.Canny(blur, edges, 45, 120, 3, false);

    // 🔹 Find contours (palm line structures)
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    // 🔹 Reset canvas + redraw base hand
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cv.imshow(canvas, src);

    // 🌕 Golden Aura Setup
    ctx.shadowColor = "rgba(255,215,0,0.7)";
    ctx.shadowBlur = 20;
    ctx.globalAlpha = 0.9;

    for (let i = 0; i < contours.size(); i++) {
      const cnt = contours.get(i);
      if (cv.arcLength(cnt, false) < 100) continue; // ignore short noise

      const points = [];
      for (let j = 0; j < cnt.data32S.length; j += 2) {
        points.push({ x: cnt.data32S[j], y: cnt.data32S[j + 1] });
      }

      if (points.length > 3) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        // Smooth Bezier line
        for (let k = 1; k < points.length - 2; k++) {
          const xc = (points[k].x + points[k + 1].x) / 2;
          const yc = (points[k].y + points[k + 1].y) / 2;
          ctx.quadraticCurveTo(points[k].x, points[k].y, xc, yc);
        }

        const last = points.length - 1;
        ctx.quadraticCurveTo(
          points[last - 1].x,
          points[last - 1].y,
          points[last].x,
          points[last].y
        );

        // Divine color shift – blends between cyan & gold dynamically
        const hue = 40 + Math.min(points.length * 0.4, 180);
        const color = `hsl(${hue},100%,65%)`;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // 🌟 Extra Halo Pulse
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          0,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width / 2
        );
        grad.addColorStop(0, "rgba(255,255,200,0.1)");
        grad.addColorStop(1, "rgba(255,255,0,0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    console.log("✅ Divine Halo Bezier analysis complete!");
  } catch (err) {
    console.error("⚠️ OpenCV analysis error:", err);
  } finally {
    src.delete();
    gray.delete();
    blur.delete();
    edges.delete();
  }
}
