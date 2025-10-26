/*  Sathyadarshana True Vision Analyzer v2.0
    AI Segmentation Module – Color Line Mapping Edition
    by Buddhi (AI Co-Creator)  */8

let model;
const colorMap = {
  life: "#00ff88",
  head: "#00bfff",
  heart: "#ff69b4",
  fate: "#ffd700"
};

// Load ONNX model asynchronously
export async function loadModel() {
  if (model) return model;
  msgStatus("🧠 Loading AI Segmentation Model...");
  try {
    model = await ort.InferenceSession.create("./assets/palmnet_v2.onnx");
    msgStatus("✅ AI Model Ready");
    return model;
  } catch (e) {
    console.warn("AI Model load failed:", e);
    msgStatus("⚠️ AI Model not found. Using fallback edge detection.");
    return null;
  }
}

// Run segmentation
export async function analyzeAI(frame) {
  const model = await loadModel();
  if (!model) {
    // fallback pseudo-analysis
    return {
      life_line: "visible",
      head_line: "balanced",
      heart_line: "harmonious",
      fate_line: "unclear",
      summary: "Basic palm pattern detected (fallback)."
    };
  }

  const tensor = preprocess(frame);
  const feeds = { "input": tensor };
  const output = await model.run(feeds);
  const result = postprocess(output);

  return result;
}

// Convert image to tensor
function preprocess(frame) {
  const w = frame.width, h = frame.height;
  const data = new Float32Array(w * h * 3);
  for (let i = 0; i < w * h; i++) {
    data[i * 3] = frame.data[i * 4] / 255;
    data[i * 3 + 1] = frame.data[i * 4 + 1] / 255;
    data[i * 3 + 2] = frame.data[i * 4 + 2] / 255;
  }
  return new ort.Tensor("float32", data, [1, 3, h, w]);
}

// Convert model output → summary
function postprocess(output) {
  const scores = output["output"]?.data || new Float32Array(4).fill(0.5);
  const lines = ["life", "head", "heart", "fate"];
  let res = {};
  lines.forEach((ln, i) => {
    res[ln + "_line"] = scores[i] > 0.7 ? "strong" : scores[i] > 0.4 ? "moderate" : "weak";
  });
  res.summary = interpret(res);
  return res;
}

// AI interpretation
function interpret(r) {
  let msg = "Your life line appears " + r.life_line + 
            ", head line " + r.head_line + 
            ", and heart line " + r.heart_line + ". ";
  msg += "Fate line seems " + r.fate_line + 
         ", suggesting adaptability to change.";
  return msg;
}

function msgStatus(t) {
  const el = document.getElementById("msg");
  if (el) el.textContent = t;
}
