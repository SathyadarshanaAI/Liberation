// modules/report.js — Quantum Palm Analyzer V6.0a · Truth Guard + Auto Translator
import { translateText } from "./translator.js";

export async function generatePalmReport(data, mode = "mini", lang = "auto") {
  const { hand = "Left", density = 50, name = "Seeker" } = data;
  const path = hand === "Left" ? "past" : "present";
  const densityDesc =
    density > 70
      ? "clear and radiant"
      : density > 40
      ? "balanced and thoughtful"
      : "soft and introspective";

  let reportHTML = "";

  // === MINI REPORT ===
  if (mode === "mini") {
    reportHTML = `
      <h3>🪶 ${hand} Hand ${path === "past" ? "Karmic" : "Life"} Summary</h3>
      <p>
      Dear ${name}, your ${hand.toLowerCase()} hand reflects a ${densityDesc} pattern of lines,
      revealing ${path === "past" ? "deep karmic roots and emotional memory" : "a conscious path of transformation"}.
      The <b>Life Line</b> shows endurance and steady growth, while the <b>Head Line</b> expresses calm insight.
      A soft <b>Heart Line</b> denotes empathy and devotion, and the <b>Fate Line</b> runs with quiet determination.
      You possess harmony between intellect and emotion, showing balance of heart and purpose.
      This hand mirrors a soul walking in truth, embracing patience and light through every trial.
      </p>
      <p><i>— Buddhi AI · Quantum Palm Analyzer V6.0a</i></p>`;
  }

  // === DEEP REPORT ===
  else {
    reportHTML = `
      <h2>🌕 ${hand} Hand Deep Soul Analysis</h2>
      <p>
      This ${hand.toLowerCase()} hand reveals the ${path === "past"
        ? "spiritual memory of previous lifetimes and karmic impressions."
        : "living expression of your present destiny and evolving awareness."}
      Each of the eight lines signifies one aspect of divine experience —
      the bridges between body, mind, and eternal consciousness.
      </p>
      <h3>1️⃣ Life Line (🔴 Vitality)</h3><p>Represents life energy and endurance. Your life current flows ${densityDesc}.</p>
      <h3>2️⃣ Head Line (🔵 Wisdom)</h3><p>Symbol of thought and learning, reflecting balance and deep reasoning.</p>
      <h3>3️⃣ Heart Line (💚 Compassion)</h3><p>Emotional truth and love without attachment, revealing inner grace.</p>
      <h3>4️⃣ Fate Line (🟡 Destiny)</h3><p>Karmic thread from birth to realization — destiny shaped by service.</p>
      <h3>5️⃣ Sun Line (🟣 Creativity)</h3><p>Represents artistic inspiration and recognition earned through virtue.</p>
      <h3>6️⃣ Health Line (🟠 Healing)</h3><p>Shows balance between body and mind — awareness of vitality.</p>
      <h3>7️⃣ Marriage Line (🌸 Unity)</h3><p>Union shaping evolution and completion of emotional dharma.</p>
      <h3>8️⃣ Bracelet Lines (⚪ Protection)</h3><p>Spiritual rings symbolizing karmic boundaries and inherited blessings.</p>
      <p><i>— Buddhi AI · Quantum Palm Analyzer V6.0a · Truth Guard Edition</i></p>`;
  }

  // === TRANSLATION STAGE ===
  const detectedLang = lang === "auto" ? navigator.language.slice(0, 2) : lang;
  if (detectedLang !== "en") {
    try {
      const translated = await translateText(reportHTML, detectedLang);
      return translated;
    } catch (e) {
      console.warn("Translation failed:", e);
      return reportHTML;
    }
  }

  return reportHTML;
}
