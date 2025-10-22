// === Quantum Palm Analyzer V6.2 ===
// Truth Guard Multilingual Edition
const $ = id => document.getElementById(id);
const statusEl = $("status");

let streamLeft, streamRight;

// ====== Message Helper ======
function msg(text, ok = true){
  statusEl.textContent = text;
  statusEl.style.color = ok ? "#16f0a7" : "#ff6b6b";
}

// ====== Camera Control ======
async function startCam(side){
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  try{
    const constraints = { video: { facingMode: { ideal: "environment" }, width: 640, height: 480 } };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    vid.srcObject = stream;
    if(side==="left") streamLeft = stream; else streamRight = stream;
    msg(`${side} camera started ✅`);
  }catch(e){
    msg(`Camera blocked or unavailable: ${e.message}`, false);
    alert("⚠️ Camera permission denied. Please Allow camera in site settings.");
  }
}

function capture(side){
  const vid = side === "left" ? $("vidLeft") : $("vidRight");
  const canvas = side === "left" ? $("canvasLeft") : $("canvasRight");
  const ctx = canvas.getContext("2d");
  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  canvas.dataset.locked = "1";
  flash(canvas);
  msg(`${side} hand locked 🔒`);
}

function flash(el){
  el.style.boxShadow = "0 0 15px #16f0a7";
  setTimeout(() => el.style.boxShadow = "none", 800);
}

// ====== Torch Feature ======
async function toggleTorch(side){
  const stream = side === "left" ? streamLeft : streamRight;
  if(!stream){ msg("Start camera first!", false); return; }
  const track = stream.getVideoTracks()[0];
  const cap = track.getCapabilities();
  if(!cap.torch){ msg("Torch not supported", false); return; }
  const torchOn = !track.getConstraints().advanced?.[0]?.torch;
  await track.applyConstraints({ advanced: [{ torch: torchOn }] });
  msg(`Torch ${torchOn ? "ON" : "OFF"} 💡`);
}

// ====== Verify before analysis ======
function verifyLock(){6
  const L = $("canvasLeft").dataset.locked === "1";
  const R = $("canvasRight").dataset.locked === "1";
  if(!L || !R){
    alert("🛑 Capture both Left and Right hands before Analyze!");
    return false;
  }
  return true;
}

// ====== Analyzer Animation ======
function startAnalyzer(){
  msg("🌀 Scanning beams activated...");
  const beam = document.createElement("div");
  beam.style = `
    position:fixed;top:0;left:0;width:100%;height:4px;
    background:#00e5ff;box-shadow:0 0 20px #00e5ff;z-index:9999;
  `;
  document.body.appendChild(beam);
  let y = 0, dir = 1;
  const anim = setInterval(() => {
    y += 6 * dir;ඩඬ ෴
    beam.style.top = y + "px";
    if (y > window.innerHeight - 8 || y < 0) dir *= -1;
  }, 10);
  setTimeout(() => {
    clearInterval(anim);
    beam.remove();
    msg("✅ Report Generated Successfully – Truth Guard Verified");
    showReport();
  }, 3500);
}

