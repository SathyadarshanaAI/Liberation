// js/edgeLines.js — Real Palm Glow Overlay (V3.0)
// Requires: opencv.js loaded in index.html before this script

export async function drawPalmEdges(canvas) {
  if (typeof cv === "undefined") {
    console.error("⚠️ OpenCV.js not loaded!");
    return;
  }

  const ctx = canvas.getContext("2d");
  const src = cv.imread(canvas);
  let gray = new cv.Mat();
  let edges = new cv.Mat();

  try {
    // === STEP 1: Convert to Grayscale ===
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

    // === STEP 2: Gaussian Blur (reduce noise) ===
    cv.GaussianBlur(gray, gray, new cv.Size(5, 5), 1.5, 1.5);

    // === STEP 3: Edge Detection (Canny) ===
    cv.Canny(gray, edges, 60, 150);

    // === STEP 4: Create glow effect ===
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = canvas.width;
    glowCanvas.height = canvas.height;
    const gctx = glowCanvas.getContext("2d");

    const imageData = gctx.createImageData(edges.cols, edges.rows);
    const dst = imageData.data;

    for (let i = 0; i < edges.data.length; i++) {
      const v = edges.data[i];
      const idx = i * 4;
      if (v > 50) {
        // Golden Glow Tone (soft + vivid)
        dst[idx] = 255;     // R
        dst[idx + 1] = 215; // G
        dst[idx + 2] = 0;   // B
        dst[idx + 3] = 180; // Alpha
      }
    }

    gctx.putImageData(imageData, 0, 0);

    // === STEP 5: Apply Blur + Screen Blend ===
    gctx.globalCompositeOperation = "screen";
    gctx.shadowBlur = 10;
    gctx.shadowColor = "rgba(255, 220, 100, 0.9)";
    gctx.drawImage(glowCanvas, 0, 0);

    // === STEP 6: Animate Pulse ===
    animateGlow(canvas, gctx);

  } catch (err) {
    console.error("❌ Glow rendering failed:", err);
  } finally {
    src.delete(); gray.delete(); edges.delete();
  }
}

// === Animated Glow Transition ===
function animateGlow(canvas, ctx) {
  let glow = 0;
  function loop() {
    glow = (glow + 0.03) % Math.PI;
    const alpha = 0.5 + Math.sin(glow) * 0.25;

    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "lighter";
    ctx.drawImage(canvas, 0, 0);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
