// 🕉️ Sathyadarshana Integrity Monitor v5.1 — Auto-Fix Visible Panel

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

function log(type, msg, file = "system") {
  const data = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  data.push({ time: new Date().toLocaleTimeString(), type, file, msg });
  localStorage.setItem("buddhiIntegrity", JSON.stringify(data));
  showPanel();
}

export async function checkModules() {
  log("init", "🧠 Checking module integrity...");
  for (const file of MODULES) {
    try {
      const r = await fetch(`./modules/${file}`, { method: "HEAD" });
      if (!r.ok) throw new Error("missing");
      log("ok", `${file} verified ✅`);
    } catch (e) {
      log("missing", `${file} — ${e.message}`);
    }
  }
  log("done", "All modules checked.");
}

export function checkVersion(ver = "v5.1") {
  const prev = localStorage.getItem("buddhiVersion");
  if (!prev) log("init", `Initialized ${ver}`);
  else if (prev !== ver) log("update", `Updated ${prev} → ${ver}`);
  else log("version", `${ver} active`);
  localStorage.setItem("buddhiVersion", ver);
}

window.onerror = (msg, src, line) => {
  const file = src?.split("/").pop() || "unknown";
  log("error", `${msg} (line ${line})`, file);
  return true;
};
window.addEventListener("unhandledrejection", e =>
  log("promise", e.reason?.message || e.reason)
);

function showPanel() {
  if (!document.body) return setTimeout(showPanel, 300);

  let panel = document.getElementById("buddhiMonitor");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "buddhiMonitor";
    panel.style.cssText = `
      position:fixed;bottom:10px;left:10px;right:10px;
      background:rgba(0,0,0,0.9);
      color:#16f0a7;font-family:monospace;font-size:12px;
      border:1px solid #00e5ff;border-radius:10px;
      padding:8px 10px;z-index:999999;
      box-shadow:0 0 12px #00e5ff;
      max-height:140px;overflow-y:auto;
      opacity:0;transition:opacity .6s;
    `;
    panel.innerHTML = `<div id="buddhiLog">🧠 Buddhi Log Initializing...</div>`;
    document.body.appendChild(panel);
    setTimeout(() => (panel.style.opacity = "1"), 300);
  }

  const logBox = document.getElementById("buddhiLog");
  const data = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  logBox.innerHTML = data
    .slice(-10)
    .map(l => `[${l.type}] <b>${l.file}</b>: ${l.msg}`)
    .join("<br>");
}

// 🔁 keep visible always
setInterval(showPanel, 2500);
