import { CameraCard } from './modules/camera.js';
import { exportPalmPDF } from './modules/pdf.js';

const el = (id)=>document.getElementById(id);

// ── DOM refs ─────────────────────────────────────────────────────────
const canvasLeft  = el("canvasLeft");
const canvasRight = el("canvasRight");
const statusEl    = el("status");
const insightEl   = el("insight");
const langSel     = el("language");
const h3Left      = el("h3Left");
const h3Right     = el("h3Right");
const titleEl     = el("title");
const lblLang     = el("lblLanguage");

// ── State ─────────────────────────────────────────────────────────────
let camLeft, camRight;
let lastAnalysisLeft = null, lastAnalysisRight = null;
let lastLang = "en";

// ── I18N (12 languages) ──────────────────────────────────────────────
const SUPPORTED_LANGS = ['en','si','ta','hi','bn','ar','es','fr','de','ru','ja','zh-CN'];
const TTS_LANG_MAP = {
  'en':'en-US','si':'si-LK','ta':'ta-IN','hi':'hi-IN','bn':'bn-IN','ar':'ar-SA',
  'es':'es-ES','fr':'fr-FR','de':'de-DE','ru':'ru-RU','ja':'ja-JP','zh-CN':'zh-CN'
};

const UI_I18N = {
  en:{title:'Sathya Darshana Quantum Palm Analyzer V5.3', lang:'Language:', left:'Left Hand', right:'Right Hand',
      start:'Start', cap:'Capture', torch:'Torch', upload:'Upload',
      analyze:'Analyze', mini:'Mini Report', full:'Full Report (PDF)', speak:'Speak', ready:'Ready.',
      inherited:'Inherited tendencies', present:'Present actions',
      lines:{Heart:'Heart',Head:'Head',Life:'Life',Fate:'Fate',Health:'Health',Marriage:'Marriage'},
      reportTitle:'Palm Report', leftHdr:'Left', rightHdr:'Right', details:'Details'},
  si:{title:'සත්‍ය දර්ශන පෑම් විශ්ලේෂකය V5.3', lang:'භාෂාව:', left:'වම් අත', right:'දකුණු අත',
      start:'ආරම්භ', cap:'ග්‍රහණය', torch:'ටෝර්ච්', upload:'ඡායාරූපය',
      analyze:'විශ්ලේෂණය', mini:'ක්ෂුද්‍ර වාර්තාව', full:'සම්පූර්ණ PDF', speak:'කියවන්න', ready:'සූදානම්.',
      inherited:'පාරම්පරාවෙන් ලැබුණු ප්‍රවණතා', present:'වත්මන් ක්‍රියාකාරකම්',
      lines:{Heart:'හෘද',Head:'ශිරස්',Life:'ජීවිත',Fate:'නියත',Health:'සෞඛ්‍ය',Marriage:'විවාහ'},
      reportTitle:'අත විශ්ලේෂණ වාර්තාව', leftHdr:'වම්', rightHdr:'දකුණු', details:'විස්තර'},
  ta:{title:'சத்தியதர்ஷன கைரேகை பகுப்பாய்வு V5.3', lang:'மொழி:', left:'இடக் கை', right:'வலக் கை',
      start:'தொடங்கு', cap:'பிடி', torch:'டார்ச்', upload:'பதிவேற்று',
      analyze:'பகுப்பு', mini:'சிறு அறிக்கை', full:'முழு PDF', speak:'பேசு', ready:'தயார்.',
      inherited:'பாரம்பரிய குணங்கள்', present:'தற்போதைய செயற்பாடுகள்',
      lines:{Heart:'இதயம்',Head:'தலை',Life:'வாழ்க்கை',Fate:'விதி',Health:'ஆரோக்கியம்',Marriage:'திருமணம்'},
      reportTitle:'கைரேகை அறிக்கை', leftHdr:'இடம்', rightHdr:'வலம்', details:'விவரங்கள்'},
  hi:{title:'सत्य दर्शन पाम विश्लेषक V5.3', lang:'भाषा:', left:'बायां हाथ', right:'दायां हाथ',
      start:'शुरू', cap:'कैप्चर', torch:'टॉर्च', upload:'अपलोड',
      analyze:'विश्लेषण', mini:'संक्षिप्त रिपोर्ट', full:'पूर्ण PDF', speak:'बोलें', ready:'तैयार.',
      inherited:'वंशानुगत प्रवृत्तियाँ', present:'वर्तमान क्रियाएँ',
      lines:{Heart:'हृदय',Head:'मस्तिष्क',Life:'जीवन',Fate:'भाग्य',Health:'स्वास्थ्य',Marriage:'विवाह'},
      reportTitle:'हस्तरेखा रिपोर्ट', leftHdr:'बायां', rightHdr:'दायां', details:'विवरण'},
  bn:{title:'সত্যদর্শন পাম বিশ্লেষক V5.3', lang:'ভাষা:', left:'বাম হাত', right:'ডান হাত',
      start:'শুরু', cap:'ক্যাপচার', torch:'টর্চ', upload:'আপলোড',
      analyze:'বিশ্লেষণ', mini:'সংক্ষিপ্ত প্রতিবেদন', full:'পূর্ণ PDF', speak:'পড়ে শোনান', ready:'প্রস্তুত.',
      inherited:'উত্তরাধিকার সূত্রে প্রবণতা', present:'বর্তমান কাজকর্ম',
      lines:{Heart:'হৃদয়',Head:'মস্তিষ্ক',Life:'জীবন',Fate:'ভাগ্য',Health:'স্বাস্থ্য',Marriage:'বিবাহ'},
      reportTitle:'পাম রিপোর্ট', leftHdr:'বাম', rightHdr:'ডান', details:'বিস্তারিত'},
  ar:{title:'محلل كف اليد ساتيا دارشانا V5.3', lang:'اللغة:', left:'اليد اليسرى', right:'اليد اليمنى',
      start:'ابدأ', cap:'التقاط', torch:'مصباح', upload:'رفع',
      analyze:'تحليل', mini:'تقرير مختصر', full:'ملف PDF كامل', speak:'قراءة', ready:'جاهز.',
      inherited:'صفات موروثة', present:'أفعال حالية',
      lines:{Heart:'القلب',Head:'الرأس',Life:'الحياة',Fate:'القدر',Health:'الصحة',Marriage:'الزواج'},
      reportTitle:'تقرير الكف', leftHdr:'يسار', rightHdr:'يمين', details:'تفاصيل'},
  es:{title:'Analizador de Palma Sathya Darshana V5.3', lang:'Idioma:', left:'Mano izquierda', right:'Mano derecha',
      start:'Iniciar', cap:'Capturar', torch:'Linterna', upload:'Subir',
      analyze:'Analizar', mini:'Informe breve', full:'PDF completo', speak:'Voz', ready:'Listo.',
      inherited:'Tendencias heredadas', present:'Acciones presentes',
      lines:{Heart:'Corazón',Head:'Cabeza',Life:'Vida',Fate:'Destino',Health:'Salud',Marriage:'Matrimonio'},
      reportTitle:'Informe de palma', leftHdr:'Izquierda', rightHdr:'Derecha', details:'Detalles'},
  fr:{title:'Analyse de Paume Sathya Darshana V5.3', lang:'Langue :', left:'Main gauche', right:'Main droite',
      start:'Démarrer', cap:'Capturer', torch:'Lampe', upload:'Téléverser',
      analyze:'Analyser', mini:'Résumé', full:'PDF complet', speak:'Voix', ready:'Prêt.',
      inherited:'Tendances héritées', present:'Actions présentes',
      lines:{Heart:'Cœur',Head:'Tête',Life:'Vie',Fate:'Destin',Health:'Santé',Marriage:'Mariage'},
      reportTitle:'Rapport de paume', leftHdr:'Gauche', rightHdr:'Droite', details:'Détails'},
  de:{title:'Sathya Darshana Handflächen-Analyzer V5.3', lang:'Sprache:', left:'Linke Hand', right:'Rechte Hand',
      start:'Start', cap:'Aufnehmen', torch:'Lampe', upload:'Hochladen',
      analyze:'Analysieren', mini:'Kurzbericht', full:'Vollständiges PDF', speak:'Sprach', ready:'Bereit.',
      inherited:'Angeborene Tendenzen', present:'Gegenwärtige Handlungen',
      lines:{Heart:'Herz',Head:'Kopf',Life:'Leben',Fate:'Schicksal',Health:'Gesundheit',Marriage:'Ehe'},
      reportTitle:'Handflächenbericht', leftHdr:'Links', rightHdr:'Rechts', details:'Details'},
  ru:{title:'Анализатор ладони Сатья Даршана V5.3', lang:'Язык:', left:'Левая рука', right:'Правая рука',
      start:'Старт', cap:'Кадр', torch:'Фонарик', upload:'Загрузить',
      analyze:'Анализ', mini:'Краткий отчёт', full:'Полный PDF', speak:'Голос', ready:'Готово.',
      inherited:'Наследственные склонности', present:'Текущие действия',
      lines:{Heart:'Сердце',Head:'Голова',Life:'Жизнь',Fate:'Судьба',Health:'Здоровье',Marriage:'Брак'},
      reportTitle:'Отчёт по ладони', leftHdr:'Левая', rightHdr:'Правая', details:'Подробности'},
  ja:{title:'サティヤ・ダルシャナ 手相アナライザー V5.3', lang:'言語:', left:'左手', right:'右手',
      start:'開始', cap:'キャプチャ', torch:'ライト', upload:'アップロード',
      analyze:'分析', mini:'ミニレポート', full:'完全PDF', speak:'読み上げ', ready:'準備完了.',
      inherited:'先天的傾向', present:'現在の行動',
      lines:{Heart:'感情線',Head:'知能線',Life:'生命線',Fate:'運命線',Health:'健康線',Marriage:'結婚線'},
      reportTitle:'手相レポート', leftHdr:'左', rightHdr:'右', details:'詳細'},
  'zh-CN':{title:'萨提亚·达尔沙那 掌相分析 V5.3', lang:'语言：', left:'左手', right:'右手',
      start:'开始', cap:'拍摄', torch:'手电', upload:'上传',
      analyze:'分析', mini:'简报', full:'完整PDF', speak:'朗读', ready:'就绪.',
      inherited:'先天倾向', present:'当下行为',
      lines:{Heart:'感情线',Head:'智慧线',Life:'生命线',Fate:'命运线',Health:'健康线',Marriage:'婚姻线'},
      reportTitle:'掌相报告', leftHdr:'左', rightHdr:'右', details:'细节'}
};

