import { generatePalmReport } from "./report.js";
import { detectLines } from "./vision-map.js";

export async function analyzeRealPalm(imgData, side) {
  const vision = await detectLines(imgData);
  const report = await generatePalmReport(vision, side);
  return `<div class="miniReport">${report}</div>`;
}
