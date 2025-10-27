export async function generatePalmReport(v,side){
  let tone = side==="left"?"emotionally intelligent":"logically disciplined";
  const energy = (v.life.strength + v.heart.clarity + v.head.depth)*33.3;
  return `
  <h3>🤖 AI RealScan Report (${side} hand)</h3>
  <p>Your ${tone} side shows a ${v.life.curve} life line and a clear heart line,
  indicating persistence and depth of feeling. The head line reveals ${v.head.angle>10?"creative divergence":"focused precision"}.
  Fate line ${v.fate.split?"shows dual opportunities":"remains steady"}.
  <br><br><b>✨ Energy Index:</b> ${energy.toFixed(2)}</p>`;
}
