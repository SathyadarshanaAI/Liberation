// 🕉️ Sathyadarshana Divine Line Explorer 3D Renderer
// File: js/lines-3d.js — V1.0 Golden Dharma Core Edition

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function initGoldenPalm3D(containerId = "canvasRight") {
  const canvas = document.getElementById(containerId);
  if (!canvas) return console.error("Canvas not found:", containerId);

  // === Basic Scene Setup ===
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.width, canvas.height);

  // === Lighting ===
  const ambient = new THREE.AmbientLight(0xffd700, 0.3);
  scene.add(ambient);

  const point = new THREE.PointLight(0xffd700, 1.2, 100);
  point.position.set(0, 0, 10);
  scene.add(point);

  // === Palm Surface (Flat Mesh Plane) ===
  const geometry = new THREE.PlaneGeometry(4, 6, 32, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0x111111,
    shininess: 10,
    transparent: true,
    opacity: 0.95,
  });
  const palm = new THREE.Mesh(geometry, material);
  scene.add(palm);

  // === Golden Lines ===
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffd700,
    linewidth: 2,
  });

  const lines = [];

  // Base line coordinates (symbolic palm lines)
  const paths = [
    [[-1.2, -1.5, 0], [-0.4, -0.2, 0], [0.3, 0.4, 0]], // Life Line
    [[-1.0, 0.0, 0], [0.2, 0.3, 0], [1.1, 0.4, 0]],   // Head Line
    [[-1.0, 0.6, 0], [0.4, 0.8, 0], [1.1, 0.9, 0]],   // Heart Line
    [[0.0, -1.8, 0], [0.1, -0.5, 0], [0.0, 1.2, 0]]   // Fate Line
  ];

  paths.forEach(points => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    const line = new THREE.Line(geometry, lineMaterial);
    scene.add(line);
    lines.push(line);
  });

  // === Glow Animation ===
  let glowPhase = 0;
  function animate() {
    requestAnimationFrame(animate);
    glowPhase += 0.02;
    const glowIntensity = Math.abs(Math.sin(glowPhase)) * 0.5 + 0.5;

    point.intensity = 0.8 + glowIntensity * 0.5;
    lines.forEach(l => (l.material.color.setHSL(0.14, 1, 0.4 + glowIntensity * 0.2)));

    palm.rotation.y += 0.002;
    palm.rotation.x = Math.sin(glowPhase * 0.1) * 0.05;
    renderer.render(scene, camera);
  }

  camera.position.z = 6;
  animate();

  console.log("🌟 Golden Dharma 3D Renderer Initialized");
}
