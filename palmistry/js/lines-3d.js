// 🕉️ Sathyadarshana Quantum Palm Analyzer
// V19.1 – Pure Line Mode (Aura Removed)
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function initGoldenPalm3D(canvasId = "canvasRight") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor(0x000000, 0);

  // 🌗 Minimal ambient (no glow, no aura)
  const ambient = new THREE.AmbientLight(0xffffff, 0.15);
  scene.add(ambient);

  // 🟡 Disable any light emission
  const point = new THREE.PointLight(0xffd700, 0, 0);
  scene.add(point);

  // 🌟 Golden Line Material
  const goldMat = new THREE.LineBasicMaterial({
    color: 0xffd700,
    linewidth: 2,
    transparent: true,
    opacity: 0.9,
  });

  // Palm lines only
  const lines = [
    [[-1.3, -1.5, 0], [-0.4, -0.2, 0], [0.3, 0.4, 0]], // Life
    [[-1.0, 0.0, 0], [0.2, 0.3, 0], [1.1, 0.4, 0]],   // Head
    [[-1.0, 0.6, 0], [0.4, 0.8, 0], [1.1, 0.9, 0]],   // Heart
    [[0.0, -1.8, 0], [0.1, -0.5, 0], [0.0, 1.2, 0]],  // Fate
    [[0.8, -1.6, 0], [1.1, -0.2, 0], [1.3, 1.0, 0]],  // Sun
  ];

  for (const pts of lines) {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    const line = new THREE.Line(geo, goldMat);
    scene.add(line);
  }

  // Gentle shimmer
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.02;
    goldMat.opacity = 0.8 + 0.2 * Math.sin(t * 2.0);
    renderer.render(scene, camera);
  }
  animate();

  console.log("✨ Pure Golden Line Mode active — Aura disabled completely.");
}
