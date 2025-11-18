/* =====================================================
   THE SEED · Palmistry AI · Palm Detector · V70
   ===================================================== */

export async function detectPalm(imageData) {

    // Simple brightness mask to isolate hand
    const w = imageData.width;
    const h = imageData.height;
    const d = imageData.data;

    let mask = new Uint8ClampedArray(w * h);

    for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        const bright = (r + g + b) / 3;

        mask[i / 4] = bright > 90 ? 255 : 0;
    }

    return {
        width: w,
        height: h,
        mask: mask
    };
}
