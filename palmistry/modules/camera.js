// modules/camera.js
export async function initCamera(videoId){
  const video = document.getElementById(videoId);
  if(!video) return console.warn("Camera not found:", videoId);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"environment" } });
    video.srcObject = stream;
    console.log(`✅ Camera started for ${videoId}`);
  } catch(err){
    console.error("Camera Error:", err);
  }
}
