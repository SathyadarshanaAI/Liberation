// ===============================
// 🕉️ THE SEED — Palmistry System
// Master Orchestrator
// ===============================

import { initWisdomCore } from "./core/wisdom-core.js";

async function init() {
  console.log("🌱 Initializing The Seed...");
  const w = initWisdomCore();
  console.log("Wisdom:", w);
}

init();
