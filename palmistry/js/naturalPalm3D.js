// naturalPalm3D.js — V24.6 Natural 3D Palm Interface
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { initPalmLines3D } from "./lines-3d.js";

let rendererRef = null;

export function initNaturalPalm3D(canvasId = "canvasRight") {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    console.warn("naturalPalm3D: canvas not found:", canvasId);
    return;
  }

  // if already running, do not reinit multiple times
  if (rendererRef) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setClearColor(0x000000, 0);

  rendererRef = renderer;

  // Lighting
  const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  const dir = new THREE.DirectionalLight(0xffffff, 0.6);
  dir.position.set(2, 2, 3);
  scene.add(hemi, dir);

  // Palm geometry (soft curved surface)
  const palmGeo = new THREE.SphereGeometry(1.5, 48, 48);
  const palmMat = new THREE.MeshStandardMaterial({
    color: 0xffd9b3,
    roughness: 0.7,
    metalness: 0.05
  });
  const palmMesh = new THREE.Mesh(palmGeo, palmMat);
  palmMesh.scale.set(1.2, 0.85, 0.45);
  palmMesh.rotation.x = -0.5;
  scene.add(palmMesh);

  // Add natural 3D lines
  initPalmLines3D(scene);

  // gentle animation
  function animate() {
    requestAnimationFrame(animate);
    palmMesh.rotation.y += 0.002;
    palmMesh.rotation.x = -0.5 + Math.sin(Date.now() * 0.0002) * 0.03;
    renderer.render(scene, camera);
  }
  animate();

  console.log("🌿 Natural 3D Palm Interface initialized.");
}
