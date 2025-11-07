// server.js — V26.0 AI Palm Mock Analyzer
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/analyze", async (req, res) => {
  const { image } = req.body;
  console.log("📥 Palm image received, analyzing...");

  // 🔮 Simulated AI prediction
  const result = {
    life_line: "strong & deep — long vitality",
    head_line: "clear — intellectual balance",
    heart_line: "curved upward — emotional warmth",
    fate_line: "visible — goal oriented",
    energy_field: "Harmonic Resonance 87%",
    summary: "Stable mind, compassionate nature, destined for leadership"
  };

  res.json(result);
});

app.listen(5000, () => console.log("🚀 AI Analyzer running on port 5000"));
