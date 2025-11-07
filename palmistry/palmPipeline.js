// palmPipeline.js — AI API Handler
export async function analyzePalmAI(base64Image) {
  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64Image })
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("AI request failed:", err);
    return { error: "AI server unreachable" };
  }
}
