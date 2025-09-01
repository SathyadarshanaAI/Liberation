// kp-chart.js

// Zodiac Signs
const ZODIACS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

// Nakshatras & their Lords
const NAKSHATRAS = [
  { name: 'Ashwini', lord: 'Ketu' }, { name: 'Bharani', lord: 'Venus' }, /* ... */ { name: 'Revati', lord: 'Mercury' }
];

// Sub-Lord Sequence (Vimshottari Dasa order)
const SUB_LORDS = ['Ketu','Venus','Sun','Moon','Mars','Rahu','Jupiter','Saturn','Mercury'];

// Helper: Zodiac sign from degree
function getZodiacSign(degree) {
  return ZODIACS[Math.floor((degree % 360) / 30)];
}

// Helper: Nakshatra from degree
function getNakshatra(degree) {
  const index = Math.floor((degree % 360) / (13 + 1/3));
  return NAKSHATRAS[index];
}

// Helper: Sub Lord (KP logic simplified)
function getSubLord(degree) {
  // Simplified: Use degree % 120, divided by dasa period length, etc.
  // KP sub-lord real calculation is complex!
  const dasaLength = [7,20,6,10,7,18,16,19,17]; // years
  let pos = degree % 120;
  let lordIdx = 0;
  let offset = 0;
  for(let i=0;i<dasaLength.length;i++) {
    offset += dasaLength[i] * 360/120;
    if(pos < offset) {
      lordIdx = i;
      break;
    }
  }
  return SUB_LORDS[lordIdx];
}

// Main: Generate KP Chart Data for planets (needs planetary degrees as input)
function generateKPChart(planets) {
  // planets: array of { name: 'Sun', degree: 123.45 }
  return planets.map(p => {
    const sign = getZodiacSign(p.degree);
    const nak = getNakshatra(p.degree);
    const sublord = getSubLord(p.degree);
    return {
      planet: p.name,
      degree: p.degree,
      sign,
      nakshatra: nak.name,
      nakLord: nak.lord,
      subLord: sublord
    };
  });
}

// Example usage (stubbed data):
const samplePlanets = [
  { name: 'Sun', degree: 123.45 },
  { name: 'Moon', degree: 210.12 },
  { name: 'Mars', degree: 17.89 },
  // ... add all planets
];

// Usage:
const kpTable = generateKPChart(samplePlanets);
console.log(kpTable);

