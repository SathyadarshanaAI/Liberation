/* ================================================================
   🖐️ THE SEED Palmistry AI · V230.6
   HAND MASK ENGINE — Left/Right PNG Overlay + AI BOX Crop
================================================================ */

/**
 * Apply hand mask overlay inside AI box
 * @param {CanvasRenderingContext2D} ctx - palmCanvas context
 * @param {Object} box - AI bounding box {minX, minY, width, height}
 * @param {HTMLImageElement} leftMask
 * @param {HTMLImageElement} rightMask
 */
export function applyHandMask(ctx, box, leftMask, rightMask) {

    if (!box || !ctx) return;

    // Detect selected hand
    const selected = document.getElementById("handPref")?.value || "Left Hand";

    let maskImg =
        selected.includes("Left") ? leftMask :
        selected.includes("Right") ? rightMask : leftMask;

    if (!maskImg) return;

    // Smooth edges
    ctx.imageSmoothingEnabled = true;

    // DRAW the PNG mask INSIDE AI bounding box
    ctx.drawImage(
        maskImg,
        box.minX,
        box.minY,
        box.width,
        box.height
    );

    // Make box more visible
    ctx.strokeStyle = "#ffd700";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.minX, box.minY, box.width, box.height);
}
