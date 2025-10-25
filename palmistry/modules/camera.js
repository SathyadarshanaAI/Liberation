import { emit } from './bus.js';
console.log("Camera module active");
emit("module:camera", { ok:true });
