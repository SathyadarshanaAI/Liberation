import { on } from './bus.js';
on("vision:ready", ({result})=>{
  const speech = new SpeechSynthesisUtterance(result);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
});
