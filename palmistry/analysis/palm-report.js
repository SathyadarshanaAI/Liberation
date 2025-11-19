// 🕉️ THE SEED • Palm Report Generator · V200 (Stable)

export function generatePalmReport(lines, mounts, aura) {

    function wrapLine(name, data) {
        return {
            strength: data.strength,
            meaning: data.meaning,
            message: lineMessage(name, data.strength)
        };
    }

    function lineMessage(name, v) {
        if (name === "life") {
            if (v < 0.15) return "Your prāṇa flow is sensitive; rest, breathing, and healing practices help.";
            if (v < 0.35) return "Your vitality fluctuates; balance your routine.";
            if (v < 0.6) return "Stable life-force energy.";
            return "Very strong vitality and endurance.";
        }

        if (name === "head") {
            if (v < 0.15) return "Your mental energy is sensitive; meditation increases stability.";
            if (v < 0.35) return "Thoughts fluctuate; grounding helps.";
            if (v < 0.6) return "Balanced intellect and focus.";
            return "Very strong analytical clarity.";
        }

        if (name === "heart") {
            if (v < 0.15) return "Emotional healing recommended.";
            if (v < 0.35) return "Your emotions stay guarded; self-love is key.";
            if (v < 0.6) return "Balanced emotional expression.";
            return "Strong emotional depth and empathy.";
        }

        if (name === "fate") {
            if (v < 0.15) return "Your destiny is flexible; nothing is fixed — you create your path.";
            if (v < 0.35) return "Your direction shifts; clarity is forming.";
            if (v < 0.6) return "Stable sense of purpose.";
            return "Very strong life direction and karma alignment.";
        }
    }

    return {
        lifeLine:  wrapLine("life",  lines.life),
        headLine:  wrapLine("head",  lines.head),
        heartLine: wrapLine("heart", lines.heart),
        fateLine:  wrapLine("fate",  lines.fate),

        mounts: mounts,

        auraField: {
            upper: {
                level: aura.upper,
                meaning: aura.upper < 0.02 ? "Sensitive emotional field" :
                         aura.upper < 0.05 ? "Active emotional vibrations" :
                          "Strong emotional projection"
            },
            middle: {
                level: aura.middle,
                meaning: aura.middle < 0.02 ? "Stress-prone mindfield" :
                         aura.middle < 0.05 ? "Balanced mental activity" :
                          "Highly active mindful aura"
            },
            lower: {
                level: aura.lower,
                meaning: aura.lower < 0.02 ? "Low prāṇa; needs restoration" :
                         aura.lower < 0.05 ? "Moderate life-force aura" :
                          "Strong foundational aura"
            }
        },

        finalMessage: "You are evolving — your energy is shifting toward a higher path."
    };
}
