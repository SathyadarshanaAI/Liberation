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

window.analyzePalm = async function (canvas) {

    const hands = await window.HandDetector();

    // Convert canvas → real image for mobile
    const img = new Image();
    img.src = canvas.toDataURL("image/jpeg", 0.9);

    img.onload = async () => {

        hands.onResults(results => {
            if (!results.multiHandLandmarks?.length) {
                document.getElementById("output").textContent =
                    "Palm not detected. Try again.";
                return;
            }

            const lm = results.multiHandLandmarks[0];
            const ctx = canvas.getContext("2d");

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            drawGlowLine(ctx, lm[0], lm[5], lm[17], "cyan");
            drawGlowLine(ctx, lm[12], lm[9], lm[5], "magenta");
            drawGlowLine(ctx, lm[17], lm[13], lm[8], "yellow");

            translateAndShow(generateReading());
        });

        await hands.send({ image: img });
    };
};

function drawGlowLine(ctx, a, b, c, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;

    const W = ctx.canvas.width, H = ctx.canvas.height;

    ctx.beginPath();
    ctx.moveTo(a.x * W, a.y * H);
    ctx.lineTo(b.x * W, b.y * H);
    ctx.lineTo(c.x * W, c.y * H);
    ctx.stroke();
}

function generateReading() {
    return `
🖐️ Palmistry AI V41
Life Line: Strong life-force energy.
Head Line: Clarity & intelligence.
Heart Line: Compassion & balance.
Destiny: Spiritual leadership.
`;
}

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
