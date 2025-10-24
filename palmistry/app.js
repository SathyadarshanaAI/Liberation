// === Symbolic Reasoner Core (V8.3) ===
function symbolicReasoner(clarity, brightness) {
  const findings = [];

  // Logical relationships based on ratios
  if (clarity > 0.55 && brightness > 0.55)
    findings.push("Lines are luminous and stable — denotes harmony between karmic and present energies.");
  if (clarity < 0.35 && brightness > 0.6)
    findings.push("Spiritual potential high, but worldly restlessness present.");
  if (clarity > 0.45 && brightness < 0.4)
    findings.push("Deep-rooted karmic memory influencing physical life force.");
  if (Math.abs(clarity - brightness) < 0.05)
    findings.push("Balanced duality between past and present lives — transformation imminent.");
  if (clarity > 0.6)
    findings.push("Strong intuitive foresight; seeker of hidden truths.");
  if (brightness < 0.3)
    findings.push("Shadowed subconscious; meditation and faith advised.");

  // Unique pattern markers (AI placeholders for future shape detection)
  findings.push("🔹 Cross pattern near Life Line → Major destiny reconfiguration.");
  findings.push("⭐ Star near Fate Line → Sudden recognition or spiritual elevation.");
  findings.push("⚡ Fork in Head Line → Dual paths of logic and imagination.");
  findings.push("🌙 Island in Heart Line → Emotional sensitivity requiring healing.");
  findings.push("🔥 Chain marks along Sun Line → Creative obstacles transforming into wisdom.");
  findings.push("💧 Break on Health Line → Temporary imbalance, rest recommended.");
  findings.push("🔱 Rising Manikanda Line → Divine awakening through karma purification.");

  return findings.join("\n");
}

// integrate this within analyze() after main report
function analyzeWithSymbolic(side, clarity, brightness) {
  const reasonText = symbolicReasoner(clarity, brightness);
  const combined = `\n\n🧩 Symbolic Reasoning (${side} hand)\n──────────────────────────────\n${reasonText}\n──────────────────────────────\n🕊️ The balance of karma and present destiny converges within the seeker.\n`;
  return combined;
}
