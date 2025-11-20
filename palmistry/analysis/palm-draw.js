// THE SEED · Palm Line Overlay Renderer V8.0
// Color-coded 8 major palm lines drawn perfectly aligned on overlayCanvas

export function drawLines(overlayCanvas, lineData) {

    if (!overlayCanvas || !lineData) return;

    const ctx = overlayCanvas.getContext("2d");
    ctx.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    const COLORS = {
        life:    "#00ff88",
        head:    "#00ccff",
        heart:   "#ff3377",
        fate:    "#ffaa00",
        sun:     "#ffd700",
        mercury: "#33ffdd",
        marriage:"#ff66cc",
        travel:  "#66aaff"
    };

    // Loop through each detected line set
    Object.keys(lineData).forEach(key => {
        const ln = lineData[key];
        if (!ln || !ln.points || ln.points.length < 2) return;

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = COLORS[key] || "#00e5ff";

        ln.points.forEach((pt, i) => {
            if (i === 0)
                ctx.moveTo(pt.x, pt.y);
            else
                ctx.lineTo(pt.x, pt.y);
        });

        ctx.stroke();
    });
}
