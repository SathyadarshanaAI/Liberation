/* ========================================== 🕉️ THE SEED · Palmistry AI · V120 MAIN.JS — AI HAND DETECTOR + OUTLINE EDITION ========================================== */

/* ====== IMPORT AI MODELS ====== */ import * as handpose from "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose"; import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl";

let video = document.getElementById("video"); let palmCanvas = document.getElementById("palmCanvas"); let overlayCanvas = document.getElementById("overlayCanvas"); let output = document.getElementById("output"); let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d"); const overlayCtx = overlayCanvas.getContext("2d");

let handModel = null;

/* ============================ LOAD AI HAND MODEL ============================ */ async function loadHandModel() { log("Loading AI Hand Model..."); handModel = await handpose.load(); log("Hand Model Loaded ✔"); }

loadHandModel();

/* ============================ CAMERA INITIALIZATION ============================ */ export async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); video.srcObject = stream; log("Camera started"); } catch (e) { error("Camera failed: " + e.message); } }

/* ============================ AI HAND DETECTION ============================ */ async function detectHand() { if (!handModel) { log("Hand model not ready..."); return null; }

const predictions = await handModel.estimateHands(video);

if (predictions.length === 0) {
    log("No hand detected");
    return null;
}

const hand = predictions[0];
const keypoints = hand.landmarks;

const xs = keypoints.map(p => p[0]);
const ys = keypoints.map(p => p[1]);

const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);

return { minX, maxX, minY, maxY, keypoints };

}

/* ============================ AI OUTLINE + PALM BOX DRAWING ============================ */ async function autoPalmCapture() { const hand = await detectHand(); if (!hand) return;

overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

const scaleX = palmCanvas.width / video.videoWidth;
const scaleY = palmCanvas.height / video.videoHeight;

const x = hand.minX * scaleX;
const y = hand.minY * scaleY;
const w = (hand.maxX - hand.minX) * scaleX;
const h = (hand.maxY - hand.minY) * scaleY;

overlayCtx.strokeStyle = "#00e5ff";
overlayCtx.lineWidth = 3;
overlayCtx.strokeRect(x, y, w, h);

log("Palm outline drawn/* ==========================================

🕉️ THE SEED · Palmistry AI · V120 MAIN.JS — AI HAND DETECTOR + OUTLINE EDITION ========================================== */

/* ====== IMPORT AI MODELS ====== */ import * as handpose from "https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose"; import "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl";

let video = document.getElementById("video"); let palmCanvas = document.getElementById("palmCanvas"); let overlayCanvas = document.getElementById("overlayCanvas"); let output = document.getElementById("output"); let dbg = document.getElementById("debugConsole");

const palmCtx = palmCanvas.getContext("2d"); const overlayCtx = overlayCanvas.getContext("2d");

let handModel = null;

/* ============================ LOAD AI HAND MODEL ============================ */ async function loadHandModel() { log("Loading AI Hand Model..."); handModel = await handpose.load(); log("Hand Model Loaded ✔"); }

loadHandModel();

/* ============================ CAMERA INITIALIZATION ============================ */ export async function startCamera() { try { const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); video.srcObject = stream; log("Camera started"); } catch (e) { error("Camera failed: " + e.message); } }

/* ============================ AI HAND DETECTION ============================ */ async function detectHand() { if (!handModel) { log("Hand model not ready..."); return null; }

const predictions = await handModel.estimateHands(video);

if (predictions.length === 0) {
    log("No hand detected");
    return null;
}

const hand = predictions[0];
const keypoints = hand.landmarks;

const xs = keypoints.map(p => p[0]);
const ys = keypoints.map(p => p[1]);

const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);

return { minX, maxX, minY, maxY, keypoints };

}

/* ============================ AI OUTLINE + PALM BOX DRAWING ============================ */ async function autoPalmCapture() { const hand = await detectHand(); if (!hand) return;

overlayCtx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

const scaleX = palmCanvas.width / video.videoWidth;
const scaleY = palmCanvas.height / video.videoHeight;

const x = hand.minX * scaleX;
const y = hand.minY * scaleY;
const w = (hand.maxX - hand.minX) * scaleX;
const h = (hand.maxY - hand.minY) * scaleY;

overlayCtx.strokeStyle = "#00e5ff";
overlayCtx.lineWidth = 3;
overlayCtx.strokeRect(x, y, w, h);

log("Palm outline drawn
