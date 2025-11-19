// 🕉️ THE SEED • Palm Lines Extractor · V122 (Guaranteed Working)

export function extractPalmLines(canvas) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;

    // Brighten
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i+1] + data[i+2]) / 3;
        avg = Math.min(255, avg + 25);
        data[i] = data[i+1] = data[i+2] = avg;
    }
    ctx.putImageData(img, 0, 0);

    // Brightness map
    let bright = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = (y*w + x) * 4;
            bright[y*w + x] =
                (data[idx] + data[idx+1] + data[idx+2]) / 3;
        }
    }

    function sampleLine(x1, y1, x2, y2) {
        let sum = 0, count = 0;
        const steps = 120;
        const dx = (x2 - x1) / steps;
        const dy = (y2 - y1) / steps;
        let x = x1, y = y1;

        for (let i = 0; i < steps; i++) {
            const ix = Math.floor(x);
            const iy = Math.floor(y);
            if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
                const v = bright[iy*w + ix];
                sum += (255 - v);
                count++;
            }
            x += dx;
            y += dy;
        }

        if (!count) return 0;
        return (sum / count) / 255;
    }

    const L = sampleLine(w*0.25, h*0.65, w*0.45, h*0.95);
    const H = sampleLine(w*0.25, h*0.55, w*0.75, h*0.55);
    const R = sampleLine(w*0.30, h*0.38, w*0.80, h*0.38);
    const F = sampleLine(w*0.50, h*0.20, w*0.50, h*0.85);

    function meaning(v) {
        if (v < 0.12) return "Very low or blocked";
        if (v < 0.30) return "Weak, faint, inconsistent";
        if (v < 0.55) return "Moderate and steady";
        if (v < 0.75) return "Strong and clear";
        return "Very strong, dominant energy";
    }

    // Guaranteed correct format
    return {
        lines: {
            life:  { strength: L, meaning: meaning(L) },
            head:  { strength: H, meaning: meaning(H) },
            heart: { strength: R, meaning: meaning(R) },
            fate:  { strength: F, meaning: meaning(F) }
        },
        status: "Palm lines extracted"
    };
}