function t(path) {
  const dict = UI_I18N[lastLang] || UI_I18N.en;
  return path.split('.').reduce((o,k)=>o&&o[k], dict) ?? path;
}

// apply UI + RTL if needed
function applyUI() {
  document.documentElement.lang = lastLang;
  document.body.dir = (lastLang === 'ar') ? 'rtl' : 'ltr';

  titleEl.textContent = t('title');
  lblLang.textContent = t('lang');
  h3Left.textContent = t('left');
  h3Right.textContent = t('right');

  el('startCamLeft').textContent  = t('start');
  el('captureLeft').textContent   = t('cap');
  el('torchLeft').textContent     = t('torch');
  el('uploadLeft').textContent    = t('upload');

  el('startCamRight').textContent = t('start');
  el('captureRight').textContent  = t('cap');
  el('torchRight').textContent    = t('torch');
  el('uploadRight').textContent   = t('upload');

  el('analyze').textContent       = t('analyze');
  el('miniReport').textContent    = t('mini');
  el('fullReport').textContent    = t('full');
  el('speak').textContent         = t('speak');
  statusEl.textContent            = t('ready');
}
const setStatus = (msg)=> statusEl.textContent = msg;

// ── Init ─────────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  applyUI();

  camLeft  = new CameraCard(el("camBoxLeft"),  { facingMode:'environment', onStatus:setStatus });
  camRight = new CameraCard(el("camBoxRight"), { facingMode:'environment', onStatus:setStatus });

  // Left
  el("startCamLeft").onclick  = async()=>{ await camLeft.start();  setStatus(t('left')+' ✓'); };
  el("captureLeft").onclick   = ()=>{ camLeft.captureTo(canvasLeft);  setStatus(t('left')+' OK'); };
  el("torchLeft").onclick     = async()=>{ await camLeft.toggleTorch(); };
  el("uploadLeft").onclick    = ()=>fileUpload(canvasLeft);

  // Right
  el("startCamRight").onclick = async()=>{ await camRight.start(); setStatus(t('right')+' ✓'); };
  el("captureRight").onclick  = ()=>{ camRight.captureTo(canvasRight); setStatus(t('right')+' OK'); };
  el("torchRight").onclick    = async()=>{ await camRight.toggleTorch(); };
  el("uploadRight").onclick   = ()=>fileUpload(canvasRight);

  // Analyze
  el("analyze").onclick = async()=>{
    setStatus('…');
    await animateScan(canvasLeft); await animateScan(canvasRight);
    lastAnalysisLeft  = await fakeAnalyze(canvasLeft,  "left");
    lastAnalysisRight = await fakeAnalyze(canvasRight, "right");
    showInsight(lastAnalysisLeft, lastAnalysisRight, "full");
    setStatus('✓');
  };

  // Mini
  el("miniReport").onclick = ()=>{
    if (lastAnalysisLeft && lastAnalysisRight) showInsight(lastAnalysisLeft, lastAnalysisRight, "mini");
  };

  // PDF (auto download via modules/pdf.js)
  el("fullReport").onclick = ()=>{
    if (!(lastAnalysisLeft && lastAnalysisRight)) return setStatus('…');
    const text = getReportText(lastAnalysisLeft, lastAnalysisRight, "full");
    exportPalmPDF({
      leftCanvas: canvasLeft,
      rightCanvas: canvasRight,
      reportText: text,
      fileName: `Palm_Report_${new Date().toISOString().slice(0,10)}.pdf`
    });
    setStatus('PDF ✓');
  };

  // Speak — wait for voices if needed
  el("speak").onclick = ()=>{
    if (!(lastAnalysisLeft && lastAnalysisRight)) return;
    const text = getReportText(lastAnalysisLeft, lastAnalysisRight, "full");
    if (speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = ()=> speakPalmReport(text);
    } else {
      speakPalmReport(text);
    }
  };

  // Language change
  langSel.onchange = ()=>{
    lastLang = SUPPORTED_LANGS.includes(langSel.value) ? langSel.value : 'en';
    applyUI();
    if (lastAnalysisLeft && lastAnalysisRight) showInsight(lastAnalysisLeft, lastAnalysisRight, "full");
  };
});

