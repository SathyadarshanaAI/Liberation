// 🕉️ Sathyadarshana Integrity Monitor v4.1 — Guaranteed Auto Popup Panel

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

// 🧠 Core logger
function logIntegrity(type, msg, file="system", line="?"){
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity")||"[]");
  logs.push({time:new Date().toLocaleTimeString(),type,file,line,msg});
  localStorage.setItem("buddhiIntegrity",JSON.stringify(logs));
  renderPanel();
}

// 🟢 Check Modules
export async function checkModules(){
  logIntegrity("check","Verifying core modules...");
  for(const file of MODULES){
    try{
      const res = await fetch(`./modules/${file}`,{method:"HEAD"});
      if(!res.ok) throw new Error("missing or inaccessible");
      logIntegrity("ok",`${file} verified`);
    }catch(e){
      logIntegrity("missing",`${file} → ${e.message}`);
    }
  }
  logIntegrity("done","Module check complete ✅");
}

// 🔢 Version
export function checkVersion(ver="v4.1"){
  const prev = localStorage.getItem("buddhiVersion");
  if(prev && prev!==ver) logIntegrity("update",`Updated ${prev} ➜ ${ver}`);
  else if(!prev) logIntegrity("init",`Initialized version ${ver}`);
  localStorage.setItem("buddhiVersion",ver);
}

// ⚠️ Error Catcher
window.onerror=(msg,src,line)=>{
  const file=src?src.split("/").pop():"unknown";
  logIntegrity("error",msg,file,line);
  return true;
};
window.addEventListener("unhandledrejection",e=>
  logIntegrity("promise",e.reason?.message||e.reason)
);

// 🟣 Wait for document body (guaranteed popup)
function ensureReady(fn){
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",fn);
  else fn();
}

// 🟩 Create Panel
function renderPanel(){
  ensureReady(()=>{
    let panel=document.getElementById("integrityPanel");
    if(!panel){
      panel=document.createElement("div");
      panel.id="integrityPanel";
      Object.assign(panel.style,{
        position:"fixed",bottom:"10px",right:"10px",zIndex:9999,
        width:"320px",maxHeight:"200px",overflowY:"auto",
        background:"#101820cc",color:"#16f0a7",
        fontFamily:"monospace",fontSize:"12px",padding:"8px",
        borderRadius:"10px",boxShadow:"0 0 10px #00e5ff",
        backdropFilter:"blur(5px)",textAlign:"left"
      });
      document.body.appendChild(panel);
    }
    const logs=JSON.parse(localStorage.getItem("buddhiIntegrity")||"[]");
    panel.innerHTML=logs.slice(-8).map(l=>
      `<div>[${l.type}] <b>${l.file}</b>: ${l.msg}</div>`
    ).join("");
  });
}

// 🔁 Refresh every 3s
setInterval(()=>renderPanel(),3000);

// 🧠 Hotkey for log viewer
window.addEventListener("keydown",e=>{
  if(e.ctrlKey&&e.altKey&&e.key==="b"){
    const logs=JSON.parse(localStorage.getItem("buddhiIntegrity")||"[]");
    alert("🧠 Buddhi Logs\n\n"+
      logs.slice(-12).map(l=>`${l.time} | ${l.type} | ${l.file}\n${l.msg}`).join("\n"));
  }
});
