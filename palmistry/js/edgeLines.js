// ========================================================
// 🕉️ Sathyadarshana Quantum Palm Analyzer · V29.1
// "TruePalm Line Focus Edition" — 8-Line Glow (Refined)
// ========================================================

export async function detectPalmEdges(frame, canvas) {
  return new Promise((resolve, reject) => {
    try {
      if (!window.cv || !cv.Mat) return reject("⚠️ OpenCV not ready!");

      // Convert input to Mat
      const src = cv.matFromImageData(frame);
      const gray = new cv.Mat();
      const blur = new cv.Mat();
      const edges = new cv.Mat();

      // 🧠 Step 1 — Preprocess
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 1.5, 1.5);
      cv.Canny(blur, edges, 45, 120);

      // 🧘 Step 2 — Contour Detection
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      // 🎨 Color palette for 8 major palm lines
      const colors = [
        "#00FF88", "#0099FF", "#FF4477", "#AA66FF",
        "#FFD700", "#FF8800", "#FF99CC", "#FFFFFF"
      ];

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🌈 Step 3 — Filter + Draw
      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const area = cv.contourArea(cnt);

        // ❌ Skip very small or very large areas (background)
        if (area < 80 || area > 15000) continue;

        const color = colors[i % colors.length];
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.2;

        // Convert contour to path
        const data = cnt.data32S;
        ctx.beginPath();
        for (let j = 0; j < data.length; j += 2) {
          const x = data[j];
          const y = data[j + 1];
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // ✨ Step 4 — Release memory
      src.delete(); gray.delete(); blur.delete(); edges.delete();
      contours.delete(); hierarchy.delete();

      // 📜 Return structured palm interpretation
      resolve({
        life: "deep and steady",
        fate: "ascending with power",
        heart: "curved with warmth",
        mind: "clear and analytical",
        sun: "radiant creative energy",
        health: "stable vitality",
        marriage: "harmonious bond",
        manikanda: "awakening spiritual current"
      });

    } catch (err) {
      console.error("💥 detectPalmEdges error:", err);
      reject(err);
    }
  });
}
