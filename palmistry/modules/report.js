import { on } from './bus.js';
on("vision:ready", ({side,result})=>{
  const box = document.getElementById("reportBox");
  box.innerHTML = `<b>${side.toUpperCase()} HAND REPORT:</b><br>${result}`;
});
