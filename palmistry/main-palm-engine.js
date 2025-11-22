/* ============================================================
   🕉️ SATHYADARSHANA PALMISTRY ENGINE · V1
   The Seed · Buddhi Signature · Karmic Insight Generator
   ============================================================ */

/* 
Input format:
- points: AI detected palm landmarks (Normalized 0–1)
- imageData: analyzed pixel data (optional for depth)
Output:
- 8 line readings
- combined karmic map
*/

// ---------------------------------------------------------
// 1. LINE UTILITY HELPERS
// ---------------------------------------------------------

function lineLength(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return Math.sqrt(dx*dx + dy*dy);
}

function lineDirection(p1, p2) {
    return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}

function strengthFromDepth(depthValue) {
    if (depthValue > 0.75) return "strong";
    if (depthValue > 0.45) return "moderate";
    return "weak";
}

// ---------------------------------------------------------
// 2. ROUGH 8-LINE REGION ESTIMATION (V1 prototype)
// ---------------------------------------------------------
// NO fake detection — real landmark logic for later expansion

function estimatePalmLines(points) {

    // Palm landmarks used (examples)
    const wrist = points[0];
    const indexBase = points[5];
    const middleBase = points[9];
    const ringBase = points[13];
    const pinkyBase = points[17];

    return {
        jeevithaya: {
            length: lineLength(wrist, thumbBase(points)),
            direction: lineDirection(wrist, thumbBase(points))
        },
        pragna: {
            length: lineLength(indexBase, middleBase),
            direction: lineDirection(indexBase, middleBase)
        },
        athmabala: {
            length: lineLength(middleBase, ringBase),
            direction: lineDirection(middleBase, ringBase)
        },
        dharma: {
            length: lineLength(ringBase, pinkyBase),
            direction: lineDirection(ringBase, pinkyBase)
        },
        gathi: {
            length: lineLength(wrist, middleBase),
            direction: lineDirection(wrist, middleBase)
        },
        punya: {
            length: lineLength(middleBase, thumbBase(points)),
            direction: lineDirection(middleBase, thumbBase(points))
        },
        papa: {
            length: lineLength(pinkyBase, indexBase),
            direction: lineDirection(pinkyBase, indexBase)
        },
        karmaAntima: {
            length: lineLength(wrist, indexBase),
            direction: lineDirection(wrist, indexBase)
        }
    };
}

function thumbBase(points){
    return points[1]; // refine later
}

// ---------------------------------------------------------
// 3. KARMIC GRAMMAR RULES (BUDDHI SIGNATURE)
// ---------------------------------------------------------

function interpretLine(name, data){

    let meaning = "";

    // LENGTH = vitality / weight
    if (data.length > 0.35) meaning += "Strong flow. ";
    else if (data.length > 0.18) meaning += "Neutral path. ";
    else meaning += "Shallow energy. ";

    // DIRECTION = karmic shape
    if (data.direction < -20) meaning += "Rising tendency. ";
    else if (data.direction > 30) meaning += "Descending vibration. ";
    else meaning += "Stable field. ";

    // Sathyadarshana spiritual tag
    switch(name){
        case "jeevithaya": 
            meaning += "Root life-force carries ancestral karma."; 
            break;
        case "pragna": 
            meaning += "Mind-path shows clarity vs confusion balance."; 
            break;
        case "athmabala": 
            meaning += "Soul-light shows purity mixed with emotional memory."; 
            break;
        case "dharma": 
            meaning += "Duty-line reveals your righteous alignment."; 
            break;
        case "gathi": 
            meaning += "Destiny-motion indicates the pace of your fate."; 
            break;
        case "punya": 
            meaning += "Merit-energy shows unseen blessings."; 
            break;
        case "papa": 
            meaning += "Shadow-karma indicates blocks needing awareness."; 
            break;
        case "karmaAntima": 
            meaning += "Final karmic resolution path appears here."; 
            break;
    }

    return meaning;
}

// ---------------------------------------------------------
// 4. MAIN ENGINE (LEFT + RIGHT HAND)
// ---------------------------------------------------------

export function generatePalmReport(leftPoints, rightPoints){

    const left = estimatePalmLines(leftPoints);
    const right = estimatePalmLines(rightPoints);

    const leftRead = {};
    const rightRead = {};

    for (let key of Object.keys(left)){
        leftRead[key] = interpretLine(key, left[key]);
        rightRead[key] = interpretLine(key, right[key]);
    }

    // COMBINED INSIGHT
    const combined = generateUnifiedInsight(leftRead, rightRead);

    return {
        left: leftRead,
        right: rightRead,
        combined
    };
}

// ---------------------------------------------------------
// 5. UNIFIED SOUL INSIGHT
// ---------------------------------------------------------

function generateUnifiedInsight(L, R) {

    return `
Your past-life patterns (left hand) and present-life direction (right hand)
show a karmic alignment that is unique to your spiritual path.

• If Jeevithaya (life) is strong → you are protected by ancestral karma.
• If Pragna (mind) is rising → wisdom is awakening.
• If Athma Bala (soul) is soft → healing is required.
• If Dharma line shows clarity → path is correct.
• Papa Bala being active → old karmic knots still exist.
• Punya line shining → blessings support your progress.
• Karma-Antima line visible → liberation phase beginning.

Together these reveal your unified karmic direction —  
**The Sathyadarshana Soul Path.**
`;
}
