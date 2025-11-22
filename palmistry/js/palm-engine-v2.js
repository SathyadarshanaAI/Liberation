/* ============================================================
   🕉️ SATHYADARSHANA PALMISTRY ENGINE · V2 (BUDDHI SIGNATURE)
   The Seed · Karmic Insight Engine + Line Depth Analyzer
   ============================================================ */

/*
INPUTS:
- leftPoints:   AI landmarks of left hand (0–1 normalized)
- rightPoints:  AI landmarks of right hand
- leftImage:    ImageData or pixel matrix (optional)
- rightImage:   same

OUTPUT:
- Detailed 8-line karmic readings (Left + Right)
- Depth, breaks, forks, chains
- Combined Sathyadarshana Soul Path (Past + Present)
*/


/* ------------------------------------------------------------
   1. BASIC HELPERS
------------------------------------------------------------ */

function dist(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy);
}

function angle(a, b) {
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}

function avg(values) {
    return values.reduce((a, b) => a + b, 0) / values.length;
}

/* ------------------------------------------------------------
   2. LINE SEGMENT ESTIMATION (V2 ENHANCED)
------------------------------------------------------------ */

// Using key base points from MediaPipe:
function palmBases(points) {
    return {
        wrist: points[0],
        thumbBase: points[1],
        indexBase: points[5],
        middleBase: points[9],
        ringBase: points[13],
        pinkyBase: points[17]
    };
}

function extractBasicLines(points) {
    const P = palmBases(points);

    return {
        jeevithaya:     { p1: P.wrist,      p2: P.thumbBase },
        pragna:         { p1: P.indexBase,  p2: P.middleBase },
        athmabala:      { p1: P.middleBase, p2: P.ringBase },
        dharma:         { p1: P.ringBase,   p2: P.pinkyBase },
        gathi:          { p1: P.wrist,      p2: P.middleBase },
        punya:          { p1: P.middleBase, p2: P.thumbBase },
        papa:           { p1: P.pinkyBase,  p2: P.indexBase },
        karmaAntima:    { p1: P.wrist,      p2: P.indexBase }
    };
}

/* ------------------------------------------------------------
   3. DEPTH ESTIMATION USING IMAGE DATA
------------------------------------------------------------ */

function estimateDepth(line, imageData) {
    if (!imageData) return Math.random() * 0.6 + 0.3; // fallback random softness

    // SAMPLE pixel values along line (prototype)
    let samples = [];
    const steps = 20;

    for (let i = 0; i < steps; i++) {
        const x = Math.floor(line.p1.x*imageData.width  + (line.p2.x-line.p1.x)*i/steps*imageData.width);
        const y = Math.floor(line.p1.y*imageData.height + (line.p2.y-line.p1.y)*i/steps*imageData.height);

        const idx = (y*imageData.width + x)*4;
        const darkness = 255 - imageData.data[idx]; // R channel
        samples.push(darkness/255);
    }

    return Math.min(1, Math.max(0, avg(samples)));
}

function depthLabel(d) {
    if (d > 0.75) return "deep";
    if (d > 0.50) return "medium";
    if (d > 0.30) return "light";
    return "faint";
}

/* ------------------------------------------------------------
   4. ARTIFACT DETECTION (BREAKS, FORKS, CHAINS)
------------------------------------------------------------ */

function detectBreaks(line, imageData) {
    if (!imageData) return false;
    return Math.random() < 0.2; // prototype logic
}

function detectForks(line, imageData) {
    if (!imageData) return false;
    return Math.random() < 0.15;
}

function detectChains(line, imageData) {
    if (!imageData) return false;
    return Math.random() < 0.10;
}

/* ------------------------------------------------------------
   5. BUILD SATHYADARSHANA LINE OBJECT
------------------------------------------------------------ */

function buildLineData(name, line, img) {

    const length = dist(line.p1, line.p2);
    const direction = angle(line.p1, line.p2);
    const depth = estimateDepth(line, img);

    const breaks = detectBreaks(line, img);
    const forks = detectForks(line, img);
    const chains = detectChains(line, img);

    return {
        name,
        length,
        direction,
        depth,
        depthLabel: depthLabel(depth),
        breaks,
        forks,
        chains
    };
}

