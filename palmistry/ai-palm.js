// === LOAD MEDIAPIPE HAND DETECTOR ===
window.HandDetector = function () {
    return new Promise(resolve => {
        const hands = new Hands({
            locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        resolve(hands);
    });
};


// === PALM ANALYSIS ===
window.analyzePalm = async function (canvas) {

    const hands = await window.HandDetector();
    const ctx = canvas.getContext("2d");

    // Convert canvas → real image
    const img = new Image();
    img.src = canvas.toDataURL("image/png");

    img.onload = async () => {

        // VERY IMPORTANT — give real size to MediaPipe
        img.width = canvas.width;
        img.height = canvas.height;

        hands.onResults(results => {

            if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
                document.getElementById("output").textContent =
                    "Palm not detected. Try again.";
                return;
            }

            const lm = results.multiHandLandmarks[0];

            // Redraw hand image first
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw glowing palm lines
            drawGlowLine(ctx, lm[0], lm[5], lm[17], "cyan");     // Life
            drawGlowLine(ctx, lm[12], lm[9], lm[5], "magenta"); // Head
            drawGlowLine(ctx, lm[17], lm[13], lm[8], "yellow"); // Heart

            // Show reading
            translateAndShow(generateReading());
        });

        // NOW detection will work 🟢
        await hands.send({ image: img });
    };
};


// === DRAW GLOW LINES ===
function drawGlowLine(ctx, a, b, c, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;

    const W = ctx.canvas.width, H = ctx.canvas.height;

    ctx.beginPath();
    ctx.moveTo(a.x * W, a.y * H);
    ctx.lineTo(b.x * W, b.y * H);
    ctx.lineTo(c.x * W, c.y * H);
    ctx.stroke();
}


// === AI PALM READING ===
function generateReading() {
    return `
🖐️ Palmistry AI V42

Life Line: Strong life-force energy.
Head Line: Clear thinking, good focus.
Heart Line: Balanced emotions and compassion.
Destiny: Spiritual leadership and intuition.
`;
}


// === MULTILINGUAL OUTPUT ===
function translateAndShow(text) {
    const lang = document.getElementById("langSelect").value;

    if (lang === "Sinhala") {
        text = text.replace("Life Line", "ජීවිත රේඛාව")
                   .replace("Head Line", "මානසික රේඛාව")
                   .replace("Heart Line", "හද රේඛාව")
                   .replace("Destiny", "විනිශ්චය");
    }

    if (lang === "Tamil") {
        text = text.replace("Life Line", "உயிர் கோடு")
                   .replace("Head Line", "தலை கோடு")
                   .replace("Heart Line", "இதய கோடு")
                   .replace("Destiny", "விதி");
    }

    document.getElementById("output").textContent = text;
}
