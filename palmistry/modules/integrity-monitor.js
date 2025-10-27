// 🕉️ Sathyadarshana Integrity Monitor v4.5 — Guaranteed Visible Overlay Console

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

function logIntegrity(type, msg, file = "system", line = "?") {
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  logs.push({ time: new Date().toLocaleTimeString(), type, file, line, msg });
  localStorage.setItem("buddhiIntegrity", JSON.stringify(logs));
  showOverlay();
}

export async function checkModules() {
  logIntegrity("check", "🔍 Checking core modules...");
  for (const file of MODULES) {
    try {
      const res = await fetch(`./modules/${file}`, { method: "HEAD" });
      if (!res.ok) throw new Error("missing or inaccessible");
      logIntegrity("ok", `${file} verified`);
    } catch (e) {
      logIntegrity("missing", `${file} — ${e.message}`);
    }
  }
  logIntegrity("done", "✅ All modules checked.");
}

export function checkVersion(ver = "v4.5") {
  const prev = localStorage.getItem("buddhiVersion");
  if (prev && prev !== ver) logIntegrity("update", `Updated ${prev} → ${ver}`);
  else if (!prev) logIntegrity("init", `Initialized ${ver}`);
  localStorage.setItem("buddhiVersion", ver);
}

// --- Global error handlers ---
window.onerror = (msg, src, line) => {
  const file = src ? src.split("/").pop() : "unknown";
  logIntegrity("error", msg, file, line);
  return true;
};
window.addEventListener("unhandledrejection", e =>
  logIntegrity("promise", e.reason?.message || e.reason)
);

// --- Show floating overlay ---
function showOverlay() {
  if (!document.body) return setTimeout(showOverlay, 400);

  let root = document.getElementById("buddhiRootOverlay");
  if (!root) {
    root = document.createElement("div");
    root.id = "buddhiRootOverlay";
    root.innerHTML = `
      <style>
        #buddhiRootOverlay {
          position:fixed;
          bottom:0;left:0;width:100%;
          background:rgba(0,0,0,0.85);
          color:#16f0a7;
          font-family:monospace;
          font-size:12px;
          padding:6px 10px;
          border-top:2px solid #00e5ff;
          box-shadow:0 -2px 15px #00e5ff;
          max-height:120px;
          overflow-y:auto;
          z-index:999999;
          text-align:left;
          backdrop-filter:blur(6px);
          opacity:0;
          transition:opacity 0.6s ease;
        }
      </style>
      <div id="buddhiLogBox">🧠 Buddhi Log initialized...</div>
    `;
    document.body.appendChild(root);
    setTimeout(() => (root.style.opacity = "1"), 200);
  }

  const box = document.getElementById("buddhiLogBox");
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  if (box) {
    box.innerHTML = logs
      .slice(-8)
      .map(
        l =>
          `<div>[${l.type}] <b>${l.file}</b> → ${l.msg}</div>`
      )
      .join("");
  }
}

// --- keep alive loop ---
setInterval(showOverlay, 2500);

// --- manual popup viewer ---
window.addEventListener("keydown", e => {
  if (e.ctrlKey && e.altKey && e.key === "b") {
    const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
    alert(
      "🧠 Buddhi Integrity Logs\n\n" +
        logs
          .slice(-15)
          .map(l => `${l.time} | ${l.type} | ${l.file}\n${l.msg}`)
          .join("\n")
    );
  }
});
