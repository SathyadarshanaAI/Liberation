/* =====================================================
   THE SEED · True Palm AI · Stage 1 (Safe Module)
   No dependency – Does NOT touch existing system.
   ===================================================== */

export async function detectTrueLines(imageData) {

    try {
        // Convert to grayscale
        const gray = [];
        for (let i = 0; i < imageData.data.length; i += 4) {
            const r = imageData.data[i];
            const g = imageData.data[i + 1];
            const b = imageData.data[i + 2];
            gray.push((r + g + b) / 3);
        }

        // Basic intensity map
        const avg = gray.reduce((a, b) => a + b, 0) / gray.length;

        // Line detection sample (placeholder rules)
        const lifeStrength  = clamp((avg % 0.91), 0.1, 0.9);
        const headClarity  = clamp((avg % 0.73), 0.1, 0.9);
        const heartDepth   = clamp((avg % 0.67), 0.1, 0.9);
        const fatePower    = clamp((avg % 0.52), 0.1, 0.9);

        // Return structure
        return {
            ok: true,
            lines: {
                life: lifeStrength,
                head: headClarity,
                heart: heartDepth,
                fate: fatePower
            }
        };

    } catch (e) {
        return { ok: false, error: e.toString() };
    }
}

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}
