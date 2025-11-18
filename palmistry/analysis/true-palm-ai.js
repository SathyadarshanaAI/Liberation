/* =====================================================
   THE SEED · True Palm AI · Stage 2
   Full 8-Line Reading (Safe Placeholder Engine)
   ===================================================== */

export async function detectTrueLines(imageData) {
    try {
        const gray = [];
        const d = imageData.data;

        for (let i = 0; i < d.length; i += 4) {
            gray.push((d[i] + d[i+1] + d[i+2]) / 3);
        }

        const avg = gray.reduce((a,b)=>a+b,0) / gray.length;

        function calc(seed, min, max) {
            let v = (avg % seed) * 1.37;
            return clamp(v, min, max).toFixed(3);
        }

        return {
            ok: true,
            lines: {
                life:     calc(0.91, 0.10, 0.90),
                head:     calc(0.73, 0.10, 0.90),
                heart:    calc(0.67, 0.10, 0.90),
                fate:     calc(0.52, 0.10, 0.90),
                sun:      calc(0.44, 0.05, 0.85),
                mercury:  calc(0.39, 0.05, 0.85),
                mars:     calc(0.33, 0.05, 0.85),
                jupiter:  calc(0.28, 0.05, 0.85)
            }
        };

    } catch (e) {
        return { ok: false, error: e.toString() };
    }
}

function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
}
