// THE SEED · Clean Draw Layer (No Debug Overlay)
// This file ensures NOTHING is drawn on the canvas.

export function drawLines(canvas, lineData) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
