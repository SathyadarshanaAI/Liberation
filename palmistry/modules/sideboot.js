// modules/sideboot.js — AI Buddhi Side Panel with Live Analyzer Feed
// © 2025 Sathyadarshana Research Core

import { speakText } from "./voice.js";
import { checkForUpdates } from "./updater.js";
import { detectLanguage } from "./auto-lang.js";
import { toast } from "./ui.js";
import { on } from "./bus.js";               // ← subscribe to events
import { runAnalysis } from "./analyzer.js"; // optional: quick trigger

let isOpen = false;
let unsub = []; // to store unsubs from bus

export function initSideBoot() {
  // Panel HTML
  const panel = document.createElement("div");
  panel.id = "sideBoot";
  panel.innerHTML = `
    <div id="sideBootHeader">🧠 AI Buddhi Panel</div>
    <div id="sideBootBody">
      <div id="sideBootStatus">🌿 Ready</div>

      <div id="sideBootButtons">
        <button class="sbBtn" id="sbAnalyzeQuick">🔮 Quick Analyze (Left)</button>
        <button class="sbBtn" id="sbVoice">🎙️ Speak</button>
        <button class="sbBtn" id="sbUpdate">⚡ Update</button>
        <button class="sbBtn" id="sbLang">🌏 Lang</button>
        <button class="sbBtn danger" id="sbClear">🧹 Clear Feed</button>
        <button class="sbBtn" id="sbHide">❌ Hide</button>
      </div>

      <div class="feedWrap">
        <div class="feedHead">📡 Live Analyzer Feed</div>
        <div id="liveFeed"></div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // Style
  const css = document.createElement("style");
  css.textContent = `
    #sideBoot {
      position: fixed; top: 0; right: -340px; width: 320px; height: 100vh;
      background: #0b0f16; border-left: 2px solid #00e5ff; color: #e6f0ff;
      font-family: system-ui, sans-serif; transition: right .35s ease;
      box-shadow: -4px 0 12px rgba(0,229,255,.25); z-index: 9998; display: flex; flex-direction: column;
    }
    #sideBoot.open { right: 0; }
    #sideBootHeader { background:#101820; padding:14px; text-align:center; font-weight:700; border-bottom:1px solid #00e5ff; color:#16f0a7; }
    #sideBootBody { flex:1; overflow-y:auto; padding:10px; }

    #sideBootButtons { display:flex; flex-wrap:wrap; gap:6px; margin:6px 0 10px; }
    .sbBtn {
      background:#101820; color:#00e5ff; border:1px solid #00e5ff; border-radius:10px;
      padding:6px 10px; cursor:pointer; font-size:.9rem; transition:.25s;
    }
    .sbBtn:hover{ background:#00e5ff; color:#000; }
    .sbBtn.danger{ border-color:#ff3b6b; color:#ff3b6b; }
    .sbBtn.danger:hover{ background:#ff3b6b; color:#000; }

    #sideBootStatus{ margin:8px 0; padding:6px; background:#101820; border:1px solid #16f0a7; border-radius:6px; text-align:center; font-size:.9rem; }

    .feedWrap{ border:1px solid #00e5ff; border-radius:10px; background:#071019; }
    .feedHead{ padding:8px 10px; border-bottom:1px solid #003e52; color:#9beaf7; font-weight:600; }
    #liveFeed{ font-family:ui-monospace, SFMono-Regular, Menlo, monospace; font-size:.82rem; line-height:1.35; padding:8px 10px; max-height:52vh; overflow-y:auto; }
    .row{ display:flex; gap:6px; align-items:center; margin-bottom:4px; }
    .t{ color:#7de3ff; opacity:.85; min-width:66px; }
    .k{ color:#16f0a7; }
    .v{ color:#e6f0ff; opacity:.9; }
    .chip{ font-size:.72rem; padding:2px 6px; border-radius:999px; border:1px solid #245; color:#9beaf7; }
    .lvl-ok{ color:#16f0a7; } .lvl-info{ color:#9beaf7; } .lvl-warn{ color:#ffd166; } .lvl-err{ color:#ff3b6b; }
  `;
  document.head.appendChild(css);

  // Floating toggle
  const toggle = document.createElement("button");
  toggle.id = "sideBootToggle";
  toggle.textContent = "🧭";
  Object.assign(toggle.style,{
    position:"fixed", top:"40%", right:"6px", background:"#00e5ff", color:"#000",
    border:"none", borderRadius:"50%", width:"48px", height:"48px", fontSize:"1.4rem",
    fontWeight:"bold", cursor:"pointer", zIndex:9999, boxShadow:"0 0 10px #00e5ff"
  });
  toggle.onclick = toggleSideBoot;
  document.body.appendChild(toggle);

  bindButtons();
  wireFeed(); // ← subscribe to live events
  logStatus("🌿 Buddhi SideBoot initialized.");
}

function toggleSideBoot(){
  const p = document.getElementById("sideBoot");
  isOpen = !isOpen;
  if (isOpen){ p.classList.add("open"); speakText("AI Buddhi panel opened.", detectLanguage()); }
  else       { p.classList.remove("open"); speakText("Panel closed.", detectLanguage()); }
}

function bindButtons(){
  const byId = id => document.getElementById(id);

  byId("sbAnalyzeQuick").onclick = async ()=>{
    logRow({ t:"step", k:"analyze", v:"left (quick)" });
    toast("Analyzer (left) starting…");
    try { await runAnalysis({ hand:"left" }); } catch(e){ logRow({ t:"err", k:"analyze", v:e.message }); }
  };

  byId("sbVoice").onclick = ()=>{
    speakText("Hello Anuruddha, live analyzer feed is active.", detectLanguage());
    logRow({ t:"info", k:"voice", v:"greeting played" });
  };

  byId("sbUpdate").onclick = async ()=>{
    const up = await checkForUpdates();
    if (up){ speakText("A new update is available.", detectLanguage()); logStatus("⚡ Update available!"); }
    else   { speakText("System is already up to date.", detectLanguage()); logStatus("✅ No updates found."); }
  };

  byId("sbLang").onclick = ()=>{
    const lang = detectLanguage();
    speakText(`Language is ${lang}`, lang);
    logRow({ t:"info", k:"lang", v:lang });
  };

  byId("sbClear").onclick = ()=>{
    const feed = document.getElementById("liveFeed");
    feed.textContent = "";
    logStatus("🧹 Feed cleared");
  };

  byId("sbHide").onclick = toggleSideBoot;
}

// ===== Live Feed wiring ======================================================
function wireFeed(){
  // unsubscribe previous, if any
  unsub.forEach(fn => fn());
  unsub = [];

  // status / steps
  unsub.push(on("analyzer:status",   ({level="info", msg}) => logStatus(formatLvl(level) + " " + msg)));
  unsub.push(on("analyzer:step",     ({tag, msg})          => logRow({ t:"step", k:tag, v:msg })));
  // metrics (key/value)
  unsub.push(on("analyzer:metric",   ({key, val})          => logRow({ t:"metric", k:key, v:val })));

  // you can add more topics if needed:
  // on("analyzer:debug", payload => logRow({ t:"dbg", k:payload.k, v:payload.v }))
}

function formatLvl(level){
  switch(level){
    case "ok":   return "✅";
    case "warn": return "⚠️";
    case "err":  return "❌";
    default:     return "ℹ️";
  }
}

// ===== Render helpers ========================================================
export function logStatus(text){
  const st = document.getElementById("sideBootStatus");
  st && (st.textContent = text);
  logRow({ t:"info", k:"status", v:text });
}

function logRow({ t="info", k="", v="" } = {}){
  const feed = document.getElementById("liveFeed");
  if (!feed) return;

  const time = new Date().toLocaleTimeString();
  const row  = document.createElement("div");
  row.className = "row";
  row.innerHTML = `
    <span class="t">${time}</span>
    <span class="chip">${t}</span>
    <span class="k">${escapeHtml(k)}</span>
    <span class="v">= ${escapeHtml(String(v))}</span>
  `;
  feed.appendChild(row);
  feed.scrollTop = feed.scrollHeight; // auto-scroll to bottom
}

function escapeHtml(s){
  return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
