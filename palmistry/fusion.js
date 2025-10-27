import { generatePalmReport } from "./report.js";
import { detectLines } from "./vision-map.js";

export async function analyzeRealPalm(img,side){
  const vision = await detectLines(img);
  const report = await generatePalmReport(vision,side);
  return `<div class="miniReport">${report}</div>`;
}
