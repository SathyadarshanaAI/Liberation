// modules/analyzer.js — V10.1 Real Reading Fusion Edition
// © 2025 Sathyadarshana Research Core

import { analyzePalm } from "./vision.js";
import { emit } from "./bus.js";

// Main function: Real AI fusion analyzer
export async function runAnalysis({ hand = "left", mode = "mini" } = {}) {
  emit("analyzer:status", { level: "info", msg: `Start analyzing ${hand} hand` });

  const canvas = document.getElementById(hand === "left" ? "canvas-left" : "canvas-right");
  const vision = await analyzePalm(canvas);

  // Fallback check
  if (!vision || !vision.interpretation) {
    emit("analyzer:status", { level: "error", msg: "Vision module failed" });
    return { summary: "No valid data", all: [] };
  }

  // === Merge findings ===
  const reportParts = [];
  for (const f of vision.interpretation) {
    let tone = "";
    switch (f.name) {
      case "Heart Line":
        tone = hand === "left"
          ? "The heart line reveals echoes of karmic
