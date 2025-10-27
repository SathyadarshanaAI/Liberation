// 🕉️ Sathyadarshana Integrity Monitor v4.0 — Auto UI Panel Edition

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

// ✅ Safe logger
function logIntegrity(type, msg, file="system", line="?"){
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity")||"[]");
  logs.push({time:new Date().toLocaleTimeString(),type,file,line,msg});
  localStorage.setItem("buddhiIntegrity",JSON.stringify(logs));
  renderPanel();
}

// 🧩 Check essential modules
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

// 🔢 Version tracker
export function checkVersion(ver="v4.0"){
  const prev = localStorage.getItem("buddhiVersion");
  if(prev && prev!==ver)
    logIntegrity("update",`Updated ${prev} ➜ ${ver}`);
  else if(!prev)
    logIntegrity("init",`Initialized version ${ver}`);
  localStorage.setItem("buddhiVersion",ver);
}

// ⚠️ Runtime Error catcher
window.onerror = (msg,src,line)=>{
  const file = src?src.split("/").pop():"unknown";
  logIntegrity("error",msg,file,line);
  return true;
};
window.addEventListener("unhandledrejection",e=>
  logIntegrity("promise",e.reason?.message||e.reason)
);

// 💡 Real-time panel
function renderPanel(){
  let panel=document.getElementById("integrityPanel");
  if(!panel){
    panel=document.createElement("div");
    panel.id="integrityPanel";
    Object.assign(panel.style,{
      position:"fixed",bottom:"10px",right:"10px",zIndex:9999,
      width:"320px",maxHeight:"200px",overflowY:"auto",
      background:"#101820",color:"#16f0a7",fontFamily:"monospace",
      fontSize:"12px",padding:"8px",borderRadius:"10px",
      boxShadow:"0 0 10px #00e5ff",textAlign:"left"
    });
    document.body.appendChild(panel);
  }
  const logs=JSON.parse(localStorage.getItem("buddhiIntegrity")||"[]");
  panel.innerHTML=logs.slice(-10).map(l=>
    `<div>[${l.type}] <b>${l.file}</b>: ${l.msg}</div>`
  ).join("");
}

// 🔁 Auto refresh every 3s
setInterval(renderPanel,3000);

// 🧠 Keyboard shortcut: Ctrl+Alt+B for popup log
window.addEventListener("keydown",e=>{
  if(e.ctrlKey&&e.altKey&&e.key==="b"){
    const logs=JSON.parse(localStorage.getItem("buddhiIntegrity")||"[]");
    alert("🧠 Buddhi Logs\n\n"+
      logs.slice(-12).map(l=>`${l.time} | ${l.type} | ${l.file}\n${l.msg}`).join("\n"));
  }
});
