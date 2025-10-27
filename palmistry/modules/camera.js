export async function startCamera(video,msg,file="camera.js"){
  try{
    const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"}});
    video.srcObject=stream;
    msg.textContent="✅ Camera started.";
    window.__loadedModules[file]=true;
  }catch(err){
    msg.textContent="❌ Camera error: "+err.message;
    document.dispatchEvent(new CustomEvent("buddhi-error",{detail:{
      type:"camera",file,line:12,message:err.message
    }}));
  }
}
