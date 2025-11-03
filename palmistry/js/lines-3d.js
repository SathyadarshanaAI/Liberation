// 🕉️ Sathyadarshana Quantum Palm Analyzer
// V19.3 · Pure Golden Line Edition (No Aura Layer / No Circle / No Glow)
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function initGoldenPalm3D(canvasId = "canvasRight") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // === Scene Setup ===
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    0.1,
    100
  );
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor(0x000000, 0); // transparent background

  // === Light Setup (Minimal Ambient, No Glow) ===
  const ambient = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambient);

  // Disable any glow/point light fully
  const point = new THREE.PointLight(0xffd700, 0, 0);
  scene.add(point);

  // === Golden Line Material ===
  const goldMat = new THREE.LineBasicMaterial({
    color: 0xffd700,
    linewidth: 2,
    transparent: true,
    opacity: 0.9,
  });

  // === Palm Lines (No aura, no mesh, only lines) ===
  const lines = [
    [[-1.3, -1.5, 0], [-0.4, -0.2, 0], [0.3, 0.4, 0]], // Life
    [[-1.0, 0.0, 0], [0.2, 0.3, 0], [1.1, 0.4, 0]],   // Head
    [[-1.0, 0.6, 0], [0.4, 0.8, 0], [1.1, 0.9, 0]],   // Heart
    [[0.0, -1.8, 0], [0.1, -0.5, 0], [0.0, 1.2, 0]],  // Fate
    [[0.8, -1.6, 0], [1.1, -0.2, 0], [1.3, 1.0, 0]],  // Sun
    [[-0.6, -1.4, 0], [-0.5, -0.7, 0], [-0.3, 0.3, 0]], // Health
  ];

  for (const pts of lines) {
    const curve = new THREE.CatmullRomCurve3(
      pts.map((p) => new THREE.Vector3(...p))
    );
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    const line = new THREE.Line(geo, goldMat);
    scene.add(line);
  }

  // === Simple Animation (No aura shimmer, just soft pulse) ===
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.015;
    goldMat.opacity = 0.8 + 0.15 * Math.sin(t * 2);
    renderer.render(scene, camera);
  }
  animate();

  console.log("✅ Aura fully removed — only pure golden lines are active.");
}
