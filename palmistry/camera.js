// modules/camera.js
export async function initCamera(containerId){
  const area = document.getElementById(containerId);
  if(!area) return console.warn("Camera area not found!");

  const video = document.createElement("video");
  video.autoplay = true;
  video.playsInline = true;
  video.style.width = "100%";
  video.style.height = "100%";
  video.style.objectFit = "cover";
  video.style.borderRadius = "16px";

  area.appendChild(video);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video:{ facingMode:"environment" } });
    video.srcObject = stream;
    console.log("Camera started successfully.");
  } catch(err){
    console.error("Camera Error:", err);
    area.innerHTML = `<p style="color:#f55">⚠️ Camera access denied or unavailable.</p>`;
  }
}
