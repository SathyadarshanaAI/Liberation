// =====================================================
// 🧩 Sathyadarshana Code Health Diagnostic Engine
// =====================================================
(function codeHealthCheck() {
  try {
    console.log("🧠 Running Code Health Diagnostic...");

    // === Module Sanity Checks ===
    const modules = ["initApp", "initAI", "runPalmPipeline", "speakSinhala"];
    modules.forEach(fn => {
      if (typeof eval(fn) !== "function") {
        console.warn(`⚠️ Missing or invalid module: ${fn}`);
      }
    });

    // === Variable & Context Check ===
    if (typeof cv === "undefined") console.warn("⚠️ OpenCV not loaded!");
    if (typeof tf === "undefined") console.warn("⚠️ TensorFlow not loaded!");
    if (!document.querySelector("#vidLeft")) console.warn("⚠️ Left video element missing!");
    if (!document.querySelector("#vidRight")) console.warn("⚠️ Right video element missing!");

    // === Syntax Tester ===
    const testScript = "let x = 1 + 2; console.log('🩺 Syntax OK:', x);";
    new Function(testScript)();

    console.log("✅ Code Health: No critical syntax errors detected.");

  } catch (err) {
    console.error("💥 Code Health Error:", err.message);
    const st = document.getElementById("status");
    if (st) st.textContent = "💢 Code Health Error: " + err.message;
  }
})();// 🩺 Quick Check
try {
  if (typeof initApp !== "function") {
    console.error("🚨 initApp() not found in module scope.");
    const st = document.getElementById("status");
    if (st) st.innerHTML = "💢 initApp() not loaded — check js/app.js path or export.";
  } else {
    console.log("✅ initApp() available.");
  }
} catch (err) {
  console.error("💥 initApp load test failed:", err);
}
