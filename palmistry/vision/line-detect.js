/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   line-detect.js — 8-Line Detection Engine (v1.0)

   Detects:
   - Life Line
   - Head Line
   - Heart Line
   - Fate Line
   - Sun Line
   - Mercury Line
   - Marriage Line
   - Health Line

   Uses:
   - palmData from palm-detect.js
   - edge detection + ridge contrast mapping
----------------------------------------------------------*/

export function detectLines(palmObj) {

  const { palmCanvas, palmData, width, height } = palmObj;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  ctx.putImageData(palmData, 0, 0);

  /* ---------------------------------------------------------
     STEP 1 — Sobel Edge Detection
  ----------------------------------------------------------*/
  const gray = palmData;
  const edgeData = new Uint8ClampedArray(gray.data.length);

  const sobelX = [-1,0,1, -2,0,2, -1,0,1];
  const sobelY = [-1,-2,-1, 0,0,0, 1,2,1];

  function getPixel(x,y){
    const idx = (y*width + x)*4;
    return gray.data[idx];
  }

  for(let y=1; y<height-1; y++){
    for(let x=1; x<width-1; x++){
      let gx=0, gy=0;
      let k=0;

      for(let j=-1; j<=1; j++){
        for(let i=-1; i<=1; i++){
          let val = getPixel(x+i, y+j);
          gx += val * sobelX[k];
          gy += val * sobelY[k];
          k++;
        }
      }

      const g = Math.sqrt(gx*gx + gy*gy);
      const index = (y*width + x)*4;
      edgeData[index] = edgeData[index+1] = edgeData[index+2] = g > 80 ? 255 : 0;
      edgeData[index+3] = 255;
    }
  }

  const edgeImg = new ImageData(edgeData, width, height);
  ctx.putImageData(edgeImg, 0, 0);

  /* ---------------------------------------------------------
     STEP 2 — Horizontal / Curved Line Fragment Extraction
     (Simple ridge detection for palm lines)
  ----------------------------------------------------------*/

  let lines = {
    life: null,
    head: null,
    heart: null,
    fate: null,
    sun: null,
    mercury: null,
    marriage: null,
    health: null
  };

  /* Core idea:
     - Palm lines appear as high-density horizontal or curved edges.
     - We scan Y-axis bands to find strongest edge clusters.
  */

  function scanBand(yStart, yEnd){
    let strongest = { y: 0, strength: -1 };
    for(let y = yStart; y <= yEnd; y++){
      let count = 0;
      for(let x = 10; x < width-10; x++){
        const idx = (y*width + x)*4;
        if(edgeData[idx] === 255) count++;
      }
      if(count > strongest.strength){
        strongest = { y, strength: count };
      }
    }
    return strongest;
  }

  // Approximate palm vertical segmentation zones
  const heartZone = scanBand(height*0.10, height*0.25);
  const headZone  = scanBand(height*0.26, height*0.40);
  const lifeZone  = scanBand(height*0.41, height*0.58);
  const fateZone  = scanBand(height*0.20, height*0.70);
  const sunZone   = scanBand(height*0.15, height*0.45);
  const mercZone  = scanBand(height*0.10, height*0.35);
  const marrZone  = scanBand(height*0.02, height*0.10);
  const healthZ   = scanBand(height*0.55, height*0.80);

  lines.heart   = heartZone.y;
  lines.head    = headZone.y;
  lines.life    = lifeZone.y;
  lines.fate    = fateZone.y;
  lines.sun     = sunZone.y;
  lines.mercury = mercZone.y;
  lines.marriage= marrZone.y;
  lines.health  = healthZ.y;

  return lines;
}
