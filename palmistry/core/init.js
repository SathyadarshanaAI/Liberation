// core/init.js — System initialization & environment checks

export async function systemInit() {
  console.log("✅ Moduler OK — environment initializing...");

  // --- Check for camera access ---
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("❌ Your browser does not support camera access.");
  }

  // --- Register service worker ---
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("📡 Service Worker registered successfully.");
    } catch (err) {
      console.warn("Service Worker registration failed:", err);
    }
  }

  // --- Load manifest info (optional) ---
  try {
    const res = await fetch("./manifest.json");
    const manifest = await res.json();
    console.log(`📘 Manifest loaded: ${manifest.name || "Unnamed"}`);
  } catch {
    console.log("⚠️ Manifest not found or invalid JSON");
  }

  // --- Local storage version sync ---
  const current = "Palmistry-Lab-v5.3";
  const stored = localStorage.getItem("palmistry_version");
  if (stored !== current) {
    localStorage.setItem("palmistry_version", current);
    console.log("🔄 Version updated:", current);
  }

  // --- Visual confirmation in console ---
  console.log("🌿 SystemInit complete — ready to start main runtime");
}
