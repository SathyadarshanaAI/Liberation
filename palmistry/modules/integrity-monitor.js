// 🧠 Buddhi Fusion Monitor v6.1 — Full Diagnostic Edition
// Scans all core modules, detects syntax + runtime errors, and shows them live.

export function initMonitor() {
  const panel = createMonitorPanel();
  log(panel, "🧠 Buddhi Fusion Monitor v6.1 initialized.");
  startIntegrityLoop(panel);
  setupErrorCatcher(panel);
}

function createMonitorPanel() {
  let box = document.getElementById("buddhiMonitor");
  if (!box) {
    box = document.createElement("div");
    box.id = "buddhiMonitor";
    Object.assign(box.style, {
      position: "fixed",
      bottom: "10px",
      right: "10px",
      width: "360px",
      height: "240px",
      background: "rgba(0,0,0,0.8)",
      color: "#00ffcc",
      fontFamily: "monospace",
      fontSize: "11px",
      overflowY: "auto",
      border: "1px solid #00e5ff",
      borderRadius: "10px",
      padding: "6px",
      zIndex: "99999",
      boxShadow: "0 0 10px #00e5ff"
    });
    document.body.appendChild(box);
  }
  return box;
}

function log(panel, text, color="#00ffcc") {
  const t = new Date().toLocaleTimeString();
  panel.innerHTML += `<div style="color:${color}">[${t}] ${text}</div>`;
  panel.scrollTop = panel.scrollHeight;
}

function startIntegrityLoop(panel){
  const modules = [
    "camera.js","ai-segmentation.js","report.js",
    "compare.js","voice.js","updater.js"
  ];
  setInterval(()=>{
    modules.forEach(m=>{
      try{
        // module loaded check
        if(!window.__loadedModules) window.__loadedModules={};
        if(!window.__loadedModules[m]){
          log(panel, `⚠️ Module ${m} not confirmed loaded.`, "#ffaa00");
        }
      }catch(e){
        log(panel, `❌ Module check failed @${m}: ${e.message}`, "#ff7777");
      }
    });
  },4000);
}

function setupErrorCatcher(panel){
  window.addEventListener("error", e=>{
    log(panel, `❌ JS Error in ${extractFile(e.filename)} @L${e.lineno}: ${e.message}`, "#ff5555");
  });
  window.addEventListener("unhandledrejection", e=>{
    log(panel, `⚠️ Promise Rejection: ${e.reason}`, "#ff9933");
  });
  document.addEventListener("buddhi-error", e=>{
    const d=e.detail;
    log(panel, `❌ ${d.type.toUpperCase()} Error in ${d.file||"unknown"} @L${d.line||"?"}: ${d.message}`, "#ff6666");
  });
}

function extractFile(path){
  if(!path) return "unknown";
  const parts = path.split("/");
  return parts[parts.length-1];
}
