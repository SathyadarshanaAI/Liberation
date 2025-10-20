// modules/auto-lang.js — Auto Language Detection & Switch
// © 2025 Sathyadarshana Research Core

import i18n from "../lang/i18n.json" assert { type: "json" };
import { speakText } from "./voice.js";

// detect browser language
export function detectLanguage() {
  const browserLang = navigator.language || navigator.userLanguage || "en";
  const shortCode = browserLang.split("-")[0].toLowerCase();

  const supported = Object.keys(i18n);
  const finalLang = supported.includes(shortCode) ? shortCode : "en";

  console.log(`🌐 Browser language detected: ${browserLang} → using: ${finalLang}`);
  applyLanguage(finalLang);
  return finalLang;
}

// apply translations to UI
export function applyLanguage(lang) {
  const t = i18n[lang] || i18n.en;

  // bind common UI elements
  const map = {
    "title": "app_title",
    "welcome": "welcome",
    "btnAnalyze": "analyze",
    "btnCapture": "capture",
    "btnSave": "save",
    "btnSpeak": "speak",
    "lblLang": "language",
    "resultTitle": "result_title"
  };

  for (const [id, key] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el && t[key]) el.innerText = t[key];
  }

  // speak welcome text once
  speakText(t.welcome, lang, 1);
}

// run automatically on load
window.addEventListener("DOMContentLoaded", () => {
  detectLanguage();
});
