// modules/translator.js — Quantum Palm Analyzer V6.0a Global Translator

const SUPPORTED_LANGS = {
  en: "English", si: "Sinhala", ta: "Tamil", hi: "Hindi", 
  zh: "Chinese", ja: "Japanese", es: "Spanish", fr: "French", 
  de: "German", it: "Italian", ru: "Russian", ar: "Arabic"
};

// 🌐 Auto Translate Text via Google API
export async function translateText(text, targetLang = "en") {
  if (targetLang === "en") return text;
  const encoded = encodeURIComponent(text);
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encoded}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map(item => item[0]).join("");
  } catch (e) {
    console.warn("🌐 Translation failed:", e);
    return text;
  }
}

// 🌍 Detect browser or user language
export function detectUserLang() {
  const code = navigator.language.slice(0, 2);
  return SUPPORTED_LANGS[code] ? code : "en";
}

// 📘 Optional Manual Switch Dropdown
export function buildLangSelector(onChange) {
  const sel = document.createElement("select");
  sel.id = "langSelect";
  sel.style.cssText = `
    position:fixed;bottom:12px;right:12px;
    background:#101820;color:#00e5ff;border:1px solid #00e5ff;
    border-radius:10px;padding:6px 10px;font-size:14px;z-index:9999;
  `;
  for (const [code, name] of Object.entries(SUPPORTED_LANGS)) {
    const opt = document.createElement("option");
    opt.value = code; opt.textContent = name;
    sel.appendChild(opt);
  }
  sel.value = detectUserLang();
  sel.onchange = ()=> onChange(sel.value);
  document.body.appendChild(sel);
}
