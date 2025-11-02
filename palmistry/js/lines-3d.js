// 🕉️ Sathyadarshana Divine Line Explorer 3D Renderer (Clean Gold Lines Edition)
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function initGoldenPalm3D(containerId = "canvasRight") {
  const canvas = document.getElementById(containerId);
  if (!canvas) return console.error("Canvas not found:", containerId);

  // === Scene Setup ===
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.width, canvas.height);

  // === Lighting (Balanced — no big yellow aura) ===
  const ambient = new THREE.AmbientLight(0xffffff, 0.25);
  scene.add(ambient);

  const point = new THREE.PointLight(0xffd700, 0.6, 50);
  point.position.set(0, 0, 10);
  scene.add(point);

  // === Palm Base (transparent, no glow background) ===
  const geometry = new THREE.PlaneGeometry(4, 6, 32, 32);
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.0, // fully transparent surface
  });
  const palm = new THREE.Mesh(geometry, material);
  scene.add(palm);

  // === Pure Golden Lines ===
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffd700,
    linewidth: 2,
  });

  const paths = [
    [[-1.2, -1.5, 0], [-0.4, -0.2, 0], [0.3, 0.4, 0]], // Life Line
    [[-1.0, 0.0, 0], [0.2, 0.3, 0], [1.1, 0.4, 0]],   // Head Line
    [[-1.0, 0.6, 0], [0.4, 0.8, 0], [1.1, 0.9, 0]],   // Heart Line
    [[0.0, -1.8, 0], [0.1, -0.5, 0], [0.0, 1.2, 0]]   // Fate Line
  ];

  paths.forEach(points => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(60));
    const line = new THREE.Line(geo, lineMaterial);
    scene.add(line);
  });

  // === Smooth Motion ===
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.01;
    point.intensity = 0.5 + 0.3 * Math.sin(t * 2); // gentle pulse
    camera.position.z = 6;
    renderer.render(scene, camera);
  }

  animate();
  console.log("🌟 Golden Palm 3D Renderer (No Aura) Initialized");
}
