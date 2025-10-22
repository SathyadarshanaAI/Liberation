export class CameraCard {
  constructor(container, opts={}){
    this.container=container;
    this.opts=opts;
    this.video=document.createElement('video');
    this.video.autoplay=true;
    this.video.playsInline=true;
    this.video.style.width='260px';
    this.video.style.height='320px';
    container.appendChild(this.video);
  }
  async start(){
    try{
      const stream=await navigator.mediaDevices.getUserMedia({video:this.opts});
      this.video.srcObject=stream;
      this.opts.onStatus?.("📷 Camera started");
    }catch(e){
      this.opts.onStatus?.("❌ Camera error: "+e,false);
    }
  }
  captureTo(canvas,{mirror=false}={}){
    const ctx=canvas.getContext('2d');
    canvas.width=this.video.videoWidth;
    canvas.height=this.video.videoHeight;
    if(mirror){
      ctx.scale(-1,1);
      ctx.drawImage(this.video,-canvas.width,0,canvas.width,canvas.height);
    }else{
      ctx.drawImage(this.video,0,0,canvas.width,canvas.height);
    }
  }
}
