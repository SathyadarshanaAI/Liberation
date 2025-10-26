import { emit } from "./bus.js";
export function generateReport(side){
  const box=document.getElementById("reportBox");
  box.innerHTML=`<b>${side}</b> hand analysis complete.<br/>AI Buddhi detects clear life, fate and heart lines.`;
  emit("report:done",{side});
}
