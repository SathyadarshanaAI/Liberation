// main.js — Root Modular Loader
const status = document.getElementById("status");
const reportBox = document.getElementById("reportBox");

async function boot() {
  status.textContent = "Loading modules…";
  try {
    const [bus, camera, report, vision, pdf, ai] = await Promise.all([
      import("./modules/bus.js"),
      import("./modules/camera.js"),
      import("./modules/report.js"),
      import("./modules/vision.js"),
      import("./modules/pdf.js"),
      import("./modules/ai.js"),
    ]);

    status.textContent = "Modules loaded ✅";
    reportBox.textContent = "Quantum Palm Analyzer Core initialized successfully.";

    // Emit first event
    bus.emit("core:ready", { time: new Date().toISOString() });
  } catch (e) {
    status.textContent = "❌ Module load failed";
    reportBox.textContent = e.message;
    console.error("Module load error:", e);
  }
}

boot();
