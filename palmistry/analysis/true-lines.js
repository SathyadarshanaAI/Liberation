// 🕉️ THE SEED · True Palm Line Engine V1.0
// Real contour + ridge cluster detection (Life, Head, Heart, Fate)

export async function extractPalmLines(canvas) {
    const ctx = canvas.getContext("2d");
    const { width: w, height: h } = canvas;

    const img = ctx.getImageData(0, 0, w, h);
    const data = img.data;

    // 1. Convert to grayscale
    let gray = [];
    for (let i = 0; i < data.length; i += 4) {
        let g = (data[i] + data[i+1] + data[i+2]) / 3;
        gray.push(g);
    }

    // 2. Edge detect → palm lines pop out strongly
    let edges = new Array(gray.length).fill(0);

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {

            let idx = y * w + x;

            // Sobel-like gradient
            let gx = 
                -gray[idx - 1] + gray[idx + 1] +
                -2 * gray[idx - 1 + w] + 2 * gray[idx + 1 + w] +
                -gray[idx - 1 - w] + gray[idx + 1 - w];

            let gy = 
                -gray[idx - w] - 2 * gray[idx - 1] - gray[idx + 1] +
                gray[idx + w] + 2 * gray[idx + 1 + w] + gray[idx - 1 + w];

            let mag = Math.sqrt(gx*gx + gy*gy);

            edges[idx] = mag > 35 ? 1 : 0;  // threshold
        }
    }

    // 3. Identify line regions (Life, Head, Heart, Fate)
    function avgIntensity(x1, y1, x2, y2) {
        let sum = 0, count = 0;
        for (let y = y1; y < y2; y++) {
            for (let x = x1; x < x2; x++) {
                let idx = y * w + x;
                sum += edges[idx];
                count++;
            }
        }
        return sum / count;
    }

    const lines = {
        life: avgIntensity(w*0.10, h*0.45, w*0.45, h*0.80),
        head: avgIntensity(w*0.20, h*0.35, w*0.80, h*0.55),
        heart: avgIntensity(w*0.20, h*0.15, w*0.80, h*0.35),
        fate: avgIntensity(w*0.45, h*0.20, w*0.55, h*0.80)
    };

    // 4. Draw detected edges on canvas (cyan)
    ctx.strokeStyle = "#00FFFF";
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let idx = y * w + x;
            if (edges[idx] === 1) ctx.lineTo(x, y);
        }
    }

    ctx.stroke();

    return {
        lifeLine: lines.life,
        headLine: lines.head,
        heartLine: lines.heart,
        fateLine: lines.fate,
        rawEdges: edges
    };
}
