// modules/analyzer.js
let worker;

export async function run(imageData) {
  // if heavy: delegate to worker
  if (!worker) {
    worker = new Worker('./workers/analyzer.worker.js', { type:'module' });
  }
  const payload = { kind:'analyze', width: imageData.width, height: imageData.height, data: imageData.data.buffer };
  const res = await post(worker, payload, [imageData.data.buffer]);
  return res; // {confidence, lines:{...}}
}

function post(w, msg, transfer=[]) {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).slice(2);
    const onMsg = e => { if (e.data?.id===id) { w.removeEventListener('message', onMsg); resolve(e.data.result); } };
    const onErr = err => { w.removeEventListener('error', onErr); reject(err); };
    w.addEventListener('message', onMsg); w.addEventListener('error', onErr, { once:true });
    w.postMessage({ ...msg, id }, transfer);
  });
}
