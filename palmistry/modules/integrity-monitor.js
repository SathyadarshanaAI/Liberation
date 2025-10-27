// 🕉️ Sathyadarshana Integrity Monitor v4.2 — Universal Auto Popup Version

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

// --- LOG FUNCTION ---
function logIntegrity(type, msg, file="system", line="?") {
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  logs.push({
    time: new Date().toLocaleTimeString(),
    type, file, line, msg
  });
  localStorage.setItem("buddhiIntegrity", JSON.stringify(logs));
  renderPanel();
}

// --- MODULE CHECK ---
export async function checkModules() {
  logIntegrity("check", "🔍 Verifying essential modules...");
  for (const file of MODULES) {
    try {
      const res = await fetch(`./modules/${file}`, { method: "HEAD" });
      if (!res.ok) throw new Error("missing or inaccessible");
      logIntegrity("ok", `${file} verified`);
    } catch (e) {
      logIntegrity("missing", `${file} → ${e.message}`);
    }
  }
  logIntegrity("done", "✅ Module integrity check complete.");
}

// --- VERSION TRACKER ---
export function checkVersion(ver = "v4.2") {
  const prev = localStorage.getItem("buddhiVersion");
  if (prev && prev !== ver)
    logIntegrity("update", `Updated ${prev} ➜ ${ver}`);
  else if (!prev)
    logIntegrity("init", `Initialized version ${ver}`);
  localStorage.setItem("buddhiVersion", ver);
}

// --- ERROR MONITORING ---
window.onerror = (msg, src, line) => {
  const file = src ? src.split("/").pop() : "unknown";
  logIntegrity("error", msg, file, line);
  return true;
};
window.addEventListener("unhandledrejection", (e) =>
  logIntegrity("promise", e.reason?.message || e.reason)
);

// --- SAFE PANEL CREATION ---
function renderPanel() {
  if (!document.body) {
    // retry every 300ms until DOM ready
    return setTimeout(renderPanel, 300);
  }

  let panel = document.getElementById("integrityPanel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "integrityPanel";
    Object.assign(panel.style, {
      position: "fixed",
      bottom: "10px",
      right: "10px",
      zIndex: 99999,
      width: "320px",
      maxHeight: "200px",
      overflowY: "auto",
      background: "rgba(16,24,32,0.9)",
      color: "#16f0a7",
      fontFamily: "monospace",
      fontSize: "12px",
      padding: "8px",
      borderRadius: "10px",
      boxShadow: "0 0 10px #00e5ff",
      backdropFilter: "blur(5px)",
      textAlign: "left",
      transition: "opacity 0.5s",
      opacity: "0"
    });
    document.body.appendChild(panel);
    setTimeout(() => (panel.style.opacity = "1"), 500);
  }

  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  panel.innerHTML = logs
    .slice(-8)
    .map(
      (l) =>
        `<div>[${l.type}] <b>${l.file}</b>: ${l.msg}</div>`
    )
    .join("");
}

// --- AUTO REFRESH EVERY 3 SECONDS ---
setInterval(renderPanel, 3000);

// --- KEYBOARD POPUP VIEWER ---
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && e.key === "b") {
    const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
    alert(
      "🧠 Buddhi Integrity Logs\n\n" +
        logs
          .slice(-12)
          .map(
            (l) =>
              `${l.time} | ${l.type} | ${l.file}\n${l.msg}`
          )
          .join("\n")
    );
  }
});
