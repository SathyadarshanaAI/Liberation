/* ============================================================
   TRUE LINES BRIDGE · V100
   Extract 8 Palm Lines from Mask (Life, Head, Heart, Fate etc.)
   ============================================================ */

export function extractTrueLines(palmMask) {

    const { width, height, mask } = palmMask;

    function getLineStrength(xFactor, yFactor) {
        let sum = 0, count = 0;

        for (let y = 0; y < height; y++) {
            let x = Math.floor(width * xFactor);

            let pos = y * width + x;

            sum += mask[pos];
            count++;
        }

        return (sum / (count * 255)).toFixed(3);
    }

    return {
        life: getLineStrength(0.35, 0.65),
        head: getLineStrength(0.45, 0.50),
        heart: getLineStrength(0.55, 0.40),
        fate: getLineStrength(0.50, 0.15),
        sun: getLineStrength(0.70, 0.20),
        mercury: getLineStrength(0.80, 0.30),
        mars: getLineStrength(0.25, 0.75),
        jupiter: getLineStrength(0.40, 0.10)
    };
}
