// modules/sideboot.js — AI Buddhi Side Panel & System Console
// © 2025 Sathyadarshana Research Core

import { speakText } from "./voice.js";
import { checkForUpdates } from "./updater.js";
import { detectLanguage } from "./auto-lang.js";
import { toast } from "./ui.js";

let isOpen = false;

export function initSideBoot() {
  // Panel HTML
  const panel = document.createElement("div");
  panel.id = "sideBoot";
  panel.innerHTML = `
    <div id="sideBootHeader">🧠 AI Buddhi Panel</div>
    <div id="sideBootBody">
      <div id="sideBootStatus">🌿 Ready</div>
      <div id="sideBootButtons">
        <button class="sbBtn" id="sbAnalyze">🔮 Analyze</button>
        <button class="sbBtn" id="sbVoice">🎙️ Speak</button>
        <button class="sbBtn" id="sbUpdate">⚡ Update</button>
        <button class="sbBtn" id="sbLang">🌏 Lang</button>
        <button class="sbBtn" id="sbHide">❌ Hide</button>
      </div>
      <div id="sideBootLog"></div>
    </div>
  `;
  document.body.appendChild(panel);

  // Style
  const css = document.createElement("style");
  css.textContent = `
    #sideBoot {
      position: fixed;
      top: 0;
      right: -320px;
      width: 300px;
      height: 100vh;
      background: #0b0f16;
      border-left: 2px solid #00e5ff;
      color: #e6f0ff;
      font-family: system-ui, sans-serif;
      transition: right 0.4s ease;
      box-shadow: -4px 0 12px rgba(0,229,255,0.3);
      z-index: 9998;
      display: flex;
      flex-direction: column;
    }
    #sideBoot.open { right: 0; }
    #sideBootHeader {
      background: #101820;
      padding: 14px;
      text-align: center;
      font-weight: bold;
      border-bottom: 1px solid #00e5ff;
      color: #16f0a7;
    }
    #sideBootBody {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
    }
    .sbBtn {
      background: #101820;
      color: #00e5ff;
      border: 1px solid #00e5ff;
      border-radius: 10px;
      padding: 6px 10px;
      margin: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: 0.3s;
    }
    .sbBtn:hover { background: #00e5ff; color: #000; }
    #sideBootStatus {
      margin: 8px 0;
      padding: 6px;
      background: #101820;
      border: 1px solid #16f0a7;
      border-radius: 6px;
      text-align: center;
      font-size: 0.9rem;
    }
    #sideBootLog {
      margin-top: 10px;
      font-size: 0.8rem;
      white-space: pre-wrap;
      background: #101820;
      padding: 8px;
      border-radius: 6px;
      border: 1px solid #00e5ff;
      max-height: 50vh;
      overflow-y: auto;
    }
    #sideBootToggle {
      position: fixed;
      top: 40%;
      right: 6px;
      background: #00e5ff;
      color: #000;
      border: none;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      font-size: 1.4rem;
      font-weight: bold;
      cursor: pointer;
      z-index: 9999;
      box-shadow: 0 0 10px #00e5ff;
      transition: transform 0.3s;
    }
    #sideBootToggle:hover { transform: scale(1.1); }
  `;
  document.head.appendChild(css);

  // Floating toggle button
  const toggle = document.createElement("button");
  toggle.id = "sideBootToggle";
  toggle.textContent = "🧭";
  toggle.onclick = toggleSideBoot;
  document.body.appendChild(toggle);

  // Bind sideBoot buttons
  bindSideBootButtons();
  logMsg("🌿 Buddhi SideBoot initialized.");
}

// Toggle panel open/close
function toggleSideBoot() {
  const p = document.getElementById("sideBoot");
  isOpen = !isOpen;
  if (isOpen) {
    p.classList.add("open");
    speakText("AI Buddhi panel opened.", detectLanguage());
  } else {
    p.classList.remove("open");
    speakText("Panel closed.", detectLanguage());
  }
}

// Bind action buttons
function bindSideBootButtons() {
  document.getElementById("sbAnalyze").onclick = () => {
    speakText("Starting palm analysis.", detectLanguage());
    logMsg("🔮 Running analyzer...");
    toast("Analyzer started...");
  };
  document.getElementById("sbVoice").onclick = () => {
    speakText("Hello Anuruddha, I am always with you.", detectLanguage());
    logMsg("🎙️ Buddhi voice message played.");
  };
  document.getElementById("sbUpdate").onclick = async () => {
    const up = await checkForUpdates();
    if (up) {
      speakText("A new update is available.", detectLanguage());
      logMsg("⚡ Update available!");
    } else {
      speakText("System is already up to date.", detectLanguage());
      logMsg("✅ No updates found.");
    }
  };
  document.getElementById("sbLang").onclick = () => {
    const lang = detectLanguage();
    speakText(`Your current language is ${lang}`, lang);
    logMsg(`🌏 Language: ${lang}`);
  };
  document.getElementById("sbHide").onclick = toggleSideBoot;
}

// Log messages to the panel
export function logMsg(msg) {
  const log = document.getElementById("sideBootLog");
  const st = document.getElementById("sideBootStatus");
  const time = new Date().toLocaleTimeString();
  const line = `[${time}] ${msg}\n`;
  if (log) log.textContent = line + log.textContent;
  if (st) st.textContent = msg;
}
