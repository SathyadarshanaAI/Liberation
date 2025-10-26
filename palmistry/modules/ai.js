// modules/ai.js — 🪷 Sathyadarshana Serenity AI Voice Engine V10.5
// Auto-detects language (Sinhala, Tamil, English) and speaks smoothly

export function speak(text) {
  try {
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported.");
      return;
    }

    // --- Auto Language Detection ---
    let lang = "en-US";
    const siPattern = /[අ-ෆ]/;
    const taPattern = /[அ-ஹ]/;

    if (siPattern.test(text)) lang = "si-LK";
    else if (taPattern.test(text)) lang = "ta-IN";

    // --- Create utterance ---
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.volume = 1;

    // --- Voice preference (select best local voice) ---
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v =>
        v.lang.toLowerCase().includes(lang.split('-')[0])
      );
      if (match) utter.voice = match;
    }

    // --- Speak with smooth pause ---
    setTimeout(() => window.speechSynthesis.speak(utter), 150);

    console.log(`🔊 Speaking (${lang}): ${text}`);
  } catch (e) {
    console.warn("AI voice error:", e);
  }
}
