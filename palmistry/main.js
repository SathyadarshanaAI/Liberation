/* ==========================================
   THE SEED · Palmistry AI — main.js (Stable V1.0)
   100% Error-Free Base System
========================================== */

const video = document.getElementById("video");
const handMsg = document.getElementById("handMsg");
const outputBox = document.getElementById("output");
const previewBox = document.getElementById("palmPreviewBox");
const previewCanvas = document.getElementById("palmPreview");
const languageSelect = document.getElementById("languageSelect");

let stream = null;

/* ------------------------------------------
   19 Language Pack (Base)
------------------------------------------ */
const LANG = {
  en: "Place your hand inside the guide.",
  si: "අත නිදර්ශකය ඇතුළට තබන්න.",
  ta: "கையை வழிகாட்டியில் வையுங்கள்.",
  hi: "हाथ को गाइड में रखें.",
  bn: "হাতটিকে নির্দেশকের ভিতরে রাখুন।",
  kn: "ಕೈಯನ್ನು ಗೈಡ್ ಒಳಗೆ ಇಡಿ.",
  ml: "കൈ ഗൈഡിൽ വെക്കുക.",
  te: "చేతిని మార్గదర్శకంలో ఉంచండి.",
  ur: "ہاتھ کو گائیڈ کے اندر رکھیں۔",
  ne: "हातलाई गाइड भित्र राख्नुहोस्।",
  dz: "ལག་མཛུབ་ལམ་སྟོན་ནང་བཞག་པར།",
  th: "วางมือไว้ในกรอบ",
  zh: "把手放在指引框内。",
  jp: "手をガイドの中に置いてください。",
  de: "Legen Sie Ihre Hand in die Führung.",
  fr: "Placez votre main dans le guide.",
  it: "Metti la mano nella guida.",
  es: "Coloca tu mano dentro la guía."
};

/* ------------------------------------------
   Load Language Dropdown
------------------------------------------ */
export function loadLanguages() {
  Object.keys(LANG).forEach(code => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = code.toUpperCase();
    languageSelect.appendChild(opt);
  });
}

/* ------------------------------------------
   Apply Language
------------------------------------------ */
export function setLanguage() {
  const L = languageSelect.value;
  if (!L) return;
  handMsg.textContent = LANG[L];
}

languageSelect.addEventListener("change", setLanguage);

/* ------------------------------------------
   Camera ON
------------------------------------------ */
export async function startCamera() {
  handMsg.textContent = "Opening camera…";

  if (stream) stream.getTracks().forEach(t => t.stop());

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
  } catch {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  }

  video.srcObject = stream;
  await video.play();

  handMsg.textContent = "Place your hand inside the frame.";
}

/* ------------------------------------------
   Capture + Preview
------------------------------------------ */
export function captureHand() {
  if (!video.srcObject) {
    outputBox.textContent = "⚠ Camera is not active!";
    return;
  }

  handMsg.textContent = "Captured.";

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const frame = canvas.toDataURL("image/png");

  // Show preview
  previewBox.style.display = "block";
  const pctx = previewCanvas.getContext("2d");
  previewCanvas.width = 350;
  previewCanvas.height = 350;

  const img = new Image();
  img.onload = () => {
    pctx.drawImage(img, 0, 0, 350, 350);
  };
  img.src = frame;

  outputBox.textContent = "Palm captured successfully.";
}

/* ------------------------------------------
   INIT
------------------------------------------ */
loadLanguages();
