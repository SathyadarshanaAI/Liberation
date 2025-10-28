import { speak } from "./voice.js";
...
const plainText = box.textContent.slice(0, 300);
speak(`Here is your ${side} hand analysis. ${plainText}`, window.currentLang);
