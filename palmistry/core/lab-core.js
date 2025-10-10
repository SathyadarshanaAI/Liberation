<!-- palmistry/core/lab-core.js -->
<script type="module">
const LAB = {};
const MANIFEST_URL = "manifest.json";        // production name
const SW_URL = "../sw.js";                    // already added

// ---------- fetch with cache bust + sanity ----------
async function fetchJSON(url) {
  const bust = `v=${Date.now()}`;
  const res = await fetch(`${url}?${bust}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} @ ${url}`);
  return res.json();
}

// ---------- manifest ----------
let manifest = null;
LAB.loadManifest = async () => {
  try {
    manifest = await fetchJSON(MANIFEST_URL);
    localStorage.setItem("lab_manifest", JSON.stringify(manifest));
    return manifest;
  } catch {
    // offline / fallback
    const cached = localStorage.getItem("lab_manifest");
    if (cached) {
      manifest = JSON.parse(cached);
      return manifest;
    }
    throw new Error("No manifest available");
  }
};
LAB.getManifest = () => manifest;
LAB.getVersion = () => (manifest?.version ?? "0.0.0");

// ---------- service worker ----------
LAB.initSW = async () => {
  if (!("serviceWorker" in navigator)) return;
  try {
    await navigator.serviceWorker.register(SW_URL);
  } catch {}
};

// ---------- tiny pubsub for modules ----------
const bus = new EventTarget();
LAB.on  = (ev, fn) => bus.addEventListener(ev, fn);
LAB.emit= (ev, detail) => bus.dispatchEvent(new CustomEvent(ev,{detail}));

// ---------- boot ----------
LAB.init = async () => {
  await LAB.initSW();
  await LAB.loadManifest();
  LAB.emit("ready", { version: LAB.getVersion(), manifest });
};

window.LAB = LAB;
export default LAB;
</script>
