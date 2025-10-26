export function speak(text,lang="en"){
  const msg=new SpeechSynthesisUtterance(text);
  msg.lang=lang;
  speechSynthesis.speak(msg);
}
