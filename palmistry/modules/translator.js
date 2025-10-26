/* True Vision Analyzer · Translation Core v2.1.1
   Natural grammar translation via web API (fallback local) */

export async function translateTextAI(text, targetLang="si") {
  const api = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(api);
    const data = await res.json();
    return data[0].map(x=>x[0]).join("");
  } catch(e) {
    console.warn("Live translation failed, fallback used", e);
    return text; // fallback to English if offline
  }
}
