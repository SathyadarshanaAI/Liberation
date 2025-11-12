// =============================
// 🌌 lines-3d.js — Serenity Render Core (V29.2)
// =============================

// Main 3D Palm Renderer
export async function renderPalmLines3D(frame, canvas) {
  const ctx = canvas.getContext("2d");

  // 🩶 Background cleanup
  ctx.fillStyle = "#f5f5f5";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🪶 Restore palm image
  const imgData = new ImageData(frame.data, frame.width, frame.height);
  ctx.putImageData(imgData, 0, 0);

  // 🔮 Apply subtle glow
  ctx.globalAlpha = 0.25;
  const gradient = ctx.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    50,
    canvas.width / 2,
    canvas.height / 2,
    200
  );
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(1, "#d1d1d1");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = 1.0;

  // 🪄 3D stroke style setup
  const glowColors = [
    "#00e5ff",
    "#ff4081",
    "#ffc107",
    "#7c4dff",
    "#4caf50",
    "#ff5722",
    "#9c27b0",
    "#2196f3",
  ];
  const lines = getPalmLineCoords(canvas);

  // 🧠 Draw each major palm line
  for (let i = 0; i < lines.length; i++) {
    const path = lines[i];
    const color = glowColors[i % glowColors.length];
    draw3DLine(ctx, path, color);
  }

  // 🌟 Label each line
  ctx.font = "12px Segoe UI";
  ctx.fillStyle = "#111";
  ctx.textAlign = "center";
  const labels = [
    "Life",
    "Heart",
    "Head",
    "Fate",
    "Sun",
    "Mercury",
    "Health",
    "Marriage",
  ];
  for (let i = 0; i < lines.length; i++) {
    const p = lines[i][Math.floor(lines[i].length / 2)];
    ctx.fillText(`${labels[i]} Line`, p[0], p[1] - 5);
  }
}

// Draw smooth 3D glowing curve
function draw3DLine(ctx, path, color) {
  const grad = ctx.createLinearGradient(path[0][0], path[0][1], path[1][0], path[1][1]);
  grad.addColorStop(0, color);
  grad.addColorStop(1, "#fff");

  ctx.beginPath();
  ctx.moveTo(path[0][0], path[0][1]);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i][0], path[i][1]);
  }
  ctx.strokeStyle = grad;
  ctx.lineWidth = 2.5;
  ctx.shadowBlur = 12;
  ctx.shadowColor = color;
  ctx.stroke();
  ctx.closePath();
}

// Generate pseudo palm-line coordinate paths (AI placeholder)
function getPalmLineCoords(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  return [
    // Life Line
    [
      [w * 0.3, h * 0.8],
      [w * 0.25, h * 0.6],
      [w * 0.35, h * 0.4],
      [w * 0.45, h * 0.2],
    ],
    // Heart Line
    [
      [w * 0.15, h * 0.4],
      [w * 0.35, h * 0.35],
      [w * 0.55, h * 0.38],
      [w * 0.75, h * 0.35],
    ],
    // Head Line
    [
      [w * 0.2, h * 0.5],
      [w * 0.4, h * 0.55],
      [w * 0.65, h * 0.5],
    ],
    // Fate Line
    [
      [w * 0.5, h * 0.9],
      [w * 0.5, h * 0.7],
      [w * 0.45, h * 0.5],
      [w * 0.45, h * 0.3],
    ],
    // Sun Line
    [
      [w * 0.6, h * 0.85],
      [w * 0.65, h * 0.6],
      [w * 0.65, h * 0.35],
    ],
    // Mercury Line
    [
      [w * 0.75, h * 0.85],
      [w * 0.78, h * 0.6],
      [w * 0.8, h * 0.4],
    ],
    // Health Line
    [
      [w * 0.35, h * 0.9],
      [w * 0.55, h * 0.65],
      [w * 0.65, h * 0.45],
    ],
    // Marriage Line
    [
      [w * 0.75, h * 0.25],
      [w * 0.8, h * 0.22],
    ],
  ];
}
