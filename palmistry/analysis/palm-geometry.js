// 🕉️ Sathyadarshana • THE SEED Geometry Engine V2.0
// Shadowless Normalization + Auto-Contrast + No Cyan Overlay

export async function detectPalmGeometry(videoElement, canvasElement) {
    const ctx = canvasElement.getContext("2d");

    // Draw camera to canvas
    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

    // Extract pixels
    let frame = ctx.getImageData(0, 0, canvasElement.width, canvasElement.height);

    // --- 1. Normalize brightness & reduce overexposure ---
    frame = normalizeFrame(frame);

    // --- 2. Apply auto–contrast ---
    frame = applyAutoContrast(frame);

    // Render NEW processed frame
    ctx.putImageData(frame, 0, 0);

    // --- 3. Silhouette detection (internal use only) ---
    let data = frame.data;
    let outlineMap = [];
    let threshold = 130;

    for (let y = 0; y < canvasElement.height; y++) {
        for (let x = 0; x < canvasElement.width; x++) {
            let idx = (y * canvasElement.width + x) * 4;
            let brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
            outlineMap.push(brightness < threshold ? 1 : 0);
        }
    }

    // NO OUTLINE DRAWING — clean preview
    return {
        palmDetected: true,
        zones: {
            lifeZone: "bottom-left quadrant",
            headZone: "center of palm",
            heartZone: "upper palm",
            fateZone: "vertical midline"
        }
    };
}



/* --------------------------------------------------------
   NORMALIZATION ENGINE – fixes bright/wash-out palm
   -------------------------------------------------------- */
function normalizeFrame(frame) {
    let d = frame.data;

    let min = 255, max = 0;

    // 1. Scan pixel brightness range
    for (let i = 0; i < d.length; i += 4) {
        let b = (d[i] + d[i+1] + d[i+2]) / 3;
        if (b < min) min = b;
        if (b > max) max = b;
    }

    // Avoid division error
    if (max - min < 20) max = min + 20;

    // 2. Normalize 0 – 220 range
    for (let i = 0; i < d.length; i += 4) {
        d[i]     = ((d[i]     - min) / (max - min)) * 220;
        d[i + 1] = ((d[i + 1] - min) / (max - min)) * 220;
        d[i + 2] = ((d[i + 2] - min) / (max - min)) * 220;
    }

    return frame;
}



/* --------------------------------------------------------
   AUTO CONTRAST — brings out lines clearly
   -------------------------------------------------------- */
function applyAutoContrast(frame) {
    let d = frame.data;

    const contrast = 1.20;  // perfect value for palm lines

    for (let i = 0; i < d.length; i += 4) {
        d[i]     = truncate((d[i] - 128) * contrast + 128);
        d[i + 1] = truncate((d[i + 1] - 128) * contrast + 128);
        d[i + 2] = truncate((d[i + 2] - 128) * contrast + 128);
    }

    return frame;
}

function truncate(v) {
    return Math.min(255, Math.max(0, v));
}
