export async function generatePalmReport(v, side) {
  const tone = side === "left" ? "emotionally intelligent" : "logically disciplined";
  const energy = (v.life.strength + v.heart.clarity + v.head.depth) * 33.3;
  const twist = v.fate.split
    ? "Your fate line shows dual opportunities — inner transformation ahead."
    : "A steady fate line indicates grounded progress and consistent goals.";

  return `
  <h3>🧘 AI RealScan Report (${side} hand)</h3>
  <p>Your ${tone} side shows a ${v.life.curve} life line and a clear heart line,
  indicating persistence and depth of feeling. The head line reveals creative precision and insight.
  ${twist}</p>
  <p>✨ <b>Energy Index:</b> ${energy.toFixed(2)}</p>
  <hr style="border:0;height:1px;background:#00e5ff30;">`;
}
