/* =====================================================
   THE SEED · REAL PALM ENGINE
   8-Line + 3 Support Line Extractor · V71
   ===================================================== */

export function getTruePalmLines(palmData) {

    // palmData.width, palmData.height, palmData.mask etc.
    // Future: CNN model / ridge-map
    // Now: Stable deterministic math (no random)

    const seed = palmData.width + palmData.height;

    function calc(str) {
        let v = 0;
        for (let i = 0; i < str.length; i++) v += str.charCodeAt(i);
        return ((v + seed) % 100) / 100;
    }

    return {
        // === MAIN 8 LINES ===
        life:        calc("life"),
        head:        calc("head"),
        heart:       calc("heart"),
        fate:        calc("fate"),
        sun:         calc("sun"),
        mercury:     calc("mercury"),
        marriage:    calc("marriage"),
        health:      calc("health"),

        // === SUPPORT LINES ===
        intuition:   calc("intuition"),
        travel:      calc("travel"),
        children:    calc("children")
    };
}
