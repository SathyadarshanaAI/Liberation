// modules/i18n.js
export const LANGS = ['en','si','ta','hi','bn','ar','es','fr','de','ru','ja','zh-CN'];

// Master dictionary: UI + glossary + long paragraphs
export const I18N = {
  en: {
    ui: { title: "Sathya Darshana Quantum Palm Analyzer", lang:"Language", left:"Left Hand", right:"Right Hand",
          start:"Start", cap:"Capture", torch:"Torch", upload:"Upload",
          analyze:"Analyze", mini:"Mini Report", full:"Full Report (PDF)", speak:"Speak", ready:"Ready." },
    g: { // Glossary – strictly curated terms
      palmistry:"Palmistry", heartLine:"Heart Line", headLine:"Head Line", lifeLine:"Life Line",
      fateLine:"Fate Line", sunLine:"Sun Line", healthLine:"Health Line", marriageLines:"Marriage Lines",
      bracelets:"Manibandha (Wrist Lines)"
    },
    p: { // Long paragraphs (you can expand freely)
      leftSummary: "Represents inherited tendencies, instinctive patterns, and the subconscious.",
      rightSummary:"Reflects present choices, actions, and how you shape your path.",
      heartDeep: "The Heart Line relates to emotional style, attachment, and compassion. A clear, even line suggests balanced feeling and steady bonds.",
      headDeep:  "The Head Line speaks to reasoning and decision-making. Depth with clarity indicates focused intellect; breaks suggest creative shifts.",
      lifeDeep:  "The Life Line reflects vitality and major life changes. Strength is not about lifespan but about energy and adaptation.",
      fateDeep:  "The Fate (Saturn) Line shows career direction and commitments. Forks may indicate parallel paths or evolving purpose."
    }
  },

  // ✅ Sinhala – curated terms (NO machine translate)
  si: {
    ui: { title:"සත්‍ය දර්ශන පෑම් විශ්ලේෂකය", lang:"භාෂාව", left:"වම් අත", right:"දකුණු අත",
          start:"ආරම්භ", cap:"ග්‍රහණය", torch:"ටෝර්ච්", upload:"ඡායාරූපය",
          analyze:"විශ්ලේෂණය", mini:"ක්ෂුද්‍ර වාර්තාව", full:"සම්පූර්ණ වාර්තා PDF", speak:"කියවන්න", ready:"සූදානම්." },
    g: {
      palmistry:"අත විශ්ලේෂණය",              // Palmistry
      heartLine:"හෘද රේඛාව",
      headLine:"ශිරස් රේඛාව",
      lifeLine:"ජීවිත රේඛාව",
      fateLine:"නියත (ශනි) රේඛාව",
      sunLine:"සුර්ය (අපොලෝ) රේඛාව",
      healthLine:"ආරෝග්‍ය/බුධ රේඛාව",
      marriageLines:"විවාහ රේඛා",
      bracelets:"මණිබන්ධ රේඛා"
    },
    p: {
      leftSummary:"පාරම්පරාවෙන් ලැබුණු ප්‍රවණතා, ස්වභාවික රටා සහ අවබෝධයට පහළ පැතිරීම් පෙන්වයි.",
      rightSummary:"දැන් කරන තේරීම් හා ක්‍රියාකාරකම් රැස් කර ඔබ මාර්ගය ගොඩනඟන ආකාරය පෙන්වයි.",
      heartDeep:"හෘද රේඛාව යනු දැනුම් ගැන්වූ හැඟීම්, ආකර්ෂණය සහ කරුණාවට අදාලයි. පැහැදිලි හා සමාන රේඛාවක් සාමාන්‍යයෙන් සමතුලිත සෙනෙහසක් පෙන්වයි.",
      headDeep:"ශිරස් රේඛාව තාර්කික සිතුවම් සහ තීරණ ගැනීම සැලකේ. ගැඹුරු හා පැහැදිලි රටා උනන්දුවෙන් යුතු බුද්ධිය; කැඩීම් සෘජුම තැනින් ඇතිවූ නිර්මාණාත්මක මාරු පෙන්වයි.",
      lifeDeep:"ජීවිත රේඛාව ජීවන ශක්තිය හා විශාල මාරු දර්ශනය කරයි. එහි ශක්තිය දිගුකාලීනතාව නොව, ශක්තිමත් හැඟීම හා හැඩගැස්වීම පෙන්වයි.",
      fateDeep:"නියත/ශනි රේඛාව වෘත්තීය දිශාව හා බැඳීම් පිළිබඳ ය. දෙබැඳුම් හෝ කැඩීම් සමකාලීන මාවත් හෝ නව අරමුණකට හැරවීම අර්ථ දක්වයි."
    }
  },

  // ✅ Tamil – curated
  ta: {
    ui:{ title:"சத்திய தர்ஷன கைரேகை பகுப்பாய்வு", lang:"மொழி", left:"இடக் கை", right:"வலக் கை",
         start:"தொடங்கு", cap:"பிடி", torch:"டார்ச்", upload:"பதிவேற்று",
         analyze:"பகுப்பு", mini:"சிறு அறிக்கை", full:"முழு PDF", speak:"பேசு", ready:"தயார்." },
    g:{
      palmistry:"கைரேகை", heartLine:"இதய கோடு", headLine:"தலை கோடு", lifeLine:"வாழ்க்கை கோடு",
      fateLine:"சனி/விதி கோடு", sunLine:"சூரிய கோடு", healthLine:"ஆரோக்கிய/புதன் கோடு",
      marriageLines:"திருமண கோடுகள்", bracelets:"மணிக்கட்டு கோடுகள்"
    },
    p:{
      leftSummary:"முன்னோரிடமிருந்து வந்த மனப்பாங்குகளும் உள்ளுணர்வும் பிரதிபலிக்கின்றன.",
      rightSummary:"தற்போதைய தேர்வுகள், செயல்கள் மற்றும் நீங்கள் வழியை உருவாக்கும் முறை காட்டுகிறது.",
      heartDeep:"இதய கோடு உணர்வுபூர்வ பாணி, பாசம், கருணை ஆகியவற்றை குறிக்கிறது.",
      headDeep:"தலை கோடு சிந்தனை மற்றும் முடிவு எடுப்பை குறிக்கிறது.",
      lifeDeep:"வாழ்க்கை கோடு உயிர்ச்சக்தி மற்றும் மாற்றங்களைப் பற்றியது.",
      fateDeep:"விதி/சனி கோடு தொழில் திசை மற்றும் பொறுப்புகளை காட்டுகிறது."
    }
  },

  // ⬇︎ The rest: keep short UI + glossary (you can expand p.* later)
  hi:{ui:{title:"सत्य दर्शन पाम विश्लेषक",lang:"भाषा",left:"बायां हाथ",right:"दायां हाथ",start:"शुरू",cap:"कैप्चर",torch:"टॉर्च",upload:"अपलोड",analyze:"विश्लेषण",mini:"संक्षिप्त रिपोर्ट",full:"पूर्ण PDF",speak:"बोलें",ready:"तैयार."},
      g:{palmistry:"हस्तरेखा",heartLine:"हृदय रेखा",headLine:"मस्तिष्क रेखा",lifeLine:"जीवन रेखा",fateLine:"भाग्य/शनि रेखा",sunLine:"सूर्य रेखा",healthLine:"स्वास्थ्य/बुध रेखा",marriageLines:"विवाह रेखाएँ",bracelets:"मणिबंध रेखाएँ"},p:{}},
  bn:{ui:{title:"সত্যদর্শন পাম বিশ্লেষক",lang:"ভাষা",left:"বাম হাত",right:"ডান হাত",start:"শুরু",cap:"ক্যাপচার",torch:"টর্চ",upload:"আপলোড",analyze:"বিশ্লেষণ",mini:"সংক্ষিপ্ত প্রতিবেদন",full:"পূর্ণ PDF",speak:"পড়ে শোনান",ready:"প্রস্তুত."},
      g:{palmistry:"হস্তরেখা",heartLine:"হৃদয় রেখা",headLine:"মস্তিষ্ক রেখা",lifeLine:"জীবন রেখা",fateLine:"ভাগ্য/শনি রেখা",sunLine:"সূর্য রেখা",healthLine:"স্বাস্থ্য/বুধ রেখা",marriageLines:"বিবাহ রেখা",bracelets:"কাঁকন রেখা"},p:{}},
  ar:{ui:{title:"محلل كف اليد ساتيا دارشانا",lang:"اللغة",left:"اليد اليسرى",right:"اليد اليمنى",start:"ابدأ",cap:"التقاط",torch:"مصباح",upload:"رفع",analyze:"تحليل",mini:"تقرير مختصر",full:"PDF كامل",speak:"قراءة",ready:"جاهز."},
      g:{palmistry:"قراءة الكف",heartLine:"خط القلب",headLine:"خط الرأس",lifeLine:"خط الحياة",fateLine:"خط القدر/زحل",sunLine:"خط الشمس",healthLine:"خط الصحة/عطارد",marriageLines:"خطوط الزواج",bracelets:"خطوط المعصم"},p:{}},
  es:{ui:{title:"Analizador de Palma Sathya Darshana",lang:"Idioma",left:"Mano izquierda",right:"Mano derecha",start:"Iniciar",cap:"Capturar",torch:"Linterna",upload:"Subir",analyze:"Analizar",mini:"Informe breve",full:"PDF completo",speak:"Voz",ready:"Listo."},
      g:{palmistry:"Quiromancia",heartLine:"Línea del corazón",headLine:"Línea de la cabeza",lifeLine:"Línea de la vida",fateLine:"Línea del destino/Saturno",sunLine:"Línea del sol",healthLine:"Línea de la salud/Mercurio",marriageLines:"Líneas del matrimonio",bracelets:"Líneas del brazalete"},p:{}},
  fr:{ui:{title:"Analyse de Paume Sathya Darshana",lang:"Langue",left:"Main gauche",right:"Main droite",start:"Démarrer",cap:"Capturer",torch:"Lampe",upload:"Téléverser",analyze:"Analyser",mini:"Résumé",full:"PDF complet",speak:"Voix",ready:"Prêt."},
      g:{palmistry:"Chiromancie",heartLine:"Ligne du cœur",headLine:"Ligne de tête",lifeLine:"Ligne de vie",fateLine:"Ligne du destin/Saturne",sunLine:"Ligne du soleil",healthLine:"Ligne de santé/Mercure",marriageLines:"Lignes de mariage",bracelets:"Lignes du poignet"},p:{}},
  de:{ui:{title:"Handflächen-Analyzer",lang:"Sprache",left:"Linke Hand",right:"Rechte Hand",start:"Start",cap:"Aufnehmen",torch:"Lampe",upload:"Hochladen",analyze:"Analysieren",mini:"Kurzbericht",full:"Vollständiges PDF",speak:"Sprach",ready:"Bereit."},
      g:{palmistry:"Chiromantie",heartLine:"Herzlinie",headLine:"Kopflinie",lifeLine:"Lebenslinie",fateLine:"Schicksals-/Saturnlinie",sunLine:"Sonnenlinie",healthLine:"Gesundheits-/Merkurlinie",marriageLines:"Ehelinien",bracelets:"Handgelenkslinien"},p:{}},
  ru:{ui:{title:"Анализ ладони",lang:"Язык",left:"Левая рука",right:"Правая рука",start:"Старт",cap:"Кадр",torch:"Фонарик",upload:"Загрузить",analyze:"Анализ",mini:"Краткий отчёт",full:"Полный PDF",speak:"Голос",ready:"Готово."},
      g:{palmistry:"Хиромантия",heartLine:"Линия сердца",headLine:"Линия головы",lifeLine:"Линия жизни",fateLine:"Линия судьбы/Сатурна",sunLine:"Солнечная линия",healthLine:"Линия здоровья/Меркурия",marriageLines:"Линии брака",bracelets:"Линии браслета"},p:{}},
  ja:{ui:{title:"手相アナライザー",lang:"言語",left:"左手",right:"右手",start:"開始",cap:"キャプチャ",torch:"ライト",upload:"アップロード",analyze:"分析",mini:"ミニレポート",full:"完全PDF",speak:"読み上げ",ready:"準備完了."},
      g:{palmistry:"手相術",heartLine:"感情線",headLine:"知能線",lifeLine:"生命線",fateLine:"運命線/土星",sunLine:"太陽線",healthLine:"健康線/水星",marriageLines:"結婚線",bracelets:"手首線"},p:{}},
  'zh-CN':{ui:{title:"掌相分析",lang:"语言",left:"左手",right:"右手",start:"开始",cap:"拍摄",torch:"手电",upload:"上传",analyze:"分析",mini:"简报",full:"完整PDF",speak:"朗读",ready:"就绪."},
      g:{palmistry:"掌相学",heartLine:"感情线",headLine:"智慧线",lifeLine:"生命线",fateLine:"命运线/土星",sunLine:"太阳线",healthLine:"健康线/水星",marriageLines:"婚姻线",bracelets:"手腕线"},p:{}}
};

// Helper
export function t(lang, path){
  const dict = I18N[lang] || I18N.en;
  return path.split('.').reduce((o,k)=>o&&o[k], dict) ?? path;
}
