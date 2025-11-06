// lines-3d.js — V24.0 Natural Line Integration Edition
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

export function initPalmLines3D(scene) {
  if (!scene) return;

  // === Natural Line Material ===
  const mat = new THREE.LineBasicMaterial({
    color: 0x9c7c63,      // soft brownish color for natural skin lines
    linewidth: 1.5,
    transparent: true,
    opacity: 0.9
  });

  // === Palm Line Paths (same coordinates, softer curves) ===
  const lines = [
    [[-1.3, -1.5, 0], [-0.4, -0.2, 0], [0.3, 0.4, 0]], // Life
    [[-1.0, 0.0, 0], [0.2, 0.3, 0], [1.1, 0.4, 0]],   // Head
    [[-1.0, 0.6, 0], [0.4, 0.8, 0], [1.1, 0.9, 0]],   // Heart
    [[0.0, -1.8, 0], [0.1, -0.5, 0], [0.0, 1.2, 0]],  // Fate
  ];

  for (const pts of lines) {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)));
    const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(80));
    const line = new THREE.Line(geo, mat);
    scene.add(line);
  }

  console.log("🌿 Natural 3D palm lines added to scene.");
}
