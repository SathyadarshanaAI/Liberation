// modules/debug.js
export function startErrorMonitor(){
  console.log("🩵 [Buddhi Debug] Error monitor active...");

  window.addEventListener("error", e=>{
    console.error("❌ JS Error:", e.message, "\nFile:", e.filename, "\nLine:", e.lineno);
    showNotice(`⚠️ Error in ${e.filename.split("/").pop()}: ${e.message}`);
  });

  window.addEventListener("unhandledrejection", e=>{
    console.error("💥 Unhandled Promise Rejection:", e.reason);
    showNotice(`💥 Promise Rejection: ${e.reason}`);
  });

  function showNotice(msg){
    let el=document.getElementById("status");
    if(!el){
      el=document.createElement("div");
      el.id="status";
      document.body.prepend(el);
    }
    el.style.color="#ff6b6b";
    el.innerHTML=msg;
  }
}
