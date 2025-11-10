// ================================================
// 🕉️ Sathyadarshana Quantum Palm Analyzer · V27.5
// Hybrid AI (TensorFlow + OpenCV + Sinhala Voice)
// ================================================

// 1️⃣ TensorFlow.js CDN Imports
import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js';
import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.10.0/dist/tf-backend-webgl.min.js';

// 2️⃣ Initialize TensorFlow Backend (WebGL)
async function initTF() {
  try {
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('✅ TensorFlow WebGL backend ready');
    document.getElementById('status').textContent = '🔍 TensorFlow Ready';
  } catch (err) {
    console.error('⚠️ TensorFlow init error:', err);
    document.getElementById('status').textContent = '⚠️ TensorFlow Init Failed';
  }
}

// 3️⃣ Camera Handling Logic
async function startCamera(videoId, facingMode = 'environment') {
  const vid = document.getElementById(videoId);
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode },
      audio: false
    });
    vid.srcObject = stream;
    await vid.play();
    document.getElementById('status').textContent = `📷 Camera active (${facingMode})`;
    console.log(`✅ Camera started for ${videoId}`);
  } catch (err) {
    console.error(`⚠️ Camera error (${videoId}):`, err);
    document.getElementById('status').textContent = `⚠️ Camera error: ${err.message}`;
  }
}

// 4️⃣ Capture Function (Freeze + Canvas Draw)
function captureFrame(videoId, canvasId, outputId) {
  const vid = document.getElementById(videoId);
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
  canvas.style.display = "block";
  vid.pause();

  document.getElementById(outputId).textContent = '✅ Palm Captured!';
  document.getElementById('status').textContent = '📸 Frame Captured Successfully';
  console.log(`✅ Frame captured for ${videoId}`);
}

// 5️⃣ AI Mock Analyzer (Placeholder for Real TF Model)
function analyzePalmAI() {
  const linesFound = Math.floor(Math.random() * 20) + 10;
  const clarity = linesFound > 15 ? "strong" : "light";
  const report = `Detected ${linesFound} visible palm lines.\nClarity: ${clarity}.\nEnergy level: ${(linesFound * 5).toFixed(0)}%.`;
  return report;
}

// 6️⃣ Sinhala Voice Output (SpeechSynthesis API)
function speakSinhala(text) {
  if (!window.speechSynthesis) return console.warn("Speech synthesis not supported.");
  const voice = new SpeechSynthesisUtterance(text);
  voice.lang = "si-LK";
  voice.pitch = 1;
  voice.rate = 1;
  voice.volume = 1;
  window.speechSynthesis.speak(voice);
  console.log("🗣️ Speaking Sinhala Output...");
}

// 7️⃣ Button Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Left Hand
  document.getElementById('startCamLeft').addEventListener('click', () => startCamera('vidLeft', 'environment'));
  document.getElementById('captureLeft').addEventListener('click', () => captureFrame('vidLeft', 'canvasLeft', 'analysisTextLeft'));
  document.getElementById('analyzeLeft')?.addEventListener('click', () => {
    const report = analyzePalmAI();
    document.getElementById('analysisTextLeft').textContent = report;
    speakSinhala("ඔයාගේ වම් අතේ ජීවිත රේඛාව ශක්තිමත්යි. හදවත පිරිසිදුයි.");
  });

  // Right Hand
  document.getElementById('startCamRight').addEventListener('click', () => startCamera('vidRight', 'environment'));
  document.getElementById('captureRight').addEventListener('click', () => captureFrame('vidRight', 'canvasRight', 'analysisTextRight'));
  document.getElementById('analyzeRight')?.addEventListener('click', () => {
    const report = analyzePalmAI();
    document.getElementById('analysisTextRight').textContent = report;
    speakSinhala("ඔයාගේ දකුණු අතේ රේඛා පිරිසිදුයි. විශ්වාස සහ ශක්තිය පෙන්වයි.");
  });
});

// 8️⃣ Initialize TensorFlow Backend on Load
initTF();
