import { startCam, capture } from "./camera.js";
import { drawAura } from "./aura.js";
import { drawLines } from "./lines.js";

const statusEl = document.getElementById("status");

// Camera start buttons
document.getElementById("startCamLeft").onclick = ()=>startCam("left", statusEl);
document.getElementById("startCamRight").onclick = ()=>startCam("right", statusEl);

// Capture buttons
document.getElementById("captureLeft").onclick = ()=>{
  capture("left", ctx=>{
    drawAura(document.getElementById("canvasLeftAura").getContext("2d"));
    drawLines(document.getElementById("canvasLeftLines").getContext("2d"));
  });
};

document.getElementById("captureRight").onclick = ()=>{
  capture("right", ctx=>{
    drawAura(document.getElementById("canvasRightAura").getContext("2d"));
    drawLines(document.getElementById("canvasRightLines").getContext("2d"));
  });
};
