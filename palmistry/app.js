බ// app.js — Sathyadarshana Quantum Palm Analyzer V5.6
import { CameraCard } from './modules/camera.js';
import { I18N } from './modules/i18n.js';

// DOM helper
const $ = id => document.getElementById(id);
window.$ = $;

const statusEl = $('status');
const leftCv = $('canvasLeft');
const rightCv = $('canvasRight');

function setStatus(msg, ok = true) {
  statusEl.textContent = msg;
  statusEl.style.color = ok ? '#16f0a7' : '#ff6b6b';
}

// ==== CAMERA SETUP ====
let camLeft, camRight;

function setupCams() {
  camLeft = new CameraCard($('camBoxLeft'), {
    facingMode: 'environment',
    onStatus: setStatus
  });
  camRight = new CameraCard($('camBoxRight'), {
    facingMode: 'environment',
    onStatus: setStatus
  });

  $('startCamLeft').onclick = () => {
    camLeft.start();
    setStatus("📷 Left camera started");
  };
  $('startCamRight').onclick = () => {
    camRight.start();
    setStatus("📷 Right camera started");
  };

  $('captureLeft').onclick = () => {
    captureAndScan(camLeft, leftCv, "left");
  };
  $('captureRight').onclick = () => {
    captureAndScan(camRight, rightCv, "right");
  };

  $('torchLeft').onclick = () => camLeft.toggleTorch();
  $('torchRight').onclick = () => camRight.toggleTorch();

  $('uploadLeft').onclick = () => filePickToCanvas(leftCv);
  $('uploadRight').onclick = () => filePickToCanvas(rightCv);
}

async function filePickToCanvas(cv) {
  const inp = document.createElement('input');
  inp.type = 'file';
  inp.accept = 'image/*';
  inp.onchange = () => {
    const f = inp.files?.[0];
    if (!f) return;
    const img = new Image();
    img.onload = () => {
      cv.width = img.naturalWidth;
      cv.height = img.naturalHeight;
      cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      setStatus('🖼️ Image loaded');
    };
    img.src = URL.createObjectURL(f);
  };
  inp.click();
}

// ==== CAPTURE + SCAN (main camera stays visible) ====
function captureAndScan(cam, cv, side) {
  cam.captureTo(cv, { mirror: side === 'right', cover: false });
  showScanOverlay(cam.container);
  setStatus(`🔍 Scanning ${side} palm...`);
  setTimeout(() => {
    setStatus(`✅ ${side.charAt(0).toUpperCase() + side.slice(1)} palm captured`);
  }, 1800);
}

// ==== SCAN OVERLAY (beam + glow animation) ====
function showScanOverlay(container) {
  const overlay = document.createElement('div');
  overlay.className = 'scan-overlay';
  overlay.style.position = 'absolute';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  container.appendChild(overlay);

  const beam = document.createElement('div');
  beam.className = 'scan-beam';
  overlay.appendChild(beam);

  setTimeout(() => overlay.remove(), 2000);
}

// ==== ANALYZER ====
function analyzeCanvas(cv) {
  const ctx = cv.getContext('2d');
  const { width: w, height: h } = cv;
  if (!w || !h) return { ok: false, msg: 'No image' };
  const img = ctx.getImageData(0, 0, w, h).data;
  let sum = 0;
  for (let i = 0; i < img.length; i += 4) {
    const v = (img[i] * 0.3 + img[i + 1] * 0.59 + img[i + 2] * 0.11);
    sum += v < 90 ? 1 : 0;
  }
  const density = (sum / (w * h)) * 100;
  return { ok: true, metrics: { density: +density.toFixed(2) }, report: `Line density ${density.toFixed(2)}%` };
}

$('analyze').onclick = () => {
  setStatus("🪷 Analyzing...");
  const L = analyzeCanvas(leftCv);
  const R = analyzeCanvas(rightCv);
  $('insight').textContent = `LEFT → ${L.report}\nRIGHT → ${R.report}`;
  setStatus("✅ Analysis complete");
};

// ==== PDF SAVE ====
$('fullReport').onclick = () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.text("Sathya Darshana · Quantum Palm Analyzer V5.6", 40, 50);
  doc.text($('insight').textContent || 'No data.', 40, 80);
  doc.save('PalmReport.pdf');
  setStatus('📄 PDF saved');
};

// ==== SPEAK ====
$('speak').onclick = () => {
  const txt = $('insight').textContent || "No analysis yet.";
  const u = new SpeechSynthesisUtterance(txt);
  u.lang = $('language').value || 'en';
  speechSynthesis.speak(u);
  setStatus("🔊 Speaking…");
};

// ==== TRANSLATION ====
function updateUI(lang) {
  const ui = I18N[lang]?.ui || I18N.en.ui;
  $('title').textContent = ui.title + " V5.6";
  $('lblLanguage').textContent = ui.lang + ":";
  $('h3Left').textContent = ui.left;
  $('h3Right').textContent = ui.right;
  $('startCamLeft').textContent = ui.start;
  $('startCamRight').textContent = ui.start;
  $('captureLeft').textContent = ui.cap;
  $('captureRight').textContent = ui.cap;
  $('torchLeft').textContent = ui.torch;
  $('torchRight').textContent = ui.torch;
  $('uploadLeft').textContent = ui.upload;
  $('uploadRight').textContent = ui.upload;
  $('analyze').textContent = ui.analyze;
  $('fullReport').textContent = ui.full;
  $('speak').textContent = ui.speak;
  setStatus(ui.ready);
}

$('language').addEventListener('change', e => {
  const lang = e.target.value;
  localStorage.setItem('lang', lang);
  updateUI(lang);
});

const savedLang = localStorage.getItem('lang') || 'en';
$('language').value = savedLang;
updateUI(savedLang);

// ==== INIT ====
window.addEventListener('DOMContentLoaded', () => {
  setupCams();
  setStatus('🌿 Ready');
});
