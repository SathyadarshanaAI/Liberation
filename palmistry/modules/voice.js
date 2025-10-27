export function speak(text, lang="en") {
  try {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = (lang==="si") ? "si-LK" : lang;
    utter.pitch = 1;
    utter.rate = 1;
    speechSynthesis.speak(utter);
  } catch (e) {
    bfLog("🎙️ Voice error: "+e.message,"#ff4444");
  }
}
