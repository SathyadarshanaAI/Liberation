export async function renderPalmLines3D(frame, canvas) {
  const ctx = canvas.getContext("2d");
  const img = tf.browser.fromPixels(frame);
  const gray = img.mean(2).toFloat().div(255);
  const edges = await tf.image.sobelEdges(gray);
  const sobel = edges.mean(3);
  const data = await tf.browser.toPixels(sobel);

  const tmp = document.createElement("canvas");
  tmp.width = canvas.width;
  tmp.height = canvas.height;
  const tctx = tmp.getContext("2d");
  const imgData = tctx.createImageData(canvas.width, canvas.height);
  imgData.data.set(data);
  tctx.putImageData(imgData, 0, 0);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(tmp, 0, 0);
  ctx.globalCompositeOperation = "screen";
  ctx.strokeStyle = "#00ffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height / 2, 45, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}
