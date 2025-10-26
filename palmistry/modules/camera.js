import { emit } from "./bus.js";
console.log("📷 camera module loaded");

export async function startCamera(side){
  const vid=document.getElementById(`vid-${side}`);
  try{
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
    vid.srcObject=stream;
    emit("camera:ready",{side});
  }catch(e){
    alert("Camera error: "+e.message);
  }
}

export function capture(side){
  const vid=document.getElementById(`vid-${side}`);
  const canvas=document.getElementById(`canvas-${side}`);
  const ctx=canvas.getContext("2d");
  ctx.drawImage(vid,0,0,canvas.width,canvas.height);
  canvas.style.display="block";
  emit("capture:done",{side});
}
