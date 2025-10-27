// 🕉️ Sathyadarshana Integrity Monitor v4.3 — Unstoppable Popup Engine

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

// 🧠 Store + log
function logIntegrity(type, msg, file="system", line="?") {
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  logs.push({ time: new Date().toLocaleTimeString(), type, file, line, msg });
  localStorage.setItem("buddhiIntegrity", JSON.stringify(logs));
  drawPanel();
}

// 🔍 Check modules
export async function checkModules() {
  logIntegrity("check", "Checking Sathyadarshana modules...");
  for (const file of MODULES) {
    try {
      const res = await fetch(`./modules/${file}`, { method: "HEAD" });
      if (!res.ok) throw new Error("missing or inaccessible");
      logIntegrity("ok", `${file} verified`);
    } catch (e) {
      logIntegrity("missing", `${file} — ${e.message}`);
    }
  }
  logIntegrity("done", "✅ Module scan complete.");
}

// 🔢 Versioning
export function checkVersion(ver = "v4.3") {
  const prev = localStorage.getItem("buddhiVersion");
  if (prev && prev !== ver) logIntegrity("update", `Updated ${prev} → ${ver}`);
  else if (!prev) logIntegrity("init", `Initialized ${ver}`);
  localStorage.setItem("buddhiVersion", ver);
}

// ⚠️ Global error capture
window.onerror = (msg, src, line) => {
  const file = src ? src.split("/").pop() : "unknown";
  logIntegrity("error", msg, file, line);
  return true;
};
window.addEventListener("unhandledrejection", e =>
  logIntegrity("promise", e.reason?.message || e.reason)
);

// 🧩 Create & refresh panel
function drawPanel() {
  if (!document.body) return; // wait for DOM
  let p = document.getElementById("integrityPanel");
  if (!p) {
    p = document.createElement("div");
    p.id = "integrityPanel";
    Object.assign(p.style, {
      position: "fixed",
      bottom: "10px",
      right: "10px",
      width: "320px",
      maxHeight: "200px",
      overflowY: "auto",
      background: "rgba(16,24,32,0.92)",
      color: "#16f0a7",
      fontFamily: "monospace",
      fontSize: "12px",
      padding: "8px",
      borderRadius: "10px",
      boxShadow: "0 0 10px #00e5ff",
      backdropFilter: "blur(5px)",
      textAlign: "left",
      zIndex: "99999",
      opacity: "0",
      transition: "opacity 0.6s ease-in"
    });
    document.body.appendChild(p);
    setTimeout(() => (p.style.opacity = "1"), 300);
  }

  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  p.innerHTML = logs
    .slice(-8)
    .map(l => `<div>[${l.type}] <b>${l.file}</b>: ${l.msg}</div>`)
    .join("");
}

// 🕓 Guaranteed popup trigger – checks DOM until success
let ensureInterval = setInterval(() => {
  if (document.body) {
    drawPanel();
    clearInterval(ensureInterval);
    // re-render logs every 5s
    setInterval(drawPanel, 5000);
  }
}, 500);

// 🧠 Keyboard log viewer (Ctrl + Alt + B)
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
