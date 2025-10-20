/* logic12.js — 12-language dynamic wording engine (mini report)
   Export: generateMiniReport(data, lang="si")
   data schema (example):
   {
     left:{ density:4.43, life:"strong", head:"balanced", heart:"moderate", fate:"present", sun:"visible", health:"steady", marriage:"clear", manikanda:3 },
     right:{ density:5.59, life:"strong", head:"balanced", heart:"moderate", fate:"present", sun:"visible", health:"steady", marriage:"clear", manikanda:3 },
     name:"Anuruddha", locale:"si", captured_at:"2025-10-20 10:10"
   }
*/
const L = {
  // ---- Sinhala (si) --------------------------------------------------------
  si: {
    meta: {
      title: "Palmistry Mini Report",
      left: "වම්", right: "දකුණු",
      density: "රේඛා ඝනත්වය", summary: "සාරාංශය"
    },
    life: {
      strong:  ["ජීවන රේඛාව තද හා පැහැදිලි — දිගු ශක්තිමත් ගමනක් පෙන්වයි.",
                "ශාරීරික ශක්තිය සහ නැවත නැඟී යාම ඉහළය."],
      faint:   ["ජීවන රේඛාව හික්මුණු — විවේකය, ආහාර පුරුද්ද, ජලය මත අවධානය අවශ්‍යය.",
                "ශක්තිය සුරැකීමට අක්‍රිය කාලසීමා සැලසුම් කරන්න."],
      broken:  ["ජීවන රේඛාවේ බිඳුම් — පරිසර/ජීවිත මාරු ප්‍රවාහයක්.",
                "නව ආරම්භ සාර්ථක කරගැනීමට කුඩා පියවර මාලාවක් ප්‍රයෝජනවත්ය."]
    },
    head: {
      balanced:["චිත්ත රේඛා සමබර — විවේචනාත්මක සිත හා ආත්ම විශ්වාසය එකට ගමන් කරයි.",
                "තීරණ ගන්නේ සාක්ෂි හා කඨින දත්ත මතය."],
      strong:  ["චිත්ත රේඛා තීක්ෂ්ණ — විශ්ලේෂණ/ඉංජිනේරු චින්තනය හොඳයි.",
                "විස්තර පාලනය හා සැලසුම්කරණය ශක්තිමත්."],
      short:   ["චිත්ත රේඛාව කෙටි — ඉක්මන් ක්‍රියා මනසක්, පුරුදු refine කිරීම වැදගත්.",
                "අවධානය තබාගැනීමේ පුහුණුව උපකාරීය."]
    },
    heart: {
      moderate:["හෘද රේඛා මධ්‍යස්ථ — සංවේගය පාලනයට හැකි; විශ්වාසය සුරකින්නා.",
                "සබඳතා තුළ සීමා හා කාරුණික භාෂාව රැකේ."],
      deep:    ["හෘද රේඛා ගැඹුරු — ආදරය උණුසුම්; සමහර විට අතිසංවේගික.",
                "ලෝකයේ දුක් සැනසීමේ අරමුණක් දරයි."],
      faint:   ["හෘද රේඛාව දුර්බල — හදවත රැකගැනීමේ චාරිත්‍ර අවශ්‍යය.",
                "විවේකය, ප්‍රාණායාම, නිශ්ශබ්ද භාවනාව උපකාරීය."]
    },
    fate: {
      present: ["භාග්‍ය රේඛා පැහැදිලි — අරමුණට ගමන් වේ.", "වෘත්තීය නිශ්චිතත්වය ඉහළට."],
      weak:    ["භාග්‍ය රේඛා දුර්බල — නව දිශා සොයා බැලීම හොඳ කාලය.",
                "මූලික ආරම්භ කුඩා පියවර මගින් කෙරෙව්."]
    },
    sun: {
      visible: ["සූර්‍ය රේඛාව දෘෂ්‍ය — ජනප්‍රියත්වය/ස්ත්‍රීණායකත්වය/කලාත්මක ප්‍රකාශනය.",
                "සේවය හරහා ආලෝකය බෙදාහැරේ."],
      absent:  ["සූර්‍ය රේඛාව අඩු — නිර්මාණාත්මක ප්‍රකාශය සැලසුම්කරණය හරහා වර්ධනය කරන්න."]
    },
    health: {
      steady:  ["සෞඛ්‍ය රේඛා ස්ථාවර — ශාරීරික හා මානසික ප්‍රතිශක්තිය හොඳයි."],
      sensitive:["සෞඛ්‍ය රේඛා සංවේදී — නිදා, ජලය, දීප්තිමත් ආහාර පුරුද්ද සලකා බලන්න."]
    },
    marriage: {
      clear:   ["විවහ රේඛා පැහැදිලි — එකඟතාව හා ගෞරවය පවතී."],
      multiple:["විවහ රේඛා කිහිපය — සම්බන්ධතා මාරු/දළ වගකීම්; සරල සංවාදය වැදගත්."]
    },
    manikanda: count => `මණිඛන්ඩ රේඛා ${count} — ජීවිත පදනම සහ ආත්මික වාසනාව දකින ලදි.`,
    composer: (d)=> {
      const L = d.left, R = d.right;
      const pick = (set, key)=> (set[key] && set[key][Math.floor(Math.random()*set[key].length)]) || "";
      const parts = [
        `(${d.name||"පරිශීලක"}) — ${L.density}% / ${R.density}% ${L.density<=R.density?"(දකුණු ක්‍රියාශීලී)":"(වම් අභ්‍යන්තර)"} .`,
        pick(LifeSI, R.life) || pick(L.si.life, R.life),
        pick(L.si.head, R.head),
        pick(L.si.heart, R.heart),
        pick(L.si.fate, R.fate),
        pick(L.si.sun, R.sun),
        pick(L.si.health, R.health),
        pick(L.si.marriage, R.marriage),
        L.si.manikanda(R.manikanda)
      ];
      return parts.filter(Boolean).join(" ");
    }
  }
};

