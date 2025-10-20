// app.js — Quantum Palm Analyzer V5.3 (no external bundler)
// Features: dual camera (left/right), mirror draw on right, capture, upload,
// torch (where supported), simple Analyze → JSON, Mini Report (12-lang via logic12.js),
// Full Report (PDF via jsPDF), Speak (Web Speech API).

import { generateMiniReport } from "./logic12.js";

const $ = (id) => document.getElementById(id);

// DOM
const statusEl = $("status");
const langSel  = $("language");
const canvasL  = $("canvasLeft");
const canvasR  = $("canvasRight");
const btns = {
  startL: $("startCamLeft"),
  capL:   $("captureLeft"),
  torchL: $("torchLeft"),
  uplL:   $("uploadLeft"),
  startR: $("startCamRight"),
  capR:   $("captureRight"),
  torchR: $("torchRight"),
  uplR:   $("uploadRight"),
  analyze:$("analyze"),
  mini:   $("miniReport"),
  full:   $("fullReport"),
  speak:  $("speak"),
};
const insightEl = $("insight");

// State
let streamL=null, streamR=null;
let rafL=0, rafR=0;
let liveL=false, liveR=false;
let lastAnalysis = null; // save last JSON

// Utils
function msg(txt){ statusEl.textContent = txt; }
function ctx(c){ return c.getContext("2d", { willReadFrequently:true }); }
function clearRAF(side){ if(side==="L"){ cancelAnimationFrame(rafL); rafL=0; } else { cancelAnimationFrame(rafR); rafR=0; } }
function stopStream(str){ try{ str?.getTracks()?.forEach(t=>t.stop()); }catch(e){} }

function mapLang(val){
  // Map UI language select to logic12 registry
  const m = { "si":"si","en":"en","ta":"ta","hi":"hi","ar":"ar","ja":"ja","zh-CN":"zh","bn":"en","es":"en","fr":"en","de":"en","ru":"en" };
  return m[val] || "en";
}

// Camera Start
async function startCam(side){
  try{
    const useRear = { facingMode: "environment" };
    const str = await navigator.mediaDevices.getUserMedia({ video: useRear, audio:false });
    const video = document.createElement("video");
    video.autoplay = true; video.muted = true; video.playsInline = true;
    video.srcObject = str;
    await video.play();

    const w = video.videoWidth || 1280;
    const h = video.videoHeight|| 720;
    const target = side==="L"?canvasL:canvasR;
    target.width=w; target.height=h;

    function draw(){
      const C = ctx(target);
      if(side==="L"){
        // normal
        C.drawImage(video, 0, 0, w, h);
        rafL = requestAnimationFrame(draw);
      }else{
        // RIGHT: mirror horizontally
        C.save();
        C.scale(-1,1);
        C.drawImage(video, -w, 0, w, h);
        C.restore();
        rafR = requestAnimationFrame(draw);
      }
    }
    draw();

    if(side==="L"){ streamL=str; liveL=true; } else { streamR=str; liveR=true; }
    msg(`✅ Camera ${side==="L"?"LEFT":"RIGHT"} ${w}×${h}.`);
  }catch(e){
    msg("Camera error: " + e.message);
  }
}

function capture(side){
  // just stop the RAF → freeze current frame on canvas
  if(side==="L"){ clearRAF("L"); liveL=false; }
  else { clearRAF("R"); liveR=false; }
  msg(`🖼 Captured ${side==="L"?"LEFT":"RIGHT"}.`);
}

async function torch(side){
  try{
    const str = side==="L" ? streamL : streamR;
    if(!str){ return msg("Start camera first."); }
    const track = str.getVideoTracks()[0];
    const caps = track.getCapabilities?.() || {};
    if(!("torch" in caps)){ return msg("💡 Torch not supported on this device."); }
    const settings = track.getSettings?.() || {};
    const next = !settings.torch;
    await track.applyConstraints({ advanced:[{ torch: next }] });
    msg(`🔦 Torch ${next?"ON":"OFF"} (${side==="L"?"LEFT":"RIGHT"})`);
  }catch(e){
    msg("Torch error: " + e.message);
  }
}

