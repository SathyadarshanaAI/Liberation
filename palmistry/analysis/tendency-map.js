export function mapTendencies(lines, mounts) {
  return {
    creativity: mounts.includes("Apollo") ? 0.9 : 0.5,
    discipline: mounts.includes("Saturn") ? 0.85 : 0.4,
    emotionalDepth: lines.heart.strength
  };
}
