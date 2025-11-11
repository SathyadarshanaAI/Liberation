import { analyzePalm } from "./brain.js";

export async function runPalmPipeline(side, ctx) {
  console.log(`🔍 Running Palm Analyzer for ${side} hand...`);

  // Palm analysis (canvasLeft/canvasRight)
  const buddhiReport = await analyzePalm(side, ctx.canvas.id);

  // Panel update
  document.getElementById(`miniReport${capitalize(side)}`).textContent =
    buddhiReport.split('\n')[3] || "Palm summary unavailable";
  document.getElementById(`deepReport${capitalize(side)}`).textContent = buddhiReport;

  // Voice output
  return { voice: buddhiReport };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
