// modules/updater.js — client-side auto updater for Palmistry AI
// © 2025 Sathyadarshana Research Core

export async function checkForUpdates() {
  const localPath = "./config/model_registry.json";

  try {
    const resLocal = await fetch(localPath);
    const local = await resLocal.json();

    const remoteURL = local.features.remoteEndpoint;
    console.log("🌐 Checking remote registry:", remoteURL);

    const resRemote = await fetch(remoteURL, { cache: "no-store" });
    const remote = await resRemote.json();

    if (remote.last_update !== local.last_update) {
      console.log("🔄 Update available:", remote.last_update);

      // show toast notification in UI
      showUpdateNotice("New AI model or ruleset available", remote.last_update);

      // save to localStorage for later reload
      localStorage.setItem("pending_registry_update", JSON.stringify(remote));

      return true;
    } else {
      console.log("✅ System up to date.");
      return false;
    }
  } catch (err) {
    console.error("⚠️ Update check failed:", err.message);
    return false;
  }
}

function showUpdateNotice(message, date) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#101820";
  toast.style.color = "#16f0a7";
  toast.style.padding = "10px 16px";
  toast.style.borderRadius = "12px";
  toast.style.fontSize = "0.9rem";
  toast.style.boxShadow = "0 0 10px #00e5ff";
  toast.style.zIndex = "9999";
  toast.innerHTML = `⚡ ${message} <br><small>${date}</small><br>
    <button id="updateNowBtn" style="
      background:#00e5ff;color:#000;border:none;border-radius:6px;
      margin-top:4px;padding:4px 10px;cursor:pointer;">Reload Now</button>`;
  document.body.appendChild(toast);

  document.getElementById("updateNowBtn").onclick = () => {
    localStorage.setItem("forceReload", "true");
    location.reload();
  };

  setTimeout(() => toast.remove(), 15000);
}

// optional: trigger on page load
window.addEventListener("DOMContentLoaded", () => {
  checkForUpdates();
});
