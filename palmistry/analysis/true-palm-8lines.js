/* ============================================================
   TRUE PALM 8-LINE CORE · V100
   Wrapper for Main Controller
   ============================================================ */

import { detectTruePalm } from "./true-palm-ai.js";
import { extractTrueLines } from "./true-lines-bridge.js";

export async function runTruePalmAI(imageData) {

    const palm = detectTruePalm(imageData);
    const lines = extractTrueLines(palm);

    return { palm, lines };
}
