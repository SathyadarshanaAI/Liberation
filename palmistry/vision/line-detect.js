// vision/line-detect.js
// Dummy line detector — returns 8 canonical lines with sample coordinates
// Each line = { id, name, points: [[x,y],[x,y],...] , confidence }

export async function detectLines(palm) {
  const w = palm.bbox.w || 400;
  const h = palm.bbox.h || 600;

  // Generate synthetic lines roughly positioned
  const lines = [
    { id: "life", name: "Life Line", points: [[w*0.15,h*0.85],[w*0.25,h*0.6],[w*0.45,h*0.5]], confidence: 0.9 },
    { id: "head", name: "Head Line", points: [[w*0.1,h*0.5],[w*0.45,h*0.45],[w*0.8,h*0.4]], confidence: 0.9 },
    { id: "heart", name: "Heart Line", points: [[w*0.15,h*0.25],[w*0.45,h*0.2],[w*0.8,h*0.18]], confidence: 0.9 },
    { id: "fate", name: "Fate Line", points: [[w*0.5,h*0.9],[w*0.5,h*0.3]], confidence: 0.65 },
    { id: "sun", name: "Sun Line", points: [[w*0.7,h*0.85],[w*0.75,h*0.4]], confidence: 0.5 },
    { id: "mercury", name: "Mercury Line", points: [[w*0.8,h*0.85],[w*0.82,h*0.55]], confidence: 0.45 },
    { id: "mars", name: "Mars Line", points: [[w*0.2,h*0.9],[w*0.35,h*0.7]], confidence: 0.4 },
    { id: "manikanda", name: "Manikanda (Spiritual Wrist Seal)", points: [[w*0.3,h*0.95],[w*0.7,h*0.95]], confidence: 0.8 }
  ];

  // Attach simple metrics
  lines.forEach(l => {
    l.length = Math.hypot((l.points[0][0]- (l.points[l.points.length-1][0])),
                          (l.points[0][1]- (l.points[l.points.length-1][1])));
  });

  return lines;
}
