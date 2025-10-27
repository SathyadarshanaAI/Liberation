// 🕉️ Sathyadarshana Integrity Monitor v5.0 — Unbreakable Console Engine

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

// 🧾 Save + draw log
function log(type, msg, file = "system", line = "?") {
  const data = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  data.push({ time: new Date().toLocaleTimeString(), type, file, line, msg });
  localStorage.setItem("buddhiIntegrity", JSON.stringify(data));
  forcePanel();
}

// 🔍 Verify module presence
export async function checkModules() {
  log("init", "🔍 Checking module integrity...");
  for (const file of MODULES) {
    try {
      const r = await fetch(`./modules/${file}`, { method: "HEAD" });
      if (!r.ok) throw new Error("missing");
      log("ok", `${file} verified ✅`);
    } catch (e) {
      log("missing", `${file} — ${e.message}`);
    }
  }
  log("done", "All modules checked");
}

// 🧩 Version check
export function checkVersion(ver = "v5.0") {
  const prev = localStorage.getItem("buddhiVersion");
  if (!prev) log("init", `Initialized ${ver}`);
  else if (prev !== ver) log("update", `Updated ${prev} → ${ver}`);
  else log("version", `${ver} active`);
  localStorage.setItem("buddhiVersion", ver);
}

// 🧱 Error capture
window.onerror = (msg, src, line) => {
  log("error", msg, src?.split("/").pop() || "unknown", line);
  return true;
};
window.addEventListener("unhandledrejection", e =>
  log("promise", e.reason?.message || e.reason)
);

// 🔦 Popup creator (absolute fallback)
function forcePanel() {
  try {
    if (!document.body) return setTimeout(forcePanel, 300);
    let panel = document.getElementById("buddhiMonitor");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "buddhiMonitor";
      panel.style.cssText = `
        position:fixed;bottom:0;left:0;width:100%;
        background:rgba(0,0,0,0.9);
        color:#16f0a7;font-family:monospace;font-size:12px;
        border-top:2px solid #00e5ff;
        box-shadow:0 -2px 10px #00e5ff;
        padding:6px 10px;max-height:140px;overflow-y:auto;
        z-index:999999;opacity:0;transition:opacity .6s;
      `;
      panel.innerHTML = `<div id="buddhiLog">🧠 Buddhi Monitor starting...</div>`;
      document.body.appendChild(panel);
      setTimeout(() => (panel.style.opacity = "1"), 200);
    }

    const logBox = document.getElementById("buddhiLog");
    const data = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
    logBox.innerHTML = data
      .slice(-10)
      .map(l => `[${l.type}] <b>${l.file}</b>: ${l.msg}`)
      .join("<br>");
  } catch (err) {
    console.warn("Monitor display failed:", err);
  }
}

// 🔁 Continuous self-refresh
setInterval(forcePanel, 2000);
