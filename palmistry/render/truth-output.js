// render/truth-output.js
// Convert lines into a readable mini-report string (approx 400–600 chars)

export function finalReading(lines) {
  if (!lines || lines.length === 0) return "No lines detected.";

  // Find main lines by id
  const find = id => lines.find(l => l.id === id);

  const life = find("life");
  const head = find("head");
  const heart = find("heart");
  const fate = find("fate");

  const parts = [];

  if (life) {
    parts.push(`Life Line: length ${Math.round(life.length)} px — indicates vitality and general life path.`);
  } else parts.push("Life Line: not detected clearly.");

  if (head) {
    parts.push(`Head Line: length ${Math.round(head.length)} px — suggests thinking style and mental focus.`);
  } else parts.push("Head Line: not detected clearly.");

  if (heart) {
    parts.push(`Heart Line: length ${Math.round(heart.length)} px — emotional nature and relationships.`);
  } else parts.push("Heart Line: not detected clearly.");

  if (fate) {
    parts.push(`Fate Line: presence ${Math.round((fate.length||0))} — career/fortune tendencies noted.`);
  }

  // Add short summary
  parts.push("This is a concise AI-generated mini-report. For a full detailed reading (2500 words) request the paid full report.");

  return parts.join("\n\n");
}
