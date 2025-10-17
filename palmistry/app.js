// app.js
import { CameraCard } from './modules/camera.js';
import { analyzePalm } from './modules/analyzer.js';
import { saveNote, getNotes } from './modules/storage.js';
import { exportPDF } from './modules/pdf.js';
import { updateApp } from './modules/updater.js';

const $ = (s, r=document) => r.querySelector(s);
const statusEl = $("#status");
const canvas = $("#canvas");
const camBox = $("#camBox");
const resultEl = $("#insight");
const btnStart = $("#startCam");
const btnSwitch = $("#switchCam");
const btnTorch = $("#toggleTorch");
const btnCapture = $("#capture");
const btnAnalyze = $("#analyze");
const btnPdf = $("#dlPdf");

let camera = null;
let lastHand = "right"; // default

function setStatus(msg) { statusEl.textContent = msg; }

window.addEventListener('DOMContentLoaded', () => {
  camera = new CameraCard(camBox, {
    facingMode: 'environment',
    onStatus: setStatus
  });

  btnStart.onclick = async () => { await camera.start(); };
  btnSwitch.onclick = async () => { lastHand = lastHand === "right" ? "left" : "right"; await camera.switch(); setStatus(`Scanning: ${lastHand} hand`); };
  btnTorch.onclick = async () => { await camera.toggleTorch(); };
  btnCapture.onclick = () => { camera.captureTo(canvas); setStatus('Image captured. Analyze to continue.'); };

  btnAnalyze.onclick = async () => {
    setStatus('Analyzing palm...');
    const analysis = await analyzePalm(canvas, lastHand);
    resultEl.textContent = JSON.stringify(analysis, null, 2); // You can format nicely
    saveNote({ hand: lastHand, analysis, date: new Date().toISOString() });
  };

  btnPdf.onclick = () => { exportPDF(canvas, getNotes()); setStatus('PDF generated.'); };
});