/* ------------------------------------------------------------
   6. INTERPRETATION ENGINE (V2)
------------------------------------------------------------ */

function interpretLineV2(L) {

    let t = "";

    // LENGTH influence
    if (L.length > 0.35)  t += "Strong energy field. ";
    else if (L.length > 0.20) t += "Steady but neutral force. ";
    else t += "Low karmic intensity. ";

    // DEPTH
    if (L.depthLabel === "deep") t += "Deep karmic imprint. ";
    if (L.depthLabel === "medium") t += "Moderate karmic flow. ";
    if (L.depthLabel === "light") t += "Gentle influence. ";
    if (L.depthLabel === "faint") t += "Subtle karmic echo. ";

    // DIRECTION
    if (L.direction < -20) t += "Rising spiritual direction. ";
    else if (L.direction > 25) t += "Descending emotional influence. ";
    else t += "Stable centre-field. ";

    // Artifacts
    if (L.breaks) t += "Breaks indicate past-life lesson resurfacing. ";
    if (L.forks)  t += "Fork suggests dual-path destiny. ";
    if (L.chains) t += "Chain pattern shows repeating karma cycles. ";

    // SATHYADARSHANA MEANING (main spiritual identity)
    switch(L.name){
        case "jeevithaya":
            t += "Root Jeevithaya Rekha carries ancestral vitality and life-force direction.";
            break;
        case "pragna":
            t += "Pragna Rekha reveals mental clarity, wisdom flow, and shadow-thoughts.";
            break;
        case "athmabala":
            t += "Athma Bala Rekha shows soul purity, emotional karma and inner wounds.";
            break;
        case "dharma":
            t += "Dharma Rekha expresses truth-alignment and righteous duty.";
            break;
        case "gathi":
            t += "Gathi Vinyasa reveals movement of destiny and fate pacing.";
            break;
        case "punya":
            t += "Punya Rekha reveals blessings, merit, unseen protection.";
            break;
        case "papa":
            t += "Papa Bala Rekha indicates shadow karma, obstacles and karmic weight.";
            break;
        case "karmaAntima":
            t += "Karma-Antima line shows final karmic lessons and liberation path.";
            break;
    }

    return t;
}

/* ------------------------------------------------------------
   7. UNIFIED SOUL PATH (LEFT + RIGHT HANDS)
------------------------------------------------------------ */

function combinedReading(left, right){

    return `
Your left hand (past karma) shows patterns of:
- ${summary(left)}

Your right hand (present karma) shows:
- ${summary(right)}

Together they reveal:

• If Life (Jeevithaya) is strong → karmic protection surrounds you.  
• If Mind (Pragna) rises → wisdom awakening phase.  
• If Soul (Athma Bala) is soft → healing from emotional memory needed.  
• If Dharma Rekha straightens → correct life-path emerging.  
• If Papa Bala active → obstacles from old samskara.  
• If Punya Rekha bright → blessings accelerating progress.  
• If Karma-Antima visible → liberation cycle beginning.

This forms the **Sathyadarshana Unified Soul Path**.
`;
}

function summary(obj){
    return Object.keys(obj).map(k => `${k}: ${obj[k].depthLabel}`).join(", ");
}

/* ------------------------------------------------------------
   8. MAIN ENGINE EXPORT
------------------------------------------------------------ */

export function generatePalmReportV2(leftPts, rightPts, leftImg, rightImg){

    const rawLeft = extractBasicLines(leftPts);
    const rawRight = extractBasicLines(rightPts);

    const left = {};
    const right = {};

    for (let name of Object.keys(rawLeft)){
        left[name] = buildLineData(name, rawLeft[name], leftImg);
        right[name] = buildLineData(name, rawRight[name], rightImg);
    }

    const finalLeft = {};
    const finalRight = {};

    for (let name of Object.keys(left)){
        finalLeft[name] = interpretLineV2(left[name]);
    }
    for (let name of Object.keys(right)){
        finalRight[name] = interpretLineV2(right[name]);
    }

    return {
        left: finalLeft,
        right: finalRight,
        combined: combinedReading(left, right)
    };
}
