/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   main.js — Browser + Module Compatible Edition (v3.1)
----------------------------------------------------------*/

let stream = null;

/* DOM */
const video = document.getElementById("video");
const msg = document.getElementById("handMsg");
const outBox = document.getElementById("output");
const langSelect = document.getElementById("languageSelect");

/* LANG PACK (12 languages) */
const LANG = {
  en: { msg: "Place your hand inside the guide.", step: "Scan left → right.", open: "Open Camera", scan: "Scan Hand" },
  si: { msg: "අත නිදර්ශකය තුළ තබන්න.", step: "වම් අත → දකුණු අත.", open: "කැමරා විවෘත කරන්න", scan: "අත් පරීක්ෂා කරන්න" },
  ta: { msg: "கையை வழிகாட்டி உள்ளே வையுங்கள்.", step: "இடது → வலது.", open: "கேமரா திறக்க", scan: "ஸ்கேன்" },
  hi: { msg: "हाथ गाइड के अंदर रखें.", step: "बायाँ → दायाँ.", open: "कैमरा खोलें", scan: "स्कैन" }
  // (rest languages you added)
};

/* ---------------------------------------------------------
   LOAD LANGUAGES
----------------------------------------------------------*/
export function loadLanguages() {
  if (!langSelect) return;

  Object.keys(LANG).forEach(code => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = code.toUpperCase();
    langSelect.appendChild(option);
  });
}

/* ---------------------------------------------------------
   APPLY LANGUAGE
----------------------------------------------------------*/
export function setLanguage() {
  const L = langSelect.value;
  if (!L) return;

  msg.innerHTML = LANG[L].msg + "<br>" + LANG[L].step;

  const btns = document.querySelectorAll(".actionBtn");
  btns[0].textContent = LANG[L].open;
  btns[1].textContent = LANG[L].scan;
}

/* ---------------------------------------------------------
   CAMERA ENGINE
----------------------------------------------------------*/
export async function startCamera() {
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

  msg.innerHTML = "Hold your hand inside the guide.";
}

/* ---------------------------------------------------------
   CAPTURE + PREVIEW
----------------------------------------------------------*/
export function captureHand() {
  if (!video.srcObject) {
    alert("Camera not active!");
    return;
  }

  msg.innerHTML = "Scanning… please wait.";

  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0);

  const imageData = canvas.toDataURL("image/png");

  outBox.textContent = "Palm scan captured.\nAI Engine loading…";
}
