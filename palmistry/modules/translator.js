/* True Vision Analyzer · Natural Translation Engine v2.1.1
   Grammar-correct multilingual translation (12 languages)
   Fallback: English text if offline */

export async function translateTextAI(text, targetLang="en") {
  if (!text || !targetLang) return text;

  const api = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(api);
    const data = await res.json();
    const translated = data[0].map(x => x[0]).join("");
    return translated.trim();
  } catch (e) {
    console.warn("🌐 Translation offline – fallback English used:", e);
    return text;
  }
}
