// modules/live.js — 🪷 Sathyadarshana Live Discussion V1.4
// Multilingual Voice Chat (12 languages auto-detect)

import { speak } from './ai.js';
import { emit, on } from './bus.js';

let active = false;
let timer = null;
let secondsLeft = 600;
let recognition;
let currentLang = "en-US";

// --- Initialize Live Chat Box ---
export function initLiveChat() {
  if (document.getElementById("liveBox")) return;

  const box = document.createElement("div");
  box.id = "liveBox";
  box.style.cssText = `
    position: fixed; bottom: 10px; right: 10px;
    background: #101820; color: #e6f0ff; border: 1px solid #16f0a7;
    border-radius: 15px; width: 320px; padding: 10px;
    box-shadow: 0 0 10px #00e5ff80; z-index: 9999;
    font-family: 'Segoe UI', sans-serif;
  `;
  box.innerHTML = `
    <h3 style="margin:6px 0;color:#16f0a7;">🗣️ Live Discussion (Multilingual)</h3>
    <div id="liveLog" style="height:160px;overflow-y:auto;background:#0b0f16;
      border-radius:10px;padding:8px;margin-bottom:8px;font-size:0.9em;"></div>
    <div style="display:flex;align-items:center;gap:4px;">
      <input id="liveInput" type="text" placeholder="Speak or type..."
        style="flex:1;padding:6px;border-radius:6px;border:none;outline:none;background:#1a1f2b;color:#fff;">
      <button id="micBtn" title="Speak" style="background:#00e5ff40;border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;">🎙️</button>
      <button id="liveSend" style="background:#16f0a7;border:none;padding:6px 10px;
        border-radius:6px;color:#000;">Send</button>
    </div>
    <p id="liveTimer" style="color:#aaa;font-size:0.8em;margin-top:6px;"></p>
  `;
  document.body.appendChild(box);

  document.getElementById("liveSend").onclick = sendMsg;
  document.getElementById("micBtn").onclick = startVoiceInput;

  startTimer();
  speak("Live discussion started. You can speak in any language.", "en-US");
  appendMsg("🪷 Buddhi", "Welcome! You may speak in Sinhala, Tamil, English, or any other of 12 languages.");
  active = true;
}

function sendMsg() {
  const input = document.getElementById("liveInput");
  const q = input.value.trim();
  if (!q) return;
  appendMsg("🧍‍♂️ You", q);
  input.value = "";
  detectLanguage(q);
  setTimeout(() => aiReply(q), 800);
}

// --- Detect language (same 12 patterns as AI voice) ---
function detectLanguage(text) {
  const patterns = {
    "si-LK": /[අ-ෆ]/, "ta-IN": /[அ-ஹ]/, "hi-IN": /[अ-ह]/,
    "zh-CN": /[\u4e00-\u9fff]/, "ja-JP": /[\u3040-\u30ff]/,
    "ko-KR": /[\u1100-\u11FF]/, "ar-SA": /[\u0600-\u06FF]/,
    "es-ES": /[¿¡áéíóúñ]/, "fr-FR": /[àâçéèêëîïôûùüÿœ]/,
    "de-DE": /[äöüß]/, "it-IT": /[àèéìòù]/, "ru-RU": /[А-Яа-яЁё]/
  };
  currentLang = "en-US";
  for (const [code, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) { currentLang = code; break; }
  }
  console.log("🌐 Detected language:", currentLang);
}

// --- Voice Input (Speech-to-Text) ---
function startVoiceInput() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRec) { alert("Voice recognition not supported."); return; }

  recognition = new SpeechRec();
  recognition.lang = currentLang;
  recognition.interimResults = false;
  recognition.continuous = false;

  speak("Listening...", currentLang);
  document.getElementById("micBtn").textContent = "🎧";

  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    document.getElementById("liveInput").value = text;
    detectLanguage(text);
    document.getElementById("micBtn").textContent = "🎙️";
    sendMsg();
  };
  recognition.onend = () => (document.getElementById("micBtn").textContent = "🎙️");
  recognition.start();
}

// --- AI Replies ---
function aiReply(text) {
  let reply = "";
  if (/life|ජීව/gi.test(text)) reply = "Your Life Line reflects vitality and endurance.";
  else if (/heart|හෘද/gi.test(text)) reply = "Your Heart Line reveals emotion and kindness.";
  else if (/head|සිස/gi.test(text)) reply = "Your Head Line shows focus and inner clarity.";
  else if (/fate|අධිෂ්ඨානය/gi.test(text)) reply = "Your Fate Line shows the path guided by destiny.";
  else reply = "I sense energy flowing strongly around your palm. Ask about a specific line for detail.";

  appendMsg("🪷 Buddhi", reply);
  speak(reply, currentLang);
}

function appendMsg(sender, msg) {
  const log = document.getElementById("liveLog");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${msg}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

function startTimer() {
  const el = document.getElementById("liveTimer");
  timer = setInterval(() => {
    if (--secondsLeft <= 0) {
      clearInterval(timer);
      appendMsg("🪷 Buddhi", "Session ended. May your light shine.");
      speak("Session ended. May your light shine.", currentLang);
      setTimeout(closeLive, 4000);
    } else {
      el.textContent = "⏳ Remaining time: " + Math.floor(secondsLeft/60) + ":" + String(secondsLeft%60).padStart(2,"0");
    }
  }, 1000);
}

function closeLive(){ const box = document.getElementById("liveBox"); if (box) box.remove(); active = false; }

on("report:done", ()=> {
  setTimeout(() => {
    const btn = document.createElement("button");
    btn.textContent = "🗣️ Discuss Your Reading (12 Languages)";
    btn.style.cssText = "margin-top:12px;padding:8px 14px;border-radius:10px;border:1px solid #16f0a7;background:#0b0f16;color:#16f0a7;cursor:pointer;";
    btn.onclick = initLiveChat;
    document.getElementById("reportBox").appendChild(btn);
  }, 600);
});
