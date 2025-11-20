// 🕉️ Sathyadarshana • Colored Palm Lines V1.0
// Draw ONLY the lines in colors – hand stays natural

export function drawLines(overlayCanvas, lines) {
    const ctx = overlayCanvas.getContext("2d");
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    if (!lines) return;

    const colors = {
        life:   "#FFA500", // Orange
        head:   "#0099FF", // Blue
        heart:  "#FF3333", // Red
        fate:   "#B400FF", // Purple
        apollo: "#FFD700", // Yellow
        mercury:"#00FF66", // Green
        mars:   "#CC0000", // Deep Red
        health: "#FFFFFF"  // White
    };

    for (let key in lines) {
        if (!lines[key] || !lines[key].points) continue;

        const line = lines[key];
        ctx.strokeStyle = colors[key] || "#00FFFF";
        ctx.lineWidth = 3;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        ctx.beginPath();
        line.points.forEach((pt, idx) => {
            if (idx === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
    }
}
