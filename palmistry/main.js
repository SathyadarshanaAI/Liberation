import './modules/core.js';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(()=>console.log("SW registered ✅"))
    .catch(console.warn);
}
