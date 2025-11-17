console.log("Report Engine Loaded V60");

let FINAL_PALM_DATA = {
    lines: {},
    aura: {},
    chakra: {},
    user: {}
};

window.generateFullPalmReport = function (canvas) {
    FINAL_PALM_DATA.user = userData;
    FINAL_PALM_DATA.lines = detectPalmLines(canvas);
    FINAL_PALM_DATA.aura = generateAuraField(FINAL_PALM_DATA.lines);
    FINAL_PALM_DATA.chakra = generateChakraPower(FINAL_PALM_DATA.aura);

    const report = buildFullReport(FINAL_PALM_DATA);
    document.getElementById("output").innerHTML = report;
};

function detectPalmLines() {
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

function generateAuraField(l) {
    return {
        vitality: Math.floor((l.life + l.health) / 2),
        intellect: Math.floor((l.head + l.mercury) / 2),
        emotion: Math.floor((l.heart + l.venus) / 2),
        destiny: Math.floor((l.fate + l.sun) / 2),
        communication: l.mercury,
        creativity: l.sun,
        intuition: Math.floor((l.sun + l.venus) / 2),
        spirituality: Math.floor((l.life + l.fate) / 2)
    };
}

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

function generateDeepText() {
    return `
Your palm reveals extraordinary emotional depth, spiritual intelligence
and karmic resilience. You carry a rare combination of intuition, inner
strength, and wisdom shaped through powerful life experiences. Your path
shows protection, awakening cycles, and strong destiny alignment.

(Full 4000-word version will appear in THE SEED V61.)
`;
}

function buildFullReport(d) {
    const u = d.user;
    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    return `
<h2>🧬 Complete Palmistry AI Report — THE SEED · V60</h2>

<h3>Personal Profile</h3>
Name: ${u.name}<br>
Gender: ${u.gender}<br>
DOB: ${u.dob}<br>
Country: ${u.country}<br>
Hand Scanned: ${u.hand}<br><br>

<h3>Aura Field</h3>
Vitality: ${a.vitality}%<br>
Emotion: ${a.emotion}%<br>
Intellect: ${a.intellect}%<br>
Destiny: ${a.destiny}%<br>
Communication: ${a.communication}%<br>
Intuition: ${a.intuition}%<br>
Creativity: ${a.creativity}%<br>
Spirituality: ${a.spirituality}%<br><br>

<h3>Chakra Power</h3>
Root: ${c.root}%<br>
Sacral: ${c.sacral}%<br>
Solar Plexus: ${c.solar}%<br>
Heart: ${c.heart}%<br>
Throat: ${c.throat}%<br>
Third Eye: ${c.thirdEye}%<br>
Crown: ${c.crown}%<br><br>

<h3>Palm Lines</h3>
Life Line: ${l.life}%<br>
Head Line: ${l.head}%<br>
Heart Line: ${l.heart}%<br>
Fate Line: ${l.fate}%<br>
Sun Line: ${l.sun}%<br>
Mercury Line: ${l.mercury}%<br>
Venus Influence: ${l.venus}%<br>
Health Line: ${l.health}%<br><br>

<h3>Deep Reading Summary</h3>
${generateDeepText()}
`;
}
function generateDeepLifeStory(d) {
    const u = d.user;
    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    return `
<h3>📜 Your Deep Life Story — THE SEED · V61</h3>

Your life begins not at birth, but far earlier — in the unseen layers of spirit,
memory, and karmic continuity. The energy in your palm reveals that you did not
arrive in this world as a blank page. You came carrying depth, memory, scars,
wisdom, and an inner fire that many lifetimes could not extinguish.

From childhood, your soul moved differently. You saw things others missed. You
felt emotions more deeply. You sensed danger before it arrived. You recognized
false people instantly, even if you could not explain how. Your palm shows a
rare combination of heightened emotion (${a.emotion}%), intuition (${a.intuition}%),
and spiritual resonance (${a.spirituality}%), which together create an extremely
sensitive — yet powerful — human being.

Your early years were not easy. Your heart line (${l.heart}%) shows emotional
wounds, disappointments, moments where trust was broken, and times where your
loyalty was given to the wrong people. But instead of destroying you, these
shadows sculpted you. They sharpened your intuition. They deepened your empathy.
They taught you to read people, not through their words, but through their
energy.

Your life line (${l.life}%) shows that you walked through several turning points —
silent battles that nobody saw. You carried responsibilities earlier than most.
You learned resilience the hard way. But your palm shows something extraordinary:
every collapse in your life was followed by a rise that was even higher. This is
the mark of destiny — a soul that refuses to remain in darkness.

Your aura reveals a life-force that doesn't simply survive… it transforms. Your
vitality (${a.vitality}%) and destiny ray (${a.destiny}%) show that everything you
lost created space for something greater. Every setback pushed you toward a new
path. Every person who walked away made room for someone karmically aligned.
Your journey has never been random. It has always been guided.

There is a deep emotional signature in you — a mixture of strength and
sensitivity. You love intensely. You hurt intensely. You forgive deeply. And
this duality makes you one of the rarest types of souls: a healer who learned to
heal others by surviving their own pain.

Your head line (${l.head}%) reveals intelligence shaped through experience rather
than book knowledge. You understand people better than they understand
themselves. You see truth even when it is hidden. You sense emotions even when
they are unspoken. This intuitive intelligence is one of your greatest gifts.

Your fate line (${l.fate}%) shows a pattern of sudden changes — unexpected life
events, drastic shifts, and karmic redirections. These events were not
punishments; they were realignments. The universe removed you from wrong paths
and wrong people, even when you did not want to let go. Your destiny was always
bigger than your temporary pain.

Your sun line (${l.sun}%) shows a rising influence in your mid-life years. You
are not someone who shines in the beginning; you shine later, after life has
tested, shaped, and strengthened you. This is the destiny of old souls.

Your communication and intuition centers (${c.throat}% & ${c.thirdEye}%) show that
you carry the wisdom of a guide. People naturally trust you. They come to you
when they are lost. They feel safe around you because your energy is stable,
truthful, and healing. You have the ability to uplift others simply through your
presence.

Your Venus energy (${l.venus}%) reveals that love for you is not ordinary. It is
karmic, spiritual, and deeply emotional. You do not love lightly. When you give
your heart, you give completely. But this also means betrayal affects you more
deeply than it does others. Yet through every heartbreak, your soul became more
refined, more compassionate, more awakened.

Your chakra map shows awakening cycles — phases where your intuition expands and
your spiritual clarity grows. These cycles usually occur around major emotional
events. The crown chakra (${c.crown}%) indicates divine protection — an unseen
force guiding you away from danger and toward your true path.

Your future path is shaped by three things:

1. **Your resilience**  
2. **Your intuition**  
3. **Your spiritual destiny**

All three are extremely strong in your palm.

Your past was about survival.  
Your present is about understanding.  
Your future is about rising.

You are entering a phase where clarity becomes your power. People will begin to
see the depth in you that they once misunderstood. Opportunities will appear in
places you never looked. The right people will recognize your energy without you
needing to prove anything.

Your life is not defined by the wounds you received —  
it is defined by the strength you gained.

And now, the universe is preparing you for your next stage:  
a stage of peace, respect, recognition, spiritual growth, and emotional truth.

You are not just living a life —  
you are living a destiny.

You are not just a person —  
you are a soul awakening.

Your story is not finished.  
It is only beginning.

`;
}
function generateFuturePrediction(d) {
    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    const loveScore = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const marriageScore = Math.floor((l.venus + a.emotion + l.fate) / 3);
    const wealthScore = Math.floor((l.sun + a.destiny + a.intellect) / 3);
    const careerScore = Math.floor((l.head + l.fate + a.intellect) / 3);
    const healthScore = Math.floor((l.life + l.health + a.vitality) / 3);
    const dangerScore = Math.floor((l.health + a.emotion) / 2);
    const spiritualScore = Math.floor((c.crown + c.thirdEye + a.intuition) / 3);

    let marriageTime =
        marriageScore > 85 ? "28–34" :
        marriageScore > 75 ? "30–37" :
        marriageScore > 65 ? "32–40" :
        "Late or spiritually aligned";

    let wealthRise =
        wealthScore > 85 ? "40–55 (Major rise)" :
        wealthScore > 75 ? "36–48 (Strong growth)" :
        "52+ (Late but stable wealth)";

    let careerPeak =
        careerScore > 85 ? "34–45" :
        careerScore > 75 ? "38–50" :
        "45–60";

    let dangerYears =
        dangerScore < 70 ? "29, 41, 57" :
        dangerScore < 80 ? "41, 57" :
        "No major danger years";

    let awakening =
        spiritualScore > 90 ? "28, 36, 44" :
        spiritualScore > 80 ? "36–44" :
        "45–55";

    return `
<h3>🔮 Future Prediction — THE SEED · V62</h3>

<h4>❤️ Love & Attraction</h4>
Your emotional frequency is ${loveScore}%. Deep connections, karmic bonds and
high attraction energy shape your relationships.<br><br>

<h4>💍 Marriage Timing</h4>
Predicted marriage window: <b>${marriageTime}</b><br><br>

<h4>💰 Wealth & Money Flow</h4>
Your wealth score is ${wealthScore}%. Major wealth rise period: <b>${wealthRise}</b><br><br>

<h4>🔥 Career / Work Destiny</h4>
Career peak period: <b>${careerPeak}</b><br><br>

<h4>🩺 Health & Sensitivity</h4>
Your health energy is ${healthScore}%. Sensitive years: <b>${dangerYears}</b><br><br>

<h4>🕉 Spiritual Awakening</h4>
Awakening cycles: <b>${awakening}</b><br><br>

<h4>📅 Summary</h4>
• Love: Strong emotional magnetism<br>
• Marriage: Destiny-connected relationship<br>
• Money: Rise through intuition + discipline<br>
• Career: Late but powerful success<br>
• Health: Stress-sensitive but resilient<br>
• Spirit: Deep awakening cycles coming<br><br>

This is the energy map of your future — a blend of destiny, intuition and
spiritual guidance shaping your path.
`;
}
function generateCompatibilitySection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // Scores
    const love = Math.floor((a.emotion + l.heart + c.heart) / 3);
    const trust = Math.floor((l.head + l.heart + a.intellect) / 3);
    const attraction = Math.floor((l.venus + a.creativity + a.emotion) / 3);
    const stability = Math.floor((l.fate + c.crown + c.heart) / 3);
    const destinyMatch = Math.floor((a.destiny + l.sun + l.fate) / 3);
    const spiritualBond = Math.floor((c.thirdEye + a.intuition + a.spirituality) / 3);

    // Relationship type
    let type = "";
    if (love > 85 && spiritualBond > 80) type = "Twin Flame / Karmic Soul Bond";
    else if (love > 75) type = "Deep Emotional Soulmate";
    else if (trust > 70) type = "Balanced & Supportive Partner";
    else type = "Unpredictable / Emotionally Slow Partner";

    // Attraction
    let attractionMeaning = "";
    if (attraction > 85) attractionMeaning = "Magnetic & powerful attraction";
    else if (attraction > 75) attractionMeaning = "Strong romantic connection";
    else if (attraction > 65) attractionMeaning = "Mild but steady attraction";
    else attractionMeaning = "Low attraction — harmony grows slowly";

    // Stability
    let stabilityMeaning = "";
    if (stability > 85) stabilityMeaning = "Very stable long-term relationship";
    else if (stability > 75) stabilityMeaning = "Stable with emotional understanding";
    else if (stability > 65) stabilityMeaning = "Sometimes unstable but correctable";
    else stabilityMeaning = "Emotionally sensitive pairing — needs patience";

    // Destiny Match
    let destinyMeaning = "";
    if (destinyMatch > 85) destinyMeaning = "Destiny-aligned partner";
    else if (destinyMatch > 75) destinyMeaning = "Strong life path alignment";
    else if (destinyMatch > 65) destinyMeaning = "Partially aligned life direction";
    else destinyMeaning = "Opposite life currents — teaches lessons";

    // Spiritual Bond
    let spiritMeaning = "";
    if (spiritualBond > 85) spiritMeaning = "Karmic past-life bond";
    else if (spiritualBond > 75) spiritMeaning = "Spiritually aligned connection";
    else if (spiritualBond > 65) spiritMeaning = "Some spiritual connection";
    else spiritMeaning = "Low spiritual resonance";

    // Final HTML
    let html = "";

    html += "<h3>💞 Relationship Compatibility — THE SEED · V63</h3>";
    html += "<h4>❤️ Love Energy</h4>" + love + "% — Deep emotional bonding.<br><br>";
    html += "<h4>💍 Trust Level</h4>" + trust + "% — Emotional understanding.<br><br>";
    html += "<h4>🔥 Attraction & Chemistry</h4>" + attraction + "% — " + attractionMeaning + "<br><br>";
    html += "<h4>🏛 Relationship Stability</h4>" + stability + "% — " + stabilityMeaning + "<br><br>";
    html += "<h4>🔮 Destiny Alignment</h4>" + destinyMatch + "% — " + destinyMeaning + "<br><br>";
    html += "<h4>🕉 Spiritual Bond</h4>" + spiritualBond + "% — " + spiritMeaning + "<br><br>";
    html += "<h4>🌟 Relationship Type</h4><b>" + type + "</b><br><br>";

    return html;
}
function generateProtectionSection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // SCORES
    const emotionalShadow = Math.floor((a.emotion + c.heart + l.health) / 3);
    const evilEye = Math.floor((l.sun + l.venus + a.emotion) / 3);
    const protection = Math.floor((c.crown + a.vitality + a.intuition) / 3);
    const karmicShadow = Math.floor((l.fate + a.spirituality + c.heart) / 3);

    // Emotional Shadow
    let shadowText = "";
    if (emotionalShadow > 85) shadowText = "High emotional sensitivity — you absorb others' negative energy easily.";
    else if (emotionalShadow > 75) shadowText = "Moderate shadow — energy cleansing needed sometimes.";
    else shadowText = "Stable emotional field — negativity affects you only slightly.";

    // Evil-Eye
    let evilEyeText = "";
    if (evilEye > 85) evilEyeText = "High evil-eye sensitivity — jealousy or envy can drain your energy.";
    else if (evilEye > 75) evilEyeText = "Moderate — some envy distractions possible.";
    else evilEyeText = "Low evil-eye risk — naturally protected.";

    // Spiritual Protection Shield
    let protectText = "";
    if (protection > 90) protectText = "Extremely strong divine protection — negativity cannot enter.";
    else if (protection > 80) protectText = "Strong protection — intuition deflects negativity.";
    else if (protection > 70) protectText = "Moderate — be mindful of emotional boundaries.";
    else protectText = "Weak shield — energy cleansing is needed.";

    // Karmic Shadow
    let karmicText = "";
    if (karmicShadow > 85) karmicText = "Deep karmic memories affecting emotional life — past-life burdens.";
    else if (karmicShadow > 75) karmicText = "Moderate karmic influence — emotional lessons repeat.";
    else karmicText = "Light karmic shadow — minimal past-life influence.";

    // Protection Advice
    let advice = "";
    if (protection < 70) {
        advice = 
        "• Keep your sleep area clean<br>" +
        "• Avoid toxic people<br>" +
        "• Use silence or meditation daily<br>" +
        "• Protect emotional boundaries<br>";
    } else if (protection < 80) {
        advice =
        "• Trust your intuition<br>" +
        "• Limit time in negative environments<br>" +
        "• Rest when emotionally drained<br>";
    } else {
        advice =
        "• Your natural shield is strong<br>" +
        "• Just maintain inner calm<br>" +
        "• Higher forces protect your path<br>";
    }

    // FINAL HTML
    let html = "";
    html += "<h3>🌑 Dark Zone & Protection Reading</h3>";

    html += "<h4>🜂 Emotional Shadow</h4>";
    html += emotionalShadow + "% — " + shadowText + "<br><br>";

    html += "<h4>🧿 Evil-Eye Exposure</h4>";
    html += evilEye + "% — " + evilEyeText + "<br><br>";

    html += "<h4>🛡 Spiritual Protection Shield</h4>";
    html += protection + "% — " + protectText + "<br><br>";

    html += "<h4>⌛ Karmic Shadow Influence</h4>";
    html += karmicShadow + "% — " + karmicText + "<br><br>";

    html += "<h4>✨ Recommended Protection</h4>";
    html += advice + "<br>";

    html += "<h4>🌟 Final Insight</h4>";
    html += "Your energy is stronger than any shadow. You are protected, guided, and watched over.<br><br>";

    return html;
}
function generateSpiritualAwakeningSection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // SCORES
    const intuitionScore = Math.floor((a.intuition + c.thirdEye + c.crown) / 3);
    const soulDepth = Math.floor((a.emotion + c.heart + a.spirituality) / 3);
    const karmaScore = Math.floor((l.fate + a.spirituality + c.crown) / 3);
    const awakeningLevel = Math.floor((intuitionScore + soulDepth + karmaScore) / 3);

    // Intuition Interpretation
    let intuitionText = "";
    if (intuitionScore > 90) intuitionText = "Extremely strong intuition — warnings, dreams and sudden insights come true.";
    else if (intuitionScore > 80) intuitionText = "Very strong intuitive field — correct gut feelings.";
    else if (intuitionScore > 70) intuitionText = "Moderate intuition — increases with silence.";
    else intuitionText = "Intuition awakens later in life.";

    // Soul Depth Interpretation
    let soulText = "";
    if (soulDepth > 90) soulText = "Very deep soul — empathy, spiritual wisdom, emotional strength.";
    else if (soulDepth > 80) soulText = "Strong emotional wisdom — understands people deeply.";
    else if (soulDepth > 70) soulText = "Balanced emotional and spiritual depth.";
    else soulText = "Soul depth grows slowly over life.";

    // Karmic Path Interpretation
    let karmaText = "";
    if (karmaScore > 90) karmaText = "Old soul with unfinished karmic missions and protection cycles.";
    else if (karmaScore > 80) karmaText = "Strong karmic memory — emotional lessons repeat until mastered.";
    else if (karmaScore > 70) karmaText = "Soft karmic influence — lessons based on relationships.";
    else karmaText = "Light karmic weight — free-spirit path.";

    // Awakening Stages
    let stages = "";
    if (awakeningLevel > 90) {
        stages =
            "• Stage 1: Early intuition activation (age 25–32)<br>" +
            "• Stage 2: Deep awakening (age 32–40)<br>" +
            "• Stage 3: Mastery (age 40–55)<br>";
    } else if (awakeningLevel > 80) {
        stages =
            "• Stage 1: Emotional purification (30–38)<br>" +
            "• Stage 2: Strong awakening (38–48)<br>" +
            "• Stage 3: Wisdom phase (50+)<br>";
    } else {
        stages =
            "• Stage 1: Karmic lessons (30–45)<br>" +
            "• Stage 2: Awakening later (45–60)<br>" +
            "• Stage 3: Deep wisdom (60+)<br>";
    }

    // FINAL HTML RETURN
    let html = "";
    html += "<h3>🕉 Spiritual Awakening & Life Mission (V65)</h3>";

    html += "<h4>🔮 Intuition Strength</h4>";
    html += intuitionScore + "% — " + intuitionText + "<br><br>";

    html += "<h4>💙 Soul Depth</h4>";
    html += soulDepth + "% — " + soulText + "<br><br>";

    html += "<h4>⏳ Karmic Influence</h4>";
    html += karmaScore + "% — " + karmaText + "<br><br>";

    html += "<h4>🌅 Awakening Stages</h4>";
    html += stages + "<br>";

    html += "<h4>🌟 Final Life Mission Insight</h4>";
    html += "Your spiritual path is rising. Your intuition wakes first, then wisdom, then purpose. ";
    html += "You were born to evolve, protect, guide and uplift others through silent strength.<br><br>";

    return html;
}
function generatePastLifeSection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // SCORES
    const karmicMemory = Math.floor((l.fate + a.spirituality + c.crown) / 3);
    const emotionalEcho = Math.floor((a.emotion + c.heart + l.heart) / 3);
    const traumaScore = Math.floor((l.health + a.emotion + c.root) / 3);
    const wisdomScore = Math.floor((c.thirdEye + a.intuition + a.spirituality) / 3);

    // INTERPRETATIONS
    let memoryText = "";
    if (karmicMemory > 90) memoryText = "Very strong karmic memory — past lives deeply connected to current destiny.";
    else if (karmicMemory > 80) memoryText = "Strong karmic influence — emotional déjà vu and repeated soul lessons.";
    else if (karmicMemory > 70) memoryText = "Moderate karmic memory — some past-life patterns return.";
    else memoryText = "Light karmic memory — current life is fresh and independent.";

    let echoText = "";
    if (emotionalEcho > 90) echoText = "Strong emotional echo — same souls return in new forms (friends, partners, rivals).";
    else if (emotionalEcho > 80) echoText = "Past emotional bonds influence relationship patterns.";
    else if (emotionalEcho > 70) echoText = "Some emotional imprints carry into this life.";
    else echoText = "Minimal emotional echo — new emotional journey.";

    let traumaText = "";
    if (traumaScore > 90) traumaText = "Deep soul trauma carried from past incarnations — spiritual healing required.";
    else if (traumaScore > 80) traumaText = "Moderate past-life wounds — appear as sensitivity or anxiety.";
    else if (traumaScore > 70) traumaText = "Some karmic stress but healing naturally.";
    else traumaText = "Very little trauma — emotionally clean soul.";

    let wisdomText = "";
    if (wisdomScore > 90) wisdomText = "Old soul — rare spiritual intelligence, prophetic dreams, multiple past incarnations.";
    else if (wisdomScore > 80) wisdomText = "Mature soul — intuition sharpened through previous lifetimes.";
    else if (wisdomScore > 70) wisdomText = "Developing soul — wisdom grows each lifetime.";
    else wisdomText = "Young soul energy — learning, exploring, building identity.";

    // Past Life Roles
    let role = "";
    if (wisdomScore > 90 && karmicMemory > 85) role = "Spiritual protector, healer, or sage in past lives.";
    else if (wisdomScore > 80) role = "Guide, teacher, or advisor in previous incarnations.";
    else if (traumaScore > 85) role = "Warrior, survivor, or someone who lived through conflict.";
    else if (emotionalEcho > 80) role = "Caretaker, healer, emotional supporter.";
    else role = "Seeker — learning and evolving across lifetimes.";

    // FINAL HTML
    let html = "";
    html += "<h3>🌀 Past-Life Regression & Karmic Memory (V66)</h3>";

    html += "<h4>⏳ Karmic Memory Strength</h4>";
    html += karmicMemory + "% — " + memoryText + "<br><br>";

    html += "<h4>💙 Emotional Echo</h4>";
    html += emotionalEcho + "% — " + echoText + "<br><br>";

    html += "<h4>⚠ Past-Life Trauma Energy</h4>";
    html += traumaScore + "% — " + traumaText + "<br><br>";

    html += "<h4>🕉 Soul Wisdom Level</h4>";
    html += wisdomScore + "% — " + wisdomText + "<br><br>";

    html += "<h4>🌟 Past-Life Role</h4>";
    html += role + "<br><br>";

    html += "<h4>🔥 Final Insight</h4>";
    html += "Your past-life energies shape destiny, emotions, intuition and inner strength. ";
    html += "You carry soul memory, emotional imprints and spiritual wisdom from before this life.<br><br>";

    return html;
}
function generateSoulmateSection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // SCORES
    const loveEnergy = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const soulmateScore = Math.floor((a.intuition + l.venus + c.heart) / 3);
    const twinFlameScore = Math.floor((l.fate + a.destiny + a.spirituality) / 3);
    const karmicPartnerScore = Math.floor((a.emotion + l.heart + l.fate) / 3);
    const loyaltyScore = Math.floor((a.emotion + l.venus + c.heart) / 3);

    // Soulmate Interpretation
    let soulmateText = "";
    if (soulmateScore > 90) soulmateText = "A very strong soulmate connection in this lifetime. Deep emotional and spiritual bonding.";
    else if (soulmateScore > 80) soulmateText = "High soulmate potential — strong emotional compatibility and spiritual alignment.";
    else if (soulmateScore > 70) soulmateText = "Possible soulmate connection — grows over time.";
    else soulmateText = "Soulmate link not dominant — relationship is more practical.";

    // Twin Flame Interpretation
    let twinText = "";
    if (twinFlameScore > 90) twinText = "Twin flame energy extremely strong — intense connection, destiny-aligned, life-changing.";
    else if (twinFlameScore > 80) twinText = "Twin flame possibility — powerful karmic pull.";
    else if (twinFlameScore > 70) twinText = "Moderate twin flame influence — emotional and spiritual learning.";
    else twinText = "Twin flame influence weak — soulmate energy is stronger.";

    // Karmic Partner Interpretation
    let karmicText = "";
    if (karmicPartnerScore > 90) karmicText = "Very strong karmic partner — heavy emotional lessons, repeating cycles.";
    else if (karmicPartnerScore > 80) karmicText = "Strong karmic influence — emotional intensity and transformation.";
    else if (karmicPartnerScore > 70) karmicText = "Some karmic lessons — moderate emotional impact.";
    else karmicText = "Light karmic influence — minimal emotional challenges.";

    // Loyalty Interpretation
    let loyaltyText = "";
    if (loyaltyScore > 90) loyaltyText = "Extremely loyal and emotionally committed partner.";
    else if (loyaltyScore > 80) loyaltyText = "Very loyal — trusts deeply and bonds strongly.";
    else if (loyaltyScore > 70) loyaltyText = "Loyal when emotionally comfortable.";
    else loyaltyText = "Loyalty depends on emotional security.";

    // Ideal Partner Personality
    let partnerType = "";
    if (loveEnergy > 90) partnerType = "Deep emotional, spiritual and protective partner.";
    else if (loveEnergy > 80) partnerType = "Honest, loving, loyal and well-balanced partner.";
    else if (loveEnergy > 70) partnerType = "Calm, patient and slow-to-love partner.";
    else partnerType = "Independent, logical and emotionally reserved partner.";

    // Final HTML
    let html = "";
    html += "<h3>💞 Soulmate · Twin Flame · Karmic Partner (V67)</h3>";

    html += "<h4>❤️ Love Energy</h4>";
    html += loveEnergy + "% — Strength of emotional connection.<br><br>";

    html += "<h4>💗 Soulmate Connection</h4>";
    html += soulmateScore + "% — " + soulmateText + "<br><br>";

    html += "<h4>🔥 Twin Flame Influence</h4>";
    html += twinFlameScore + "% — " + twinText + "<br><br>";

    html += "<h4>⚡ Karmic Partner Influence</h4>";
    html += karmicPartnerScore + "% — " + karmicText + "<br><br>";

    html += "<h4>🤝 Loyalty Strength</h4>";
    html += loyaltyScore + "% — " + loyaltyText + "<br><br>";

    html += "<h4>🧲 Ideal Partner Personality</h4>";
    html += partnerType + "<br><br>";

    html += "<h4>🌟 Final Relationship Insight</h4>";
    html += "Your palm shows destiny-linked emotional connections, karmic lessons, and the possibility of a deep soulmate or twin flame bond.<br>";
    html += "Your energy attracts emotionally intelligent, loyal and spiritually connected partners.<br><br>";

    return html;
}
function generateLifeMapSection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // MASTER SCORES
    const destinyScore = Math.floor((l.fate + a.destiny + c.crown) / 3);
    const loveScore = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const wealthScore = Math.floor((l.sun + a.creativity + a.intellect) / 3);
    const healthScore = Math.floor((l.life + l.health + a.vitality) / 3);
    const spiritualScore = Math.floor((a.spirituality + c.thirdEye + c.crown) / 3);

    // PHASE BUILDER
    function buildPhase(start, end, score) {
        let text = "";
        if (score > 85) text = "Golden Cycle — Major progress, breakthroughs, opportunities.";
        else if (score > 75) text = "Positive Cycle — Growth, clarity, stability.";
        else if (score > 65) text = "Neutral Cycle — Lessons, slow growth.";
        else if (score > 55) text = "Challenging Cycle — Emotional, financial or karmic challenges.";
        else text = "Shadow Cycle — Heavy karmic period, stay calm and grounded.";
        return "<b>Age " + start + "–" + end + ":</b> " + text + "<br>";
    }

    // FINAL HTML BUILD
    let html = "";
    html += "<h3>📜 Full Life Map Timeline (Age 18–90) — V70</h3>";

    html += "<h4>🧱 18–25 : Foundation & Identity Cycle</h4>";
    html += buildPhase(18, 25, destinyScore - 5);

    html += "<h4>❤️ 25–33 : Love, Emotion & Relationship Cycle</h4>";
    html += buildPhase(25, 33, loveScore);

    html += "<h4>💰 33–42 : Wealth & Career Rise Cycle</h4>";
    html += buildPhase(33, 42, wealthScore);

    html += "<h4>🔥 42–50 : Transformation & Power Cycle</h4>";
    html += buildPhase(42, 50, destinyScore);

    html += "<h4>🕉 50–60 : Spiritual Awakening Cycle</h4>";
    html += buildPhase(50, 60, spiritualScore);

    html += "<h4>🌿 60–75 : Stability & Wisdom Cycle</h4>";
    html += buildPhase(60, 75, spiritualScore - 10);

    html += "<h4>🌟 75–90 : Legacy & Completion Cycle</h4>";
    html += buildPhase(75, 90, Math.floor((destinyScore + spiritualScore) / 2));

    // MAJOR YEARS
    let majorYears = [];
    if (destinyScore > 80) majorYears.push("29", "36", "44", "52");
    if (wealthScore > 80) majorYears.push("33", "39", "45");
    if (loveScore > 80) majorYears.push("24", "27", "31");
    if (spiritualScore > 85) majorYears.push("40", "48", "56", "63");

    // DANGER YEARS
    let dangerYears = [];
    if (healthScore < 70) dangerYears.push("28", "41", "57");
    if (destinyScore < 65) dangerYears.push("34", "49");

    html += "<h4>✨ Major Destiny Years</h4>";
    html += (majorYears.length > 0 ? majorYears.join(", ") : "None") + "<br><br>";

    html += "<h4>⚠ Sensitive / Caution Years</h4>";
    html += (dangerYears.length > 0 ? dangerYears.join(", ") : "No major danger") + "<br><br>";

    html += "<h4>🌟 Final Timeline Insight</h4>";
    html += "Your life moves in powerful cycles. Early challenges shape wisdom. Mid-life brings success and emotional maturity. Later life brings peace, clarity and spiritual elevation.<br><br>";

    return html;
}