function uploadToCanvas(side){
  const input = document.createElement("input");
  input.type = "file"; input.accept = "image/*";
  input.onchange = () => {
    const file = input.files?.[0]; if(!file) return;
    const img = new Image();
    img.onload = ()=>{
      const c = side==="L"?canvasL:canvasR;
      const C = ctx(c);
      // fit contain
      c.width = img.width; c.height = img.height;
      C.drawImage(img, 0, 0, c.width, c.height);
      msg(`📷 Uploaded → ${side==="L"?"LEFT":"RIGHT"} (${img.width}×${img.height})`);
    };
    img.src = URL.createObjectURL(file);
  };
  input.click();
}

// Simple line-density estimator (dark-pixel ratio after threshold)
function estimateDensity(cnv){
  const C = ctx(cnv);
  const { width:w, height:h } = cnv;
  if(w*h===0) return 0;
  const img = C.getImageData(0,0,w,h).data;
  let dark=0, total=w*h;
  // Fast sample: every 4th pixel row and col to speed
  const stride = 4;
  for(let y=0; y<h; y+=2){
    for(let x=0; x<w; x+=2){
      const i = (y*w + x) * 4;
      const r=img[i], g=img[i+1], b=img[i+2];
      const lum = 0.2126*r + 0.7152*g + 0.0722*b;
      if(lum < 96) dark++;
    }
  }
  const sampled = Math.ceil((h/2)*(w/2));
  const ratio = (dark / sampled) * 100;
  return Number(ratio.toFixed(2));
}

// Map densities to qualitative tags (very simple heuristic)
function tagsFromDensity(dL, dR){
  const life   = dR > 4.5 ? "strong" : (dR < 2.5 ? "faint" : "strong");
  const head   = dR >= dL ? "balanced" : "strong";
  const heart  = dR >= 5.5 ? "deep" : (dR >= 3.5 ? "moderate" : "faint");
  const fate   = dR >= 3.0 ? "present" : "weak";
  const sun    = dR >= 3.5 ? "visible" : "absent";
  const health = dR < 7.5 ? "steady" : "sensitive";
  const marriage = dR >= 6.5 ? "multiple" : "clear";
  const manikanda = 3; // placeholder; measurable later from wrist region
  return { life, head, heart, fate, sun, health, marriage, manikanda };
}

function analyze(){
  // compute densities from both canvases
  const dL = estimateDensity(canvasL);
  const dR = estimateDensity(canvasR);
  const t  = tagsFromDensity(dL, dR);

  const data = {
    left:  { density:dL, life:t.life, head:"balanced", heart:"moderate", fate:t.fate, sun:t.sun, health:t.health, marriage:t.marriage, manikanda:t.manikanda },
    right: { density:dR, life:t.life, head:t.head, heart:t.heart, fate:t.fate, sun:t.sun, health:t.health, marriage:t.marriage, manikanda:t.manikanda },
    name: "User",
    locale: langSel.value,
    captured_at: new Date().toISOString().slice(0,19).replace("T"," ")
  };
  lastAnalysis = data;
  insightEl.textContent = JSON.stringify(data, null, 2);
  msg("✅ Analyze complete.");
  return data;
}

function miniReport(){
  const data = lastAnalysis || analyze();
  const lang = mapLang(langSel.value);
  const txt  = generateMiniReport(data, lang);
  insightEl.textContent = txt;
  msg("📝 Mini Report ready.");
}

