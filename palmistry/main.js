import { on, emit } from "./modules/bus.js";
import { speak } from "./modules/ai.js";
import { generateReport } from "./modules/report.js";
console.log("🧠 Main core V10.7 running");

const status=document.getElementById("status");
const panel=document.getElementById("aiPanel");

on("camera:ready",e=>{
  status.textContent=`✅ ${e.side} camera active`;
  speak(`${e.side} camera ready`);
});
on("capture:done",e=>{
  status.textContent=`🖐 ${e.side} hand captured — analyzing…`;
  speak(`${e.side} hand captured, analyzing palm lines.`);
  document.getElementById(`${e.side}Hand`).classList.add("flash");
  setTimeout(()=>{
    generateReport(e.side);
    emit("report:done",{side:e.side});
  },1500);
});
on("report:done",e=>{
  document.getElementById(`${e.side}Hand`).classList.remove("flash");
  status.textContent=`✨ ${e.side} hand report ready!`;
  speak(`${e.side} hand report complete.`);
  panel.style.display="block";
});
