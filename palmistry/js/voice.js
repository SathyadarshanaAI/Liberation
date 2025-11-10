export function speakSinhala(text) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "si-LK";
  u.pitch = 1;
  u.rate = 1;
  speechSynthesis.speak(u);
}
