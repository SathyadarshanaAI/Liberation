import { analyzePalm } from "./brain.js"; // Import your AI palm reader

export async function runPalmPipeline(side, ctx) {
  console.log(`🔍 Running Palm Analyzer for ${side} hand...`);

  // 1. AI Dharma Reading (canvas id: "canvasLeft"/"canvasRight")
  const buddhiReport = await analyzePalm(side, ctx.canvas.id);

  // 2. Update Panels
  document.getElementById(`miniReport${capitalize(side)}`).textContent =
    buddhiReport.split('\n')[3] || "Palm summary unavailable";
  document.getElementById(`deepReport${capitalize(side)}`).textContent = buddhiReport;

  // 3. Voice output (return for main.js)
  return { voice: buddhiReport };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
