import { speak } from "./voice.js";

export function startDialogue(side,text){
  const q=[
    "Would you like to know your future tendencies?",
    "Shall I analyze your emotional depth?",
    "Do you want to generate a full report later?"
  ];
  setTimeout(()=>{speak(`Your ${side} hand reveals strong aura lines. ${q[Math.floor(Math.random()*q.length)]}`,window.currentLang);},5000);
}
