/* ============================================================
   🖐️ HAND MASK ENGINE · THE SEED V240
   AI Box → Mask Fit → Palm ROI Extract
============================================================ */

export function applyHandMask(ctx, maskImg, box) {

    const { minX, minY, width, height } = box;

    // Keep perfect proportions (avoid stretching)
    const maskRatio = maskImg.height / maskImg.width;
    const newH = width * maskRatio;

    ctx.globalAlpha = 0.75;      // slight transparency
    ctx.drawImage(maskImg, minX, minY, width, newH);
    ctx.globalAlpha = 1.0;
}

export function extractPalmROI(pixels, box) {
    const { minX, minY, width, height } = box;

    const cropCanvas = document.createElement("canvas");
    cropCanvas.width = width;
    cropCanvas.height = height;

    const cropCtx = cropCanvas.getContext("2d");

    cropCtx.putImageData(pixels, -minX, -minY);

    return cropCanvas;
}
