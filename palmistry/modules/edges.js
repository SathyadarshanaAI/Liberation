/*  True Vision Analyzer – Edge Detection Module v2.0.1
    Sobel filter optimized for palm line extraction  */

export function detectEdges(img){
  const w=img.width,h=img.height;
  const out=new ImageData(w,h);
  for(let y=1;y<h-1;y++){
    for(let x=1;x<w-1;x++){
      const i=(y*w+x)*4;
      const gx =
        -img.data[((y-1)*w+(x-1))*4] -2*img.data[(y*w+(x-1))*4] -img.data[((y+1)*w+(x-1))*4]
        +img.data[((y-1)*w+(x+1))*4] +2*img.data[(y*w+(x+1))*4] +img.data[((y+1)*w+(x+1))*4];
      const gy =
        -img.data[((y-1)*w+(x-1))*4] -2*img.data[((y-1)*w+x)*4] -img.data[((y-1)*w+(x+1))*4]
        +img.data[((y+1)*w+(x-1))*4] +2*img.data[((y+1)*w+x)*4] +img.data[((y+1)*w+(x+1))*4];
      const g = Math.min(Math.sqrt(gx*gx + gy*gy), 255);
      out.data[i] = 0;
      out.data[i+1] = g * 1.3;
      out.data[i+2] = 255;
      out.data[i+3] = 255;
    }
  }
  return out;
}
