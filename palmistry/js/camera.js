export let streamL,streamR;

export async function startCam(side){
 const vid=document.getElementById(side==="left"?"vidLeft":"vidRight");
 const st=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
 vid.srcObject=st;
 if(side==="left")streamL=st;else streamR=st;
 document.getElementById("status").textContent=`${side} camera started ✅`;
}

export async function capture(side,callback){
 const vid=document.getElementById(side==="left"?"vidLeft":"vidRight");
 const cvs=document.getElementById(side==="left"?"canvasLeft":"canvasRight");
 const ctx=cvs.getContext("2d");
 ctx.drawImage(vid,0,0,cvs.width,cvs.height);
 cvs.classList.add("lockedImg");
 document.getElementById("status").textContent=`${side} hand captured 🔒`;
 vid.pause();vid.srcObject?.getTracks().forEach(t=>t.stop());
 if(document.getElementById("canvasLeft").classList.contains("lockedImg") &&
    document.getElementById("canvasRight").classList.contains("lockedImg")){
   callback();
 }
}
