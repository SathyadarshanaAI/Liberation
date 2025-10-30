import { drawPalm } from './drawPalm.js';
import { startCam, capture } from './camera.js';
import { saveUser, clearUser, loadUser } from './userForm.js';

const $=id=>document.getElementById(id);

loadUser();
$("saveBtn").onclick=saveUser;
$("clearBtn").onclick=clearUser;
$("startCamLeft").onclick=()=>startCam("left");
$("startCamRight").onclick=()=>startCam("right");
$("captureLeft").onclick=()=>capture("left",runSequence);
$("captureRight").onclick=()=>capture("right",runSequence);

async function runSequence(){
 $("status").textContent="🧠 AI pre-analyzing palms...";
 await pause(1000);
 drawPalm($("canvasLeft").getContext("2d"));
 drawPalm($("canvasRight").getContext("2d"));
 const u=JSON.parse(localStorage.getItem("userData")||"{}");
 $("report").innerHTML=`⚡ ${u.n||"User"}, scan complete.<br>Energy lines mapped for <b>${u.f||"General"}</b> focus.<br>Wisdom Level: <b>High</b> 🌟`;
}
function pause(ms){return new Promise(r=>setTimeout(r,ms));}
