// modules/debug.js — Buddhi Debug Pro v2.0
// © 2025 Sathyadarshana Research Core

import { on, emit } from "./bus.js";

let startTime = performance.now();

export function startErrorMonitor(){
  console.log("🩵 [Buddhi Debug] Universal Error & Event Monitor active...");

  // ===== Basic Error Handling =====
  window.addEventListener("error", e=>{
    logError(`❌ JS Error: ${e.message} (${e.filename}:${e.lineno})`);
    showNotice(`⚠️ ${e.message}`);
  });

  window.addEventListener("unhandledrejection", e=>{
    logError(`💥 Promise Rejection: ${e.reason}`);
    showNotice(`💥 ${e.reason}`);
  });

  // ===== Event Activity Log =====
  const oldEmit = emit;
  globalThis.emit = function(topic, payload){
    logEvent(`📡 Emit → ${topic}`, payload);
    return oldEmit(topic, payload);
  };

  const oldOn = on;
  globalThis.on = function(topic, fn){
    logEvent(`🎧 Listen ← ${topic}`);
    return oldOn(topic, fn);
  };

  // ===== Performance Timer =====
  setInterval(()=>{
    const uptime = ((performance.now() - startTime) / 1000).toFixed(1);
    console.log(`🕐 [Uptime: ${uptime}s] System stable ✓`);
  }, 15000); // every 15s

  // ===== Helper Functions =====
  function logError(msg){
    console.error(msg);
  }

  function logEvent(msg, data){
    console.log(`%c${msg}`, "color:#00e5ff;font-weight:bold;");
    if(data) console.log(" ↳ Data:", data);
  }

  function showNotice(msg){
    let el=document.getElementById("status");
    if(!el){
      el=document.createElement("div");
      el.id="status";
      document.body.prepend(el);
    }
    el.style.color="#ff6b6b";
    el.style.textShadow="0 0 8px #ff6b6b";
    el.innerHTML=msg;
  }
}