// Quick helpers to reuse inside composer
const LifeSI = L.si.life;

// ---- English (en) – concise analytical tone --------------------------------
L.en = {
  meta:{title:"Palmistry Mini Report", left:"LEFT", right:"RIGHT", density:"Line density", summary:"Summary"},
  life:{
    strong:["Life line is strong—vitality and stamina are high.","Good recovery and endurance."],
    faint:["Life line is faint—prioritize rest, hydration, and nutrition.","Plan low-load cycles to rebuild energy."],
    broken:["Life line shows breaks—transitions ahead; stepwise adaptation will help."]
  },
  head:{
    balanced:["Head line balanced—clear reasoning tempered with intuition.","Decisions weigh evidence and lived wisdom."],
    strong:["Head line strong—analysis, systems thinking, and planning excel."],
    short:["Head line short—decisive action; train sustained focus for depth."]
  },
  heart:{
    moderate:["Heart line moderate—emotional regulation with dependable affection."],
    deep:["Heart line deep—warm devotion; sometimes intensely felt."],
    faint:["Heart line faint—protect the heart; gentle practices recommended."]
  },
  fate:{
    present:["Fate line present—purpose consolidates; career path clarifies."],
    weak:["Fate line weak—good time to explore fresh directions."]
  },
  sun:{
    visible:["Sun line visible—recognition through service or creativity."],
    absent:["Sun line absent—schedule deliberate creative expression."]
  },
  health:{
    steady:["Health line steady—resilience is supported."],
    sensitive:["Health line sensitive—sleep and water hygiene matter."]
  },
  marriage:{
    clear:["Marriage line clear—mutual respect and alignment."],
    multiple:["Multiple lines—relationship transitions; keep communication simple."]
  },
  manikanda: n => `Manikanda bracelets: ${n} — firm base and spiritual fortune.`,
  composer(d){
    const Lf=d.left, R=d.right;
    const pick=(set,key)=> (set[key] && set[key][Math.floor(Math.random()*set[key].length)]) || "";
    return [
      `${d.name||"User"} · density ${Lf.density}% / ${R.density}% ${Lf.density<=R.density?"(right active)":"(left reflective)"}.`,
      pick(this.life, R.life),
      pick(this.head, R.head),
      pick(this.heart, R.heart),
      pick(this.fate, R.fate),
      pick(this.sun, R.sun),
      pick(this.health, R.health),
      pick(this.marriage, R.marriage),
      this.manikanda(R.manikanda)
    ].filter(Boolean).join(" ");
  }
};

