// Very fast placeholder heuristic; replace with ONNX/WASM later
self.onmessage = async e => {
  const { id, kind, width, height, data } = e.data;
  if (kind !== 'analyze') return;
  const pix = new Uint8ClampedArray(data);
  let sum=0, n=0; for (let i=0;i<pix.length;i+=24){ sum+=pix[i]+pix[i+1]+pix[i+2]; n++; }
  const conf = Math.min(99, Math.max(60, (sum/n)/4));
  const base = [80,74,70,60,66,75,55].map(v=>Math.min(100, Math.round(v + (conf-80)/2)));
  const result = {
    confidence: Number(conf.toFixed(1)),
    lines: { heart:base[0], mind:base[1], life:base[2], fate:base[3], success:base[4], health:base[5], marriage:base[6] }
  };
  self.postMessage({ id, result });
};
