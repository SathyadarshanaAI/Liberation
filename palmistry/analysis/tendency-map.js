/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   tendency-map.js — Behavioral Tendency Engine (v2.0)
   Reads:
   - Head Line shape
   - Heart Line depth
   - Fate Line flow
   - Mars Line pressure
   - Symbolic patterns
----------------------------------------------------------*/

export function tendencyMap(lines) {

    const out = [];
    out.push("🧠 **Behavioral Tendency Map**");
    out.push("-----------------------------------------");

    /* EMOTIONAL TENDENCIES */
    out.push("\n💗 **Emotional Patterns**");

    if (lines.heart?.depth === "deep") {
        out.push("• Deep emotions — easily attached, easily hurt.");
    } else if (lines.heart?.depth === "shallow") {
        out.push("• More logical in relationships, less emotional turbulence.");
    }

    if (lines.heart?.forks > 0) {
        out.push("• Two-direction love: divided feelings or dual emotional paths.");
    }

    if (lines.symbols?.islands > 0) {
        out.push("• Emotional overload moments appear under stress.");
    }

    /* MENTAL TENDENCIES */
    out.push("\n🧩 **Thinking Style & Mind Patterns**");

    if (lines.head?.shape === "straight") {
        out.push("• Practical thinker — logical, grounded decision making.");
    }
    if (lines.head?.shape === "curved") {
        out.push("• Creative imagination — artistic or spiritual insight.");
    }
    if (lines.head?.islands > 0) {
        out.push("• Overthinking cycles — too many parallel thoughts.");
    }
    if (lines.head?.breaks > 0) {
        out.push("• Life-changing mental shift due to a past event.");
    }

    /* DESTINY / LIFE-PATH TRENDS */
    out.push("\n⏳ **Life Path Tendencies**");

    if (lines.fate?.breaks > 0) {
        out.push("• A destiny shift occurred — a major life redirection.");
    }
    if (lines.fate?.origin === "mountOfMoon") {
        out.push("• Life path influenced by dreams, intuition, imagination.");
    }
    if (lines.fate?.origin === "mountOfVenus") {
        out.push("• Strong family influence on life path.");
    }

    /* ENERGY & COURAGE MAP */
    out.push("\n🔥 **Energy, Courage & Action Patterns**");

    if (lines.mars?.strength === "high") {
        out.push("• Strong courage — confronts challenges directly.");
    }
    if (lines.mars?.strength === "low") {
        out.push("• Needs emotional reassurance before taking big steps.");
    }
    if (lines.mars?.stressMarks > 0) {
        out.push("• Pressure periods cause sudden anger or frustration.");
    }

    /* FUTURE TENDENCY SIGNALS */
    out.push("\n🔮 **Future Outcome Tendencies**");

    if (lines.sun?.reputation === "high") {
        out.push("• Recognition will increase with age.");
    }
    if (lines.fate?.upwardBranches > 0) {
        out.push("• Progression & financial growth windows are coming.");
    }
    if (lines.symbols?.crosses > 0) {
        out.push("• A major decision crossroads reappears in future.");
    }
    if (lines.symbols?.stars > 0) {
        out.push("• Destiny boost — sudden success or spiritual awakening.");
    }

    out.push("\n-----------------------------------------");
    out.push("✨ *End of Behavioral Tendency Map*");

    return out.join("\n");
}
