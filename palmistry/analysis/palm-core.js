/* ---------------------------------------------------------
   THE SEED · Palmistry AI 
   palm-core.js — Main Interpretation Engine (v2.0)
----------------------------------------------------------*/

/*
 input: lines = {
   life: {...},
   head: {...},
   heart: {...},
   fate: {...},
   sun: {...},
   mercury: {...},
   mars: {...},
   manikanda: {...},
   minor: {...},
   symbols: {...}
 }
*/

export function palmAnalysis(lines) {

    let report = [];

    /* ---------------------------------------------------------
       LIFE LINE
    ----------------------------------------------------------*/
    if (lines.life) {
        report.push("🌿 **Life Line**:");
        report.push(`• Vitality: ${lines.life.energy}`);
        report.push(`• Length: ${lines.life.length}`);
        report.push(`• Curve: ${lines.life.curve}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       HEAD LINE
    ----------------------------------------------------------*/
    if (lines.head) {
        report.push("🧠 **Head Line**:");
        report.push(`• Thinking style: ${lines.head.direction}`);
        report.push(`• Focus level: ${lines.head.focus}`);
        report.push(`• Clarity: ${lines.head.clarity}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       HEART LINE
    ----------------------------------------------------------*/
    if (lines.heart) {
        report.push("❤️ **Heart Line**:");
        report.push(`• Emotional Nature: ${lines.heart.emotionalNature}`);
        report.push(`• Curve: ${lines.heart.curve}`);
        report.push(`• Depth: ${lines.heart.depth}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       FATE LINE
    ----------------------------------------------------------*/
    if (lines.fate) {
        report.push("⚡ **Fate Line**:");
        report.push(`• Career Flow: ${lines.fate.careerFlow}`);
        report.push(`• Origin: ${lines.fate.origin}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       SUN LINE
    ----------------------------------------------------------*/
    if (lines.sun) {
        report.push("☀️ **Sun Line**:");
        report.push(`• Creativity: ${lines.sun.creativity}`);
        report.push(`• Reputation: ${lines.sun.reputation}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       MERCURY LINE
    ----------------------------------------------------------*/
    if (lines.mercury) {
        report.push("🔮 **Mercury Line**:");
        report.push(`• Communication: ${lines.mercury.communication}`);
        report.push(`• Intuition: ${lines.mercury.intuition}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       MARS LINE
    ----------------------------------------------------------*/
    if (lines.mars) {
        report.push("🔥 **Mars Line**:");
        report.push(`• Bravery: ${lines.mars.bravery}`);
        report.push(`• Crisis Handling: ${lines.mars.crisisHandling}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       MANIKANDA (SPIRITUAL SEAL)
    ----------------------------------------------------------*/
    if (lines.manikanda) {
        report.push("🕉️ **Manikanda Seal**:");
        if (lines.manikanda.spiritualSeal) {
            report.push("• Spiritual protection present.");
        }
        report.push(`• Meaning: ${lines.manikanda.meaning}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       MINOR LINES
    ----------------------------------------------------------*/
    if (lines.minor) {
        report.push("✨ **Minor Lines**:");
        report.push(`• Marriage Line Strength: ${lines.minor.marriage}`);
        report.push(`• Travel Lines: ${lines.minor.travel}`);
        report.push(`• Health Lines: ${lines.minor.health}`);
        report.push(`• Intuition Lines: ${lines.minor.intuition}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       SYMBOLS
    ----------------------------------------------------------*/
    if (lines.symbols) {
        report.push("🔺 **Symbols & Markings**:");
        report.push(`• Crosses: ${lines.symbols.crosses}`);
        report.push(`• Stars: ${lines.symbols.stars}`);
        report.push(`• Forks: ${lines.symbols.forks}`);
        report.push(`• Islands: ${lines.symbols.islands}`);
        report.push(`• Breaks: ${lines.symbols.breaks}`);
        report.push(`• Grille: ${lines.symbols.grille}`);
        report.push("");
    }

    /* ---------------------------------------------------------
       FINAL SUMMARY
    ----------------------------------------------------------*/
    report.push("📜 **Overall Summary**");
    report.push(generateSummary(lines));
    report.push("");

    return report.join("\n");
}

/* ---------------------------------------------------------
   SUMMARY GENERATOR
----------------------------------------------------------*/
function generateSummary(lines) {

    let s = [];

    // energy
    if (lines.life?.energy?.includes("strong")) {
        s.push("• Overall vitality is powerful. Good long-term health.");
    }

    // brain + heart balance
    if (lines.head && lines.heart) {
        s.push("• Mind and emotions show a balanced personality.");
    }

    // career
    if (lines.fate) {
        s.push("• Career path is stable with long-term progress.");
    }

    // spiritual
    if (lines.manikanda?.spiritualSeal) {
        s.push("• Strong spiritual protection and inner guidance present.");
    }

    // creativity
    if (lines.sun?.creativity === "high") {
        s.push("• Highly creative + Inspired personality.");
    }

    // communication
    if (lines.mercury?.communication === "strong") {
        s.push("• Excellent communication ability.");
    }

    if (s.length === 0) {
        return "General balance of lines suggests a stable personality.";
    }

    return s.join("\n");
}
