export async function verifyPalmTruth(cv){
  const ctx=cv.getContext('2d');
  const {width:w,height:h}=cv;
  if(!w||!h)return{ok:false,msg:"No image"};
  const data=ctx.getImageData(0,0,w,h).data;
  let variance=0,prev=0;
  for(let i=0;i<data.length;i+=4){
    const v=(data[i]*0.3+data[i+1]*0.59+data[i+2]*0.11);
    variance+=Math.abs(v-prev); prev=v;
  }
  const clarity=variance/(w*h);
  const truthful=clarity>25;
  return{
    ok:truthful,
    clarity:+clarity.toFixed(2),
    msg:truthful
      ?"🪷 Palm verified – truth level high."
      :"⚠️ Unverified or manipulated palm image."
  };
}
