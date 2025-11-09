// ==============================
// 🧠 main.js - Browser Compatible
// ==============================

// 1️⃣ TensorFlow.js Import (CDN)
import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.10.0/dist/tf.min.js';
import 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-webgl@4.10.0/dist/tf-backend-webgl.min.js';

// 2️⃣ Initialize TF WebGL Backend
async function initTF() {
    await tf.setBackend('webgl');
    await tf.ready();
    console.log('✅ TensorFlow WebGL backend ready');
    document.getElementById('status').textContent = '🔍 TensorFlow Ready';
}

// 3️⃣ Camera Handling
async function startCamera(videoId, facingMode = 'user') {
    const vid = document.getElementById(videoId);
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode },
            audio: false
        });
        vid.srcObject = stream;
        await vid.play();
        console.log(`✅ Camera started for ${videoId}`);
    } catch (err) {
        console.error(`⚠️ Camera error for ${videoId}:`, err);
        document.getElementById('status').textContent = `⚠️ Camera error: ${err.message}`;
    }
}

// 4️⃣ Button Listeners
document.getElementById('startCamLeft').addEventListener('click', () => startCamera('vidLeft', 'user'));
document.getElementById('startCamRight').addEventListener('click', () => startCamera('vidRight', 'user'));

// 5️⃣ Capture Button Example
function captureFrame(videoId, canvasId, outputId) {
    const vid = document.getElementById(videoId);
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(vid, 0, 0, canvas.width, canvas.height);
    document.getElementById(outputId).textContent = '✅ Frame Captured!';
}

document.getElementById('captureLeft').addEventListener('click', () => captureFrame('vidLeft', 'canvasLeft', 'analysisTextLeft'));
document.getElementById('captureRight').addEventListener('click', () => captureFrame('vidRight', 'canvasRight', 'analysisTextRight'));

// 6️⃣ Initialize
initTF();
