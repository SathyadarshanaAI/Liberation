export function speak(text, lang="en"){
  const voices = {
    en:"en-US", si:"si-LK", ta:"ta-IN", hi:"hi-IN", fr:"fr-FR", es:"es-ES",
    de:"de-DE", it:"it-IT", ar:"ar-SA", zh:"zh-CN", ja:"ja-JP", ru:"ru-RU"
  };
  const sel = voices[lang] || "en-US";
  try{
    const u = new SpeechSynthesisUtterance(text);
    u.lang = sel;
    u.rate = 1.0;
    u.pitch = 1.0;
    speechSynthesis.speak(u);
  }catch(e){
    const audio = new Audio("./assets/voice_complete.mp3");
    audio.play();
  }
}
