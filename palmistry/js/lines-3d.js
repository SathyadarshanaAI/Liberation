// lines-3d.js — Natural 3D Palm Line Layer
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function initPalmLines3D(scene) {
  if (!scene) return;

  // Natural color tone
  const mat = new THREE.LineBasicMaterial({
    color: 0x9c7c63, // soft brown line
    linewidth: 1.2,
    transparent: true,
    opacity: 0.95
  });

  const lines = [
    [[-1.3, -1.5, 0.1], [-0.4, -0.2, 0.1], [0.3, 0.4, 0.1]], // Life
    [[-1.0, 0.0, 0.1], [0.2, 0.3, 0.1], [1.1, 0.4, 0.1]],   // Head
    [[-1.0, 0.6, 0.1], [0.4, 0.8, 0.1], [1.1, 0.9, 0.1]],   // Heart
    [[0.0, -1.8, 0.1], [0.1, -0.5, 0.1], [0.0, 1.2, 0.1]],  // Fate
  ];

  for (const pts of lines) {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(100));
    const line = new THREE.Line(geo, mat);
    scene.add(line);
  }

  console.log("🪶 Natural palm lines applied to 3D surface.");
}
