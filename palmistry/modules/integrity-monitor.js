// 🧠 Sathyadarshana Integrity Monitor v3.91 · Twin Vision Compatible

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

// 🟢 Save Log
function logIntegrity(type, msg, file = "system", line = "?") {
  const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
  logs.push({ time: new Date().toLocaleString(), type, file, line, msg });
  localStorage.setItem("buddhiIntegrity", JSON.stringify(logs));
  console.log(`🧠 [${type}] ${file}:${line} → ${msg}`);
}

// 🟣 Check all required modules
export async function checkModules() {
  logIntegrity("check", "Module verification started…");
  for (const file of MODULES) {
    try {
      const res = await fetch(`./modules/${file}`, { method: "HEAD" });
      if (!res.ok) throw new Error("missing or inaccessible");
      logIntegrity("ok", `${file} verified`);
    } catch (e) {
      logIntegrity("missing", `${file} → ${e.message}`);
    }
  }
  logIntegrity("done", "Module verification complete ✅");
}

// 🟢 Version tracker
export function checkVersion(ver = "v3.91") {
  const prev = localStorage.getItem("buddhiVersion");
  if (prev && prev !== ver)
    logIntegrity("update", `Updated ${prev} ➜ ${ver}`);
  else if (!prev)
    logIntegrity("init", `Initialized version ${ver}`);
  localStorage.setItem("buddhiVersion", ver);
}

// 🧩 Error and Promise handler
window.onerror = (msg, src, line) => {
  const file = src ? src.split("/").pop() : "unknown";
  logIntegrity("error", msg, file, line);
  return true;
};
window.addEventListener("unhandledrejection", e =>
  logIntegrity("promise", e.reason?.message || e.reason)
);

// 🟠 Secret viewer
window.addEventListener("keydown", e => {
  if (e.ctrlKey && e.altKey && e.key === "b") {
    const logs = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
    alert("🧠 Buddhi Logs\n\n" +
      logs.slice(-12)
        .map(l => `${l.time} | ${l.type} | ${l.file}:${l.line}\n${l.msg}`)
        .join("\n"));
  }
});
