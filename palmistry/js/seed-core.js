// Seed Core — V1.3 · User ID Integration + Aura Screen

const canvas = document.getElementById("seedCanvas");
const ctx = canvas.getContext("2d");
let w, h, particles = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// 🌌 Aura Particles
for (let i = 0; i < 160; i++) {
  particles.push({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.8,
    dx: (Math.random() - 0.5) * 0.5,
    dy: (Math.random() - 0.5) * 0.5
  });
}

// ✨ Animate background glow
function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(0, 0, w, h);
  ctx.shadowColor = "#00e5ff";
  ctx.shadowBlur = 8;

  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,255,255,${0.7 + Math.sin(p.x * 0.02) * 0.3})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > w) p.dx *= -1;
    if (p.y < 0 || p.y > h) p.dy *= -1;
  });

  requestAnimationFrame(draw);
}
draw();

// 🗣️ Voice
function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "en-US";
  msg.rate = 1;
  msg.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(msg);
}

// 🧠 Form Handling
document.getElementById("userForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("userID").value.trim();
  const name = document.getElementById("name").value;
  const dob = document.getElementById("dob").value;
  const time = document.getElementById("birthTime").value;
  const place = document.getElementById("birthPlace").value;

  const msg = document.getElementById("msg");
  msg.textContent = `🌟 ${name} (${id}) · Core Active for ${place}`;
  msg.style.textShadow = "0 0 15px #16f0a7";

  speak(`Welcome ${name}. ID ${id} recognized. Core initialized successfully.`);
  document.getElementById("userForm").style.display = "none";

  // 💾 Store for later modules
  localStorage.setItem("userData", JSON.stringify({ id, name, dob, time, place }));
});
