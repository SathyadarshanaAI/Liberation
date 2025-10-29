// palmistry/camera.js
export class PalmCamera {
  constructor(videoEl, canvasEl, boxId){
    this.video = videoEl;
    this.canvas = canvasEl;
    this.boxId = boxId;
    this.stream = null;
  }

  async start(){
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: {ideal: 1280}, height: {ideal: 720} }
      });
      this.video.srcObject = this.stream;
      this.video.style.transform = "scaleX(1)"; // avoid mirror
      this.startBeam();
    } catch(e){
      alert("Camera error: " + e.message);
    }
  }

  capture(){
    const ctx = this.canvas.getContext("2d");
    const w = this.canvas.width, h = this.canvas.height;
    ctx.save();
    ctx.scale(1,1);  // no flip
    ctx.drawImage(this.video, 0, 0, w, h);
    ctx.restore();
    localStorage.setItem(`palm_${this.boxId}`, this.canvas.toDataURL("image/png"));
    this.stopBeam();
  }

  stop(){
    this.stream?.getTracks().forEach(t=>t.stop());
    this.stopBeam();
  }

  startBeam(){
    document.querySelector(`#${this.boxId} .scanBeam`).style.display="block";
  }
  stopBeam(){
    document.querySelector(`#${this.boxId} .scanBeam`).style.display="none";
  }
}
