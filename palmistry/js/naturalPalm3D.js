// 🕉️ Sathyadarshana Quantum Palm Analyzer
// V24.6 · Combined Natural Palm Interface Edition
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { initPalmLines3D } from "./lines-3d.js";

export function initNaturalPalm3D(canvasId = "canvasRight") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn("Canvas not found for 3D Palm Rendering");
    return;
  }

  // === Scene setup ===
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor(0x000000, 0);

  // === Lighting ===
  const ambient = new THREE.AmbientLight(0xffffff, 0.6);
  const dir = new THREE.DirectionalLight(0xffffff, 0.8);
  dir.position.set(2, 2, 4);
  scene.add(ambient, dir);

  // === Palm Shape (Soft Skin Material) ===
  const palmGeo = new THREE.SphereGeometry(1.5, 32, 32);
  const palmMat = new THREE.MeshStandardMaterial({
    color: 0xffd9b3,    // soft skin tone
    roughness: 0.7,
    metalness: 0.1
  });
  const palmMesh = new THREE.Mesh(palmGeo, palmMat);
  palmMesh.scale.set(1.2, 0.8, 0.5); // flatten palm shape
  scene.add(palmMesh);

  // === Add Natural Lines ===
  initPalmLines3D(scene);

  // === Camera gentle rotation ===
  function animate() {
    requestAnimationFrame(animate);
    palmMesh.rotation.y += 0.003;
    palmMesh.rotation.x = Math.sin(Date.now() * 0.0002) * 0.1;
    renderer.render(scene, camera);
  }
  animate();

  console.log("🌿 Natural 3D Palm Interface initialized successfully.");
}
