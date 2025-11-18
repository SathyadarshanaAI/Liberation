/* =====================================================
   THE SEED · Palm AI Bridge
   ===================================================== */

import { detectTrueLines } from "./true-palm-ai.js";

export async function getTruePalmLines(imageData) {
    const r = await detectTrueLines(imageData);

    if (!r.ok) {
        return {
            life:"0.000", head:"0.000", heart:"0.000", fate:"0.000",
            sun:"0.000", mercury:"0.000", mars:"0.000", jupiter:"0.000"
        };
    }

    return r.lines;
}
