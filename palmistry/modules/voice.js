// modules/voice.js — multilingual AI voice narration (12-language)
// © 2025 Sathyadarshana Research Core

const LANGUAGES = {
  en:  "English",
  si:  "Sinhala",
  ta:  "Tamil",
  hi:  "Hindi",
  zh:  "Chinese (Mandarin)",
  ja:  "Japanese",
  ko:  "Korean",
  es:  "Spanish",
  fr:  "French",
  de:  "German",
  ru:  "Russian",
  ar:  "Arabic"
};

// detect browser voice list
let voices = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
    };
  }
}

// main TTS function
export function speakText(text, lang = "en", rate = 1) {
  if (!text) return;

  loadVoices();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = mapLangCode(lang);
  utter.rate = rate;
  utter.pitch = 1;

  // choose matching voice if available
  const v = voices.find(v => v.lang.toLowerCase().includes(lang));
  if (v) utter.voice = v;

  window.speechSynthesis.speak(utter);
  console.log(`🔊 Speaking [${LANGUAGES[lang] || lang}] →`, text);
}

// stop any playing speech
export function stopSpeak() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    console.log("🛑 Speech stopped.");
  }
}

// map short codes to full locale codes
function mapLangCode(code) {
  const map = {
    en: "en-US",
    si: "si-LK",
    ta: "ta-IN",
    hi: "hi-IN",
    zh: "zh-CN",
    ja: "ja-JP",
    ko: "ko-KR",
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    ru: "ru-RU",
    ar: "ar-SA"
  };
  return map[code] || "en-US";
}

// Example usage:
// speakText("Hello world", "en");
// speakText("ආයුබෝවන් අනුරද්ද", "si");
// speakText("வணக்கம்", "ta");