// ---- Remaining languages: minimal, clean phrases (extend anytime) ----------
const brief = {
  ta:{t:"சுருக்க அறிக்கை", L:"இடது", R:"வலது",
      lines:(nL,nR)=>`கோடு அடர்த்தி ${nL}% / ${nR}%`,
      heart:{moderate:"இதயம் சமநிலை.", deep:"இதயம் ஆழம்.", faint:"இதயம் மெலிந்து."},
      head:{balanced:"மனம் சமநிலை.", strong:"மனம் வலிமை.", short:"மனம் சுருக்கம்."},
      life:{strong:"வாழ்நாள் வலிமை.", faint:"வாழ்நாள் மந்தம்.", broken:"வாழ்நாள் இடைவேளைகள்."},
      fate:{present:"அதிர்ஷ்ட பாதை உள்ளது.", weak:"அதிர்ஷ்ட பாதை பலவீனம்."},
      sun:{visible:"சூரிய கோடு தெரிகிறது.", absent:"சூரிய கோடு மங்கியது."},
      health:{steady:"ஆரோக்கியம் நிலை.", sensitive:"ஆரோக்கியம் மெதுவாக."},
      marriage:{clear:"திருமணம் தெளிவு.", multiple:"பல திருமண கோடுகள்."},
      mani:n=>`மணிக்கட்டு கோடுகள்: ${n}.`},
  hi:{t:"संक्षिप्त रिपोर्ट", L:"बायाँ", R:"दायाँ",
      lines:(nL,nR)=>`रेखा घनत्व ${nL}% / ${nR}%`,
      heart:{moderate:"हृदय संतुलित.", deep:"हृदय गहरा.", faint:"हृदय मंद."},
      head:{balanced:"मस्तिष्क संतुलित.", strong:"मस्तिष्क प्रबल.", short:"मस्तिष्क संक्षिप्त."},
      life:{strong:"जीवन रेखा प्रबल.", faint:"जीवन रेखा मंद.", broken:"जीवन रेखा खंडित."},
      fate:{present:"भाग्य रेखा उपस्थित.", weak:"भाग्य रेखा दुर्बल."},
      sun:{visible:"सूर्य रेखा स्पष्ट.", absent:"सूर्य रेखा अनुपस्थित."},
      health:{steady:"स्वास्थ्य स्थिर.", sensitive:"स्वास्थ्य संवेदनशील."},
      marriage:{clear:"विवाह रेखा स्पष्ट.", multiple:"एकाधिक विवाह रेखाएँ."},
      mani:n=>`मणिबन्ध रेखाएँ: ${n}.`},
  pi:{t:"Saṅkhipta Vutta", L:"Vāma", R:"Dakkhiṇa",
      lines:(nL,nR)=>`Rekhāghana ${nL}% / ${nR}%`,
      heart:{moderate:"Hadaya majjhima.", deep:"Hadaya gambhīra.", faint:"Hadaya manda."},
      head:{balanced:"Citta samatta.", strong:"Citta bala.", short:"Citta rassaka."},
      life:{strong:"Jīvita balavat.", faint:"Jīvita manda.", broken:"Jīvita chinna."},
      fate:{present:"Bhāgya pātubhavati.", weak:"Bhāgya dubbala."},
      sun:{visible:"Sūriya pātubhavati.", absent:"Sūriya na dissati."},
      health:{steady:"Ārogyā thira.", sensitive:"Ārogyā mudu."},
      marriage:{clear:"Vivāha paññāyati.", multiple:"Aneka vivāha rekha."},
      mani:n=>`Maṇikaṇṭha rekha: ${n}.`},
  sa:{t:"Saṅkṣiptaḥ Vṛttaḥ", L:"Vāmaḥ", R:"Dakṣiṇaḥ",
      lines:(nL,nR)=>`Rekhā-saṅghātaḥ ${nL}% / ${nR}%`,
      heart:{moderate:"Hṛdaya-samatā.", deep:"Hṛdaya-gāmbhīryam.", faint:"Hṛdaya-mṛdu."},
      head:{balanced:"Manas-samatā.", strong:"Manas-balam.", short:"Manas-laghu."},
      life:{strong:"Āyuḥ-rekhā dṛḍhā.", faint:"Āyuḥ-rekhā mṛdu.", broken:"Āyuḥ-rekhā chinna."},
      fate:{present:"Bhāgya-rekhā vidyate.", weak:"Bhāgya-rekhā durbalā."},
      sun:{visible:"Sūrya-rekhā dṛśyate.", absent:"Sūrya-rekhā adṛśyā."},
      health:{steady:"Ārogya-sthiti.", sensitive:"Ārogya-sūkṣma."},
      marriage:{clear:"Vivāha-rekhā spaṣṭā.", multiple:"Bahvyo vivāha-rekhāḥ."},
      mani:n=>`Maṇibandha-rekhāḥ: ${n}.`},
  ja:{t:"ミニレポート", L:"左", R:"右",
      lines:(nL,nR)=>`線密度 ${nL}% / ${nR}%`,
      heart:{moderate:"感情は安定。", deep:"情は深い。", faint:"感情は繊細。"},
      head:{balanced:"理性は均衡。", strong:"分析に強い。", short:"即決型。"},
      life:{strong:"生命線は強い。", faint:"生命線は弱い。", broken:"生命線に断裂。"},
      fate:{present:"運命線あり。", weak:"運命線は弱い。"},
      sun:{visible:"太陽線あり。", absent:"太陽線は不明瞭。"},
      health:{steady:"健康線は安定。", sensitive:"健康線は敏感。"},
      marriage:{clear:"結婚線は明瞭。", multiple:"複数の結婚線。"},
      mani:n=>`手首線：${n}`},
  zh:{t:"简报", L:"左", R:"右",
      lines:(nL,nR)=>`线密度 ${nL}% / ${nR}%`,
      heart:{moderate:"情感稳。", deep:"情深。", faint:"情细。"},
      head:{balanced:"理性衡。", strong:"分析强。", short:"速断。"},
      life:{strong:"生命线强。", faint:"生命线弱。", broken:"生命线断。"},
      fate:{present:"命运线显。", weak:"命运线弱。"},
      sun:{visible:"太阳线显。", absent:"太阳线淡。"},
      health:{steady:"健康稳。", sensitive:"健康敏。"},
      marriage:{clear:"婚姻线清。", multiple:"多婚姻线。"},
      mani:n=>`腕纹：${n}`},
  el:{t:"Σύντομη Αναφορά", L:"Αριστερό", R:"Δεξί",
      lines:(nL,nR)=>`Πυκνότητα γραμμών ${nL}% / ${nR}%`,
      heart:{moderate:"Καρδιά ισορροπημένη.", deep:"Καρδιά βαθιά.", faint:"Καρδιά ευαίσθητη."},
      head:{balanced:"Νους ισορροπημένος.", strong:"Νους ισχυρός.", short:"Σύντομη σκέψη."},
      life:{strong:"Γραμή ζωής ισχυρή.", faint:"Γραμή ζωής ασθενής.", broken:"Διακεκομμένη."},
      fate:{present:"Γραμή μοίρας παρούσα.", weak:"Ασθενής μοίρα."},
      sun:{visible:"Ηλιακή γραμή ορατή.", absent:"Αμυδρή ηλιακή."},
      health:{steady:"Υγεία σταθερή.", sensitive:"Υγεία ευαίσθητη."},
      marriage:{clear:"Γραμή γάμου σαφής.", multiple:"Πολλαπλές γραμμές."},
      mani:n=>`Βραχιολιές: ${n}`},
  la:{t:"Brevis Relatio", L:"Sinistra", R:"Dextera",
      lines:(nL,nR)=>`Densitas linearum ${nL}% / ${nR}%`,
      heart:{moderate:"Cor moderatum.", deep:"Cor profundum.", faint:"Cor tenue."},
      head:{balanced:"Mens aequabilis.", strong:"Mens fortis.", short:"Mens brevis."},
      life:{strong:"Linea vitae firma.", faint:"Linea vitae tenuis.", broken:"Linea vitae fracta."},
      fate:{present:"Linea fatī adest.", weak:"Linea fatī infirma."},
      sun:{visible:"Linea solis apparet.", absent:"Linea solis obscura."},
      health:{steady:"Valetudo constans.", sensitive:"Valetudo tenera."},
      marriage:{clear:"Linea nuptiarum clara.", multiple:"Multae nuptiarum lineae."},
      mani:n=>`Monilia carpi: ${n}`},
  ar:{t:"تقرير موجز", L:"يسار", R:"يمين",
      lines:(nL,nR)=>`كثافة الخطوط ${nL}% / ${nR}%`,
      heart:{moderate:"قلب متزن.", deep:"قلب عميق.", faint:"قلب رقيق."},
      head:{balanced:"عقل متوازن.", strong:"عقل قوي.", short:"عقل سريع."},
      life:{strong:"خط الحياة قوي.", faint:"خط الحياة ضعيف.", broken:"خط الحياة متقطع."},
      fate:{present:"خط القدر حاضر.", weak:"خط القدر ضعيف."},
      sun:{visible:"خط الشمس واضح.", absent:"خط الشمس باهت."},
      health:{steady:"الصحة ثابتة.", sensitive:"الصحة حساسة."},
      marriage:{clear:"خط الزواج واضح.", multiple:"عدّة خطوط زواج."},
      mani:n=>`خطوط المعصم: ${n}`},
  he:{t:"דו\"ח קצר", L:"שמאל", R:"ימין",
      lines:(nL,nR)=>`צפיפות קווים ${nL}% / ${nR}%`,
      heart:{moderate:"לב מאוזן.", deep:"לב עמוק.", faint:"לב רגיש."},
      head:{balanced:"שֵׂכֶל מאוזן.", strong:"שֵׂכֶל חזק.", short:"שֵׂכֶל קצר."},
      life:{strong:"קו החיים חזק.", faint:"קו החיים חלש.", broken:"קו החיים קטוע."},
      fate:{present:"קו הגורל נוכח.", weak:"קו הגורל חלש."},
      sun:{visible:"קו השמש ברור.", absent:"קו השמש עמום."},
      health:{steady:"בריאות יציבה.", sensitive:"בריאות רגישה."},
      marriage:{clear:"קו הנישואין ברור.", multiple:"מס׳ קווי נישואין."},
      mani:n=>`קווי פרק כף היד: ${n}`}
};

