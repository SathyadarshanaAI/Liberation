   /* ============================================================
   🖐️ HAND MASK ENGINE – V300
   Converts MediaPipe landmarks → Shape Mask Outline
   ============================================================ */

export function drawHandMask(overlayCtx, landmarks, W, H) {
    if (!landmarks) return;

    overlayCtx.clearRect(0, 0, W, H);

    overlayCtx.strokeStyle = "#00e5ff";
    overlayCtx.lineWidth = 3;
    overlayCtx.shadowColor = "#00ffff";
    overlayCtx.shadowBlur = 15;

    overlayCtx.beginPath();

    // List landmark point order (outline)
    const outlinePoints = [
        0, 1, 2, 3, 4,     // Thumb
        0, 5, 6, 7, 8,     // Index
        9, 10, 11, 12,     // Middle
        13, 14, 15, 16,    // Ring
        17, 18, 19, 20,    // Little
        0                  // Back to base
    ];

    for (let i = 0; i < outlinePoints.length; i++) {
        let lm = landmarks[outlinePoints[i]];
        let x = lm.x * W;
        let y = lm.y * H;
        if (i === 0) overlayCtx.moveTo(x, y);
        else overlayCtx.lineTo(x, y);
    }

    overlayCtx.closePath();
    overlayCtx.stroke();

    // Optional fill
    overlayCtx.globalAlpha = 0.12;
    overlayCtx.fillStyle = "#00e5ff";
    overlayCtx.fill();
    overlayCtx.globalAlpha = 1;
}
