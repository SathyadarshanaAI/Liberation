// ================================
// THE SEED · TrueScan V1 · REAL Palm Line Detector
// analysis/palm-lines.js
// ================================

export function extractPalmLines(canvas) {

    const ctx = canvas.getContext("2d");

    // 1. Get image data
    const W = canvas.width;
    const H = canvas.height;

    let img = ctx.getImageData(0, 0, W, H);
    let data = img.data;

    // 2. Convert to grayscale
    const gray = [];
    for (let i = 0; i < data.length; i += 4) {
        const g = (data[i] * 0.299 + data[i+1] * 0.587 + data[i+2] * 0.114);
        gray.push(g);
    }

    // 3. Simple contrast boost
    for (let i = 0; i < gray.length; i++) {
        gray[i] = Math.min(255, gray[i] * 1.35);
    }

    // 4. Detect edges (simple gradient-based detector)
    const edges = new Array(gray.length).fill(0);
    for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
            const i = y * W + x;
            const gx = gray[i-1] - gray[i+1];
            const gy = gray[i-W] - gray[i+W];
            const mag = Math.sqrt(gx * gx + gy * gy);
            edges[i] = mag > 22 ? 1 : 0;  // threshold
        }
    }

    // 5. Count vertical / diagonal patterns for Fate line
    let fateScore = 0;
    for (let y = parseInt(H*0.25); y < parseInt(H*0.85); y++) {
        const x = parseInt(W * 0.53);  // center-right axis
        const i = y * W + x;
        if (edges[i] === 1) fateScore++;
    }
    fateScore = fateScore / (H * 0.6);

    // 6. Count horizontal strong edges for Head + Heart lines
    let headScore = 0;
    let heartScore = 0;

    for (let x = parseInt(W*0.20); x < parseInt(W*0.80); x++) {
        // Head line (middle)
        let y1 = parseInt(H * 0.55);
        if (edges[y1 * W + x] === 1) headScore++;

        // Heart line (upper)
        let y2 = parseInt(H * 0.40);
        if (edges[y2 * W + x] === 1) heartScore++;
    }

    headScore  = headScore  / (W * 0.60);
    heartScore = heartScore / (W * 0.60);

    // 7. Life line detection (left arc zone)
    let lifeScore = 0;
    for (let y = parseInt(H*0.30); y < parseInt(H*0.90); y++) {
        const x = parseInt(W * 0.25);
        const i = y * W + x;
        if (edges[i] ===