// language registry
const REG = { ...L, ta:brief.ta, hi:brief.hi, pi:brief.pi, sa:brief.sa, ja:brief.ja, zh:brief.zh, el:brief.el, la:brief.la, ar:brief.ar, he:brief.he };

export function generateMiniReport(data, lang="si"){
  const d = data || {};
  const langPack = REG[lang] || REG.si;
  if (langPack.composer) return langPack.composer(d);
  // fallback composer for brief langs
  const B = langPack, L = d.left||{}, R=d.right||{};
  const pick = (obj,key)=> obj[key]?.moderate||obj[key]?.strong||obj[key]?.present||obj[key]?.visible||obj[key]?.steady||"";
  return [
    `${B.t||"Report"} · ${B.lines?(B.lines(L.density||0,R.density||0)):`${L.density||"-"} / ${R.density||"-"}`}.`,
    (B.life && B.life[R.life]) || pick(B,"life"),
    (B.head && B.head[R.head]) || pick(B,"head"),
    (B.heart && B.heart[R.heart]) || pick(B,"heart"),
    (B.fate && B.fate[R.fate]) || pick(B,"fate"),
    (B.sun && B.sun[R.sun]) || pick(B,"sun"),
    (B.health && B.health[R.health]) || pick(B,"health"),
    (B.marriage && B.marriage[R.marriage]) || pick(B,"marriage"),
    B.mani ? B.mani(R.manikanda||0) : ""
  ].filter(Boolean).join(" ");
}
