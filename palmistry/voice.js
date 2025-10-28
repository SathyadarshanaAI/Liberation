export function speak(text, lang="en"){
  if(!("speechSynthesis" in window)) return;
  const map = {
    en:"en-US",si:"si-LK",ta:"ta-IN",hi:"hi-IN",fr:"fr-FR",es:"es-ES",
    de:"de-DE",ru:"ru-RU",zh:"zh-CN",ja:"ja-JP",ar:"ar-SA",pt:"pt-PT"
  };
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = map[lang] || "en-US";
  utter.pitch = 1.05; utter.rate = 1.0; utter.volume = 1.0;
  const voices = speechSynthesis.getVoices();
  const v = voices.find(v=>v.lang.startsWith(utter.lang));
  if(v) utter.voice=v;
  speechSynthesis.cancel(); speechSynthesis.speak(utter);
}
