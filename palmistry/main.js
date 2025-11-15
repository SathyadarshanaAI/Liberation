// ============================================
// Palmistry AI – main.js (CLEAN VERSION)
// ============================================

let stream = null;

const video = document.getElementById("video");
const handMsg = document.getElementById("handMsg");
const outputBox = document.getElementById("output");
const languageSelect = document.getElementById("languageSelect");

// --------------------------------------------
// LANGUAGE SYSTEM
// --------------------------------------------
const LANG = {
  en: { msg: "Place your hand inside the guide.", open: "Open Camera", scan: "Scan Hand" },
  si: { msg: "අත නිදර්ශකය ඇතුළට තබන්න.", open: "කැමරාව විවෘත කරන්න", scan: "අත පරීක්ෂා කරන්න" },
  ta: { msg: "கையை வழிகாட்டியின் உள்ளே வையுங்கள்.", open: "கேமரா திறக்க", scan: "கை ஸ்கேன்" }
};

export function loadLanguages() {
  Object.keys(LANG).forEach(key => {
    let o = document.createElement("option");
    o.value = key;
    o.textContent = key.toUpperCase();
    languageSelect.appendChild(o);
  });
}

export function setLanguage() {
  const L = languageSelect.value;
  if (!L) return;
  handMsg.textContent = LANG[L].msg;
  document.querySelectorAll(".actionBtn")[0].textContent = LANG[L].open;
  document.querySelectorAll(".actionBtn")[1].textContent = LANG[L].scan;
}

// --------------------------------------------
// CAMERA ENGINE
// --------------------------------------------
export async function startCamera() {
  handMsg.textContent = "Opening camera…";

  if (stream) stream.getTracks().forEach(t => t.stop());

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" }
    });
  } catch {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  }

  video.srcObject = stream;
  await video.play();

  handMsg.textContent = "Place your hand inside the frame.";
}

// --------------------------------------------
// SCAN FREEZE CAPTURE
// --------------------------------------------
export function captureHand() {
  if (!video.srcObject) {
    outputBox.textContent = "❗ Camera is not active!";
    return;
  }

  const c = document.createElement("canvas");
  c.width = video.videoWidth;
  c.height = video.videoHeight;

  const ctx = c.getContext("2d");
  ctx.drawImage(video, 0, 0);

  outputBox.textContent = "✔ Captured frame.\n(Analysis system not connected yet)";
}
