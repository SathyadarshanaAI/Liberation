export function speak(text, lang = "en") {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech not supported");
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

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = langMap[lang] || "en-US";
  utter.rate = 1;
  utter.pitch = 1.05;
  utter.volume = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}
