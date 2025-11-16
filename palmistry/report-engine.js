console.log("⚡ Report Engine Loaded V51");

// GLOBAL DATA STORAGE
let FINAL_PALM_DATA = {
    lines: {},
    aura: {},
    chakra: {},
    user: {}
};


// ===============================
// MAIN ENTRY
// ===============================
window.generateFullPalmReport = function (canvas) {

    FINAL_PALM_DATA.user = userData;

    FINAL_PALM_DATA.lines = detectPalmLines(canvas);
    FINAL_PALM_DATA.aura  = generateAuraField(FINAL_PALM_DATA.lines);
    FINAL_PALM_DATA.chakra = generateChakraPower(FINAL_PALM_DATA.aura);

    const report = buildFinalReport(FINAL_PALM_DATA);

    document.getElementById("output").innerHTML = report;
};


// ===============================
// PALM LINE DETECTION (TEMPORARY AI)
// ===============================
function detectPalmLines(canvas) {
    return {
        life: randomStrength(),
        head: randomStrength(),
        heart: randomStrength(),
        fate: randomStrength(),
        sun: randomStrength(),
        mercury: randomStrength(),
        venus: randomStrength(),
        health: randomStrength()
    };
}

function randomStrength() {
    return Math.floor(65 + Math.random() * 35);
}


// ===============================
//  AURA — 8 ENERGY RAYS
// ===============================
function generateAuraField(l) {
    return {
        vitality: (l.life + l.health)/2 | 0,
        intellect: (l.head + l.mercury)/2 | 0,
        emotion:  (l.heart + l.venus)/2 | 0,
        destiny:  (l.fate + l.sun)/2 | 0,
        communication: l.mercury,
        creativity: l.sun,
        intuition: (l.sun + l.venus)/2 | 0,
        spirituality: (l.life + l.fate)/2 | 0
    };
}


// ===============================
// CHAKRA MAPPING
// ===============================
function generateChakraPower(a) {
    return {
        root: a.vitality,
        sacral: a.emotion,
        solar: a.intellect,
        heart: a.emotion,
        throat: a.communication,
        thirdEye: a.intuition,
        crown: a.spirituality
    };
}


// ===============================
// FINAL REPORT
// ===============================
function buildFinalReport(d) {

    const u = d.user;
    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    return `
<h2>🧬 Complete Palmistry AI Report — THE SEED · V51</h2>

<h3>👤 Personal Profile</h3>
Name: ${u.name}<br>
Gender: ${u.gender}<br>
DOB: ${u.dob}<br>
Country: ${u.country}<br>
Hand Scanned: ${u.hand}<br><br>

<h3>🌈 Aura Field</h3>
Vitality: ${a.vitality}%<br>
Emotion: ${a.emotion}%<br>
Intellect: ${a.intellect}%<br>
Destiny: ${a.destiny}%<br>
Communication: ${a.communication}%<br>
Intuition: ${a.intuition}%<br>
Creativity: ${a.creativity}%<br>
Spirituality: ${a.spirituality}%<br><br>

<h3>🕉 Chakra Power</h3>
Root: ${c.root}%<br>
Sacral: ${c.sacral}%<br>
Solar Plexus: ${c.solar}%<br>
Heart: ${c.heart}%<br>
Throat: ${c.throat}%<br>
Third Eye: ${c.thirdEye}%<br>
Crown: ${c.crown}%<br><br>

<h3>✋ Palm Lines</h3>
Life Line: ${l.life}%<br>
Head Line: ${l.head}%<br>
Heart Line: ${l.heart}%<br>
Fate Line: ${l.fate}%<br>
Sun Line: ${l.sun}%<br>
Mercury Line: ${l.mercury}%<br>
Venus Influence: ${l.venus}%<br>
Health Line: ${l.health}%<br><br>

<h3>📘 Deep Reading Summary</h3>
${generateDeepText(d)}
`;
}


// ===============================
// 2000–3000 WORD TEXT
// (I WILL EXPAND IF YOU SAY "WRITE FULL VERSION")
// ===============================
function generateDeepText() {
    return `
Your palm reflects strong life energy, balanced emotions, 
and a deep spiritual intuition...
(Full 3000-word version coming next — tell me.)`;
}
