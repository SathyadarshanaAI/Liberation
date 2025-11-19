// ================================
// THE SEED · TrueScan V1 · REAL Palm Line Detector
// Complete & Syntax-Safe Version
// ================================

export function extractPalmLines(canvas) {

    const ctx = canvas.getContext("2d");

    const W = canvas.width;
    const H = canvas.height;

    let img = ctx.getImageData(0, 0, W, H);
    let data = img.data;

    // Convert to grayscale
    const gray = new Array(W * H);
    for (let i = 0; i < data.length; i += 4) {
        const g = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114);
        gray[i / 4] = g;
    }

    // Simple contrast boost
    for (let i = 0; i < gray.length; i++) {
        gray[i] = Math.min(255, gray[i] * 1.35);
    }

    // Basic edge detection
    const edges = new Array(W * H).fill(0);

    for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
            const i = y * W + x;

            const gx = gray[i - 1] - gray[i + 1];
            const gy = gray[i - W] - gray[i + W];

            const mag = Math.sqrt(gx * gx + gy * gy);
            edges[i] = mag > 22 ? 1 : 0;
        }
    }

    // Fate line (vertical)
    let fateScore = 0;
    const fx = parseInt(W * 0.53);

    for (let y = parseInt(H * 0.25); y < parseInt(H * 0.85); y++) {
        const i = y * W + fx;
        if (edges[i] === 1) fateScore++;
    }
    fateScore = fateScore / (H * 0.6);

    // Head + Heart lines
    let headScore = 0;
    let heartScore = 0;

    for (let x = parseInt(W * 0.20); x < parseInt(W * 0.80); x++) {

        let yHead = parseInt(H * 0.55);
        if (edges[yHead * W + x] === 1) headScore++;

        let yHeart = parseInt(H * 0.40);
        if (edges[yHeart * W + x] === 1) heartScore++;
    }

    headScore  = headScore  / (W * 0.60);
    heartScore = heartScore / (W * 0.60);

    // Life line (left arc zone)
    let lifeScore = 0;
    const lx = parseInt(W * 0.25);

    for (let y = parseInt(H * 0.30); y < parseInt(H * 0.90); y++) {
        const i = y * W + lx;
        if (edges[i] === 1) lifeScore++;
    }

    lifeScore = lifeScore / (H * 0.60);

    // Normalize 0–1 range
    function norm(v) {
        if (v < 0.05) return v * 5.5;
        if (v > 1.0) return 1.0;
        return v;
    }

    return {
        lines: {
            life:  norm(lifeScore),
            head:  norm(headScore),
            heart: norm(heartScore),
            fate:  norm(fateScore)
        }
    };
}
