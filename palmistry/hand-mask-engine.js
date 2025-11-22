/* ================================================================
   HAND MASK ENGINE — V230.7 (Stable)
================================================================ */

export function applyHandMask(ctx, box, maskLeft, maskRight, selectedHand) {

    if (!box) return;

    const { minX, minY, width, height } = box;

    const mask = (selectedHand === "Left") ? maskLeft : maskRight;

    ctx.save();
    ctx.globalAlpha = 0.55;

    ctx.drawImage(mask, minX, minY, width, height);

    ctx.restore();
}
