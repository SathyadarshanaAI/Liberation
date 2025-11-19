// 🕉️ THE SEED • Palm Lines Extractor · V121 (Fixed Return Format)

export async function extractPalmLines(canvas) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;

    // Auto brightening
    for (let i = 0; i < data.length; i += 4) {
        let avg = (data[i] + data[i+1] + data[i+2]) / 3;
        avg += 25;
        if (avg > 255) avg = 255;
        data[i] = data[i+1] = data[i+2] = avg;
    }
    ctx.putImageData(img, 0, 0);

    // Brightness map
    let bright = [];
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            const idx = (y*w + x) * 4;
            bright[y*w + x] = (data[idx] + data[idx+1] + data[idx+2]) / 3;
        }
    }

    // Sample a line between 2 points
    function sampleLine(x1, y1, x2, y2) {
        let sum = 0, count = 0;
        let dx = (x2 - x1) / 120;
        let dy = (y2 - y1) / 120;
        let x = x1, y = y1;

        for (let i = 0; i < 120; i++) {
            let ix = Math.floor(x);
            let iy = Math.floor(y);

            if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
                sum += (255 - bright[iy*w + ix]);
                count++;
            }
            x += dx;
            y += dy;
        }
        return count ? sum / count / 255 : 0;
    }

    // Real palm line geometry
    const L = sampleLine(w*0.25, h*0.65, w*0.45, h*0.95);
    const H = sampleLine(w*0.25, h*0.55, w*0.75, h*0.55);
    const R = sampleLine(w*0.30, h*0.38, w*0.80, h*0.38);
    const F = sampleLine(w*0.50, h*0.20, w*0.50, h*0.85);

    function interpret(v) {
        if (v < 0.12) return { strength: v, meaning: "Very low or blocked" };
        if (v < 0.30) return { strength: v, meaning: "Weak, faint, inconsistent" };
        if (v < 0.55) return { strength: v, meaning: "Moderate and steady" };
        if (v < 0.75) return { strength: v, meaning: "Strong and clear" };
        return { strength: v, meaning: "Very strong, dominant energy" };
    }

    // 🔥 FIXED: Correct return format
    return {
        lines: {
            life: interpret(L),
            head: interpret(H),
            heart: interpret(R),
            fate: interpret(F)
        },
        status: "Palm lines extracted"
    };
}
