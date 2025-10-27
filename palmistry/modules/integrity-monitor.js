// 🕉️ Sathyadarshana Integrity Monitor v5.2 — MutationObserver + Forced Overlay
// Paste into /modules/integrity-monitor.js and import from main.js

const MODULES = [
  "camera.js", "ai-segmentation.js", "report.js",
  "voice.js", "compare.js", "updater.js"
];

function pushLog(type, msg, file = "system") {
  try {
    const arr = JSON.parse(localStorage.getItem("buddhiIntegrity") || "[]");
    arr.push({ time: new Date().toLocaleTimeString(), type, file, msg });
    // keep last 200
    localStorage.setItem("buddhiIntegrity", JSON.stringify(arr.slice(-200)));
  } catch (e) {
    console.warn("buddhi log write failed", e);
  }
  renderPanel(); // try update UI whenever log changes
}

export async function checkModules() {
  pushLog("init", "Checking core modules...");
  for (const file of MODULES) {
    try {
      const res = await fetch(`./modules/${file}`, { method: "HEAD" });
      if (!res.ok) throw new Error("missing");
      pushLog("ok", `${file} verified`);
    } catch (err) {
      pushLog("missing", `${file} → ${err.message}`);
    }
  }
  pushLog("done", "Module verification complete");
}

export function checkVersion(ver = "v5.2") {
  const prev = localStorage.getItem("buddhiVersion");
  if (!prev) pushLog("init", `Version ${ver} initialized`);
  else if (prev !== ver) pushLog("update", `Updated ${prev} → ${ver}`);
  else pushLog("version", `${ver} active`);
  localStorage.setItem("buddhiVersion", ver);
}

// capture global errors
window.onerror = (msg, src, line, col, err) => {
  pushLog("error", `${msg} (line ${line}:${col})`, src?.split("/").pop() || "unknown");
  return true; // prevent browser default alert
};
window.addEventListener("unhandledrejection", e => {
  pushLog("promise", e.reason?.message || String(e.reason));
});

// ----------------- UI: guaranteed overlay -----------------
function createOverlay() {
  // if already exists, skip
  if (document.getElementById("buddhiMonitorRoot")) return;

  // root container
  const root = document.createElement("div");
  root.id = "buddhiMonitorRoot";
  root.setAttribute("aria-hidden", "false");

  // styles (inline to avoid missing CSS)
  root.style.cssText = `
    position:fixed;
    left:8px;
    right:8px;
    bottom:8px;
    z-index:2147483647; /* max */
    pointer-events:auto;
    display:flex;
    justify-content:center;
  `;

  // panel
  const panel = document.createElement("div");
  panel.id = "buddhiMonitorPanel";
  panel.style.cssText = `
    width:calc(100% - 0px);
    max-width:960px;
    max-height:160px;
    overflow:auto;
    background:linear-gradient(180deg, rgba(6,10,12,0.95), rgba(10,14,18,0.95));
    color:#16f0a7;
    font-family:monospace;
    font-size:12px;
    border:1px solid rgba(0,229,255,0.12);
    box-shadow:0 -2px 18px rgba(0,229,255,0.08);
    padding:8px 10px;
    border-radius:10px;
    backdrop-filter: blur(6px);
    opacity:0; transform:translateY(8px);
    transition: opacity 280ms ease, transform 280ms ease;
  `;

  // header + controls
  const header = document.createElement("div");
  header.style.cssText = "display:flex;align-items:center;gap:8px;margin-bottom:6px";
  header.innerHTML = `
    <strong style="color:#00e5ff">🧠 Buddhi Monitor</strong>
    <button id="buddhiClose" title="Hide monitor" style="margin-left:auto;padding:4px 8px;border-radius:6px;border:none;background:#111;color:#16f0a7;cursor:pointer">Hide</button>
    <button id="buddhiExpand" title="Expand" style="margin-left:6px;padding:4px 8px;border-radius:6px;border:none;background:#00e5ff;color:#000;cursor:pointer">Expand</button>
    <button id="buddhiClear" title="Clear logs" style="margin-left:6px;padding:4px 8px;border-radius:6px;border:none;background:#ff6b6b;color:#000;cursor:pointer">Clear</button>
  `;

  // log box
  const logBox = document.createElement("div");
  logBox.id = "buddhiLogBox";
  logBox.style.cssText = "max-height:90px;overflow:auto;line-height:1.4;padding-right:6px";

  // test row (manual)
  const testRow = document.createElement("div");
  testRow.style.cssText = "margin-top:6px;display:flex;gap:8px;align-items:center";
  testRow.innerHTML = `
    <button id="buddhiTest" style="padding:6px 10px;border-radius:8px;border:none;background:#00e5ff;color:#000;cursor:pointer">Test Log</button>
    <small style="color:#88cfc4">If panel fails, tap Test Log</small>
  `;

  panel.appendChild(header);
  panel.appendChild(logBox);
  panel.appendChild(testRow);
  root.appendChild(panel);
  document.documentElement.appendChild(root);

  // show animation
  requestAnimationFrame(()=> {
    panel.style.opacity = "1";
    panel.style.transform = "translateY(0)";
  });

  // wire buttons
  document.getElementById("buddhiClose").onclick = () => {
    panel.style.opacity = "0";
    setTimeout(()=> root.remove(), 300);
  };
  document.getElementById("buddhiExpand").onclick = () => {
    panel.style.maxHeight = panel.style.maxHeight === "80vh" ? "160px" : "80vh";
    document.getElementById("buddhiLogBox").style.maxHeight = panel.style.maxHeight === "80vh" ? "70vh" : "90px";
  };
  document.getElementById("buddhiClear").onclick = ()=> {
    localStorage.removeItem("buddhiIntegrity");
    renderPanel();
  };
  document.getElementById("buddhiTest").onclick = ()=> {
    pushLog("test", "Manual test log at " + new Date().toLocaleTimeString());
  };

  // click log lines to see details
  logBox.addEventListener("click", e => {
    const lines = JSON.parse(localStorage.getItem("buddhiIntegrity")||"[]");
    alert("Last 12 logs:\n\n" + lines.slice(-12).map(l => `${l.time} | ${l.type} | ${l.file}\n${l.msg}`).join("\n\n"));
  });
}

function renderPanel() {
  // ensure root exists
  if (!document.body) return; // retry via observer/interval
  if (!document.getElementById("buddhiMonitorRoot")) createOverlayRoot();
  // fill logs
  const box = document.getElementById("buddhiLogBox");
