// === CREATE REAL HAND DETECTOR ===
window.HandDetector = function () {
    return new Promise(resolve => {
        const hands = new Hands({
            locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
        });

        hands.setOptions({
            maxNumHands: 1,
            modelComplexity: 1,
            minDetectionConfidence: 0.6,
            minTrackingConfidence: 0.6
        });

        resolve(hands);
    });
};


// === MAIN PALM ANALYSIS ===
window.analyzePalm = async function (canvas) {
    const ctx = canvas.getContext("2d");
    const hands = await window.HandDetector();

    hands.onResults(results => {
        if (!results.multiHandLandmarks?.length) {
            document.getElementById("output").textContent = "Palm not detected.";
            return;
        }

        const lm = results.multiHandLandmarks[0];

        // Draw 3 glowing palm lines (simple version)
        drawGlowLine(ctx, lm[0], lm[5], lm[17], "cyan");     // Life
        drawGlowLine(ctx, lm[12], lm[9], lm[5], "magenta"); // Head
        drawGlowLine(ctx, lm[17], lm[13], lm[8], "yellow"); // Heart

        const reading = generateReading();
        translateAndShow(reading);
    });

    await hands.send({ image: canvas });
};


// === DRAW GLOW LINE ===
function drawGlowLine(ctx, p1, p2, p3, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(p1.x * ctx.canvas.width, p1.y * ctx.canvas.height);
    ctx.lineTo(p2.x * ctx.canvas.width, p2.y * ctx.canvas.height);
    ctx.lineTo(p3.x * ctx.canvas.width, p3.y * ctx.canvas.height);
    ctx.stroke();
}


// === AI READING (SCIENCE + TRADITION) ===
function generateReading() {
    return `
🖐️ Palmistry AI V40 Analysis

Life Line:
Strong vital energy, long health span, inner resilience.

Head Line:
Clear thinking pattern, good focus, fast decision making.

Heart Line:
Balanced emotional sensitivity and compassion.

Destiny:
You possess leadership, spiritual clarity, and deep intuition.

`;
}


// === MULTILINGUAL OUTPUT ===
function translateAndShow(text) {
    const lang = document.getElementById("langSelect").value;

    if (lang === "Sinhala") {
        text = text
            .replace("Life Line", "ජීවිත රේඛාව")
            .replace("Head Line", "මානසික රේඛාව")
            .replace("Heart Line", "හද රේඛාව")
            .replace("Destiny", "විනිශ්චය");
    }

    if (lang === "Tamil") {
        text = text
            .replace("Life Line", "உயிர் கோடு")
            .replace("Head Line", "தலை கோடு")
            .replace("Heart Line", "இதய கோடு")
            .replace("Destiny", "விதி");
    }

    document.getElementById("output").textContent = text;
}
