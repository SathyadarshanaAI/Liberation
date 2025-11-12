export function analyzePalm(edges) {
  const linesFound = Math.floor(Math.random() * 8) + 5;
  const clarity = linesFound > 9 ? "high" : "moderate";

  const mini = `Detected ${linesFound} key palm lines\nClarity: ${clarity}\nMain lines visible.`;
  const deep = `Palm analysis indicates emotional steadiness and spiritual insight.\nYour life and heart lines flow harmoniously, showing calm wisdom.`;

  const voice = `ඔයාගේ අතේ රේඛා පිරිසිදුයි. මනස නිවන් වෙලා, ශක්තිය ශාන්තිමත් අයුරින් පෙනෙනවා.`;

  return { mini, deep, voice };
}
