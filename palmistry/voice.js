// voice.js — Buddhi Voice System (12 Language Support)
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

  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    const match = voices.find(v => v.lang.startsWith(voiceLang));
    if (match) utter.voice = match;
  }

  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}
