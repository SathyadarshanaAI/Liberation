/*  True Vision Analyzer – Overlay Renderer v2.0.1
    Renders detected edges + symbolic AI line guides  */

import { colorMap } from "./ai-segmentation.js";

export function renderOverlay(overlay, edges, result=null){
  overlay.width = edges.width;
  overlay.height = edges.height;
  const ctx = overlay.getContext("2d");
  ctx.putImageData(edges, 0, 0);

  if(result){
    const lines = ["life","head","heart","fate"];
    lines.forEach((ln,i)=>{
      const c = colorMap[ln];
      ctx.strokeStyle = c;
      ctx.lineWidth = 2;
      ctx.beginPath();
      const y = overlay.height * (0.3 + i*0.1);
      ctx.moveTo(overlay.width * 0.25, y);
      ctx.lineTo(overlay.width * 0.75, y);
      ctx.stroke();
    });
  }
}
