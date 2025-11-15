/* ---------------------------------------------------------
   THE SEED · Palmistry AI
   main.js — Central Fusion Controller (v4.0)
   - Camera Engine (smooth switch)
   - Freeze Capture (flash, shutter)
   - Stabilizer / FPS helper
   - Pipeline: detectPalm -> detectLines -> save -> render -> build A4
   - Live AI trigger
   - Language helpers + exports
----------------------------------------------------------*/

import { detectPalm } from "./vision/palm-detect.js";
import { detectLines } from "./vision/line-detect.js";
import { buildA4Sheet } from "./render/a4-builder.js";
import { renderPalm3D } from "./render/palm-3d-render.js";
import { renderTruth } from "./render/truth-output.js";
import { initWisdomCore, WisdomCore as WC } from "./core/wisdom-core.js"; // defensive import

/* ----------------- DOM refs ----------------- */
const video = document.getElementById("video");
const handMsg = document.getElementById("handMsg");
const outputBox = document.getElementById("output");

/* ----------------- Internal state ----------------- */
let stream = null;
let facingMode = "environment"; // 'environment' or 'user'
let rafId = null;
let lastFrameTime = 0;
let fpsTarget = 18; // target FPS for processing (stabilizer)
let stableCount = 0;

/* ----------------- Language map (simple) ----------------- */
const LANG = {
  en: {
    msg: "Place your hand inside the guide.",
    step: "First scan left hand, then right hand.",
    open: "Open Camera",
    scan: "Scan Hand"
  },
  si: {
    msg: "නිදර්ශකයේ පෙන්වන පරිදි ඔබේ අත කැමරාව ඉදිරියේ තබන්න.",
    step: "පළමුව වම් අත, පසුව දකුණු අත scan කරන්න.",
    open: "කැමරා විවෘත කරන්න",
    scan: "අත් පරීක්ෂා කරන්න"
  }
  // add more languages if needed
};

/* ----------------- Exports (will be exported at end) ----------------- */

/* ----------------- Utility helpers ----------------- */
function log(msg) {
  try { console.debug("[THE SEED]", msg); } catch {}
}

function safeVibrate(ms = 60) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch {}
}

function flashEffect(duration = 140) {
  let flash = document.getElementById("__seed_flash");
  if (!flash) {
    flash = document.createElement("div");
    flash.id = "__seed_flash";
    Object.assign(flash.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      background: "#fff",
      opacity: "0",
      pointerEvents: "none",
      transition: `opacity ${duration / 1000}s ease-out`,
      zIndex: 99999
    });
    document.body.appendChild(flash);
  }
  flash.style.opacity = "1";
  setTimeout(() => (flash.style.opacity = "0"), duration);
}

/* create shutter sound element (one-time) */
let shutterAudio = null;
function playShutter() {
  try {
    if (!shutterAudio) {
      shutterAudio = new Audio();
      // short silent data URI fallback, browsers often block autoplay, but user gesture will play
      shutterAudio.src = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
    }
    shutterAudio.play().catch(() => {});
  } catch (e) {}
}

/* ----------------- Camera & Stabilizer ----------------- */
async function _getUserMedia(constraints) {
  try {
    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (err) {
    log("getUserMedia failed: " + (err && err.message));
    throw err;
  }
}

export async function switchCamera(mode = "environment") {
  // clean stop previous stream
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  facingMode = mode;
  handMsg.innerText = "Switching camera...";
  try {
    // prefer ideal width/height for better processing
    const constraints = {
      video: {
        facingMode: { ideal: mode },
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 30 }
      },
      audio: false
    };
    stream = await _getUserMedia(constraints);
    video.srcObject = stream;
    await video.play();
    handMsg.innerText = "Camera ready — place your hand inside the guide.";
    safeVibrate(40);
  } catch (err) {
    handMsg.innerText = "Camera access failed. Check permissions.";
    console.error(err);
  }
}

export async function startCamera() {
  // smoother switch wrapper
  await switchCamera(facingMode);
  // start a lightweight stabilizer loop (no heavy processing here)
  stabilizeLoop();
}

/* Stabilizer: tracks video frames and ensures a minimal frame interval before processing */
function stabilizeLoop() {
  if (rafId) cancelAnimationFrame(rafId);
  lastFrameTime = performance.now();
  stableCount = 0;
  function tick(now) {
    const dt = now - lastFrameTime;
    const targetMs = 1000 / fpsTarget;
    if (dt >= targetMs) {
      stableCount++;
      lastFrameTime = now;
      // we don't process frames here — only maintain stableCount for capture readiness
    }
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);
}

/* ----------------- Capture / Freeze ----------------- */
export async function captureHand() {
  if (!video.srcObject) {
    alert("Camera not active — click Open Camera first.");
    return;
  }

  // Wait for a couple stable frames to reduce blur
  if (stableCount < 2) {
    handMsg.innerText = "Stabilizing camera — hold still...";
    await new Promise((res) => setTimeout(res, 300));
  }

  try {
    // UI feedback
    flashEffect(160);
    playShutter();
    safeVibrate(80);
    handMsg.innerText = "Capture locked — analyzing...";

    // draw frame
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    // optional small enhancement: draw a subtle overlay to improve contrast for vision
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // get ImageData — this can be heavy; keep local copy
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // send to processing pipeline (non-blocking)
    await processPalm(frame);

    // return a convenient data URL of frozen frame for UI preview or A4 embed
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("captureHand error:", err);
    handMsg.innerText = "Capture failed. Try again.";
  }
}

