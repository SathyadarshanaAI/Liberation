export async function analyzePalm(canvas, hand="right") {
  // Later: send to palmnet_v1.onnx via worker/wasm/model
  // Now: Dummy logic
  const ctx = canvas.getContext('2d');
  const img = ctx.getImageData(0,0,canvas.width,canvas.height);

  // Detect main lines (heart, life, fate, etc.) – pseudo
  return {
    hand,
    lines: [
      { type: "heart", confidence: Math.random(), info: "Heart line indicates emotions." },
      { type: "head", confidence: Math.random(), info: "Head line reflects intellect." },
      { type: "life", confidence: Math.random(), info: "Life line shows vitality." },
      // ... more lines
    ],
    tips: "Palmistry is interpreted differently in various cultures."
  };
}