// ── Helpers ──────────────────────────────────────────────────────────
function fileUpload(canvas){
  const input=document.createElement("input");
  input.type="file"; input.accept="image/*";
  input.onchange=e=>{
    const f=e.target.files[0]; if(!f) return;
    const rdr=new FileReader();
    rdr.onload=ev=>{
      const img=new Image();
      img.onload=()=>{
        const iw=img.width, ih=img.height, aspect=3/4;
        let tw=iw, th=ih;
        if(iw/ih>aspect){tw=ih*aspect; th=ih;} else {tw=iw; th=iw/aspect;}
        canvas.width=tw; canvas.height=th;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle="#fff"; ctx.fillRect(0,0,tw,th);
        ctx.drawImage(img,(iw-tw)/2,(ih-th)/2,tw,th,0,0,tw,th);
        setStatus('📷');
      };
      img.src=ev.target.result;
    };
    rdr.readAsDataURL(f);
  };
  input.click();
}

async function animateScan(canvas){
  const ctx=canvas.getContext('2d');
  const frame=ctx.getImageData(0,0,canvas.width,canvas.height);
  const start=performance.now(), dur=800;
  await new Promise(res=>{
    function loop(now){
      const t=Math.min(1,(now-start)/dur);
      ctx.putImageData(frame,0,0);
      const y=t*canvas.height;
      const g=ctx.createLinearGradient(0,y-40,0,y+40);
      g.addColorStop(0,"rgba(0,229,255,0)");
      g.addColorStop(.5,"rgba(0,229,255,0.85)");
      g.addColorStop(1,"rgba(0,229,255,0)");
      ctx.fillStyle=g; ctx.fillRect(0,y-40,canvas.width,80);
      if(t<1) requestAnimationFrame(loop); else res();
    }
    requestAnimationFrame(loop);
  });
}

