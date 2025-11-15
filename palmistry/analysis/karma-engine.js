/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   karma-engine.js — Karmic, Destiny & Spiritual Energy Engine (v2.0)
----------------------------------------------------------*/

export function karmaAnalysis(lines) {

    let out = [];
    out.push("🕉️ **Karmic & Destiny Reading**");
    out.push("-----------------------------------------");

    /* BASE KARMA SCORE */
    let karmaScore = 50;

    if (lines.fate && lines.fate.careerFlow === "strong") karmaScore += 15;
    if (lines.sun && lines.sun.reputation === "high") karmaScore += 10;
    if (lines.manikanda && lines.manikanda.spiritualSeal) karmaScore += 25;

    /* MAJOR KARMIC INDICATORS */
    out.push(`\n🔮 **Karmic Energy Level:** ${karmaScore}/100`);

    if (karmaScore > 80) {
        out.push("• Strong soul evolution from previous births.");
        out.push("• High spiritual intelligence.");
    } else if (karmaScore > 60) {
        out.push("• Positive karmic path with natural protection.");
    } else if (karmaScore > 45) {
        out.push("• Mixed karmic influences. Some lessons remain.");
    } else {
        out.push("• Heavy karmic residue. Emotional healing required.");
    }

    /* FATE LINE → DESTINY MAP */
    if (lines.fate) {
        out.push("\n⚡ **Destiny Path**");
        if (lines.fate.origin === "mountOfMoon") {
            out.push("• Life influenced by imagination, travel, intuition.");
        } else if (lines.fate.origin === "mountOfVenus") {
            out.push("• Destiny driven by relationships & personal energy.");
        } else {
            out.push("• Standard fate influence – practical life path.");
        }
    }

    /* SUN LINE → SOUL PURPOSE */
    if (lines.sun) {
        out.push("\n🌞 **Soul Purpose**");
        if (lines.sun.creativity === "high") {
            out.push("• Soul purpose connected to arts, teaching or healing.");
        } else if (lines.sun.creativity === "medium") {
            out.push("• Balanced creative + logical soul path.");
        } else {
            out.push("• Soul seeks clarity & inner confidence.");
        }
    }

    /* MINOR SYMBOLS — KARMIC MARKERS */
    if (lines.symbols) {
        out.push("\n🔍 **Karmic Signs**");

        if (lines.symbols.stars > 0) out.push("★ Star marking → Past-life spiritual power.");
        if (lines.symbols.crosses > 0) out.push("✖ Cross sign → Karmic tests or turning points.");
        if (lines.symbols.islands > 0) out.push("◉ Islands → Emotional karmic blockages.");
        if (lines.symbols.forks > 0) out.push("Ψ Forks → Expansion & karmic openings.");
        if (lines.symbols.breaks > 0) out.push("— Breaks → Major life transitions.");
    }

    /* MANIKANDA — DIVINE SEAL */
    if (lines.manikanda && lines.manikanda.spiritualSeal) {
        out.push("\n🔱 **Manikanda Seal: Activated**");
        out.push("• Sign of old soul lineage.");
        out.push("• Divine purpose & protection.");
        out.push("• Strong intuition and destiny calling.");
    }

    out.push("\n-----------------------------------------");
    out.push("✨ *End of Karmic Report*");

    return out.join("\n");
}
