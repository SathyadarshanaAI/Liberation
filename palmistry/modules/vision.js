// Mock AI vision — until real model loads
export async function analyzePalm(canvas) {
  console.log("🧠 Simulated vision analysis running...");
  await new Promise(r => setTimeout(r, 1200));
  return {
    interpretation: [
      { name: "Heart Line", meaning: "Strong emotional awareness." },
      { name: "Head Line", meaning: "Focused and intelligent decision-making." },
      { name: "Life Line", meaning: "Good stamina and life energy." },
      { name: "Manikanda Line", meaning: "Spiritual protection indicated." }
    ]
  };
}
