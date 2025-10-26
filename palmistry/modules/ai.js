// modules/ai.js — 🪷 Serenity AI Voice Engine V1.3 (12-Language Auto Mode)

export function speak(text) {
  if (!window.speechSynthesis) {
    console.warn("Speech synthesis not supported.");
    return;
  }

  // --- Detect language ---
  let lang = "en-US";
  const patterns = {
    "si-LK": /[අ-ෆ]/,                 // Sinhala
    "ta-IN": /[அ-ஹ]/,                 // Tamil
    "hi-IN": /[अ-ह]/,                 // Hindi
    "zh-CN": /[\u4e00-\u9fff]/,       // Chinese
    "ja-JP": /[\u3040-\u30ff]/,       // Japanese
    "ko-KR": /[\u1100-\u11FF]/,       // Korean
    "ar-SA": /[\u0600-\u06FF]/,       // Arabic
    "es-ES": /[¿¡áéíóúñ]/,            // Spanish
    "fr-FR": /[àâçéèêëîïôûùüÿœ]/,     // French
    "de-DE": /[äöüß]/,                // German
    "it-IT": /[àèéìòù]/,              // Italian
    "ru-RU": /[А-Яа-яЁё]/             // Russian
  };

  for (const [code, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) { lang = code; break; }
  }

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = 0.95;
  utter.pitch = 1;
  utter.volume = 1;

  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    const v = voices.find(v => v.lang.startsWith(lang.split('-')[0])) ||
              voices.find(v => v.lang === lang);
    if (v) utter.voice = v;
  }

  setTimeout(() => window.speechSynthesis.speak(utter), 150);
  console.log(`🔊 Speaking (${lang}): ${text}`);
}
