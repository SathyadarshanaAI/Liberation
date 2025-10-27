// 🕉️ Sathyadarshana Integrity Monitor v4.4 — Self-Reviving Popup Engine

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

function logIntegrity(type, msg, file = "system", line = "?") {
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  logs.push({ time: new Date().toLocaleTimeString(), type, file, line, msg });
  localStorage.setItem("buddhiIntegrity", JSON.stringify(logs));
  showPanel();
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
  logIntegrity("done", "✅ Module verification complete");
}

export function checkVersion(ver = "v4.4") {
  const prev = localStorage.getItem("buddhiVersion");
  if (prev && prev !== ver) logIntegrity("update", `Updated ${prev} → ${ver}`);
  else if (!prev) logIntegrity("init", `Initialized ${ver}`);
  localStorage.setItem("buddhiVersion", ver);
}

// Global error monitor
window.onerror = (msg, src, line) => {
  const file = src ? src.split("/").pop() : "unknown";
  logIntegrity("error", msg, file, line);
  return true;
};
window.addEventListener("unhandledrejection", e =>
  logIntegrity("promise", e.reason?.message || e.reason)
);

// Popup drawer
function showPanel() {
  if (!document.body) {
    setTimeout(showPanel, 300);
    return;
  }
  let p = document.getElementById("integrityPanel");
  if (!p) {
    p = document.createElement("div");
    p.id = "integrityPanel";
    Object.assign(p.style, {
      position: "fixed",
      bottom: "10px",
      right: "10px",
      width: "320px",
      maxHeight: "220px",
      overflowY: "auto",
      background: "rgba(16,24,32,0.95)",
      color: "#16f0a7",
      fontFamily: "monospace",
      fontSize: "12px",
      padding: "8px",
      borderRadius: "10px",
      boxShadow: "0 0 10px #00e5ff",
      backdropFilter: "blur(6px)",
      zIndex: "99999",
      textAlign: "left",
      transition: "opacity 0.4s ease",
      opacity: "0"
    });
    document.body.appendChild(p);
    setTimeout(() => (p.style.opacity = "1"), 300);
  }

  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  p.innerHTML = logs
    .slice(-10)
    .map(
      l => `<div>[${l.type}] <b>${l.file}</b>: ${l.msg}</div>`
    )
    .join("");
}

// Retry loop until success
(function keepTrying() {
  try {
    showPanel();
    setTimeout(keepTrying, 2000);
  } catch {
    setTimeout(keepTrying, 2000);
  }
})();

// Manual viewer
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
