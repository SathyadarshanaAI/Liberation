// ============================================================
// 🕉️ Sathyadarshana Quantum Palm Analyzer · V29.3
// "Eightfold Glow + Hand Outline" — Hybrid Precision Edition
// ============================================================

export async function detectPalmEdges(frame, canvas) {
  return new Promise((resolve, reject) => {
    try {
      if (!window.cv || !cv.Mat)
        return reject("⚠️ OpenCV not ready!");

      // Convert frame to OpenCV Mat
      const src = cv.matFromImageData(frame);
      const gray = new cv.Mat();
      const blur = new cv.Mat();
      const edges = new cv.Mat();

      // 🎯 Step 1: Convert & preprocess
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
      cv.GaussianBlur(gray, blur, new cv.Size(5, 5), 1.5, 1.5);
      cv.Canny(blur, edges, 40, 120);

      // 🌈 Step 2: Find contours
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🔥 8 Palm Line Glow Colors
      const glowColors = [
        "#00FF88", "#0099FF", "#FF4477", "#AA66FF",
        "#FFD700", "#FF8800", "#FF99CC", "#FFFFFF"
      ];

      // 🎨 Step 3: Detect and draw lines
      let outlineColor = "#00FFFF"; // outer palm glow color

      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const area = cv.contourArea(cnt);

        // 🪶 Skip too small specks
        if (area < 60) continue;

        const data = cnt.data32S;

        // ✋ If very large contour -> outer hand outline
        if (area > 15000) {
          ctx.shadowColor = outlineColor;
          ctx.shadowBlur = 20;
          ctx.strokeStyle = outlineColor;
          ctx.lineWidth = 3;
        } else {
          const color = glowColors[i % glowColors.length];
          ctx.shadowColor = color;
          ctx.shadowBlur = 10;
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.4;
        }

        // Draw path
        ctx.beginPath();
        for (let j = 0; j < data.length; j += 2) {
          const x = data[j];
          const y = data[j + 1];
          if (j === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }

      // 🧘 Cleanup
      src.delete(); gray.delete(); blur.delete(); edges.delete();
      contours.delete(); hierarchy.delete();

      // 📜 AI Palm Report
      resolve({
        life: "deep and radiant",
        fate: "ascending path with energy",
        heart: "warm and compassionate",
        mind: "focused and steady",
        sun: "creative brilliance",
        health: "vital and stable",
        marriage: "balanced harmony",
        manikanda: "spiritual awakening",
        outline: "protective aura strong"
      });

    } catch (err) {
      console.error("💥 detectPalmEdges error:", err);
      reject(err);
    }
  });
}
