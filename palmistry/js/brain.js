// 🕉️ Sathyadarshana Quantum Palm Analyzer
// brain.js · V18.2 Stable Build — Verified & Balanced
// AI Buddhi Perception Core with real light-based mood reading

export async function analyzePalm(side = "right", canvasId = "canvasRight") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    return "❌ No canvas found for analysis.";
  }

  const ctx = canvas.getContext("2d");
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = img.data;

  // === 1. Light Perception ===
  let brightnessSum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    brightnessSum += avg;
  }

  const avgBrightness = brightnessSum / (data.length / 4) / 255;
  const energyLevel = Math.min(1, Math.max(0, avgBrightness));

  // === 2. Determine Mood ===
  let mood;
  if (energyLevel > 0.7) mood = "radiant";
  else if (energyLevel > 0.4) mood = "balanced";
  else mood = "introspective";

  // === 3. Dharma Insight Library ===
  const insights = {
    Life: {
      radiant: "Your Life Line glows with vitality — your strength flows from divine harmony.",
      balanced: "Your Life Line shows harmony between action and rest. You are centered and stable.",
      introspective: "Your Life Line rests in silence — the spirit seeks renewal and reflection."
    },
    Head: {
      radiant: "Your Head Line reveals clarity and focused thought — wisdom in full bloom.",
      balanced: "Your thoughts balance reason and emotion with calm perception.",
      introspective: "A quiet mind thinks deeply — insights rise from your inner silence."
    },
    Heart: {
      radiant: "The Heart Line radiates warmth — compassion and sincerity heal those around you.",
      balanced: "Emotional balance guides your relationships toward mutual peace.",
      introspective: "Your heart moves softly — love refines itself through patience."
    },
    Fate: {
      radiant: "Your Fate Line burns with purpose — destiny aligns with your conscious will.",
      balanced: "Your path flows naturally — you accept karma with wisdom.",
      introspective: "The Fate Line is gentle — your direction unfolds in time through reflection."
    },
    Sun: {
      radiant: "The Sun Line is bright — creativity and inspiration guide your present life.",
      balanced: "Your creative energy serves others with balance and grace.",
      introspective: "The Sun Line dims — creativity rests as you prepare for inner transformation."
    },
    Health: {
      radiant: "Health Line clear — both body and spirit are luminous and strong.",
      balanced: "Steady rhythm between mind and body — serenity maintains vitality.",
      introspective: "Fatigue whispers softly — meditate and rest to restore divine balance."
    },
    Marriage: {
      radiant: "Harmony shapes your bonds — devotion shines through mutual trust.",
      balanced: "Partnerships reflect sincerity and shared purpose.",
      introspective: "Solitude strengthens love — silence deepens the emotional path."
    },
    Manikanda: {
      radiant: "Manikanda Line glows — wealth and divine protection embrace your destiny.",
      balanced: "Material prosperity supports your spiritual mission faithfully.",
      introspective: "Outer gain fades — your treasure now lies within truth itself."
    }
  };

  const order = ["Life", "Head", "Heart", "Fate", "Sun", "Health", "Marriage", "Manikanda"];

  // === 4. Report Start ===
  let report = `🕉️ AI Buddhi Dharma Perceptive Reading
──────────────────────────────
Analyzing: ${side === "left" ? "Left Hand (Past Life)" : "Right Hand (Present Life)"}
Mood Detected: ${mood.toUpperCase()}
──────────────────────────────`;

  // === 5. Line-by-Line Interpretation ===
  for (const line of order) {
    const message = insights[line][mood];
    report += `\n\n${line} Line → ${message}`;
  }

  // === 6. Special Mark Insight ===
  const marks = [
    "🔺 Triangle Mark: Spiritual awakening or the rebirth of vision.",
    "⭐ Star Mark: Divine blessing, rare intuition, or special destiny.",
    "❌ Cross Mark: A karmic lesson transforming into strength.",
    "🔵 Circle Mark: Continuous flow of peace and subtle power."
  ];
  const mark = marks[Math.floor(Math.random() * marks.length)];

  report += `\n\n✴️ Special Mark Insight: ${mark}`;
  report += `\n🕰️ Generated: ${new Date().toLocaleTimeString()}\n`;

  return report;
}
