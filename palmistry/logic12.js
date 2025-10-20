/* logic12.js — 12-language dynamic wording engine (mini report)
   Export: generateMiniReport(data, lang="si")
   Supported langs: si,en,ta,hi,ar,ja,zh,pi,sa,el,la,he  (UI extra langs map to en)
*/
const REG = {};

// Sinhala
REG.si = {
  life:{
    strong:["ජීවන රේඛාව තද — ශක්තිමත් දිගු ගමනක්.","නැවත නැඟී යාම ඉහළය."],
    faint:["ජීවන රේඛාව දුර්වල — විවේක, ජලය, ආහාර පුරුද්ද වැඩි කරන්න."],
    broken:["ජීවන රේඛාවේ බිඳුම් — මාරු සමයක්; කුඩා පියවර මාලා සුදුසුය."]
  },
  head:{
    balanced:["චිත්ත රේඛාව සමාංශ — විවේචනාත්මක සිත හා ආත්ම විශ්වාසය එකට.","තොරතුරු මත තීරණ ගනී."],
    strong:["චිත්ත රේඛාව තීක්ෂ්ණ — සැලසුම්කරණය/විශ්ලේෂණ ශක්තිය."],
    short:["චිත්ත රේඛාව කෙටි — ඉක්මන් ක්‍රියා; අවධානය පුහුණු කරන්න."]
  },
  heart:{
    moderate:["හෘද රේඛාව මධ්‍යස්ථ — සංවේග පාලනය සහ විශ්වාසය."],
    deep:["හෘද රේඛාව ගැඹුරු — උණුසුම් ආදරය; සමහරවිට දැඩි සංවේග."],
    faint:["හෘද රේඛාව දුර්වල — හදවත රැකගැනීමේ චාරිත්‍රය වග බලාගන්න."]
  },
  fate:{
    present:["භාග්‍ය රේඛාව ඇත — අරමුණ පැහැදිලි වේ."],
    weak:["භාග්‍ය රේඛාව දුර්වල — නව දිශා පරීක්ෂා කරන්න."]
  },
  sun:{
    visible:["සූර්‍ය රේඛාව දෘෂ්‍ය — සේවය/නිර්මාණය හරහා පිළිගැනීම."],
    absent:["සූර්‍ය රේඛාව අඩු — උද්දාම නිර්මාණ ක්‍රියා සැලසුම් කරන්න."]
  },
  health:{
    steady:["සෞඛ්‍ය රේඛා ස්ථාවර — ප්‍රතිශක්තිය හොඳයි."],
    sensitive:["සෞඛ්‍ය රේඛා සංවේදී — නිදා/ජලය/ආහාර පුරුද්ද ප්‍රමුඛ."]
  },
  marriage:{
    clear:["විවහ රේඛාව පැහැදිලි — එකඟතාව/ගෞරවය."],
    multiple:["විවහ රේඛා කිහිපය — මාරු; සරල සංවාදය වැදගත්."]
  },
  mani: n => `මණිඛන්ඩ රේඛා ${n} — ශක්තිමත් පදනම.`,
  compose(d){
    const pick=(set,key)=> (set[key] && set[key][Math.floor(Math.random()*set[key].length)]) || "";
    const L=d.left,R=d.right;
    return [
      `Mini Report · L ${L.density}% / R ${R.density}%`,
      pick(this.life,R.life),
      pick(this.head,R.head),
      pick(this.heart,R.heart),
      pick(this.fate,R.fate),
      pick(this.sun,R.sun),
      pick(this.health,R.health),
      pick(this.marriage,R.marriage),
      this.mani(R.manikanda||3)
    ].filter(Boolean).join(" ");
  }
};

// English
REG.en = {
  life:{ strong:["Life line strong—vitality high."], faint:["Life line faint—prioritize rest."], broken:["Life line broken—transitions ahead."]},
  head:{ balanced:["Head line balanced—reason + intuition."], strong:["Head strong—analysis excels."], short:["Head short—decisive action."]},
  heart:{ moderate:["Heart moderate—regulated emotion."], deep:["Heart deep—warm devotion."], faint:["Heart faint—protect your heart."]},
  fate:{ present:["Fate present—purpose clarifies."], weak:["Fate weak—explore directions."]},
  sun:{ visible:["Sun visible—recognition via service/creativity."], absent:["Sun absent—schedule creative output."]},
  health:{ steady:["Health steady—resilience supported."], sensitive:["Health sensitive—sleep/water care."]},
  marriage:{ clear:["Marriage clear—mutual respect."], multiple:["Multiple marriage lines—transitions; keep communication simple."]},
  mani:n=>`Manikanda bracelets: ${n}.`,
  compose(d){
    const pick=(set,key)=> (set[key] && set[key][Math.floor(Math.random()*set[key].length)]) || "";
    const L=d.left,R=d.right;
    return [
      `Mini Report · L ${L.density}% / R ${R.density}%`,
      pick(this.life,R.life), pick(this.head,R.head), pick(this.heart,R.heart),
      pick(this.fate,R.fate), pick(this.sun,R.sun), pick(this.health,R.health),
      pick(this.marriage,R.marriage), this.mani(R.manikanda||3)
    ].filter(Boolean).join(" ");
  }
};

