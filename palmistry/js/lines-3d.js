// 🕉️ Sathyadarshana Divine Palm 3D Lines — V18.3 Aura Removed Clean Gold Edition
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function initGoldenPalm3D(containerId = "canvasRight") {
  const canvas = document.getElementById(containerId);
  if (!canvas) return console.error("Canvas not found:", containerId);

  // === Scene Setup ===
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor(0x000000, 0); // transparent background

  // === Lighting (soft neutral lighting) ===
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);
  // 🔕 Aura disabled — no yellow glowing ball
  const point = new THREE.PointLight(0xffd700, 0.0, 0);
  scene.add(point);

  // === Transparent Palm Plane ===
  const plane = new THREE.PlaneGeometry(4, 6, 32, 32);
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.0,
  });
  const palm = new THREE.Mesh(plane, planeMat);
  scene.add(palm);

  // === Golden Palm Lines ===
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffd700,
    linewidth: 2,
  });

  const lines = [
    [[-1.3, -1.5, 0], [-0.4, -0.2, 0], [0.3, 0.4, 0]], // Life
    [[-1.0, 0.0, 0], [0.2, 0.3, 0], [1.1, 0.4, 0]],   // Head
    [[-1.0, 0.6, 0], [0.4, 0.8, 0], [1.1, 0.9, 0]],   // Heart
    [[0.0, -1.8, 0], [0.1, -0.5, 0], [0.0, 1.2, 0]],   // Fate
  ];

  lines.forEach(points => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
    const line = new THREE.Line(geo, lineMaterial);
    scene.add(line);
  });

  // === Animation (gentle shimmer only) ===
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;
    camera.position.z = 6;
    lineMaterial.opacity = 0.7 + 0.3 * Math.sin(t * 2); // soft shimmer
    renderer.render(scene, camera);
  }

  animate();
  console.log("✅ 3D Palm Renderer loaded — Aura removed, clean golden lines active");
}
