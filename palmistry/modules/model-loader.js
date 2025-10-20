// modules/model-loader.js
// Lightweight ONNX Runtime Web loader (optional; wire when you add a model)
let ortReady = null;

export async function loadOrt() {
  if (ortReady) return ortReady;
  ortReady = new Promise((ok, err) => {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js';
    s.onload = () => ok(window.ort);
    s.onerror = err;
    document.head.appendChild(s);
  });
  return ortReady;
}

export async function loadModel(modelUrl = './models/palmnet_v1.onnx') {
  const ort = await loadOrt();
  return await ort.InferenceSession.create(modelUrl, { executionProviders: ['wasm'] });
}

/** Example run (you must build the input tensor) */
export async function runModel(session, feeds) {
  // feeds: { inputName: new ort.Tensor('float32', data, dims) }
  return await session.run(feeds);
}
