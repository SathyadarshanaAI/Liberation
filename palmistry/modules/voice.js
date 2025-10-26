// modules/voice.js — Speech Narration for Sathyadarshana Core
export function speak(text, lang = "en") {
  try {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Speech synthesis not supported.");
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 1;
    utter.pitch = 1;
    synth.speak(utter);
  } catch (e) {
    console.warn("Voice module error:", e);
  }
}
