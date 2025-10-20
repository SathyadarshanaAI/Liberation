// modules/ui.js — Unified UI manager (buttons, toasts, modals, i18n, voice)
// © 2025 Sathyadarshana Research Core

import i18n from "../lang/i18n.json" assert { type: "json" };
import { detectLanguage, applyLanguage } from "./auto-lang.js";
import { speakText, stopSpeak } from "./voice.js";
import { checkForUpdates } from "./updater.js";
import { initCamera, startLeft, startRight, stopAll, captureLeft, captureRight, mirrorToggle, torchToggle } from "./camera.js";
import { runAnalysis } from "./analyzer.js";            // expects runAnalysis({hand:'left'|'right'}) -> {summary, all}
import { exportPalmPDF } from "./pdf.js";
import { saveSession, loadLastSession } from "./storage.js"; // optional; no-op if not implemented

// ---- Global UI state --------------------------------------------------------
const $ = (id)=>document.getElementById(id);
const qs = (sel)=>document.querySelector(sel);
const state = {
  lang: "en",
  analyzing: false,
  last: {
    left:  null,
    right: null
  }
};

// ---- Toast / Notice ---------------------------------------------------------
export function toast(msg, ms=2600){
  let n = document.createElement("div");
  n.className = "sd-toast";
  n.textContent = msg;
  Object.assign(n.style, {
    position:"fixed", left:"50%", bottom:"22px", transform:"translateX(-50%)",
    background:"#101820", color:"#16f0a7", border:"1px solid #00e5ff",
    padding:"10px 14px", borderRadius:"12px", zIndex:9999, boxShadow:"0 0 12px #00e5ff"
  });
  document.body.appendChild(n);
  setTimeout(()=> n.remove(), ms);
}

// ---- Busy overlay -----------------------------------------------------------
function setBusy(on=true){
  state.analyzing = on;
  const overlay = $("busyOverlay");
  if (!overlay) return;
  overlay.style.display = on ? "flex" : "none";
}

// ---- Language handling ------------------------------------------------------
function bindLanguageSelector(){
  const sel = $("language");
  if (!sel) return;
  // build options if empty
  if (!sel.options.length){
    Object.keys(i18n).forEach(code=>{
      const opt = document.createElement("option");
      opt.value = code;
      opt.textContent = (i18n[code]?.language || i18n[code]?.app_title || code);
      sel.appendChild(opt);
    });
  }
  sel.value = state.lang;
  sel.onchange = ()=>{
    state.lang = sel.value;
    applyLanguage(state.lang);
    toast(`🌐 ${state.lang.toUpperCase()} applied`);
  };
}

// ---- Bind buttons -----------------------------------------------------------
function bindButtons(){
  const map = [
    ["btnSpeak",     ()=> speakCurrent()],
    ["btnStop",      ()=> stopSpeak()],
    ["btnSave",      ()=> onSave()],
    ["btnAnalyze",   ()=> analyzeActive()],
    ["btnAnalyzeL",  ()=> analyze("left")],
    ["btnAnalyzeR",  ()=> analyze("right")],

    ["startCamLeft", ()=> startLeft().then(()=> toast("📷 Left camera ON")).catch(e=>toast(`⚠️ ${e.message}`))],
    ["startCamRight",()=> startRight().then(()=> toast("📷 Right camera ON")).catch(e=>toast(`⚠️ ${e.message}`))],
    ["stopCam",      ()=> stopAll().then(()=> toast("🛑 Camera OFF"))],
    ["captureLeft",  ()=> captureLeft().then(p=>{ state.last.left=p; toast("📸 Left captured"); }).catch(e=>toast(`⚠️ ${e.message}`))],
    ["captureRight", ()=> captureRight().then(p=>{ state.last.right=p; toast("📸 Right captured"); }).catch(e=>toast(`⚠️ ${e.message}`))],

    ["btnMirror",    ()=> { mirrorToggle(); toast("🪞 Mirror toggled"); }],
    ["btnTorch",     ()=> { torchToggle().then(()=>toast("🔦 Torch toggled")).catch(()=>toast("⚠️ Torch not available")); }],

    ["btnPDF",       ()=> onPDF()],
    ["btnUpdate",    ()=> manualUpdateCheck()]
  ];

  map.forEach(([id,fn])=>{ const el=$(id); if(el) el.onclick=fn; });
}

