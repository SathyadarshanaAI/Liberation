/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   pastlife-engine.js — Past-Life Regression Engine (v2.0)
   Reads:
   - Previous birth tendencies
   - Unfinished karmic tasks
   - Soul strengths
   - Old emotional wounds
----------------------------------------------------------*/

export function pastLifeAnalysis(lines, karmaScore = 50) {

    let out = [];
    out.push("🕉️ **Past Life Reading**");
    out.push("-----------------------------------------");

    /* BASE PAST-LIFE TYPE DECISION */
    let type = "ordinary";

    if (karmaScore > 80 && lines.sun?.creativity === "high") {
        type = "spiritual_teacher";
    } 
    else if (karmaScore > 70 && lines.fate?.origin === "mountOfMoon") {
        type = "traveler_mystic";
    } 
    else if (lines.heart?.depth === "deep") {
        type = "emotional_healer";
    } 
    else if (lines.fate?.breaks > 2) {
        type = "warrior_life";
    }

    /* DESCRIPTIONS */
    switch (type) {

        case "spiritual_teacher":
            out.push("🌟 **Past Life Role:** Spiritual Teacher / Rishi");
            out.push("• You carried wisdom and guided others.");
            out.push("• Strong karma from teaching and healing.");
            out.push("• Lifetime spent seeking truth & meditation.");
            break;

        case "traveler_mystic":
            out.push("🌙 **Past Life Role:** Traveler / Mystic");
            out.push("• A wandering soul with visions and intuition.");
            out.push("• Deep connection to dreams & symbols.");
            out.push("• Strong imagination, spiritual journeys.");
            break;

        case "emotional_healer":
            out.push("💗 **Past Life Role:** Emotional Healer");
            out.push("• You helped emotionally wounded people.");
            out.push("• Heart-based wisdom carried into this life.");
            out.push("• Extreme sensitivity & compassion remain.");
            break;

        case "warrior_life":
            out.push("⚔️ **Past Life Role:** Warrior / Protector");
            out.push("• Past life filled with battles & sacrifice.");
            out.push("• Strong survival instincts.");
            out.push("• Old emotional scars still echo.");
            break;

        default:
            out.push("🌏 **Past Life Role:** Ordinary Soul Path");
            out.push("• Balanced past karma.");
            out.push("• Simple life, family-oriented, duty-driven.");
            break;
    }

    /* UNFINISHED TASKS */
    out.push("\n📌 **Unfinished Karmic Lessons**");

    if (lines.heart?.forks > 0) {
        out.push("• Love decisions from past are incomplete.");
    }
    if (lines.head?.islands > 0) {
        out.push("• Unresolved mental stress from previous birth.");
    }
    if (lines.fate?.breaks > 0) {
        out.push("• Interrupted destiny path — rebirth chosen to finish the work.");
    }

    /* SOUL STRENGTHS */
    out.push("\n💠 **Soul Strengths Brought to This Life**");

    if (lines.sun?.reputation === "high") out.push("• Strong leadership & recognition energy.");
    if (lines.manikanda?.spiritualSeal) out.push("• Divine protection across lifetimes.");
    if (karmaScore > 70) out.push("• Powerful inner intuition & guidance.");

    /* SOUL WEAKNESSES */
    out.push("\n⚡ **Soul Weaknesses to Heal**");

    if (lines.symbols?.islands > 0) out.push("• Emotional wounds carried from past lives.");
    if (lines.symbols?.crosses > 0) out.push("• Karmic crossroads repeating again.");
    if (lines.symbols?.breaks > 0) out.push("• Fear of loss or disruption.");

    out.push("\n-----------------------------------------");
    out.push("✨ *End of Past Life Reading*");

    return out.join("\n");
}
