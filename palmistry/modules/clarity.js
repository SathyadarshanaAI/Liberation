/*  True Vision Analyzer – Clarity & Light Module v2.0.1
    Measures brightness + contrast and returns score 0–1  */

export function checkClarity(img){
  let total=0, diff=0, count=0;
  for(let i=0;i<img.data.length;i+=40){
    const r=img.data[i], g=img.data[i+1], b=img.data[i+2];
    const lum = 0.299*r + 0.587*g + 0.114*b;
    const lum2 = 0.299*img.data[i+4] + 0.587*img.data[i+5] + 0.114*img.data[i+6];
    total += lum; diff += Math.abs(lum - lum2); count++;
  }
  const brightness = total / count;
  const contrast = diff / count;
  const clarity = Math.min(((brightness/180) * (contrast/40)), 1);
  return clarity;
}
