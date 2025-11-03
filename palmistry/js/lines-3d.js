// lines-3d.js — Pure Gold Lines (No Aura)
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

  // 🔕 No aura light
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
  const point = new THREE.PointLight(0xffd700, 0.0, 0); // Aura disabled
  scene.add(point);

  // Palm lines
  const material = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2, transparent: true, opacity: 0.8 });
  const lines = [
    [[-1.3, -1.5, 0], [-0.4, -0.2, 0], [0.3, 0.4, 0]], // Life
    [[-1.0, 0.0, 0], [0.2, 0.3, 0], [1.1, 0.4, 0]], // Head
    [[-1.0, 0.6, 0], [0.4, 0.8, 0], [1.1, 0.9, 0]], // Heart
    [[0.0, -1.8, 0], [0.1, -0.5, 0], [0.0, 1.2, 0]], // Fate
    [[0.8, -1.6, 0], [1.1, -0.2, 0], [1.3, 1.0, 0]], // Sun
  ];

  for (const pts of lines) {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    const line = new THREE.Line(geo, material);
    scene.add(line);
  }

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.015;
    material.opacity = 0.75 + 0.25 * Math.sin(t * 2.0);
    renderer.render(scene, camera);
  }
  animate();
}
