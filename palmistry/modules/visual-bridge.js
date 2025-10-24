// modules/ui-bridge.js — V8.4 Light Aura Edition
// ----------------------------------------------
import { on } from "./bus.js";

const reportBox = document.getElementById("reportBox");
const statusEl = document.getElementById("status");

// --- Smooth scroll to report ---
function scrollToReport(){
  reportBox.scrollIntoView({ behavior: "smooth", block: "center" });
  glowPulse();
}

// --- Neon glow pulse animation ---
function glowPulse(){
  reportBox.style.transition = "box-shadow 0.6s ease, background 0.6s ease";
  reportBox.style.boxShadow = "0 0 24px 6px #00e5ff";
  reportBox.style.background = "linear-gradient(145deg,#101820,#0b0f16)";
  setTimeout(()=>{
    reportBox.style.boxShadow = "0 0 10px #00e5ff80";
  }, 1200);
}

// --- Aura overlay on report ---
function auraOverlay(){
  const aura = document.createElement("div");
  aura.className = "aura-overlay";
  aura.style.position = "fixed";
  aura.style.top = "0";
  aura.style.left = "0";
  aura.style.width = "100%";
  aura.style.height = "100%";
  aura.style.pointerEvents = "none";
  aura.style.background = 
    "radial-gradient(circle at center, rgba(0,229,255,0.12) 0%, rgba(22,240,167,0.06) 60%, transparent 90%)";
  aura.style.opacity = "0";
  aura.style.transition = "opacity 1.2s ease";
  document.body.appendChild(aura);
  requestAnimationFrame(()=>{ aura.style.opacity = "1"; });
  setTimeout(()=>{ aura.style.opacity = "0"; setTimeout(()=>aura.remove(), 1500); }, 2200);
}

// --- Bus listeners ---
on("analyzer:status", e=>{
  if(e.level === "ok"){
    scrollToReport();
    auraOverlay();
  }
  if(e.level === "info"){
    statusEl.style.color = "#00e5ff";
  }
});
