/* ---------------------------------------------------------
   THE SEED · Palmistry AI — Full Fusion Engine (v3.0)
   Modules Connected:
   ✔ Camera Engine
   ✔ Freeze Capture Engine
   ✔ Palm Detect
   ✔ Line Detect (8-line system)
   ✔ A4 Builder
   ✔ 3D Palm Renderer
   ✔ Final Report Generator
   ✔ WisdomCore Data Saver
   ✔ Language Engine
   ✔ Live AI Mode
----------------------------------------------------------*/

import { detectPalm } from "./vision/palm-detect.js";
import { detectLines } from "./vision/line-detect.js";
import { buildA4Sheet } from "./render/a4-builder.js";
import { renderPalm3D } from "./render/palm-3d-render.js";
import { finalReading } from "./render/truth-output.js";
import { WisdomCore } from "./core/wisdom-core.js";

/* DOM ELEMENTS */
let stream = null;
const video = document.getElementById("video");
const msg = document.getElementById("handMsg");
const output = document.getElementById("output");
const langSel = document.getElementById("languageSelect");

/* ---------------------------------------------------------
   LANGUAGE SYSTEM (12 Advanced Languages)
----------------------------------------------------------*/
const LANG = {
  en:{msg:"Place your hand inside the guide.",step:"Scan left → right.",open:"Open Camera",scan:"Scan Hand"},
  si:{msg:"කාඩ්‍රය තුළ අත තබන්න.",step:"වම් → දකුණු අත පළමුව.",open:"කැමරා විවෘත කරන්න",scan:"අත ස්කෑන් කරන්න"},
  ta:{msg:"கையை வழிகாட்டியில் வை.",step:"இடது→வலம்.",open:"கேமரா திறக்க",scan:"ஸ்கேன்"},
  fr:{msg:"Placez la main dans la zone.",step:"Gauche→Droite.",open:"Caméra",scan:"Scanner"},
  it:{msg:"Metti la mano nella guida.",step:"Sinistra→Destra.",open:"Apri Camera",scan:"Scansiona"},
  de:{msg:"Hand in den Rahmen legen.",step:"Links→Rechts.",open:"Kamera öffnen",scan:"Scannen"},
  es:{msg:"Coloca la mano.",step:"Izquierda→Derecha.",open:"Abrir Cámara",scan:"Escanear"},
  ru:{msg:"Поместите руку.",step:"Левая→Правая.",open:"Открыть камеру",scan:"Сканировать"},
  ar:{msg:"ضع يدك داخل الدليل.",step:"يسار→يمين.",open:"افتح الكاميرا",scan:"مسح اليد"},
  zh:{msg:"把手放入框中。",step:"左→右。",open:"打开相机",scan:"扫描"},
  ja:{msg:"手をガイドに置く。",step:"左→右。",open:"カメラを開く",scan:"スキャン"},
  he:{msg:"הנח את היד במסגרת.",step:"שמאל→ימין.",open:"פתח מצלמה",scan:"סרוק"}
};

/* LOAD LANGUAGES INTO SELECT BOX */
export function loadLanguages(){
  Object.keys(LANG).forEach(L=>{
      let o=document.createElement("option");
      o.value=L; o.textContent=L.toUpperCase();
      langSel.appendChild(o);
  });
}

export function setLanguage(){
  const L = langSel.value;
  msg.innerHTML = LANG[L].msg + "<br>" + LANG[L].step;
}


/* ---------------------------------------------------------
   CAMERA ENGINE
----------------------------------------------------------*/
export async function startCamera() {
    if(stream) stream.getTracks().forEach(t=>t.stop());

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video:{facingMode:"environment"},
            audio:false
        });
    } catch {
        stream = await navigator.mediaDevices.getUserMedia({video:true});
    }

    video.srcObject = stream;
    await video.play();
    msg.innerHTML = "Camera ready — Hold your hand steady.";
}


/* ---------------------------------------------------------
   CAPTURE FREEZE
----------------------------------------------------------*/
export function captureHand() {
    if (!video.srcObject) {
        alert("Camera is not active!");
        return;
    }

    msg.innerHTML = "Capturing… keep your hand still.";

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    processPalm(frame);
}


/* ---------------------------------------------------------
   PROCESS PIPELINE — full AI sequence
----------------------------------------------------------*/
async function processPalm(frame) {
    msg.innerHTML = "Detecting palm structure…";

    const palm = await detectPalm(frame);

    msg.innerHTML = "Extracting lines…";

    const lines = await detectLines(palm);

    WisdomCore.saveScan({
        raw: frame,
        palm,
        lines,
        timestamp: Date.now()
    });

    msg.innerHTML = "Building report…";

    const report = finalReading(lines);

    output.textContent = report;

    msg.innerHTML = "Palm scan complete ✔";

    // AUTO RENDER 3D + A4 PDF STRUCTURE
    renderPalm3D(lines);
    buildA4Sheet(lines);
}


/* ---------------------------------------------------------
   LIVE AI MODE
----------------------------------------------------------*/
export async function startLiveAI() {

    const last = WisdomCore.getLastScan();
    if (!last){
        output.textContent = "Scan a palm first!";
        return;
    }

    output.textContent = "🎙 Ask me anything about your palm lines…";

    const answer = await WisdomCore.talk(last);
    output.textContent = answer;
}


/* ---------------------------------------------------------
   EXPORT A4
----------------------------------------------------------*/
export function exportA4(){
    const pdf = WisdomCore.exportPDF();
    output.textContent = "📄 A4 exported successfully.";
}
