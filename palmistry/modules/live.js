// modules/live.js — 🪷 Sathyadarshana Live Discussion Module V1.0
// Enables limited-time AI discussion after palm reading

import { speak } from './ai.js';
import { emit, on } from './bus.js';

let active = false;
let timer = null;
let secondsLeft = 600; // 10 min

// --- Create live chat panel dynamically ---
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
    <h3 style="margin:6px 0;color:#16f0a7;">🗣️ Live Discussion</h3>
    <div id="liveLog" style="height:160px;overflow-y:auto;background:#0b0f16;
      border-radius:10px;padding:8px;margin-bottom:8px;font-size:0.9em;"></div>
    <input id="liveInput" type="text" placeholder="Type your question..."
      style="width:75%;padding:6px;border-radius:6px;border:none;outline:none;background:#1a1f2b;color:#fff;">
    <button id="liveSend" style="background:#16f0a7;border:none;padding:6px 10px;
      border-radius:6px;margin-left:4px;color:#000;">Send</button>
    <p id="liveTimer" style="color:#aaa;font-size:0.8em;margin-top:6px;"></p>
  `;
  document.body.appendChild(box);

  // --- Logic ---
  document.getElementById("liveSend").onclick = () => {
    const q = document.getElementById("liveInput").value.trim();
    if (!q) return;
    appendMsg("🧍‍♂️ You", q);
    document.getElementById("liveInput").value = "";
    setTimeout(() => aiReply(q), 800);
  };

  startTimer();
  speak("Live discussion session started.");
  appendMsg("🪷 Buddhi", "Welcome. You can ask about your palm lines for the next 10 minutes.");
  active = true;
}

function aiReply(text) {
  const log = document.getElementById("liveLog");
  let reply = "Hmm, that's interesting. Could you describe what you see near your Fate Line?";
  if (/life/i.test(text)) reply = "The Life Line shows your vitality and energy. A deeper curve indicates resilience.";
  else if (/head/i.test(text)) reply = "The Head Line reveals mental focus — steady and long means clarity of thought.";
  else if (/heart/i.test(text)) reply = "The Heart Line shows emotional expression and sensitivity.";
  else if (/fate/i.test(text)) reply = "The Fate Line suggests destiny and direction. Breaks can show life changes.";
  appendMsg("🪷 Buddhi", reply);
  speak(reply);
}

function appendMsg(sender, msg) {
  const log = document.getElementById("liveLog");
  const div = document.createElement("div");
  div.innerHTML = `<strong>${sender}:</strong> ${msg}`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

// --- Timer Countdown ---
function startTimer() {
  const el = document.getElementById("liveTimer");
  timer = setInterval(() => {
    if (--secondsLeft <= 0) {
      clearInterval(timer);
      appendMsg("🪷 Buddhi", "Session ended. May your path be bright.");
      speak("Session ended. May your path be bright.");
      setTimeout(closeLive, 4000);
    } else {
      el.textContent = "⏳ Remaining time: " + Math.floor(secondsLeft/60) + ":" + String(secondsLeft%60).padStart(2,"0");
    }
  }, 1000);
}

function closeLive(){
  const box = document.getElementById("liveBox");
  if (box) box.remove();
  active = false;
}

// --- Event trigger from report.js ---
on("report:done", ()=> {
  setTimeout(() => {
    const btn = document.createElement("button");
    btn.textContent = "🗣️ Discuss Your Reading";
    btn.style.cssText = "margin-top:12px;padding:8px 14px;border-radius:10px;border:1px solid #16f0a7;background:#0b0f16;color:#16f0a7;cursor:pointer;";
    btn.onclick = initLiveChat;
    document.getElementById("reportBox").appendChild(btn);
  }, 500);
});
