// === AI Buddhi Voice Translator Engine v2.0 ===
// Handles multilingual text translation + auto voice synthesis

export async function translateReport(text, lang) {
  if (!lang || lang === "en") return text;

  try {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
    const json = await res.json();
    const translated = json[0].map(x => x[0]).join("");
    speakTranslated(translated, lang);
    return `🌐 Translated (${lang.toUpperCase()}):\n${translated}`;
  } catch (err) {
    console.warn("Translator offline fallback:", err);
    const offlineMsg = offlineNotice(lang);
    speakTranslated(offlineMsg, lang);
    return `⚠️ ${offlineMsg}`;
  }
}

// === Offline Fallback Messages ===
function offlineNotice(lang) {
  const messages = {
    si: "පරිවර්තනය කළ නොහැකි විය. ඔබගේ උපාංගය අන්තර්ජාලයට සම්බන්ධ කර නැත.",
    ta: "மொழிபெயர்ப்பு தோல்வியடைந்தது. இணைய இணைப்பு இல்லை.",
    hi: "अनुवाद असफल रहा। इंटरनेट कनेक्शन नहीं है।",
    fr: "La traduction a échoué. Pas de connexion Internet.",
    de: "Übersetzung fehlgeschlagen. Keine Internetverbindung.",
    es: "La traducción falló. No hay conexión a Internet.",
    it: "Traduzione non riuscita. Nessuna connessione Internet.",
    ar: "فشل الترجمة. لا يوجد اتصال بالإنترنت."
  };
  return messages[lang] || "Translation unavailable (offline mode).";
}

// === Voice Synthesizer ===
function speakTranslated(text, lang) {
  if (!("speechSynthesis" in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();

  const langMap = {
    si: "si-LK",
    ta: "ta-IN",
    hi: "hi-IN",
    zh: "zh-CN",
    ja: "ja-JP",
    fr: "fr-FR",
    de: "de-DE",
    es: "es-ES",
    it: "it-IT",
    ru: "ru-RU",
    ar: "ar-SA",
    en: "en-US"
  };

  utter.lang = langMap[lang] || "en-US";
  utter.rate = 0.95;
  utter.pitch = 1.0;
  utter.volume = 1.0;
  utter.text = text;

  // Pick appropriate voice
  const v = voices.find(v => v.lang.startsWith(utter.lang));
  if (v) utter.voice = v;

  speechSynthesis.speak(utter);
}
