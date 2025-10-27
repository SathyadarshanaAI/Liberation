// 🕉️ Buddhi Voice System · Quantum Multilingual Engine (V11.8)
export function speak(text, lang = "en") {
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
    pt: "pt-BR"
  };

  const voiceLang = langMap[lang] || "en-US";
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = voiceLang;
  utter.pitch = 1.05;
  utter.rate = 1.0;
  utter.volume = 1.0;

  // 🧠 Voice selection logic
  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    const match = voices.find(v => v.lang.toLowerCase().startsWith(voiceLang.toLowerCase()));
    if (match) utter.voice = match;
  }

  // 🎛️ Soft cancel + retry (browser bug prevention)
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel();
    setTimeout(() => speechSynthesis.speak(utter), 300);
  } else {
    speechSynthesis.speak(utter);
  }

  // 🧩 Feedback logs
  utter.onstart = () => console.log(`🎤 Buddhi speaking in [${utter.lang}]`);
  utter.onerror = (e) => console.error("❌ Buddhi voice error:", e);
  utter.onend = () => console.log("🔚 Voice complete.");
}
