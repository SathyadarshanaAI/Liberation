/* ---------------------------------------------------------
   THE SEED · Palmistry AI Vision
   line-detect.js — 8-Line Detection Engine (v2.0)
----------------------------------------------------------*/

/*
 palmData = {
   width,
   height,
   mask,
   bbox: { minX, minY, maxX, maxY }
 }
*/

export function detectLines(palmData) {

    const { mask, width, height, bbox } = palmData;

    // Extract palm crop
    const palm = extractRegion(mask, width, height, bbox);

    // 8 MAIN LINES OUTPUT
    const lines = {
        life: detectLifeLine(palm),
        head: detectHeadLine(palm),
        heart: detectHeartLine(palm),
        fate: detectFateLine(palm),
        sun: detectSunLine(palm),
        mercury: detectMercuryLine(palm),
        mars: detectMarsLine(palm),
        manikanda: detectManikanda(palm),

        // Extra (not analyzed yet)
        minor: detectMinorLines(palm),
        symbols: detectSymbols(palm)
    };

    return lines;
}

/* ---------------------------------------------------------
   REGION EXTRACTOR
----------------------------------------------------------*/
function extractRegion(mask, w, h, box) {
    const { minX, minY, maxX, maxY } = box;

    const pw = maxX - minX;
    const ph = maxY - minY;

    const crop = {
        width: pw,
        height: ph,
        data: new Uint8ClampedArray(pw * ph)
    };

    for (let y = minY; y < maxY; y++) {
        for (let x = minX; x < maxX; x++) {
            crop.data[(y - minY) * pw + (x - minX)] = mask[y * w + x];
        }
    }

    return crop;
}

/* ---------------------------------------------------------
   MAIN LINES (PLACEHOLDER ENGINE — AI-ready)
----------------------------------------------------------*/

function detectLifeLine(palm) {
    return {
        confidence: 0.72,
        start: "near thumb",
        curve: "medium-deep",
        length: "long",
        energy: "strong vitality"
    };
}

function detectHeadLine(palm) {
    return {
        confidence: 0.68,
        clarity: "clear",
        direction: "straight",
        focus: "analytical thinking"
    };
}

function detectHeartLine(palm) {
    return {
        confidence: 0.66,
        curve: "slightly curved",
        emotionalNature: "balanced",
        depth: "medium"
    };
}

function detectFateLine(palm) {
    return {
        confidence: 0.60,
        origin: "mid palm",
        careerFlow: "consistent"
    };
}

function detectSunLine(palm) {
    return {
        confidence: 0.55,
        creativity: "high",
        reputation: "growing"
    };
}

function detectMercuryLine(palm) {
    return {
        confidence: 0.52,
        communication: "strong",
        intuition: "active"
    };
}

function detectMarsLine(palm) {
    return {
        confidence: 0.48,
        bravery: "good",
        crisisHandling: "strong"
    };
}

function detectManikanda(palm) {
    return {
        confidence: 0.80,
        spiritualSeal: true,
        meaning: "protection + divine intuition"
    };
}

/* ---------------------------------------------------------
   MINOR LINES (AI-ready stubs)
----------------------------------------------------------*/
function detectMinorLines(palm) {
    return {
        marriage: randomScore(),
        travel: randomScore(),
        health: randomScore(),
        intuition: randomScore()
    };
}

/* ---------------------------------------------------------
   SYMBOL DETECTION (cross, fork, island, stars…)
----------------------------------------------------------*/
function detectSymbols(palm) {
    return {
        crosses: randomScore(),
        stars: randomScore(),
        forks: randomScore(),
        islands: randomScore(),
        breaks: randomScore(),
        grille: randomScore()
    };
}

/* Utility */
function randomScore() {
    return Math.round((Math.random() * 0.8 + 0.2) * 100) / 100;
}
