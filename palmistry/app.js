// app.js (ESM Main Orchestrator)
import { CameraCard } from './modules/camera.js';
// import { analyzePalm } from './modules/analyzer.js'; // future: AI analysis
// import { exportPDF } from './modules/pdf.js';        // future: PDF export

const $ = (sel, r=document) => r.querySelector(sel);

const statusEl = $("#status");
const canvas = $("#canvas");
const camBox = $("#camBox");
const btnStart = $("#startCam");
const btnSwitch = $("#switchCam");
const btnTorch = $("#toggleTorch");
const btnCapture = $("#capture");
const btnAnalyze = $("#analyze");
const btnPdf = $("#dlPdf");
const resultEl = $("#insight");

let camera = null;

function setStatus(msg) { statusEl.textContent = msg; }

window.addEventListener('DOMContentLoaded', () => {
  camera = new CameraCard(camBox, {
    facingMode: 'environment',
    onStatus: setStatus
  });

  btnStart.onclick = async () => { await camera.start(); };
  btnSwitch.onclick = async () => { await camera.switch(); };
  btnTorch.onclick = async () => { await camera.toggleTorch(); };
  btnCapture.onclick = () => {
    camera.captureTo(canvas);
    setStatus('Image captured. Now you can analyze.');
  };

  btnAnalyze.onclick = () => {
    // Future: Actually call analyzePalm(canvas) for AI analysis
    resultEl.textContent = 'Palm analysis in progress... (AI logic goes here)';
  };

  btnPdf.onclick = () => {
    // Future: Actually call exportPDF(canvas) to download PDF
    setStatus('PDF download not yet implemented');
  };
});
