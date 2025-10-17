import { CameraCard } from './modules/camera.js';

const camBoxLeft = document.getElementById("camBoxLeft");
const camBoxRight = document.getElementById("camBoxRight");
const canvasLeft = document.getElementById("canvasLeft");
const canvasRight = document.getElementById("canvasRight");
const statusEl = document.getElementById("status");

let camLeft, camRight;

function setStatus(msg) { statusEl.textContent = msg; }

window.addEventListener('DOMContentLoaded', () => {
  camLeft = new CameraCard(camBoxLeft, { facingMode: 'environment', onStatus: setStatus });
  camRight = new CameraCard(camBoxRight, { facingMode: 'environment', onStatus: setStatus });

  document.getElementById("startCamLeft").onclick = async () => {
    await camLeft.start();
    setStatus("Left hand camera started.");
  };
  document.getElementById("startCamRight").onclick = async () => {
    await camRight.start();
    setStatus("Right hand camera started.");
  };
  document.getElementById("captureLeft").onclick = () => {
    camLeft.captureTo(canvasLeft);
    setStatus("Left hand captured.");
  };
  document.getElementById("captureRight").onclick = () => {
    camRight.captureTo(canvasRight);
    setStatus("Right hand captured.");
  };
  document.getElementById("toggleTorch").onclick = async () => {
    if (camLeft.stream) {
      await camLeft.toggleTorch();
    } else if (camRight.stream) {
      await camRight.toggleTorch();
    } else {
      setStatus("Start a camera first!");
    }
  };
});
