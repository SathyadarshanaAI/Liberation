// 🧠 Buddhi Fusion Monitor v6.1 PRO — Full Diagnostic Edition
// Shows every JS error, rejected promise, and module issue in real-time.

export function initMonitor(){
  const panel=createPanel();
  log(panel,"🧠 Buddhi Fusion Monitor v6.1 PRO initialized.","#00ffff");
  setupErrorHooks(panel);
  periodicModuleCheck(panel);
}

// 🪟 Create floating panel
function createPanel(){
  let p=document.getElementById("buddhiMonitor");
  if(!p){
    p=document.createElement("div");
    p.id="buddhiMonitor";
    Object.assign(p.style,{
      position:"fixed",bottom:"10px",right:"10px",zIndex:"99999",
      width:"370px",height:"240px",overflowY:"auto",
      background:"rgba(0,0,0,0.85)",color:"#00e5ff",
      border:"1px solid #00ffff",borderRadius:"10px",padding:"6px",
      fontFamily:"monospace",fontSize:"11px",boxShadow:"0 0 10px #00ffff"
    });
    document.body.appendChild(p);
  }
  return p;
}

// 🧾 Logging helper
function log(panel,msg,color="#00e5ff"){
  const t=new Date().toLocaleTimeString();
  panel.innerHTML+=`<div style="color:${color}">[${t}] ${msg}</div>`;
  panel.scrollTop=panel.scrollHeight;
}

// 🧩 Catch every JS error, Promise rejection, Buddhi custom errors
function setupErrorHooks(panel){
  window.addEventListener("error",e=>{
    log(panel,`❌ JS Error in ${getFile(e.filename)} @L${e.lineno}: ${e.message}`,"#ff6b6b");
  });
  window.addEventListener("unhandledrejection",e=>{
    log(panel,`⚠️ Unhandled Promise: ${e.reason}`,"#ffaa33");
  });
  document.addEventListener("buddhi-error",e=>{
    const d=e.detail;
    log(panel,`❌ ${d.type.toUpperCase()} in ${d.file||'unknown'} @L${d.line||'?'} → ${d.message}`,"#ff7777");
  });
  window.addEventListener("load",()=>{
    log(panel,"✅ Error hooks active.","#16f0a7");
  });
}

// 🔍 Check all expected modules
function periodicModuleCheck(panel){
  const modules=["camera.js","ai-segmentation.js","report.js","compare.js","voice.js","updater.js"];
  setInterval(()=>{
    for(const m of modules){
      try{
        if(!window.__loadedModules?.[m])
          log(panel,`⚠️ Module not loaded: ${m}`,"#ffcc00");
      }catch(err){
        log(panel,`❌ Module scan failed: ${m} → ${err.message}`,"#ff4444");
      }
    }
  },4000);
}

function getFile(path){
  if(!path) return "unknown";
  const s=path.split("/");
  return s[s.length-1];
}