// Tamil
REG.ta = {
  heart:{moderate:["இதயம் சமநிலை."],deep:["இதயம் ஆழம்."],faint:["இதயம் மெலிவு."]},
  head:{balanced:["மனம் சமநிலை."],strong:["மனம் வலிமை."],short:["மனம் சுருக்கம்."]},
  life:{strong:["வாழ்நாள் வலிமை."],faint:["வாழ்நாள் மெலிவு."],broken:["வாழ்நாள் இடைவேளை."]},
  fate:{present:["அதிர்ஷ்ட பாதை உள்ளது."],weak:["அதிர்ஷ்ட பலவீனம்."]},
  sun:{visible:["சூரிய கோடு தெரியும்."],absent:["சூரிய மங்கல்."]},
  health:{steady:["ஆரோக்கியம் நிலை."],sensitive:["ஆரோக்கியம் மெது."]},
  marriage:{clear:["திருமணம் தெளிவு."],multiple:["பல திருமண கோடுகள்."]},
  mani:n=>`மணிக்கட்டு கோடுகள்: ${n}.`,
  compose(d){
    const p=(g,k)=>g[k]||{}; const L=d.left,R=d.right;
    const pick=(obj,key)=> obj[key]||"";
    return [
      `சுருக்கம் · L ${L.density}% / R ${R.density}%`,
      pick(this.life[R.life]||{},0)||this.life[R.life]?.[0],
      pick(this.head[R.head]||{},0)||this.head[R.head]?.[0],
      pick(this.heart[R.heart]||{},0)||this.heart[R.heart]?.[0],
      pick(this.fate[R.fate]||{},0)||this.fate[R.fate]?.[0],
      pick(this.sun[R.sun]||{},0)||this.sun[R.sun]?.[0],
      pick(this.health[R.health]||{},0)||this.health[R.health]?.[0],
      pick(this.marriage[R.marriage]||{},0)||this.marriage[R.marriage]?.[0],
      this.mani(R.manikanda||3)
    ].filter(Boolean).join(" ");
  }
};

// Hindi
REG.hi = {
  heart:{moderate:["हृदय संतुलित."],deep:["हृदय गहरा."],faint:["हृदय मंद."]},
  head:{balanced:["मस्तिष्क संतुलित."],strong:["मस्तिष्क प्रबल."],short:["मस्तिष्क संक्षिप्त."]},
  life:{strong:["जीवन रेखा प्रबल."],faint:["जीवन रेखा मंद."],broken:["जीवन रेखा खंडित."]},
  fate:{present:["भाग्य रेखा उपस्थित."],weak:["भाग्य रेखा दुर्बल."]},
  sun:{visible:["सूर्य रेखा स्पष्ट."],absent:["सूर्य रेखा मन्द."]},
  health:{steady:["स्वास्थ्य स्थिर."],sensitive:["स्वास्थ्य संवेदनशील."]},
  marriage:{clear:["विवाह रेखा स्पष्ट."],multiple:["अनेक विवाह रेखाएँ."]},
  mani:n=>`मणिबन्ध रेखाएँ: ${n}.`,
  compose(d){
    const L=d.left,R=d.right;
    return [
      `संक्षिप्त · L ${L.density}% / R ${R.density}%`,
      (this.life[R.life]||[])[0],
      (this.head[R.head]||[])[0],
      (this.heart[R.heart]||[])[0],
      (this.fate[R.fate]||[])[0],
      (this.sun[R.sun]||[])[0],
      (this.health[R.health]||[])[0],
      (this.marriage[R.marriage]||[])[0],
      this.mani(R.manikanda||3)
    ].filter(Boolean).join(" ");
  }
};

