 export function speak(text, lang="en-US"){
  if(!window.speechSynthesis) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = lang;
  msg.pitch = 1;
  msg.rate = 1;
  msg.volume = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(msg);
}
