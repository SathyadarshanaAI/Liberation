// 🕉️ Sathyadarshana Quantum Palm Analyzer · V15.0 True Vision Edition
// dharmaMode.js — Root Dhamma Integration for all palm readings (English Version)

import { speak } from "./voice.js";

// === Activate Dharma Mode ===
export function activateDharmaMode(reportEl) {
  const dharmaText = `
  🕉️ <b>Root Dhamma Principle · Causal Law of Truth</b><br>
  Reading the palm is the art of seeing the threefold flow of time — 
  the Past (your previous actions and thoughts), 
  the Present (your consciousness and awareness), 
  and the Future (the truth-path you are shaping through wisdom).<br><br>
  <i>Every line upon the palm is a verse in the book of causes — 
  the past that formed, the present that feels, 
  and the future that blooms through awareness.</i><br><br>
  🌿 Whoever observes these lines with the eye of truth 
  perceives the link between Karma and Vipāka, 
  and attains a vision of the world where causes and results dance together in harmony.
  `;

  reportEl.innerHTML = dharmaText;
  speak(
    "This is the principle of Root Dhamma. The lines of your palm reveal the flow of causes and effects — the past, the present, and the future."
  );
}

// === Describe Individual Palm Lines ===
export function describeLineDhamma(lineName) {
  const map = {
    Life: "Karmic vitality – past actions shaping the energy of this moment.",
    Head: "Conscious thought – mindfulness and perception in action.",
    Heart: "Compassionate awareness – kindness arising from understanding.",
    Fate: "Karmic path – destiny unfolding within the truth.",
    Sun: "Wisdom light – illumination and realization within consciousness.",
    Health: "Body–karma balance – harmony between action and physical being.",
    Marriage: "Union of causes – the interconnection of karma and relationships.",
    Manikanda:
      "Symbol of awakening – the crossing point of wisdom and karma.",
  };
  return (
    map[lineName] ||
    "Unrevealed or unknown line – awaiting understanding within the Dharma."
  );
}