// ====== Multilingual Reports ======
const REPORT_TEXT = {
  en:`Right hand shows strong Head & Life lines — vitality and intelligence.
Left hand indicates faith, intuition, and compassion.
Truth Guard Result: Balanced mental and emotional energy.`,
  si:`දකුණු අතේ මනෝ රේඛා සහ ජීවිත රේඛාව ශක්තිමත්ය — බුද්ධිමත්භාවය සහ ශක්තිය පෙන්වයි.
වම අත විශ්වාසය, අභිඥා හා කරුණාව පෙන්වයි.
සත්‍යරක්ෂක විශ්ලේෂණය: මනස හා හදවත අතර සමතුලිත ශක්තිය.`,
  ta:`வலது கையில் தலை மற்றும் உயிர் கோடுகள் வலுவாக உள்ளன — புத்திசாலித்தனம் மற்றும் உயிர்ச்சக்தியை குறிக்கின்றன.
இடது கை நம்பிக்கை, உள்ளுணர்வு, கருணை ஆகியவற்றைக் காட்டுகிறது.
உண்மை காவலன் முடிவு: மனமும் இதயமும் சமநிலையில்.`,
  hi:`दाहिने हाथ में मस्तिष्क और जीवन रेखाएँ मजबूत हैं — बुद्धि और ऊर्जा का संकेत देती हैं।
बाएँ हाथ में विश्वास, अंतर्ज्ञान और करुणा दिखाई देती है।
सत्य रक्षक परिणाम: मानसिक और भावनात्मक संतुलन।`,
  zh:`右手头线和生命线强劲——象征活力与智慧。
左手表现出信念、直觉和慈悲。
真理守护结果：身心能量平衡。`,
  ja:`右手の頭脳線と生命線は力強く、活力と知性を示します。
左手は信仰、直感、慈悲を示します。
真理ガード結果：心と感情のバランスが取れています。`,
  fr:`La main droite montre des lignes fortes — vitalité et intelligence.
La main gauche indique foi, intuition et compassion.
Résultat du Bouclier de Vérité : équilibre mental et émotionnel.`,
  de:`Die rechte Hand zeigt starke Linien — Vitalität und Intelligenz.
Die linke Hand weist auf Glauben, Intuition und Mitgefühl hin.
Wahrheitsschutz-Ergebnis: Ausgeglichenes mentales und emotionales Energielevel.`,
  es:`La mano derecha muestra líneas fuertes — vitalidad e inteligencia.
La izquierda indica fe, intuición y compasión.
Resultado del Guardián de la Verdad: Energía mental y emocional equilibrada.`,
  it:`La mano destra mostra linee forti — vitalità e intelligenza.
La sinistra indica fede, intuizione e compassione.
Risultato del Guardiano della Verità: equilibrio mentale ed emotivo.`,
  ru:`Правая рука показывает сильные линии головы и жизни — жизненная сила и интеллект.
Левая — вера, интуиция и сострадание.
Результат Истинного Щита: сбалансированная энергия.`,
  ar:`اليد اليمنى تُظهر خطوط الرأس والحياة قوية — دلالة على الذكاء والطاقة.
اليد اليسرى تُظهر الإيمان والحدس والرحمة.
نتيجة حارس الحقيقة: توازن بين العقل والعاطفة.`
};

// ====== Report Display ======
function showReport(){
  const lang = $("language").value || "en";
  let div = document.getElementById("report");
  if(!div){
    div = document.createElement("div");
    div.id = "report";
    div.style = `
      background:#101820;
      color:#e6f0ff;
      padding:15px;
      border-radius:10px;
      width:80%;
      margin:20px auto;
      box-shadow:0 0 12px #00e5ff;
      line-height:1.6;
    `;
    document.body.appendChild(div);
  }

  div.innerHTML = `
    <h3 style="color:#00e5ff;">🔮 Quantum Palm Analyzer Report</h3>
    <p>${REPORT_TEXT[lang] || REPORT_TEXT.en}</p>
  `;
}

// ====== PDF Export ======
$("saveBtn").onclick = () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const text = document.getElementById("report")?.innerText || "No report yet.";
  pdf.text(text, 10, 20);
  pdf.save("Palm_Report.pdf");
};

// ====== Voice Output ======
$("speakBtn").onclick = () => {
  const lang = $("language").value || "en";
  const text = document.getElementById("report")?.innerText || "No report yet.";
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  speechSynthesis.speak(u);
};

// ====== Event Bindings ======
$("startLeft").onclick = () => startCam("left");
$("startRight").onclick = () => startCam("right");
$("captureLeft").onclick = () => capture("left");
$("captureRight").onclick = () => capture("right");
$("torchLeft").onclick = () => toggleTorch("left");
$("torchRight").onclick = () => toggleTorch("right");
$("analyzeBtn").onclick = () => { if(verifyLock()) startAnalyzer(); };
$("language").addEventListener("change", e => {
  const lang = e.target.value;
  msg(`🌐 Language set to ${lang}`);
});
