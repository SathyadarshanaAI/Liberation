export function speak(text, lang = "en") {
  if (!("speechSynthesis" in window)) {
    console.warn("⚠️ Speech synthesis not supported on this browser.");
    return;
  }
  const langMap = {
    en:"en-US", si:"si-LK", ta:"ta-IN", hi:"hi-IN", fr:"fr-FR", es:"es-ES", de:"de-DE",
    ru:"ru-RU", zh:"zh-CN", ja:"ja-JP", ar:"ar-SA", pt:"pt-PT"
  };
  const voiceLang = langMap[lang] || "en-US";
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voiceLang; u.pitch=1.0; u.rate=1.0; u.volume=1.0;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
  console.log(`🎤 Speaking: ${text} (${u.lang})`);
}
