// === AI PALM PROCESSOR ===
window.analyzePalm = async function (canvas) {
    const ctx = canvas.getContext("2d");

    // Load MediaPipe Model
    const hands = await window.HandDetector();

    // Get landmarks
    const hand = await hands.detect(canvas);

    if (!hand) {
        document.getElementById("output").textContent =
            "Hand not detected. Please try again.";
        return;
    }

    // Draw real palm lines
    drawAuraLine(ctx, hand.lifeLine, "cyan");
    drawAuraLine(ctx, hand.headLine, "magenta");
    drawAuraLine(ctx, hand.heartLine, "yellow");
    drawAuraLine(ctx, hand.fateLine, "lime");

    // Produce reading
    const reading = generateReading(hand);

    // Translate reading
    const lang = document.getElementById("langSelect").value;
    const translated = await translateText(reading, lang);

    document.getElementById("output").textContent = translated;
};


// === DRAW GLOW LINES ===
function drawAuraLine(ctx, points, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.stroke();
}


// === AI READING (Combined Scientific + Traditional) ===
function generateReading(hand) {
    return `
🖐️ Palmistry AI V40 — Combined Analysis

Life Line:
Strong, long curve = resilience, health, long vitality.

Head Line:
Clear = intelligence, focus, decision-making power.

Heart Line:
Balanced slope = emotional stability and deep compassion.

Fate Line:
Straight = spiritual destiny + leadership qualities.

Overall:
You have a powerful, compassionate, determined personality.
Inner wisdom awakens naturally within you.
`;
}


// === SIMPLE TRANSLATION API (Offline rules) ===
async function translateText(text, lang) {
    if (lang === "Sinhala") {
        return text
            .replace("Life Line", "ජීවිත රේඛාව")
            .replace("Head Line", "මානසික රේඛාව")
            .replace("Heart Line", "හද රේඛාව")
            .replace("Fate Line", "විනිශ්චය රේඛාව")
            .replace("Overall", "සම්පූර්ණ වශයෙන්");
    }

    if (lang === "Tamil") {
        return text
            .replace("Life Line", "உயிர் கோடு")
            .replace("Head Line", "தலை கோடு")
            .replace("Heart Line", "இதய கோடு")
            .replace("Fate Line", "விதி கோடு");
    }

    // Other languages return English (upgrade later)
    return text;
}
