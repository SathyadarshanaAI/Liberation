import { startCam, capture } from "./camera.js";
import { drawAura } from "./aura.js";
import { drawLines } from "./lines.js";
import { analyzePalm } from "./aiBrain.js";
import { speak } from "./voice.js";

const statusEl = document.getElementById("status");
const reportEl = document.getElementById("report");

document.getElementById("startCamLeft").onclick = ()=>startCam("left", statusEl);
document.getElementById("startCamRight").onclick = ()=>startCam("right", statusEl);

document.getElementById("captureLeft").onclick = ()=>{
  capture("left", ()=>{
    drawAura(document.getElementById("canvasLeftAura").getContext("2d"));
    drawLines(document.getElementById("canvasLeftLines").getContext("2d"));
    const msg = analyzePalm("left", 0.83);
    reportEl.innerText = msg;
    speak("Left hand analyzed. Compassion and healing karma detected.");
  });
};

document.getElementById("captureRight").onclick = ()=>{
  capture("right", ()=>{
    drawAura(document.getElementById("canvasRightAura").getContext("2d"));
    drawLines(document.getElementById("canvasRightLines").getContext("2d"));
    const msg = analyzePalm("right", 0.91);
    reportEl.innerText = msg;
    speak("Right hand analyzed. Purpose and Dharma alignment detected.");
  });
};
