// main.js — Runtime entry for Quantum Palm Analyzer

import { systemInit } from "./core/init.js";
import { initCamera } from "./modules/camera.js";
import { initSideBoot } from "./modules/sideboot.js";
import { initAnalyzer } from "./modules/analyzer.js";
import { bindUI } from "./modules/ui-bridge.js";
import { exportPalmPDF } from "./modules/pdf.js";
import { i18nInit } from "./modules/i18n.js";

export async function main() {
  console.log("🚀 Launching Quantum Palm Analyzer Runtime");

  // Step 1 — Initialize environment
  await systemInit();

  // Step 2 — Initialize base modules
  try {
    await i18nInit();
    initCamera();
    initAnalyzer();
    initSideBoot();
    bindUI();
  } catch (err) {
    console.error("❌ Module initialization error:", err);
  }

  // Step 3 — Log readiness
  console.log("✨ All modules active — UI ready for interaction");
}

// Auto-run main when document fully loaded
window.addEventListener("DOMContentLoaded", main);