// Fake analyzer — plug the real one when ready
async function fakeAnalyze(canvas, hand){
  const L = UI_I18N[lastLang].lines;
  const names = [L.Heart, L.Head, L.Life, L.Fate, L.Health, L.Marriage];
  return {
    hand,
    summary: hand==="left" ? t('inherited') : t('present'),
    lines: names.map(n=>({
      name:n,
      confidence: Math.random()*0.4+0.6,
      insight: `${n} — ${t('details')}`
    }))
  };
}

function showInsight(L,R,mode){
  insightEl.textContent = getReportText(L,R,mode);
}

function getReportText(L,R,mode){
  const leftHdr  = t('leftHdr');
  const rightHdr = t('rightHdr');
  let out = `${t('reportTitle')}\n\n`;
  out += `${leftHdr}: ${L.summary}\n${rightHdr}: ${R.summary}\n\n`;
  if (mode==='full') {
    out += `— ${leftHdr} ${t('details')} —\n`;
    L.lines.forEach(l=> out += `• ${l.name}: ${(l.confidence*100).toFixed(1)}%\n`);
    out += `\n— ${rightHdr} ${t('details')} —\n`;
    R.lines.forEach(l=> out += `• ${l.name}: ${(l.confidence*100).toFixed(1)}%\n`);
  } else {
    const topL = L.lines.reduce((a,b)=>a.confidence>b.confidence?a:b);
    const topR = R.lines.reduce((a,b)=>a.confidence>b.confidence?a:b);
    out += `Top ${leftHdr}: ${topL.name} ${(topL.confidence*100).toFixed(1)}%\n`;
    out += `Top ${rightHdr}: ${topR.name} ${(topR.confidence*100).toFixed(1)}%\n`;
  }
  return out;
}

function speakPalmReport(text){
  if(!('speechSynthesis' in window)) return alert('No speech synthesis.');
  const msg=new SpeechSynthesisUtterance(text);
  const code=TTS_LANG_MAP[lastLang]||'en-US';
  msg.lang=code;
  const vs=window.speechSynthesis.getVoices();
  msg.voice = vs.find(v=>v.lang===code) || vs.find(v=>v.lang.startsWith(code.split('-')[0])) || vs[0];
  window.speechSynthesis.speak(msg);
}
