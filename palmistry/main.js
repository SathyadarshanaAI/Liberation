// main.js
import EventBus from "./modules/bus.js";
import * as Camera from "./modules/camera.js";
import * as Vision from "./modules/vision.js";
import * as Report from "./modules/report.js";
import Core from "./modules/core.js";

window.addEventListener("DOMContentLoaded", () => {
  console.log("Palmistry app initializing...");
  Core.init();
});
