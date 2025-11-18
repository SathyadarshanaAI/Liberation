/* =====================================================
   THE SEED · Palmistry AI · Line Extractor · V80 · 8 LINES
   ===================================================== */

export async function extractLines(palmData) {

    console.log("📌 extractLines() received palmData:", palmData);

    // Validate palmData
    if (!palmData) {
        console.log("❌ No palmData received!");
        return generateFallbackLines();
    }

    // simulate short processing delay
    await new Promise(res => setTimeout(res, 35));

    // ALWAYS return all 8 lines
    const lines = {
        life: rand(),
        head: rand(),
        heart: rand(),
        fate: rand(),
        sun: rand(),
        mercury: rand(),
        marriage: rand(),
        health: rand()
    };

    console.log("✔ 8-line package returned:", lines);

    return lines;
}

/* ----- Generates fallback dataset if palmData missing ----- */
function generateFallbackLines() {
    return {
        life: "0.000",
        head: "0.000",
        heart: "0.000",
        fate: "0.000",
        sun: "0.000",
        mercury: "0.000",
        marriage: "0.000",
        health: "0.000"
    };
}

/* ----- randomizer ----- */
function rand() {
    return (Math.random()).toFixed(3);
}