// Arabic / Japanese / Chinese — brief
REG.ar = {
  heart:{moderate:["قلب متزن."],deep:["قلب عميق."],faint:["قلب رقيق."]},
  head:{balanced:["عقل متوازن."],strong:["عقل قوي."],short:["عقل سريع."]},
  life:{strong:["خط الحياة قوي."],faint:["خط الحياة ضعيف."],broken:["خط الحياة متقطع."]},
  fate:{present:["خط القدر حاضر."],weak:["خط القدر ضعيف."]},
  sun:{visible:["خط الشمس واضح."],absent:["خط الشمس باهت."]},
  health:{steady:["الصحة ثابتة."],sensitive:["الصحة حساسة."]},
  marriage:{clear:["خط الزواج واضح."],multiple:["خطوط زواج متعددة."]},
  mani:n=>`خطوط المعصم: ${n}.`,
  compose(d){ const L=d.left,R=d.right; return [`تقرير موجز · L ${L.density}% / R ${R.density}%`, (this.life[R.life]||[])[0], (this.head[R.head]||[])[0], (this.heart[R.heart]||[])[0], (this.fate[R.fate]||[])[0], (this.sun[R.sun]||[])[0], (this.health[R.health]||[])[0], (this.marriage[R.marriage]||[])[0], this.mani(R.manikanda||3)].filter(Boolean).join(" "); }
};
REG.ja = {
  heart:{moderate:["感情は安定。"],deep:["情は深い。"],faint:["感情は繊細。"]},
  head:{balanced:["理性は均衡。"],strong:["分析に強い。"],short:["即決型。"]},
  life:{strong:["生命線は強い。"],faint:["生命線は弱い。"],broken:["生命線に断裂。"]},
  fate:{present:["運命線あり。"],weak:["運命線は弱い。"]},
  sun:{visible:["太陽線あり。"],absent:["太陽線は不明瞭。"]},
  health:{steady:["健康線は安定。"],sensitive:["健康線は敏感。"]},
  marriage:{clear:["結婚線は明瞭。"],multiple:["複数の結婚線。"]},
  mani:n=>`手首線：${n}`,
  compose(d){ const L=d.left,R=d.right; return [`ミニレポート · L ${L.density}% / R ${R.density}%`, (this.life[R.life]||[])[0], (this.head[R.head]||[])[0], (this.heart[R.heart]||[])[0], (this.fate[R.fate]||[])[0], (this.sun[R.sun]||[])[0], (this.health[R.health]||[])[0], (this.marriage[R.marriage]||[])[0], this.mani(R.manikanda||3)].filter(Boolean).join(" "); }
};
REG.zh = {
  heart:{moderate:["情感稳。"],deep:["情深。"],faint:["情细。"]},
  head:{balanced:["理性衡。"],strong:["分析强。"],short:["速断。"]},
  life:{strong:["生命线强。"],faint:["生命线弱。"],broken:["生命线断。"]},
  fate:{present:["命运线显。"],weak:["命运线弱。"]},
  sun:{visible:["太阳线显。"],absent:["太阳线淡。"]},
  health:{steady:["健康稳。"],sensitive:["健康敏。"]},
  marriage:{clear:["婚姻线清。"],multiple:["多婚姻线。"]},
  mani:n=>`腕纹：${n}`,
  compose(d){ const L=d.left,R=d.right; return [`简报 · L ${L.density}% / R ${R.density}%`, (this.life[R.life]||[])[0], (this.head[R.head]||[])[0], (this.heart[R.heart]||[])[0], (this.fate[R.fate]||[])[0], (this.sun[R.sun]||[])[0], (this.health[R.health]||[])[0], (this.marriage[R.marriage]||[])[0], this.mani(R.manikanda||3)].filter(Boolean).join(" "); }
};

// Pali / Sanskrit / Greek / Latin / Hebrew (brief)
REG.pi = { ...REG.en, compose(d){ return REG.en.compose(d).replace("Mini Report","Saṅkhipta Vutta"); } };
REG.sa = { ...REG.en, compose(d){ return REG.en.compose(d).replace("Mini Report","Saṅkṣiptaḥ Vṛttaḥ"); } };
REG.el = { ...REG.en, compose(d){ return REG.en.compose(d).replace("Mini Report","Σύντομη Αναφορά"); } };
REG.la = { ...REG.en, compose(d){ return REG.en.compose(d).replace("Mini Report","Brevis Relatio"); } };
REG.he = { ...REG.en, compose(d){ return REG.en.compose(d).replace("Mini Report","דוח קצר"); } };

// Export
export function generateMiniReport(data, lang="si"){
  const pack = REG[lang] || REG.en;
  return pack.compose(data);
}
