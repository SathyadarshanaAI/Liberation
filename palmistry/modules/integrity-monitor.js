// 🧠 Sathyadarshana · Buddhi Integrity Guardian v3.9
// Self-Diagnostic Engine | Line-level error + Module Health + AI Awareness

const MODULES = [
  "camera.js", "clarity.js", "edges.js", "ai-segmentation.js",
  "report.js", "voice.js", "form.js", "translate.js"
];

// 🔹 Local log store
function saveIntegrityLog(entry){
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  logs.push({ time:new Date().toLocaleString(), ...entry });
  localStorage.setItem("buddhiIntegrity", JSON.stringify(logs));

  // Notify Buddhi AI in real-time
  window.dispatchEvent(new CustomEvent("integrityUpdate",{detail:entry}));
}

// 🔹 Show logs quickly
export function viewIntegrity(){
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  console.table(logs);
}

// 🔹 Check module presence
export async function checkModules(){
  for(const file of MODULES){
    try { await import(`./${file}`); }
    catch(e){ saveIntegrityLog({type:"missing",file,msg:e.message}); }
  }
  saveIntegrityLog({type:"system",msg:"Module health check complete"});
}

// 🔹 Capture runtime errors
window.onerror = (msg,src,line,col)=>{
  const file = src?.split("/").pop() || "unknown";
  saveIntegrityLog({type:"error",file,line,msg});
  return true;
};
window.onunhandledrejection = e=>{
  saveIntegrityLog({type:"promise",msg:e.reason?.message || e.reason});
};

// 🔹 Console error override (line detect)
const oldErr = console.error;
console.error = function(...args){
  const stack = new Error().stack.split("\n")[2] || "";
  const m = stack.match(/(\w+\.js):(\d+):(\d+)/);
  const file = m?m[1]:"unknown", line=m?m[2]:"?";
  saveIntegrityLog({type:"runtime",file,line,msg:args.join(" ")});
  oldErr.apply(console,args);
};

// 🔹 Version checker
export function checkVersion(ver="v3.9"){
  const prev = localStorage.getItem("buddhiVersion");
  if(prev && prev!==ver)
    saveIntegrityLog({type:"update",msg:`Updated ${prev} ➜ ${ver}`});
  localStorage.setItem("buddhiVersion",ver);
}

// 🔹 Palm capture event (ID + side)
export function trackPalm(hand){
  const id=`Palm-${hand}-${Date.now()}`;
  saveIntegrityLog({type:"capture",hand,id});
  const all = JSON.parse(localStorage.getItem("palmRecords")||"[]");
  all.push({id,hand,time:new Date().toLocaleString()});
  localStorage.setItem("palmRecords",JSON.stringify(all));
}

// 🔹 Secret viewer (Ctrl+Alt+B)
window.addEventListener("keydown",e=>{
  if(e.ctrlKey && e.altKey && e.key==='b'){
    const logs=JSON.parse(localStorage.getItem("buddhiIntegrity")||"[]");
    alert("🧠 Buddhi Integrity Log\n\n"+
      logs.slice(-10).map(l=>`${l.time} | ${l.type} | ${l.file||''} ${l.line||''}\n${l.msg}`).join("\n"));
  }
});

// 🔹 AI awareness (Buddhi speaks)
window.addEventListener("integrityUpdate",e=>{
  const d=e.detail;
  console.log(`🧠 Buddhi detected issue → ${d.file||'unknown'}:${d.line||'?'} → ${d.msg}`);
});
