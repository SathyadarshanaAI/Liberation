/* ---------------------------------------------------------
   THE SEED · Palmistry AI (v3.0)
   Fully functional browser-safe version
   No missing imports · No module errors
----------------------------------------------------------*/

/* ---------- GLOBAL DOM ELEMENTS ---------- */
const video = document.getElementById("video");
const msg = document.getElementById("handMsg");
const outBox = document.getElementById("output");
const langSelect = document.getElementById("languageSelect");
let stream = null;

/* ---------- LANGUAGE PACK (12 LANG) ---------- */
const LANG = {
  en: { msg: "Place your hand inside the guide.", step: "First scan left, then right.", open: "Open Camera", scan: "Scan Hand" },
  si: { msg: "අත නිදර්ශකය ඇතුළට තබන්න.", step: "පළමුව වම් අත, පසුව දකුණු අත.", open: "කැමරා විවෘත කරන්න", scan: "අත් පරීක්ෂා කරන්න" },
  ta: { msg: "கையை வழிகாட்டி உள்ளே வையுங்கள்.", step: "முதல் இடது கை, பின்னர் வலது கை.", open: "கேமரா திறக்க", scan: "கை ஸ்கேன்" },
  hi: { msg: "हाथ को गाइड में रखें.", step: "पहले बायाँ, फिर दायाँ.", open: "कैमरा खोलें", scan: "हाथ स्कैन" },
  kn: { msg: "ಕೈಯನ್ನು ಗೈಡ್ ಒಳಗೆ ಇಡಿ.", step: "ಮೊದಲು ಎಡ, ನಂತರ ಬಲ.", open: "ಕ್ಯಾಮೆರಾ ಓಪನ್", scan: "ಸ್ಕ್ಯಾನ್" },
  bn: { msg: "হাত গাইডের ভিতরে রাখুন।", step: "বাম → ডান স্ক্যান করুন।", open: "ক্যামেরা চালু", scan: "স্ক্যান" },
  zh: { msg: "将手放入指引区域。", step: "先扫描左手，再右手。", open: "打开相机", scan: "扫描" },
  ja: { msg: "手をガイド内に置いてください。", step: "左手→右手", open: "カメラを開く", scan: "スキャン" },
  ar: { msg: "ضع يدك داخل الدليل.", step: "افحص اليسرى ثم اليمنى.", open: "افتح الكاميرا", scan: "مسح اليد" },
  es: { msg: "Coloca la mano en la guía.", step: "Escanea izquierda→derecha.", open: "Abrir Cámara", scan: "Escanear Mano" },
  de: { msg: "Hand in die Führung legen.", step: "Links → Rechts scannen.", open: "Kamera öffnen", scan: "Hand scannen" },
  ru: { msg: "Поместите руку внутрь контура.", step: "Сканируйте левую → правую.", open: "Открыть камеру", scan: "Сканировать" }
};

/* ---------- LOAD LANGUAGE OPTIONS ---------- */
if (langSelect) {
  Object.keys(LANG).forEach(key => {
    const o = document.createElement("option");
    o.value = key;
    o.textContent = key.toUpperCase();
    langSelect.appendChild(o);
  });
}

/* ---------- APPLY LANGUAGE ---------- */
window.setLanguage = function () {
  const L = langSelect.value;
  if (!L) return;

  msg.innerHTML = LANG[L].msg + "<br>" + LANG[L].step;
  document.querySelectorAll(".actionBtn")[0].textContent = LANG[L].open;
  document.querySelectorAll(".actionBtn")[1].textContent = LANG[L].scan;
};

/* ---------------------------------------------------------
   CAMERA ENGINE — fully working on all devices
----------------------------------------------------------*/
window.startCamera = async function () {
  if (stream) stream.getTracks().forEach(t => t.stop());

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    });
  } catch (e) {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
  }

  video.srcObject = stream;
  await video.play();

  msg.innerHTML = "Hold your hand inside the guide.";
};

/* ---------------------------------------------------------
   CAPTURE + BASIC AI PROCESSING (placeholder)
----------------------------------------------------------*/
window.captureHand = function () {
  if (!video.srcObject) {
    alert("Camera not active.");
    return;
  }

  msg.innerHTML = "Scanning... hold still.";

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const imgData = canvas.toDataURL("image/png");

  // TEMP OUTPUT UNTIL AI CONNECTED
  outBox.textContent =
    "Palm captured successfully.\nAI engine connecting...\n\n(base engine active)";
};
