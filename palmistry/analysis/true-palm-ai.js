   /* ============================================================
   THE SEED · TRUE PALM AI · V100
   Advanced Palm Region Detector (Contours + Geometry)
   ============================================================ */

export function detectTruePalm(imageData) {

    const { width, height, data } = imageData;
    
    // Convert to grayscale for edge detection
    let gray = new Uint8ClampedArray(width * height);

    for (let i = 0; i < data.length; i += 4) {
        gray[i/4] = (data[i] * 0.3 + data[i+1] * 0.59 + data[i+2] * 0.11);
    }

    // Sobel Edge Detection (real contours)
    const sobel = new Uint8ClampedArray(width * height);
    const gx = [-1,0,1,-2,0,2,-1,0,1];
    const gy = [-1,-2,-1,0,0,0,1,2,1];

    for (let y = 1; y < height-1; y++) {
        for (let x = 1; x < width-1; x++) {
            let px = 0, py = 0;
            let idx = (y * width + x);

            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    let pos = (idx + ky * width + kx);
                    let val = gray[pos];

                    let kernelIndex = (ky+1)*3 + (kx+1);

                    px += gx[kernelIndex] * val;
                    py += gy[kernelIndex] * val;
                }
            }

            sobel[idx] = Math.sqrt(px*px + py*py);
        }
    }

    // Threshold to keep strong palm edges
    let mask = new Uint8ClampedArray(width * height);
    let T = 80;

    for (let i = 0; i < sobel.length; i++) {
        mask[i] = sobel[i] > T ? 255 : 0;
    }

    return {
        width,
        height,
        mask
    };
}