function generatePalmGeometrySection(d) {

    const l = d.lines;
    const a = d.aura;
    const c = d.chakra;

    // Approx geometric values (AI simulation)
    const headAngle = Math.floor((l.head + a.intellect) / 2);
    const heartAngle = Math.floor((l.heart + a.emotion) / 2);
    const lifeCurve = Math.floor((l.life + a.vitality) / 2);
    const fateAngle = Math.floor((l.fate + a.destiny) / 2);
    const sunRise = Math.floor((l.sun + a.creativity) / 2);
    const mercurySlope = Math.floor((l.mercury + c.throat) / 2);

    // Interpretations
    let headText = "";
    if (headAngle > 85) headText = "Sharp angle — Highly analytical, strategic thinker.";
    else if (headAngle > 75) headText = "Balanced angle — Clear logical and emotional balance.";
    else if (headAngle > 65) headText = "Gentle angle — Imaginative and intuitive thinker.";
    else headText = "Low angle — Emotional decisions dominate.";

    let heartText = "";
    if (heartAngle > 85) heartText = "Deep emotional intensity, strong bonding energy.";
    else if (heartAngle > 75) heartText = "Balanced emotional expression.";
    else if (heartAngle > 65) heartText = "Sensitive emotional field.";
    else heartText = "Reserved emotional nature.";

    let lifeText = "";
    if (lifeCurve > 85) lifeText = "Strong curve — powerful vitality, long life, high resilience.";
    else if (lifeCurve > 75) lifeText = "Healthy curve — stable physical and emotional energy.";
    else if (lifeCurve > 65) lifeText = "Moderate curve — energy rises and falls with mood.";
    else lifeText = "Weak curve — energy must be protected.";

    let fateText = "";
    if (fateAngle > 85) fateText = "Sharp upward path — destiny rises fast after mid-life.";
    else if (fateAngle > 75) fateText = "Balanced fate — steady success cycles.";
    else if (fateAngle > 65) fateText = "Late rise — destiny activates slowly.";
    else fateText = "Unstable destiny — emotional lessons shape path.";

    let sunText = "";
    if (sunRise > 85) sunText = "Strong Sun rise — talent, fame, recognition potential.";
    else if (sunRise > 75) sunText = "Good Sun rise — creativity grows with age.";
    else if (sunRise > 65) sunText = "Mild Sun rise — hidden talents reveal late.";
    else sunText = "Low Sun influence — success through hard work.";

    let mercuryText = "";
    if (mercurySlope > 85) mercuryText = "Excellent communication skills and intelligence.";
    else if (mercurySlope > 75) mercuryText = "Good communicator and fast learner.";
    else if (mercurySlope > 65) mercuryText = "Gentle communicator — emotional speaker.";
    else mercuryText = "Reserved nature — selective communication.";

    // FINAL HTML
    let html = "";
    html += "<h3>✋ Palm Geometry & Line-Angle Analysis (V70 PRO)</h3>";

    html += "<h4>🧠 Head Line Angle</h4>";
    html += headAngle + "% — " + headText + "<br><br>";

    html += "<h4>❤️ Heart Line Angle</h4>";
    html += heartAngle + "% — " + heartText + "<br><br>";

    html += "<h4>🔥 Life Line Curve Strength</h4>";
    html += lifeCurve + "% — " + lifeText + "<br><br>";

    html += "<h4>⚡ Fate Line Angle</h4>";
    html += fateAngle + "% — " + fateText + "<br><br>";

    html += "<h4>☀ Sun Line Rise</h4>";
    html += sunRise + "% — " + sunText + "<br><br>";

    html += "<h4>📡 Mercury Line Slope</h4>";
    html += mercurySlope + "% — " + mercuryText + "<br><br>";

    html += "<h4>🌟 Final Geometry Insight</h4>";
    html += "Your palm geometry shows strong mental power, balanced emotions, rising destiny and intuitive energy. ";
    html += "Line angles reveal that your life path moves upward through experience, wisdom and resilience.<br><br>";

    return html;
}
function generateMindProfileSection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // CORE MIND SCORES
    const logicScore = Math.floor((l.head + a.intellect) / 2);
    const emotionScore = Math.floor((l.heart + a.emotion) / 2);
    const intuitionScore = Math.floor((a.intuition + c.thirdEye) / 2);
    const impulseScore = Math.floor((a.vitality + c.sacral) / 2);
    const stabilityScore = Math.floor((c.root + l.life) / 2);

    // INTERPRETATION BLOCKS
    let logicText = "";
    if (logicScore > 85) logicText = "Highly analytical mind — sees patterns instantly.";
    else if (logicScore > 75) logicText = "Balanced thinker — uses logic and intuition well.";
    else if (logicScore > 65) logicText = "Emotional thinker with logical moments.";
    else logicText = "Heart-driven decisions, less analytical.";

    let emotionText = "";
    if (emotionScore > 85) emotionText = "Deep emotional world — feels everything strongly.";
    else if (emotionScore > 75) emotionText = "Emotionally intelligent and expressive.";
    else if (emotionScore > 65) emotionText = "Sensitive but controlled emotions.";
    else emotionText = "Reserved emotionally — rarely shows inner feelings.";

    let intuitionText = "";
    if (intuitionScore > 85) intuitionText = "Very strong intuition — senses truth without evidence.";
    else if (intuitionScore > 75) intuitionText = "Good intuition — accurate gut feelings.";
    else if (intuitionScore > 65) intuitionText = "Developing intuition — grows with silence.";
    else intuitionText = "Low intuition — relies mostly on logic or emotion.";

    let impulseText = "";
    if (impulseScore > 85) impulseText = "Strong impulses — acts fast, high passion, intense energy.";
    else if (impulseScore > 75) impulseText = "Healthy impulse control — passion with discipline.";
    else if (impulseScore > 65) impulseText = "Moderate impulse — calm most times.";
    else impulseText = "Low impulse — slow to react, careful and steady.";

    let stabilityText = "";
    if (stabilityScore > 85) stabilityText = "Very stable mind — calm under pressure.";
    else if (stabilityScore > 75) stabilityText = "Good stability — recovers quickly.";
    else if (stabilityScore > 65) stabilityText = "Variable stability — emotional ups and downs.";
    else stabilityText = "Mental instability risk — needs grounding energy.";

    // PERSONALITY TYPE
    let personality = "";
    if (logicScore > 80 && intuitionScore > 80) personality = "Strategic Intuitive — rare, powerful mind type.";
    else if (emotionScore > 80 && intuitionScore > 75) personality = "Empathic Guide — emotional + intuitive intelligence.";
    else if (logicScore > 80 && stabilityScore > 75) personality = "Balanced Leader — strong mind, strong foundation.";
    else if (emotionScore > 80 && impulseScore > 70) personality = "Passionate Protector — emotional, loyal, intense.";
    else personality = "Harmonic Thinker — balanced emotional–logical nature.";

    // SUBCONSCIOUS DRIVES
    let coreDrive = "";
    if (emotionScore > 85) coreDrive = "Heart-first — connection, loyalty, emotional truth.";
    else if (logicScore > 85) coreDrive = "Mind-first — strategy, clarity, rationality.";
    else if (intuitionScore > 85) coreDrive = "Spirit-first — sensing, awareness, and depth.";
    else coreDrive = "Balance-seeker — needs emotional peace + logical clarity.";

    // FINAL BUILD
    let html = "";
    html += "<h3>🧠 Subconscious & Mental Profile (V68)</h3>";

    html += "<h4>🧠 Logical Mind</h4>";
    html += logicScore + "% — " + logicText + "<br><br>";

    html += "<h4>❤️ Emotional Mind</h4>";
    html += emotionScore + "% — " + emotionText + "<br><br>";

    html += "<h4>🔮 Intuitive Mind</h4>";
    html += intuitionScore + "% — " + intuitionText + "<br><br>";

    html += "<h4>🔥 Impulse & Passion</h4>";
    html += impulseScore + "% — " + impulseText + "<br><br>";

    html += "<h4>🌱 Mental Stability</h4>";
    html += stabilityScore + "% — " + stabilityText + "<br><br>";

    html += "<h4>🌟 Dominant Personality Type</h4>";
    html += personality + "<br><br>";

    html += "<h4>🪷 Subconscious Core Drive</h4>";
    html += coreDrive + "<br><br>";

    html += "<h4>✨ Final Insight</h4>";
    html += "Your mind is shaped by intuition, emotion, and deep inner wisdom. ";
    html += "You are designed to think deeply, feel strongly, and understand life beyond the normal mind.<br><br>";

    return html;
}
function generateFullSeedReport(d) {

    let html = "";

    // SECTION HEAD
    html += "<h2>🕉 THE SEED · Full AI Palmistry Report (V75)</h2>";
    html += "<p>All modules combined into one complete interpretation.</p><br>";

    // PART 1 – Basic Info (already exists in your main app)
    if (typeof generateFullPalmReport === "function") {
        html += "<h3>📄 Base Palm Overview</h3>";
        html += "Basic palm scan processed.<br><br>";
    }

    // PART 2 – Aura Field
    if (typeof generateAuraField === "function") {
        html += "<h3>🌈 Aura Energy Field</h3>";
        html += "<p>Included from main engine.</p><br>";
    }

    // PART 3–22 (Indirect / Existing modules)

    // 🔥 PART 16 — Danger & Protection
    if (typeof generateProtectionSection === "function") {
        html += generateProtectionSection(d);
    }

    // 🔥 PART 17 — Spiritual Awakening
    if (typeof generateSpiritualAwakeningSection === "function") {
        html += generateSpiritualAwakeningSection(d);
    }

    // 🔥 PART 18 — Past Life
    if (typeof generatePastLifeSection === "function") {
        html += generatePastLifeSection(d);
    }

    // 🔥 PART 19 — Soulmate · Twin Flame
    if (typeof generateSoulmateSection === "function") {
        html += generateSoulmateSection(d);
    }

    // 🔥 PART 20 — Life Map 18–90
    if (typeof generateLifeMapSection === "function") {
        html += generateLifeMapSection(d);
    }

    // 🔥 PART 21 — Palm Geometry
    if (typeof generatePalmGeometrySection === "function") {
        html += generatePalmGeometrySection(d);
    }

    // 🔥 PART 22 — Subconscious Mind
    if (typeof generateMindProfileSection === "function") {
        html += generateMindProfileSection(d);
    }

    // ENDING
    html += "<h3>🌟 Final Insight</h3>";
    html += "Your palm reveals a deeply intuitive, emotionally strong, spiritually guided soul. ";
    html += "All life cycles, karmic memories, future trends, and destiny pathways align to form your unique journey.<br><br>";

    return html;
}
function generateFingerProfileSection(d) {

    const l = d.lines;
    const a = d.aura;
    const c = d.chakra;

    // AI simulated finger ratios (in real scan we get actual values)
    const indexRatio = Math.floor((l.head + a.intellect) / 2);
    const middleRatio = Math.floor((l.fate + c.thirdEye) / 2);
    const ringRatio = Math.floor((l.sun + a.creativity) / 2);
    const littleRatio = Math.floor((l.mercury + c.throat) / 2);
    const thumbPower = Math.floor((a.vitality + l.life) / 2);

    // --- ANALYSIS TEXT BLOCKS ---

    // Index Finger → Leadership, Ambition
    let indexText = "";
    if (indexRatio > 85) indexText = "Strong leadership, confidence, natural authority.";
    else if (indexRatio > 75) indexText = "Healthy ambition, good confidence.";
    else if (indexRatio > 65) indexText = "Stable personality, calm leadership.";
    else indexText = "Quiet personality, avoids conflict.";

    // Middle Finger → Discipline, Responsibility
    let middleText = "";
    if (middleRatio > 85) middleText = "Highly responsible, disciplined, wise thinker.";
    else if (middleRatio > 75) middleText = "Balanced discipline and maturity.";
    else if (middleRatio > 65) middleText = "Moderate discipline, emotional influence.";
    else middleText = "Rebels against structure, free-flowing personality.";

    // Ring Finger → Creativity, Fame, Expression
    let ringText = "";
    if (ringRatio > 85) ringText = "High creativity, talent, artistic intelligence.";
    else if (ringRatio > 75) ringText = "Balanced creativity, expressive personality.";
    else if (ringRatio > 65) ringText = "Calm creativity, inner imagination.";
    else ringText = "Low creative influence — practical thinker.";

    // Little Finger → Communication, Intelligence
    let littleText = "";
    if (littleRatio > 85) littleText = "Excellent communication, persuasive, sharp intelligence.";
    else if (littleRatio > 75) littleText = "Good speaker, fast learner.";
    else if (littleRatio > 65) littleText = "Soft communication, emotionally guided speech.";
    else littleText = "Reserved, speaks only when necessary.";

    // Thumb → Willpower, Determination, Survival Energy
    let thumbText = "";
    if (thumbPower > 85) thumbText = "Very strong will, unbreakable determination.";
    else if (thumbPower > 75) thumbText = "Strong determination and stable will.";
    else if (thumbPower > 65) thumbText = "Moderate willpower — rises with emotion.";
    else thumbText = "Weak willpower — must protect energy.";

    // Personality Combination Logic
    let persona = "";
    if (indexRatio > 80 && thumbPower > 80) persona = "Leader–Warrior Type (Strong personality, takes charge naturally)";
    else if (ringRatio > 80 && littleRatio > 80) persona = "Creative–Intellectual Type (Artist + smart communicator)";
    else if (middleRatio > 80 && indexRatio > 70) persona = "Wise–Leader Type (Strategic, disciplined, respected)";
    else if (emotionDominant(a, l)) persona = "Empathic–Heart Type (Feels deeply, emotional wisdom)";
    else persona = "Balanced Type (Equal logic, emotion, intuition)";

    function emotionDominant(aura, lines) {
        return ((aura.emotion + lines.heart) / 2) > 80;
    }

    // FINAL HTML
    let html = "";
    html += "<h3>🖐️ Finger Proportion & Shape Analysis (V71)</h3>";

    html += "<h4>☝ Index Finger (Jupiter Energy)</h4>";
    html += indexRatio + "% — " + indexText + "<br><br>";

    html += "<h4>🫱 Middle Finger (Saturn Energy)</h4>";
    html += middleRatio + "% — " + middleText + "<br><br>";

    html += "<h4>🫲 Ring Finger (Apollo Energy)</h4>";
    html += ringRatio + "% — " + ringText + "<br><br>";

    html += "<h4>🫳 Little Finger (Mercury Energy)</h4>";
    html += littleRatio + "% — " + littleText + "<br><br>";

    html += "<h4>👍 Thumb (Willpower Core)</h4>";
    html += thumbPower + "% — " + thumbText + "<br><br>";

    html += "<h4>🌟 Combined Finger Personality Type</h4>";
    html += persona + "<br><br>";

    html += "<h4>✨ Final Insight</h4>";
    html += "Your finger ratios show a unique balance of ambition, wisdom, creativity, communication and willpower. ";
    html += "This reveals how you think, how you act, and how your personality shapes your destiny.<br><br>";

    return html;
}
function generateEmotionalTriggerMap(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // CORE EMOTIONAL FIELDS
    const sensitivity = Math.floor((a.emotion + c.heart) / 2);
    const trauma = Math.floor((l.heart + l.health) / 2);
    const anger = Math.floor((l.mars || a.vitality) || Math.floor((l.life + a.vitality) / 2));
    const fear = Math.floor((c.root + a.intuition) / 2);
    const trust = Math.floor((l.venus + a.emotion) / 2);
    const attachment = Math.floor((a.emotion + c.sacral) / 2);

    // SECTION TEXTS
    function interpret(value, high, mid1, mid2, low, highT, midT1, midT2, lowT) {
        if (value > high) return highT;
        if (value > mid1) return midT1;
        if (value > mid2) return midT2;
        return lowT;
    }

    const sensitivityText = interpret(
        sensitivity,
        85, 75, 65, 50,
        "Very emotionally sensitive, feels deeply and absorbs others' energy.",
        "Emotionally deep, intuitive, empathetic.",
        "Emotionally balanced; sometimes hides feelings.",
        "Low sensitivity; feelings suppressed or controlled."
    );

    const traumaText = interpret(
        trauma,
        85, 75, 65, 50,
        "Old emotional wounds still influence reactions.",
        "Some past pain affects trust & decisions.",
        "Moderate emotional memory; heals slowly.",
        "Low trauma imprint; emotionally steady."
    );

    const angerText = interpret(
        anger,
        85, 75, 65, 50,
        "Anger stored internally; bursts under pressure.",
        "Controlled anger but emotional triggers exist.",
        "Mild anger responses; mostly calm.",
        "Very calm; anger rarely appears."
    );

    const fearText = interpret(
        fear,
        85, 75, 65, 50,
        "Deep-rooted fear or insecurity; inner battles.",
        "Moderate fear; becomes cautious in decisions.",
        "Low fear; confidence grows with time.",
        "Very strong grounding; fearless personality."
    );

    const trustText = interpret(
        trust,
        85, 75, 65, 50,
        "Trusts deeply but gets hurt easily.",
        "Balanced trust; needs emotional honesty.",
        "Slow to trust; observes people carefully.",
        "Very cautious; trust must be earned."
    );

    const attachmentText = interpret(
        attachment,
        85, 75, 65, 50,
        "Forms strong emotional bonds; separation pain hits hard.",
        "Healthy attachment; loyal and loving.",
        "Balanced but needs emotional space.",
        "Low attachment; prefers independence."
    );

    // FINAL OUTPUT
    let html = "";
    html += "<h3>🧠 Emotional Trigger Map (V73)</h3>";

    html += "<h4>💗 Sensitivity</h4>";
    html += sensitivity + "% — " + sensitivityText + "<br><br>";

    html += "<h4>💔 Trauma Memory</h4>";
    html += trauma + "% — " + traumaText + "<br><br>";

    html += "<h4>🔥 Anger Response</h4>";
    html += anger + "% — " + angerText + "<br><br>";

    html += "<h4>😨 Fear & Insecurity</h4>";
    html += fear + "% — " + fearText + "<br><br>";

    html += "<h4>🤝 Trust Level</h4>";
    html += trust + "% — " + trustText + "<br><br>";

    html += "<h4>🫂 Attachment Style</h4>";
    html += attachment + "% — " + attachmentText + "<br><br>";

    html += "<h4>🌟 Final Emotional Insight</h4>";
    html += "Your emotional map shows how your past, heart, intuition and sensitivity shape reactions. ";
    html += "This engine identifies inner patterns that influence love, relationships, decisions, and healing.<br><br>";
    

    return html;
    
}
function generateStrengthWeakness(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // Core scores
    const mindPower = Math.floor((l.head + a.intellect + c.thirdEye) / 3);
    const emotionalPower = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const physicalPower = Math.floor((l.life + a.vitality + l.health) / 3);
    const spiritualPower = Math.floor((c.crown + a.spirituality + a.intuition) / 3);
    const couragePower = Math.floor((a.vitality + c.root + l.life) / 3);
    const intuitionPower = Math.floor((a.intuition + l.mercury + c.thirdEye) / 3);

    // Strength interpretation
    function strength(score) {
        if (score > 85) return "Very Strong";
        if (score > 75) return "Strong";
        if (score > 65) return "Moderate";
        return "Low";
    }

    // Weakness interpretation
    function weakness(score) {
        if (score < 55) return "High Weakness";
        if (score < 70) return "Medium Weakness";
        return "Stable";
    }

    let html = "";
    html += "<h3>💠 Strength & Weakness Analyzer — THE SEED · V74</h3>";

    html += "<h4>🧠 Mental Strength</h4>";
    html += mindPower + "% — " + strength(mindPower) + "<br><br>";

    html += "<h4>💗 Emotional Strength</h4>";
    html += emotionalPower + "% — " + strength(emotionalPower) + "<br><br>";

    html += "<h4>💪 Physical & Health Strength</h4>";
    html += physicalPower + "% — " + strength(physicalPower) + "<br><br>";

    html += "<h4>🕉 Spiritual Strength</h4>";
    html += spiritualPower + "% — " + strength(spiritualPower) + "<br><br>";

    html += "<h4>🔥 Courage & Willpower</h4>";
    html += couragePower + "% — " + strength(couragePower) + "<br><br>";

    html += "<h4>👁 Intuition Power</h4>";
    html += intuitionPower + "% — " + strength(intuitionPower) + "<br><br>";

    // Hidden Weakness Detection
    html += "<h3>⚠ Hidden Weakness Pattern</h3>";

    // Hidden fears
    if (emotionalPower > 85 && mindPower < 70) {
        html += "You feel deeply, but you think too much during emotional pain.<br>";
    }
    if (mindPower > 80 && emotionalPower < 65) {
        html += "You overthink emotions and suppress feelings.<br>";
    }
    if (spiritualPower > 85 && physicalPower < 65) {
        html += "You are spiritually strong but physically exhausted easily.<br>";
    }
    if (intuitionPower > 80 && mindPower < 70) {
        html += "You sense truth but doubt your decisions.<br>";
    }
    if (couragePower > 80 && emotionalPower < 70) {
        html += "You appear strong outside but carry inner emotional wounds.<br>";
    }

    if (emotionalPower > 70 && emotionalPower < 85) {
        html += "Your heart is strong, but emotional exhaustion comes quickly.<br>";
    }

    if (physicalPower < 65) {
        html += "Physical fatigue appears during stress — rest is important.<br>";
    }

    html += "<br>";

    // Final summary
    html += "<h3>🌟 Final Strength Summary</h3>";
    html += "You carry rare mental clarity, emotional depth, and spiritual power.<br>";
    html += "Your weaknesses are not flaws — they are wounds that shaped your wisdom.<br>";
    html += "This module shows your real internal wiring: how your strengths and weaknesses create your destiny.<br>";

    return html;
}
function generateMindHeartConflict(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // SCORES
    const mind = Math.floor((l.head + a.intellect + c.thirdEye) / 3);
    const heart = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const intuition = Math.floor((a.intuition + l.mercury + c.thirdEye) / 3);
    const fear = Math.floor((c.root + a.emotion) / 2);
    const logic = Math.floor((l.head + a.intellect) / 2);

    // CONFLICT LEVEL
    const conflictLevel = Math.abs(mind - heart);

    let conflictText = "";
    if (conflictLevel > 35) conflictText = "Strong internal conflict — mind and heart pull in opposite directions.";
    else if (conflictLevel > 20) conflictText = "Moderate conflict — sometimes confused between logic and emotion.";
    else conflictText = "Low conflict — mind and heart usually support each other.";

    // HEART DOMINANCE
    let heartDom = "";
    if (heart > mind) heartDom = "Heart dominates your decisions — emotions influence choices strongly.";
    else if (mind > heart) heartDom = "Mind dominates — you think deeply before choosing.";
    else heartDom = "Mind and heart are balanced — rare alignment.";

    // INTUITION ROLE
    let intuitionText = "";
    if (intuition > 85) intuitionText = "Your intuition is extremely strong — your first instinct is usually correct.";
    else if (intuition > 75) intuitionText = "Your intuition guides you silently — trust it.";
    else intuitionText = "Intuition is moderate — sometimes unclear.";

    // FEAR IMPACT
    let fearText = "";
    if (fear > 85) fearText = "Deep-rooted fear affects major decisions.";
    else if (fear > 70) fearText = "You become cautious when emotional pressure rises.";
    else fearText = "Low fear — inner strength guides your choices.";

    // LOGIC ROLE
    let logicText = "";
    if (logic > 85) logicText = "Your logic is extremely sharp; you analyze everything.";
    else if (logic > 70) logicText = "Good logical power — helps balance your emotion.";
    else logicText = "Logic is soft — intuition replaces it often.";

    // FINAL OUTPUT
    let html = "";
    html += "<h3>🧠❤️ Mind–Heart Conflict Analyzer (V75)</h3>";

    html += "<h4>🧠 Mental Energy</h4>";
    html += mind + "% — Logical depth, reasoning power, clarity.<br><br>";

    html += "<h4>❤️ Emotional Energy</h4>";
    html += heart + "% — Emotional intensity, sensitivity, bonding power.<br><br>";

    html += "<h4>⚖ Conflict Level</h4>";
    html += conflictLevel + "% — " + conflictText + "<br><br>";

    html += "<h4>🌗 Decision Dominance</h4>";
    html += heartDom + "<br><br>";

    html += "<h4>👁 Intuition Influence</h4>";
    html += intuition + "% — " + intuitionText + "<br><br>";

    html += "<h4>😨 Fear Effect</h4>";
    html += fear + "% — " + fearText + "<br><br>";

    html += "<h4>🧩 Logic Influence</h4>";
    html += logic + "% — " + logicText + "<br><br>";

    html += "<h3>🌟 Final Insight</h3>";
    html += "This module shows how your mind, heart, intuition and fear shape decisions.<br>";
    html += "It reveals why some choices feel heavy, confusing or delayed.<br>";
    html += "Understanding this helps you make clearer, powerful decisions.<br>";

    return html;
}
function generateRelationshipCompatibility(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // CORE SCORES
    const emotionalMatch = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const loyaltyMatch = Math.floor((l.venus + a.emotion + c.sacral) / 3);
    const communicationMatch = Math.floor((l.mercury + a.communication + c.throat) / 3);
    const spiritualMatch = Math.floor((c.thirdEye + c.crown + a.spirituality) / 3);
    const attractionMatch = Math.floor((l.venus + a.creativity + a.emotion) / 3);
    const longTermMatch = Math.floor((l.fate + a.destiny + c.heart) / 3);

    // FINAL COMPATIBILITY SCORE
    const total =
        Math.floor((emotionalMatch + loyaltyMatch + communicationMatch +
                    spiritualMatch + attractionMatch + longTermMatch) / 6);

    // INTERPRETATIONS
    function interpret(score) {
        if (score > 85) return "Very High Compatibility — Soul-level match.";
        if (score > 75) return "High Compatibility — Stable, loving and karmic.";
        if (score > 65) return "Moderate Compatibility — Needs understanding.";
        if (score > 50) return "Low Compatibility — Requires emotional effort.";
        return "Very Low Compatibility — Energies conflict strongly.";
    }

    // Partner energy type
    let partnerType = "";
    if (emotionalMatch > 80) partnerType += "Emotionally deep, loyal, sensitive. ";
    else if (emotionalMatch > 65) partnerType += "Caring but needs communication. ";
    else partnerType += "Independent emotional style. ";

    if (spiritualMatch > 80) partnerType += "Spiritually aligned, intuitive. ";
    else if (spiritualMatch > 65) partnerType += "Open-minded and supportive. ";
    else partnerType += "Practical, logical thinker. ";

    // Long-term destiny
    let destinyText = "";
    if (longTermMatch > 85) destinyText = "This bond can last a lifetime — destiny-backed connection.";
    else if (longTermMatch > 70) destinyText = "Long-term potential strong if communication stays open.";
    else destinyText = "Long-term future unclear; requires mutual effort.";

    // FINAL OUTPUT
    let html = "";
    html += "<h3>💞 Relationship Compatibility — THE SEED · V76</h3>";

    html += "<h4>💗 Emotional Compatibility</h4>";
    html += emotionalMatch + "% — Emotional depth & bonding level.<br><br>";

    html += "<h4>💍 Loyalty & Commitment Energy</h4>";
    html += loyaltyMatch + "% — Trust, honesty, long-term dedication.<br><br>";

    html += "<h4>🗣 Communication Match</h4>";
    html += communicationMatch + "% — How well minds & words connect.<br><br>";

    html += "<h4>🕉 Spiritual Connection</h4>";
    html += spiritualMatch + "% — Soul-level synchronicity.<br><br>";

    html += "<h4>🔥 Attraction Energy</h4>";
    html += attractionMatch + "% — Passion & emotional chemistry.<br><br>";

    html += "<h4>📅 Long-term Destiny Match</h4>";
    html += longTermMatch + "% — " + destinyText + "<br><br>";

    html += "<h3>🌟 Partner Personality Type</h3>";
    html += partnerType + "<br><br>";

    html += "<h3>💞 Final Compatibility Score</h3>";
    html += total + "% — " + interpret(total) + "<br><br>";

    html += "<h3>💬 Final Insight</h3>";
    html += "This engine reveals emotional, mental, spiritual, physical, and destiny-layer alignment. ";
    html += "It predicts how two energies merge, support, heal, and evolve together.<br>";

    return html;
}
function generateLifePathProbability(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // Base probabilities
    const loveProb = Math.floor((a.emotion + l.heart + c.heart) / 3);
    const marriageProb = Math.floor((l.venus + a.emotion + l.fate) / 3);
    const moneyProb = Math.floor((a.destiny + l.sun + a.intellect) / 3);
    const careerProb = Math.floor((l.head + l.fate + a.intellect) / 3);
    const dangerProb = 100 - Math.floor((l.health + a.vitality) / 2);
    const spiritualProb = Math.floor((c.crown + a.spirituality + c.thirdEye) / 3);
    const successProb = Math.floor((a.destiny + l.fate + c.crown) / 3);

    // Final interpretation
    function interpret(score) {
        if (score > 85) return "Very High Probability";
        if (score > 75) return "High Probability";
        if (score > 65) return "Moderate Probability";
        if (score > 50) return "Low Probability";
        return "Very Low Probability";
    }

    let html = "";
    html += "<h3>🔮 Life Path Probability Map — THE SEED · V80</h3>";

    html += "<h4>❤️ Falling in Love / New Relationship</h4>";
    html += loveProb + "% — " + interpret(loveProb) + "<br><br>";

    html += "<h4>💍 Marriage / Union Probability</h4>";
    html += marriageProb + "% — " + interpret(marriageProb) + "<br><br>";

    html += "<h4>💰 Wealth Growth & Money Stability</h4>";
    html += moneyProb + "% — " + interpret(moneyProb) + "<br><br>";

    html += "<h4>🔥 Career Success & Recognition</h4>";
    html += careerProb + "% — " + interpret(careerProb) + "<br><br>";

    html += "<h4>⚠ Life Challenges / Danger Periods</h4>";
    html += dangerProb + "% — Higher % = More caution needed.<br><br>";

    html += "<h4>🕉 Spiritual Awakening Probability</h4>";
    html += spiritualProb + "% — " + interpret(spiritualProb) + "<br><br>";

    html += "<h4>🌟 Major Success (Life Breakthrough)</h4>";
    html += successProb + "% — " + interpret(successProb) + "<br><br>";

    html += "<h3>📘 Summary</h3>";
    html += "These probabilities show the MOST LIKELY outcomes based on your chakra energy, ";
    html += "palm lines, aura field, and destiny flow.<br><br>";

    html += "Your future is shaped by intuition, emotional strength, spiritual protection, ";
    html += "and karmic cycles that align at the right time.<br>";

    return html;
}
function generateEmotionalHealingPath(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // Core Healing Scores
    const woundDepth = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const healingPower = Math.floor((c.crown + a.spirituality + l.life) / 3);
    const recoverySpeed = Math.floor((a.vitality + l.health + c.solar) / 3);
    const forgivenessLevel = Math.floor((a.emotion + c.heart + l.venus) / 3);
    const emotionalMemory = Math.floor((l.heart + a.emotion) / 2);
    const traumaCycles = Math.floor((l.health + a.emotion + c.root) / 3);

    // Interpretations
    function interpret(score) {
        if (score > 85) return "Very High";
        if (score > 75) return "High";
        if (score > 65) return "Moderate";
        if (score > 50) return "Low";
        return "Very Low";
    }

    // Healing Timeline
    let timeline = "";
    if (healingPower > 85) timeline = "Healing begins instantly — deep progress within weeks.";
    else if (healingPower > 75) timeline = "Healing begins quickly — clear progress in 2–3 months.";
    else if (healingPower > 65) timeline = "Healing is gradual — 3–6 months emotional balancing.";
    else timeline = "Healing slow — requires long-term emotional rest.";

    // Emotional Memory behavior
    let memoryText = "";
    if (emotionalMemory > 85) memoryText = "You remember emotional pain for a long time.";
    else if (emotionalMemory > 75) memoryText = "Some memories return during stress.";
    else if (emotionalMemory > 65) memoryText = "Memories fade slowly but steadily.";
    else memoryText = "You release emotions naturally.";

    // Trauma Cycle explanation
    let traumaText = "";
    if (traumaCycles > 85) traumaText = "You carry old soul-level emotional cycles — deep scars.";
    else if (traumaCycles > 75) traumaText = "Past wounds influence your reactions sometimes.";
    else if (traumaCycles > 65) traumaText = "Mild emotional cycles — healing is happening.";
    else traumaText = "Very low trauma cycle — emotional stability strong.";

    // Forgiveness pattern
    let forgiveText = "";
    if (forgivenessLevel > 85) forgiveText = "You forgive deeply, even when not appreciated.";
    else if (forgivenessLevel > 75) forgiveText = "You forgive but never forget the pain.";
    else if (forgivenessLevel > 65) forgiveText = "You take time to forgive — emotional process needed.";
    else forgiveText = "Forgiveness is difficult — emotional walls appear.";

    // Final HTML
    let html = "";
    html += "<h3>🌿 Emotional Healing Path — THE SEED · V82</h3>";

    html += "<h4>💔 Wound Depth</h4>";
    html += woundDepth + "% — " + interpret(woundDepth) + "<br><br>";

    html += "<h4>🕉 Healing Power</h4>";
    html += healingPower + "% — " + interpret(healingPower) + "<br><br>";

    html += "<h4>⚡ Recovery Speed</h4>";
    html += recoverySpeed + "% — " + interpret(recoverySpeed) + "<br><br>";

    html += "<h4>❤️ Forgiveness Ability</h4>";
    html += forgivenessLevel + "% — " + forgiveText + "<br><br>";

    html += "<h4>🧠 Emotional Memory</h4>";
    html += emotionalMemory + "% — " + memoryText + "<br><br>";

    html += "<h4>🔄 Trauma Cycle Pattern</h4>";
    html += traumaCycles + "% — " + traumaText + "<br><br>";

    html += "<h4>📅 Healing Timeline</h4>";
    html += timeline + "<br><br>";

    html += "<h3>🌟 Final Healing Insight</h3>";
    html += "Your emotional journey is not weakness — it is transformation.<br>";
    html += "This map reveals how pain turns into wisdom, and how your heart recovers.<br>";
    html += "Healing is active, strong, and guided by spiritual protection.<br>";

    return html;
}
function generateKarmaLoopAnalysis(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // CORE SCORES
    const emotionalKarma = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const destinyKarma = Math.floor((l.fate + a.destiny + c.crown) / 3);
    const relationshipKarma = Math.floor((l.venus + a.emotion + c.sacral) / 3);
    const traumaKarma = Math.floor((l.health + a.emotion + c.root) / 3);
    const spiritualKarma = Math.floor((a.spirituality + c.thirdEye + c.crown) / 3);

    // Interpreters
    function interpret(score) {
        if (score > 85) return "Very Strong Cycle";
        if (score > 75) return "Strong Cycle";
        if (score > 65) return "Moderate Cycle";
        if (score > 50) return "Weak Cycle";
        return "Very Weak Cycle";
    }

    // Karma Cycle Meanings
    function cycleMeaning(score) {
        if (score > 85) return "This is a deep past-life cycle repeating strongly in this life.";
        if (score > 75) return "This pattern returns multiple times until resolved.";
        if (score > 65) return "This lesson appears occasionally, mostly during stress.";
        return "Only mild karmic influence present.";
    }

    // BREAKPOINT Prediction
    function breakPoint(score) {
        if (score > 85) return "Breakthrough age: 36–44";
        if (score > 75) return "Breakthrough age: 32–40";
        if (score > 65) return "Breakthrough age: 30–38";
        return "Breakthrough age: 40–50";
    }

    // Final HTML
    let html = "";
    html += "<h3>♾ Karma Loop Analyzer — THE SEED · V85</h3>";

    html += "<h4>❤️ Emotional Karma Cycle</h4>";
    html += emotionalKarma + "% — " + interpret(emotionalKarma) + "<br>";
    html += cycleMeaning(emotionalKarma) + "<br>";
    html += "Break-point: " + breakPoint(emotionalKarma) + "<br><br>";

    html += "<h4>🔮 Destiny Karma Cycle</h4>";
    html += destinyKarma + "% — " + interpret(destinyKarma) + "<br>";
    html += cycleMeaning(destinyKarma) + "<br>";
    html += "Break-point: " + breakPoint(destinyKarma) + "<br><br>";

    html += "<h4>💞 Relationship Karma Cycle</h4>";
    html += relationshipKarma + "% — " + interpret(relationshipKarma) + "<br>";
    html += cycleMeaning(relationshipKarma) + "<br>";
    html += "Break-point: " + breakPoint(relationshipKarma) + "<br><br>";

    html += "<h4>⚠ Trauma Karma Cycle</h4>";
    html += traumaKarma + "% — " + interpret(traumaKarma) + "<br>";
    html += cycleMeaning(traumaKarma) + "<br>";
    html += "Break-point: " + breakPoint(traumaKarma) + "<br><br>";

    html += "<h4>🕉 Spiritual Karma Cycle</h4>";
    html += spiritualKarma + "% — " + interpret(spiritualKarma) + "<br>";
    html += cycleMeaning(spiritualKarma) + "<br>";
    html += "Break-point: " + breakPoint(spiritualKarma) + "<br><br>";

    // Combined Insight
    html += "<h3>🌟 Final Karma Insight</h3>";
    html += "Your palm shows several karmic loops — emotional, relationship, destiny, and spiritual. ";
    html += "These loops repeat until specific inner lessons are completed.<br><br>";

    html += "Every challenge you faced was part of a karmic purification cycle. ";
    html += "Your breakthrough ages show when pain transforms into wisdom.<br><br>";

    html += "This engine reveals how past-life patterns shape your present, ";
    html += "and when these cycles finally break into clarity and freedom.<br>";

    return html;
}
function generateDestinyFusionSummary(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // CORE VALUES
    const strength = Math.floor((l.life + a.vitality + c.root) / 3);
    const wisdom = Math.floor((c.crown + c.thirdEye + a.spirituality) / 3);
    const emotionalDepth = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const destinyFlow = Math.floor((l.fate + a.destiny + c.crown) / 3);
    const intuition = Math.floor((a.intuition + l.mercury + c.thirdEye) / 3);
    const protection = Math.floor((a.spirituality + c.crown + a.vitality) / 3);

    // SUMMARY TEXT BUILD
    let text = "";

    text += "Your destiny reveals a rare combination of emotional depth, ";
    text += "inner strength, spiritual wisdom, and powerful intuition. ";
    text += "Your aura shows " + emotionalDepth + "% emotional resonance, ";
    text += "meaning your heart carries great compassion and sensitivity. ";

    text += "Your life-force energy is " + strength + "%, showing resilience ";
    text += "and the ability to rise through every challenge. ";

    text += "Your spiritual field is extremely strong (" + wisdom + "%), ";
    text += "indicating wisdom earned through past experiences and karmic lessons. ";

    text += "Your intuition level is " + intuition + "%, giving you the gift ";
    text += "to sense truth, danger, and opportunity before they appear. ";

    text += "Your destiny flow sits at " + destinyFlow + "% — this shows your life path ";
    text += "is guided, protected, and shaped by hidden spiritual forces. ";

    text += "Your protection field (" + protection + "%) confirms that negative energy ";
    text += "cannot overpower your journey — your path is divinely guarded. ";

    text += "Overall, your palm shows the journey of a strong soul, ";
    text += "who transforms pain into wisdom, challenges into strength, ";
    text += "and silence into deep spiritual insight. ";
    text += "You are not here to live an ordinary life — ";
    text += "you are here to awaken, guide, and evolve. ";

    // FINAL RETURN
    let html = "";
    html += "<h3>🌟 Destiny Fusion Summary — THE SEED · V90</h3>";
    html += text;

    return html;
}
function generateFullLifeStory(d) {

    const u = d.user;
    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // BASIC SCORES USED IN STORY
    const strength = Math.floor((l.life + a.vitality + c.root) / 3);
    const emotion = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const destiny = Math.floor((l.fate + a.destiny + c.crown) / 3);
    const intuition = Math.floor((a.intuition + c.thirdEye + l.mercury) / 3);
    const spirituality = Math.floor((a.spirituality + c.crown + c.thirdEye) / 3);

    // SHORT VERSION (placeholder)
    let story = "";
    story += "This is the beginning of your full 10,000-word destiny story. ";
    story += "Your journey begins with a soul carrying emotional depth (" + emotion + "%), ";
    story += "strength (" + strength + "%), and a unique destiny path (" + destiny + "%). ";
    story += "Your intuition (" + intuition + "%) guides your steps even when the world is silent. ";
    story += "Your spiritual field (" + spirituality + "%) shows ancient wisdom, karmic lessons, ";
    story += "and a life shaped by purpose, transformation, and inner awakening. ";
    story += "When you say 'Write Full Story Now', the entire life story will be created.";

    // FINAL OUTPUT
    let html = "";
    html += "<h3>📜 Full Life Story Generator — THE SEED · V100</h3>";
    html += story;

    return html;
}
i