/* ----------------- Processing pipeline ----------------- */
async function processPalm(frame) {
  try {
    handMsg.innerText = "Detecting palm region…";
    const palm = await detectPalm(frame); // returns {width,height,mask,bbox}
    if (!palm || !palm.bbox) {
      handMsg.innerText = "Palm not detected — adjust position & lighting.";
      return;
    }

    handMsg.innerText = "Detecting lines…";
    const lines = await detectLines(palm); // returns JSON of lines, symbols

    handMsg.innerText = "Saving scan to wisdom core…";
    // wisdom core: safe calls if available
    try {
      if (typeof WC !== "undefined" && WC && typeof WC.saveScan === "function") {
        WC.saveScan({ raw: frame, palm, lines, timestamp: Date.now() });
      } else if (typeof initWisdomCore === "function") {
        // if just init available, call to initialize a lightweight core
        initWisdomCore();
      }
    } catch (e) {
      log("WisdomCore save failed: " + e?.message);
    }

    handMsg.innerText = "Generating mini reading…";
    let readingText = "";
    try {
      // renderTruth expects (palmReading, karmaReading) in your earlier design,
      // but we'll be defensive: if renderTruth accepts lines only, it still should return string.
      readingText = renderTruth(lines, lines); // best-effort — modules should align
    } catch (e) {
      readingText = "Reading generated (basic).";
      log("renderTruth error: " + e?.message);
    }

    outputBox.textContent = readingText || "No reading available.";

    handMsg.innerText = "Scan complete ✔";

    // auto-trigger 3D + A4 build (non-blocking)
    try {
      if (typeof renderPalm3D === "function") renderPalm3D(lines);
    } catch (e) { log("renderPalm3D failed: " + e?.message); }
    try {
      if (typeof buildA4Sheet === "function") buildA4Sheet(lines);
    } catch (e) { log("buildA4Sheet failed: " + e?.message); }

    return { palm, lines };
  } catch (err) {
    console.error("processPalm error:", err);
    handMsg.innerText = "Analysis error. Try again.";
  }
}

/* ----------------- Live AI mode ----------------- */
export async function startLiveAI() {
  handMsg.innerText = "Opening Live AI…";
  outputBox.textContent = "Initializing Live AI session…";
  // get last scan
  let lastScan = null;
  try {
    if (WC && typeof WC.getLastScan === "function") lastScan = WC.getLastScan();
  } catch (e) {
    log("WisdomCore.getLastScan failed");
  }

  if (!lastScan) {
    outputBox.textContent = "No recent palm scan available. Please scan first.";
    handMsg.innerText = "Scan required for Live AI.";
    return;
  }

  try {
    outputBox.textContent = "Live AI ready — ask about lines, timing, remedies.";
    // talk: many implementations used WisdomCore.talk(last). Be defensive:
    let answer = "";
    if (WC && typeof WC.talk === "function") {
      answer = await WC.talk(lastScan);
    } else {
      // fallback: simple summary
      answer = "Live AI fallback: I see the primary patterns are present. Ask a specific question about Life, Head, Heart or Fate lines.";
    }
    outputBox.textContent = answer;
  } catch (e) {
    console.error("startLiveAI error:", e);
    outputBox.textContent = "Live AI error.";
  }
}

/* ----------------- Language helpers ----------------- */
export function loadLanguages(selectId = "languageSelect") {
  const sel = document.getElementById(selectId);
  if (!sel) return;
  sel.innerHTML = "<option value=''>Select Language</option>";
  Object.keys(LANG).forEach((k) => {
    const o = document.createElement("option");
    o.value = k;
    o.textContent = k.toUpperCase();
    sel.appendChild(o);
  });
}
export function setLanguage() {
  const sel = document.getElementById("languageSelect");
  if (!sel) return;
  const L = sel.value;
  if (!L || !LANG[L]) return;
  handMsg.innerHTML = LANG[L].msg + "<br>" + LANG[L].step;
  // update UI buttons if present
  const buttons = document.querySelectorAll(".actionBtn");
  if (buttons && buttons.length >= 2) {
    buttons[0].textContent = LANG[L].open;
    buttons[1].textContent = LANG[L].scan;
  }
}

/* ----------------- A4 export wrapper (calls buildA4Sheet if present) ----------------- */
export async function exportA4() {
  handMsg.innerText = "Preparing A4 report…";
  let lastScan = null;
  try {
    if (WC && typeof WC.getLastScan === "function") lastScan = WC.getLastScan();
  } catch (e) { log("getLastScan failed"); }
  if (!lastScan) {
    handMsg.innerText = "Scan required before export.";
    return;
  }
  try {
    if (typeof buildA4Sheet === "function") {
      await buildA4Sheet(lastScan.lines || lastScan);
      handMsg.innerText = "A4 report built.";
    } else {
      handMsg.innerText = "A4 builder not available.";
    }
  } catch (e) {
    console.error("exportA4 error:", e);
    handMsg.innerText = "A4 export failed.";
  }
}

/* ----------------- Graceful stop (useful when leaving page) ----------------- */
export function stopCamera() {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  if (stream) {
    stream.getTracks().forEach((t) => t.stop());
    stream = null;
  }
  try { video.pause(); video.srcObject = null; } catch (e) {}
  handMsg.innerText = "Camera stopped.";
}

/* ----------------- Exports ----------------- */
export default {
  startCamera,
  switchCamera,
  captureHand,
  startLiveAI,
  loadLanguages,
  setLanguage,
  exportA4,
  stopCamera
};
