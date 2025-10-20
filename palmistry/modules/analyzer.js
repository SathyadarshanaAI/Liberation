// modules/analyzer.js — (ADD these imports + emits)
import { emit } from "./bus.js";

// Call this from UI: runAnalysis({hand:'left'|'right'})
export async function runAnalysis({ hand = "left" } = {}){
  const start = performance.now();
  emit("analyzer:status", { level:"info", msg:`start ${hand}` });

  // 1) preprocess (example logs)
  emit("analyzer:step", { tag:"preprocess", msg:"denoise + normalize" });

  // ... your actual preprocessing
  // emit intermediate metrics
  emit("analyzer:metric", { key:`${hand}.contrast`, val: 0.82 });
  emit("analyzer:metric", { key:`${hand}.edges`, val: 1532 });

  // 2) model inference (worker / onnx)
  emit("analyzer:step", { tag:"inference", msg:"onnx run" });
  // const modelOut = await onnxRun(...)
  // demo fake:
  const modelOut = {
    lines: {
      life:  { length: 82, clarity: 0.88, slope: 9,  breaks: 0, crosses: 1 },
      head:  { length: 76, clarity: 0.74, slope: 14, breaks: 1, crosses: 0 },
      heart: { length: 69, clarity: 0.79, slope: 7,  breaks: 0, crosses: 1 }
    }
  };
  emit("analyzer:metric", { key:`${hand}.life.length`,  val: modelOut.lines.life.length });
  emit("analyzer:metric", { key:`${hand}.head.slope`,   val: modelOut.lines.head.slope });
  emit("analyzer:metric", { key:`${hand}.heart.clarity`, val: modelOut.lines.heart.clarity });

  // 3) fusion (rules + model) → insights
  emit("analyzer:step", { tag:"fusion", msg:"ruleset merge" });
  // const fusion = fuseInsights(modelOut)
  const fusion = {
    summary: "Strong vitality, analytical mind, sincere emotions.",
    all: [
      { id:"life-slope-up",     weight:0.70, meaning:"Optimism & vitality" },
      { id:"head-length-long",  weight:0.80, meaning:"Analytical depth" },
      { id:"heart-clarity-strong", weight:0.90, meaning:"Emotional stability" }
    ]
  };
  const score = (fusion.all.reduce((a,b)=>a+b.weight,0)/fusion.all.length).toFixed(2);
  emit("analyzer:metric", { key:`${hand}.fusion.score`, val: Number(score) });

  const ms = (performance.now() - start).toFixed(0);
  emit("analyzer:status", { level:"ok", msg:`done ${hand} (${ms} ms)` });

  return fusion;
}
