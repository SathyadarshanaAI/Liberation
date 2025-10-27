// voice.js — AI Buddhi Voice Summary (Sinhala/English/Tamil auto-switch)
export function speak(text, lang = "en") {
  let voiceLang = "en-US";
  if (lang === "si") voiceLang = "si-LK";
  if (lang === "ta") voiceLang = "ta-IN";

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = voiceLang;
  utter.pitch = 1.05;
  utter.rate = 1.0;
  utter.volume = 1.0;

  // select best voice available
  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) {
    const match = voices.find(v => v.lang.startsWith(voiceLang));
    if (match) utter.voice = match;
  }

  speechSynthesis.cancel();
  speechSynthesis.speak(utter);
}