// ---- Speak current insight --------------------------------------------------
function speakCurrent(){
  const t = $("insight")?.innerText?.trim();
  if (!t) { toast("ℹ️ No insight to speak"); return; }
  speakText(t, state.lang, 1);
}

// ---- Analyze ---------------------------------------------------------------
async function analyze(which){ // 'left'|'right'
  setBusy(true);
  try{
    const out = await runAnalysis({ hand: which });
    state.last[which] = out;
    renderInsight(out);
    toast(`🔎 ${which==='left'?'Left':'Right'} analysis done`);
  }catch(err){
    console.error(err);
    toast("❌ Analysis failed");
  }finally{
    setBusy(false);
  }
}
function analyzeActive(){
  // if both canvases exist, prefer visible/selected; else run both sequentially
  const l = $("canvasLeft"), r = $("canvasRight");
  if (l && r){ analyze("left"); setTimeout(()=>analyze("right"), 300); }
  else if (l) { analyze("left"); }
  else if (r) { analyze("right"); }
  else toast("⚠️ No active canvas");
}

// ---- Render Insight ---------------------------------------------------------
function renderInsight(res){
  if (!res) return;
  const box = $("insight");
  if (!box) return;
  const t = i18n[state.lang] || i18n.en;

  const lines = (res.all||[])
    .slice(0,10)
    .map(x=>`• ${x.meaning} (${(x.weight*100|0)}%)`).join("\n");

  box.innerText = `${t.result_title}\n\n${res.summary || ""}\n\n${lines}`;
  $("resultTitle") && ( $("resultTitle").innerText = t.result_title );
}

// ---- Save & PDF -------------------------------------------------------------
async function onSave(){
  try{
    const payload = {
      ts: new Date().toISOString(),
      lang: state.lang,
      left: state.last.left || null,
      right: state.last.right || null
    };
    await (saveSession?.(payload));
    toast("💾 Session saved");
  }catch{
    toast("⚠️ Save unavailable");
  }
}
function onPDF(){
  const payload = {
    lang: state.lang,
    left: state.last.left,
    right: state.last.right,
    title: (i18n[state.lang]?.app_title || "Quantum Palm Analyzer")
  };
  try{
    exportPalmPDF(payload);
    toast("🧾 PDF exporting…");
  }catch{
    toast("⚠️ PDF module not ready");
  }
}

// ---- Update check -----------------------------------------------------------
async function manualUpdateCheck(){
  const has = await checkForUpdates();
  toast(has ? "⚡ Update available — reload to apply" : "✅ Up-to-date");
}

// ---- Public init ------------------------------------------------------------
export async function bindUI(){
  // busy overlay (create if missing)
  if (!$("busyOverlay")){
    const o = document.createElement("div");
    o.id="busyOverlay";
    Object.assign(o.style,{
      position:"fixed", inset:"0", background:"rgba(0,0,0,.45)",
      display:"none", alignItems:"center", justifyContent:"center",
      zIndex:9998, backdropFilter:"blur(2px)"
    });
    o.innerHTML = `<div style="background:#101820;border:1px solid #00e5ff;color:#16f0a7;padding:12px 18px;border-radius:14px;box-shadow:0 0 12px #00e5ff">
      ⏳ Processing…
    </div>`;
    document.body.appendChild(o);
  }

  // detect/apply language
  state.lang = detectLanguage();

  // camera boot (safe to call; it can be no-op until user presses Start)
  try { initCamera?.(); } catch{}

  // wire UI
  bindLanguageSelector();
  bindButtons();

  // lazy load last session
  try{
    const last = await (loadLastSession?.());
    if (last){
      state.lang = last.lang || state.lang;
      applyLanguage(state.lang);
      state.last.left  = last.left  || null;
      state.last.right = last.right || null;
      if (last.left)  renderInsight(last.left);
      if (last.right) renderInsight(last.right);
      toast("🗂️ Last session loaded");
    }
  }catch{}
}
