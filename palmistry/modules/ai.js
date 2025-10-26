// modules/ai.js — Sathyadarshana Voice Engine (V10.4)
export function speak(text, lang = "en") {
  try {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Speech synthesis not supported in this browser.");
      return;
    }

    const voice = new SpeechSynthesisUtterance(text);
    voice.lang = lang;
    voice.rate = 1;
    voice.pitch = 1;
    synth.speak(voice);
  } catch (e) {
    console.warn("AI voice error:", e);
  }
}
