// =====================================================
// palmPipeline.js — Edge + AI integration
// =====================================================

import { detectPalmEdges } from "./edgeLines.js";

export async function runPalmPipeline(side, canvas) {
  document.getElementById("status").textContent = `🧠 Analyzing ${side} hand...`;
  const ctx = canvas.getContext("2d");
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const lines = await detectPalmEdges(frame, canvas);

  const mini = `Life line: ${lines.life}\nHeart line: ${lines.heart}\nFate line: ${lines.fate}`;
  const deep = `Inner strength and emotional calm visible through ${lines.life} and ${lines.heart}.`;
  document.getElementById(`miniReport${cap(side)}`).textContent = mini;
  document.getElementById(`deepReport${cap(side)}`).textContent = deep;

  document.getElementById("status").textContent = "✨ Analysis Complete!";
  return {
    voice: side === "left"
      ? "ඔයාගේ වම් අතේ රේඛා පිරිසිදුයි. ඔබේ ආත්ම ශක්තිය විශාලයි."
      : "ඔයාගේ දකුණු අතේ රේඛා විශ්වාස සහ නායකත්වය පෙන්වයි.",
  };
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
