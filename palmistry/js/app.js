export async function initApp() {
  const sides = ["left", "right"];
  const ctx = {};
  for (const side of sides) {
    const video = document.getElementById(`vid${capitalize(side)}`);
    const canvas = document.getElementById(`canvas${capitalize(side)}`);
    const c = canvas.getContext("2d");

    document.getElementById(`startCam${capitalize(side)}`).addEventListener("click", async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
      } catch (err) {
        document.getElementById("status").textContent = "💢 Camera Error: " + err.message;
      }
    });

    document.getElementById(`capture${capitalize(side)}`).addEventListener("click", () => {
      c.drawImage(video, 0, 0, canvas.width, canvas.height);
    });

    ctx[side] = { video, canvas, ctx: c };
  }
  return ctx;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
