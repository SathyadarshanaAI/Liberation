// app.js (ESM)
import * as UI from './modules/ui.js';
import * as Store from './modules/storage.js';
import * as Camera from './modules/camera.js';
import * as Analyzer from './modules/analyzer.js';
import * as PDF from './modules/pdf.js';
import { Updater } from './modules/updater.js';

const APP_VERSION = '4.6.0';

(async function boot() {
  UI.init();
  Store.init({ appVersion: APP_VERSION });

  // self-update (non-blocking)
  const updater = new Updater({
    versionUrl: './config/version.json',         // or https://<user>.github.io/.../version.json
    featuresUrl: './config/features.json',
    currentVersion: APP_VERSION,
  });
  updater.check().catch(console.warn);

  // camera hooks
  UI.on('startCamera', Camera.start);
  UI.on('switchCam', Camera.switch);
  UI.on('flash', Camera.torch);
  UI.on('capture', () => UI.draw(Camera.capture()));

  // analyze
  UI.on('analyze', async () => {
    const frame = UI.getImageData();
    const result = await Analyzer.run(frame);     // worker/wasm inside
    UI.renderScores(result);
    Store.saveResult(result, UI.getThumb());
  });

  // pdf
  UI.on('pdf', () => PDF.make(UI.getThumb(), Store.lastResult()));

  // pair summary
  UI.on('pairSummary', () => UI.renderPairSummary(Store.latestPairWithBoth()));
})();
