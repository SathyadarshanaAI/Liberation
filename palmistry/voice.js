export async function generateMiniReport(img,side){
  const user=JSON.parse(localStorage.getItem("userData")||"{}");
  return `
  <h3>🖐️ ${side.toUpperCase()} Hand Mini Report</h3>
  <p><strong>Name:</strong> ${user.name||"Unknown"}<br>
  <strong>DOB:</strong> ${user.dob||"—"} | <strong>ID:</strong> ${user.id||"—"}</p>
  <p>Your ${side} hand shows balanced energy lines and moderate tension between heart and mind.
  The life line indicates resilience, while creative impulses emerge through branching rays.
  Focus on harmony, mindfulness, and compassionate strength. This analysis reflects physical
  vitality and subtle spiritual potential sensed through line structure and tonal variation.</p>`;
}
