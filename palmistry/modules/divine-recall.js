/* ============================================================
   Module: divine-recall.js | Version: v2.5 Divine Recall AI
   Purpose: Voice-based search + audio feedback in Dashboard
   ============================================================ */

import { speak } from "./voice.js";
import { translateTextAI } from "./translate.js";

let recognizing = false;
let recognition;

// Initialize Speech Recognition
export function initVoiceRecall(lang="en") {
  try {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) throw new Error("SpeechRecognition not supported");
    
    recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => {
      recognizing = true;
      speak("Listening...", lang);
    };
    
    recognition.onresult = async (e) => {
      const transcript = e.results[0][0].transcript.trim().toLowerCase();
      console.log("🎧 Heard:", transcript);
      await handleVoiceCommand(transcript, lang);
    };
    
    recognition.onend = () => {
      recognizing = false;
    };
  } catch (err) {
    console.error("Voice Recognition Error:", err);
    speak("Voice recognition is not supported on this device.");
  }
}

// Handle recognized command
async function handleVoiceCommand(text, lang="en") {
  const reports = document.querySelectorAll(".card");
  let found = false;
  
  reports.forEach(card => {
    const info = card.innerText.toLowerCase();
    if (info.includes(text)) {
      card.style.boxShadow = "0 0 20px #00e5ff";
      speak(await translateTextAI("Report found for " + text, lang), lang);
      found = true;
    } else {
      card.style.boxShadow = "";
    }
  });
  
  if (!found) speak(await translateTextAI("No report found for " + text, lang), lang);
}

// Start listening
export function startVoiceSearch(lang="en") {
  if (recognizing) {
    recognition.stop();
    recognizing = false;
    speak("Stopped listening.", lang);
  } else {
    recognition.start();
  }
}