function buildFullText(d){
  // Long form (≈1000–1500 words possible). For performance, we keep concise but substantial (~1000+ chars).
  // Sections adapted from previous spec; language-aware header simple.
  const L = d.left, R = d.right;
  const lang = mapLang(d.locale||"en");
  const head =
`SATHYADARSHANA · PALMISTRY FULL REPORT
Name: ${d.name||"User"}   Date: ${d.captured_at}   Left Density: ${L.density}%   Right Density: ${R.density}%`;

  const body =
`ROLE & METHOD
This document interprets palm structures using observational palmistry with computational cues (line density, contrast patterns). It is not fatalistic prediction but a reflective mirror of tendencies.

LIFE LINE
Your life line trends ${R.life}. This suggests robust stamina with renewal capacity. Periodic rest cycles keep vitality steady.

HEAD (MIND) LINE
Marked as ${R.head}. Reasoning and intuition co-operate; planning improves outcomes.

HEART LINE
Emotion reads ${R.heart}. This indicates dependable affection with measured expression.

FATE LINE
${R.fate === "present" ? "Purpose consolidates; career vectors clarify." : "Purpose is refocusing; explore fresh directions with small experiments."}

SUN LINE
${R.sun === "visible" ? "Recognition arises through service or creativity; your name grows with contribution." : "Schedule deliberate creative output to kindle recognition."}

HEALTH & MANIKANDA
Health is ${R.health}. Manikanda bracelets ${R.manikanda} indicate grounded base and spiritual fortune.

COMPARISON (LEFT vs RIGHT)
Left ${L.density}% reflects inner memory and prior conditioning; Right ${R.density}% shows present action and outward momentum.

GUIDANCE
Walk with a joined heart and mind. Keep a three-step habit: attentive listening, reflective writing hour, and small, rapid implementations.`;

  return head + "\n\n" + body;
}

function fullReportPDF(){
  const d = lastAnalysis || analyze();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"pt", format:"a4" }); // 595x842
  const margin = 40, width = 595 - margin*2;
  let y = margin;

  function para(text, size=12, gap=12){
    doc.setFont("Times","normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, width);
    lines.forEach(ln => { y += 16; doc.text(ln, margin, y); });
    y += gap;
    if (y > 842 - margin - 40){ doc.addPage(); y = margin; }
  }

  // Title
  doc.setFont("Times","bold"); doc.setFontSize(20);
  doc.text("SATHYADARSHANA · PALMISTRY FULL REPORT", margin, y); y += 24;
  doc.setFont("Times","normal"); doc.setFontSize(11);
  doc.text(`Generated: ${d.captured_at}   Name: ${d.name||"User"}   L:${d.left.density}%  R:${d.right.density}%`, margin, y); y += 12;
  doc.setDrawColor(40); doc.line(margin, y, margin+width, y); y += 12;

  // Body
  para(buildFullText(d), 12, 6);

  // Footer
  y = 842 - 24;
  doc.setFontSize(10); doc.setTextColor(150);
  doc.text("© Sathyadarshana · For personal guidance only", margin, y);

  doc.save(`Palmistry-Full-Report-${(d.name||"User")}.pdf`);
  msg("📄 Full Report (PDF) downloaded.");
}

// Speak (Web Speech API)
function speak(){
  const data = lastAnalysis || analyze();
  const lang = mapLang(langSel.value);
  const text = generateMiniReport(data, lang);
  if(!("speechSynthesis" in window)) return msg("🔈 Speech not supported.");
  const u = new SpeechSynthesisUtterance(text);
  // Try basic locale mapping
  const langMap = { si:"si-LK", en:"en-US", ta:"ta-IN", hi:"hi-IN", ar:"ar-SA", ja:"ja-JP", zh:"zh-CN" };
  u.lang = langMap[lang] || "en-US";
  u.rate = 1.0; u.pitch=1.0;
  window.speechSynthesis.speak(u);
  msg("🔊 Speaking mini report…");
}

// Bindings
btns.startL.onclick = ()=> startCam("L");
btns.startR.onclick = ()=> startCam("R");
btns.capL.onclick   = ()=> capture("L");
btns.capR.onclick   = ()=> capture("R");
btns.torchL.onclick = ()=> torch("L");
btns.torchR.onclick = ()=> torch("R");
btns.uplL.onclick   = ()=> uploadToCanvas("L");
btns.uplR.onclick   = ()=> uploadToCanvas("R");
btns.analyze.onclick= ()=> analyze();
btns.mini.onclick   = ()=> miniReport();
btns.full.onclick   = ()=> fullReportPDF();
btns.speak.onclick  = ()=> speak();

msg("Ready.");
