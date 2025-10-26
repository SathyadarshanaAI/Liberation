// modules/ai.js — V10.7.1 Voice Fusion Fix

export function speak(text, lang = "en") {
  try {
    if ("speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined") {
      const msg = new SpeechSynthesisUtterance(text);
      msg.lang = lang;
      msg.rate = 1.0;
      msg.pitch = 1.0;
      msg.volume = 1.0;
      window.speechSynthesis.speak(msg);
    } else {
      // Fallback if speech API not available
      console.log("🔊 Speak (text only):", text);
      const status = document.getElementById("status");
      if (status) status.textContent = "🗣️ " + text;
    }
  } catch (err) {
    console.warn("Speech error:", err.message);
    const status = document.getElementById("status");
    if (status) status.textContent = "🗣️ " + text;
  }
}
