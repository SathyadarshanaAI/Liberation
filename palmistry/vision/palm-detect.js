/* ---------------------------------------------------------
   THE SEED · Palmistry AI Vision
   palm-detect.js — Palm Region Detection (v2.0)
----------------------------------------------------------*/

export async function detectPalm(frame) {

    const { width, height, data } = frame;

    // Empty mask for detected palm pixels
    let mask = new Uint8ClampedArray(width * height);

    // Basic skin color thresholds (optimized)
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const avg = (r + g + b) / 3;

        // Skin threshold (broad)
        const isSkin =
            r > 80 && g > 45 && b > 20 &&
            r > g && r > b &&
            avg > 60;

        mask[i / 4] = isSkin ? 255 : 0;
    }

    // Smooth edges
    mask = smoothMask(mask, width, height);

    // Compute bounding box
    const bbox = getBoundingBox(mask, width, height);

    return {
        width,
        height,
        mask,
        bbox
    };
}

/* ---------------------------------------------------------
   SMOOTH MASK — Reduce noise
----------------------------------------------------------*/
function smoothMask(mask, w, h) {
    const sm = new Uint8ClampedArray(mask.length);

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let sum = 0;

            for (let yy = -1; yy <= 1; yy++) {
                for (let xx = -1; xx <= 1; xx++) {
                    sum += mask[(y + yy) * w + (x + xx)] ? 1 : 0;
                }
            }

            sm[y * w + x] = sum >= 5 ? 255 : 0;
        }
    }

    return sm;
}

/* ---------------------------------------------------------
   BOUNDING BOX — Find palm area
----------------------------------------------------------*/
function getBoundingBox(mask, w, h) {
    let minX = w, minY = h, maxX = 0, maxY = 0;

    for (let i = 0; i < mask.length; i++) {
        if (mask[i]) {
            const y = Math.floor(i / w);
            const x = i % w;

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        }
    }

    return { minX, minY, maxX, maxY };
}
