// 🕉️ voice.js — Buddhi Voice System (Mobile Friendly 12-Language Edition)
export function speak(text, lang = "en") {
  try {
    if (!("speechSynthesis" in window)) {
      console.warn("⚠️ Speech synthesis not supported on this browser.");
      return;
    }

    const langMap = {
      en: "en-US",
      si: "si-LK",
      ta: "ta-IN",
      hi: "hi-IN",
      fr: "fr-FR",
      es: "es-ES",
      de: "de-DE",
      ru: "ru-RU",
      zh: "zh-CN",
      ja: "ja-JP",
      ar: "ar-SA",
      pt: "pt-PT",
    };

    const voiceLang = langMap[lang] || "en-US";
    const utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = voiceLang;
    utter.pitch = 1.05;
    utter.rate = 1.0;
    utter.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(voiceLang));
    if (match) utter.voice = match;

    window.speechSynthesis.cancel(); // stop any ongoing speech
    window.speechSynthesis.speak(utter);
    console.log(`🎤 Speaking in ${utter.lang}`);
  } catch (e) {
    console.error("🔇 Voice system error:", e);
  }
}
