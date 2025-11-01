// 🕉️ Sathyadarshana Quantum Palm Analyzer
// brain.js · V18.1 "AI Buddhi Perception Core"
// This version blends image perception, randomness, and intuitive logic
// to generate living, non-repetitive Dharma reports.

export async function analyzePalm(side = "right", canvasId = "canvasRight") {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = img.data;

  // --- Basic Perception Metrics ---
  let brightnessSum = 0, contrastSum = 0;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    brightnessSum += avg;
  }

  const avgBrightness = brightnessSum / (data.length / 4) / 255;
  const energyLevel = Math.min(1, Math.max(0, avgBrightness));

  // Determine mood based on perceived light intensity
  let mood;
  if (energyLevel > 0.7) mood = "radiant";
  else if (energyLevel > 0.4) mood = "balanced";
  else mood = "introspective";

  // --- Dynamic Perceptive Insight Library ---
  const insights = {
    Life: {
      radiant: "Your Life Line glows with vitality — your current strength flows from divine balance.",
      balanced: "Your Life Line shows harmony between effort and rest. You are centered.",
      introspective: "The Life Line seems quiet — your spirit seeks peace and renewal."
    },
    Head: {
      radiant: "Your Head Line reveals sharp clarity and wise decisions.",
      balanced: "A thoughtful mind walks gently between reason and feeling.",
      introspective: "Your thoughts dive deep; wisdom grows in silence."
    },
    Heart: {
      radiant: "The Heart Line shines — compassion overflows and heals others.",
      balanced: "Balanced emotions guide your relationships toward truth.",
      introspective: "You feel deeply and quietly — love matures through reflection."
    },
    Fate: {
      radiant: "Your Fate Line burns with purpose; destiny aligns under your will.",
      balanced: "Your path flows with natural rhythm — karma unfolds gently.",
      introspective: "The Fate Line seems hidden — your true direction awaits discovery."
    },
    Sun: {
      radiant: "A strong Sun Line — creative energy is at its peak.",
      balanced: "Your creative light serves others with calm confidence.",
      introspective: "The Sun Line dims — your light rests, preparing for new expression."
    },
    Health: {
      radiant: "Your Health Line glows — physical and spiritual vitality merge.",
      balanced: "You sustain your energy through mindfulness and rhythm.",
      introspective: "Inner calm must be protected; fatigue whispers through your aura."
    },
    Marriage: {
      radiant: "Harmony and mutual respect shape your current bonds.",
      balanced: "Your partnerships mirror your sincerity and devotion.",
      introspective: "Solitude refines your heart; love deepens through patience."
    },
    Manikanda: {
      radiant: "The Manikanda Line radiates wealth and spiritual protection.",
      balanced: "Prosperity grows through humble service and self-awareness.",
      introspective: "Material gain feels secondary — inner truth becomes your real treasure."
    }
  };

  // --- Choose line interpretation based on mood ---
  const order = ["Life", "Head", "Heart", "Fate", "Sun", "Health", "Marriage", "Manikanda"];
  let report = `🕉️ AI Buddhi Dharma Perceptive Reading
──────────────────────────────
Analyzing: ${side === "left" ? "Left Hand (Past Life)" : "Right Hand (Present Life)"}
Mood Detected: ${mood.toUpperCase()}
──────────────────────────────`;

  for (const line of order) {
    const message = insights[line][mood];
    report += `\n\n${line} Line → ${message}`;
  }

  // --- Special Marks ---
  const marks = [
    "🔺 Triangle Mark: Spiritual awakening or rebirth of purpose.",
    "⭐ Star Mark: Divine blessing or hidden talent.",
    "❌ Cross Mark: Karmic lesson being resolved.",
    "🔵 Circle Mark: Calm spiritual continuity."
  ];
  const mark = marks[Math.floor(Math.random() * marks.length)];

  report += `\n\n✴️ Special Mark Insight: ${
