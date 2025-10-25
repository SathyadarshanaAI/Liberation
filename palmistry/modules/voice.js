// modules/voice.js — Multilingual AI Voice Narration (12 Languages)
// © 2025 Sathyadarshana Research Core · Hybrid Engine (Offline + Online)

const LANGUAGES = {
  en: "English", si: "Sinhala", ta: "Tamil", hi: "Hindi",
  zh: "Chinese (Mandarin)", ja: "Japanese", ko: "Korean",
  es: "Spanish", fr: "French", de: "German",
  ru: "Russian", ar: "Arabic"
};

// ---- Internal Voice Cache ----
let voices = [];
function loadVoices() {
  voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
    };
  }
}

// ---- Main Speak Function ----
export async function speakText(text, lang = "en", rate = 1) {
  if (!text) return;
  loadVoices();

  // Try offline TTS first
  const voiceLang = mapLangCode(lang);
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = voiceLang;
  utter.rate = rate;
  utter.pitch = 1;

  const match = voices.find(v => v.lang.toLowerCase().includes(lang));
  if (match) utter.voice = match;

  // If browser has the voice → speak natively
  if (match) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    console.log(`🔊 Native voice → ${LANGUAGES[lang]} (${match.name})`);
    return;
  }

  // Else use Google Translate TTS fallback
  console.warn(`⚠️ No native ${LANGUAGES[lang]} voice found. Using online fallback...`);
  const audioUrl = buildGoogleTTS(text, lang);
  const audio = new Audio(audioUrl);
  audio.play();
  console.log(`🌐 Online TTS [${LANGUAGES[lang]}] →`, text);
}

// ---- Stop Speech ----
export function stopSpeak() {
  if (window.speechSynthesis.speaking) {
    window.speechSynthesis.cancel();
    console.log("🛑 Speech stopped.");
  }
}

// ---- Google-style TTS Fallback ----
function buildGoogleTTS(text, lang) {
  const base = "https://translate.google.com/translate_tts";
  const q = encodeURIComponent(text);
  return `${base}?ie=UTF-8&client=tw-ob&q=${q}&tl=${mapLangCodeShort(lang)}`;
}

// ---- Lang Code Maps ----
function mapLangCode(code) {
  const map = {
    en:"en-US", si:"si-LK", ta:"ta-IN", hi:"hi-IN", zh:"zh-CN",
    ja:"ja-JP", ko:"ko-KR", es:"es-ES", fr:"fr-FR",
    de:"de-DE", ru:"ru-RU", ar:"ar-SA"
  };
  return map[code] || "en-US";
}
function mapLangCodeShort(code) {
  const map = {
    en:"en", si:"si", ta:"ta", hi:"hi", zh:"zh-CN",
    ja:"ja", ko:"ko", es:"es", fr:"fr", de:"de", ru:"ru", ar:"ar"
  };
  return map[code] || "en";
}

// ---- Example Usage ----
// speakText("Hello world", "en");
// speakText("ආයුබෝවන් අනුරද්ද", "si");
// speakText("வணக்கம்", "ta");
// speakText("नमस्ते", "hi");
// speakText("你好", "zh");
// speakText("こんにちは", "ja");
// speakText("안녕하세요", "ko");
// speakText("Hola amigo", "es");
// speakText("Bonjour", "fr");
// speakText("Guten Tag", "de");
// speakText("Здравствуйте", "ru");
// speakText("السلام عليكم", "ar");
