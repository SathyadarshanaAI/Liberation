import { detectPalmEdges } from "./edgeLines.js";

document.getElementById("analyzeLeft").onclick = async () => {
  const canvas = document.getElementById("canvasLeft");
  const ctx = canvas.getContext("2d");
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const res = await detectPalmEdges(frame, canvas);

  const msg = res.palmDetected
    ? "ඔයාගේ අත පිරිසිදුව හඳුනා ගන්න ලදි. Calm energy detected."
    : "අත හඳුනා ගන්න බැරි වුණා. කරුණාකර අත නියම ලෙස පෙන්වන්න.";

  const voice = new SpeechSynthesisUtterance(msg);
  voice.lang = "si-LK";
  speechSynthesis.speak(voice);
};
