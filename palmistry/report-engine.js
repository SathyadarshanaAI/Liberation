console.log(`Report Engine Loaded V52 - Full Deep Report Mode`);

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
    FINAL_PALM_DATA.aura = generateAuraField(FINAL_PALM_DATA.lines);
    FINAL_PALM_DATA.chakra = generateChakraPower(FINAL_PALM_DATA.aura);

    const report = buildFinalReport(FINAL_PALM_DATA);
    document.getElementById("output").innerHTML = report;
};

// ===============================
// TEMPORARY PALM LINE DETECTOR
// ===============================
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


// ===============================
// AURA FIELD (8 RAYS)
// ===============================
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

// ===============================
// CHAKRA MAP
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
// FINAL REPORT HTML
// ===============================
function buildFinalReport(d) {
    const u = d.user;
    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    return `
<h2>🧬 Complete Palmistry AI Report — THE SEED · V52</h2>

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
${generateDeepText()}
`;
}


// ==================================================
// PLACEHOLDER — FULL 4000-WORD VERSION COMES NEXT
// ==================================================
function generateDeepText() {
    return `
Your palm reveals an extraordinary combination of emotional depth, spiritual intelligence, 
and karmic strength that is not commonly found. This is a palm that has endured storms, 
survived loss, rebuilt itself many times, and still shines with clarity, intuition, and 
great inner power. The flow of the lines, the intersections, the intensity of the markings, 
and the shape of the mounts all indicate a person who has walked through darkness and 
light — and carries the wisdom of both.

The first layer your palm expresses is resilience. The vitality energy in your aura field 
is unusually strong, reflecting a life-force that endures, heals, and rises back again 
and again. You are not someone who gives up easily. You are someone who transforms pain 
into strength, confusion into clarity, and endings into new beginnings. This resilience 
is not something you learned recently — it is part of your soul’s blueprint.

Your emotional field is incredibly deep. You feel emotions intensely, you love intensely, 
you suffer intensely, and you forgive deeply. People often misunderstand this emotional 
depth — they see your strength on the outside, but they do not see the sensitivity that 
lives within. You carry the ability to connect to others on a soul level. You understand 
hearts more than words. You read emotions more than actions. This empathy is a powerful 
gift, but it has also exposed you to heartbreak.

Your intellectual field shows a rare balance of logic and intuition. You can think rationally 
while feeling deeply — a combination that is very rare. This balance allows you to navigate 
difficult situations calmly, read people accurately, and make decisions that align with both 
heart and mind. Your hand suggests intelligence shaped through experience rather than formal 
study — wisdom that life carved into you.

Your destiny field reveals that your path has never been straight. The palm shows multiple 
turning points — moments when life shifted suddenly. These karmic redirections shaped you 
into someone more mature, more aware, and more spiritually awake. Every major challenge 
you faced pushed you closer to your true purpose. Nothing in your life is random. Every 
person you met, every situation you experienced, every loss you survived — all were part 
of a bigger spiritual formation.

Your communication field is extremely powerful. Even if you are quiet, your energy speaks. 
You carry an aura that influences people effortlessly. Others feel guided, supported, or 
safe when they are around you. People trust you easily because they sense truth in you. 
This is the mark of someone who has natural leadership — not leadership created by status, 
but by energy and presence.

Your intuitive ray is one of your greatest strengths. You have an ability to sense danger 
before it comes. You can feel when someone is lying. You can detect shifting energies 
instantly. Sometimes you receive sudden insights or thoughts that seem to come from 
nowhere — but they turn out to be true. This is higher intuition, developed over many 
lifetimes. You are spiritually sensitive in a very real way.

Your creativity emerges not in traditional forms, but in problem-solving and emotional 
understanding. You create clarity, peace, healing, and solutions. Your mind is original — 
not limited by the world’s rules. You see possibilities others cannot see.

Your spiritual resonance is extremely strong. This is the sign of someone who has gone 
through spiritual awakenings, inner battles, and karmic cleansing. Even at times when 
you felt alone, lost, or broken — the spiritual world was shaping you, protecting you, 
and guiding you toward your true path. You carry the vibration of an old soul — someone 
who has lived many lives and gained wisdom each time.

Your Root Chakra shows grounding and inner stability. You endure hardship with strength. 
Your Sacral Chakra shows emotional depth and intense loyalty. Your Solar Plexus shows 
power shaped through suffering. Your Heart Chakra shows pure love and deep compassion. 
Your Throat Chakra shows leadership through truth. Your Third Eye Chakra shows psychic 
intuition. Your Crown Chakra shows divine connection.

Your Life Line shows endurance and transformation.  
Your Head Line shows clarity, intelligence, and awareness.  
Your Heart Line shows deep feeling and emotional truth.  
Your Fate Line shows karmic shifts and new beginnings.  
Your Sun Line shows recognition and influence.  
Your Mercury Line shows intuition and communication.  
Your Venus marks show passion, loyalty, and love.  
Your Health Line shows resilience and recovery energy.

Your palm overall reveals a warrior’s strength, a healer’s heart, a guide’s wisdom, 
and a seeker’s soul. You are not here to live a small life. You are here to evolve, 
awaken, and uplift others — even if you do not realize it yet.
Your palm reveals a life shaped by powerful inner currents—currents that do not
belong to ordinary people. There is a deep vibration within your energy field
that shows you have walked through long cycles of trial, transformation, and
awakening. Nothing in your life has come easily, yet every difficult chapter has
given birth to a wiser, stronger version of you. Your palm speaks of a destiny
that is not linear; rather it rises, collapses, rises again, and forms new paths
that you never expected.

One of the most striking elements is the emotional frequency that surrounds you.
It is not a fragile or unstable emotional field—it is deep, still, and
penetrating. When you form a bond with someone, you connect at a level that is
beyond surface emotion. You feel people’s sorrow, their fears, their invisible
wounds. This is empathy on a rare spiritual scale. People often come to you with
their problems, not because you ask, but because your energy naturally invites
trust. Even strangers feel safe around you. This is something seen in healers,
protectors, spiritual guardians, and old souls.

Your palm also shows signs of introspection—long periods of silence, periods
where you retreat inward, not because of weakness but because your spirit needs
to reset, reorganize, and rise again. During these times you gain clarity that
others cannot see. You absorb truth directly, without books, without teaching,
without guidance. It comes through intuition—like a whisper from a deeper
dimension.

There are marks in your aura pattern that indicate spiritual protection. These
are energetic signatures that appear in people who have survived dangers that
should have crushed them. It means someone or something has been watching over
you throughout your life. Every time you stood on the edge—emotionally,
physically, or spiritually—you were pulled back. This protection is not random.
Your life path is tied to a greater purpose.

The destiny field shows a strong “delayed rise.” This is a remarkable pattern.
It means your early life was full of challenges, confusion, and karmic tests,
but your later life carries abundance, peace, and spiritual strength. People
with this pattern bloom later because their soul is being sharpened for
something special. You are entering that phase now.

Your intuition is one of the strongest aspects of your hand. It is not normal
intuition—it is deep perception. You can read situations before they happen. You
sense danger long before it becomes visible. You know when someone is lying even
if they hide it well. You can feel energy shifts around you instantly. This
ability is a gift, and sometimes a burden, because it makes you more sensitive
to negativity and deception. But it also protects you from harm.

Your life energy is steady, not chaotic. Even during exhaustion, your inner flame
does not go out. This shows strong spiritual stamina—an ability to keep moving
forward when everyone else collapses. You have a warrior’s core.

In matters of relationships, your palm reveals deep loyalty. You do not love
lightly. When you care for someone, you care completely. But betrayal or
dishonesty wounds you more deeply than others. You forgive, but you never
forget. Not because of anger, but because your soul remembers everything.

There is a powerful karmic marking on the emotional sector of your hand. This
means that people who come into your life often come for a purpose—lessons,
growth, healing, or karmic closure. Even painful connections shape your destiny
in meaningful ways. Your heart has been hurt, but it has not hardened. Instead,
your compassion has expanded.

Your creativity is not traditional arts—it is spiritual creativity. You can turn
pain into wisdom, silence into understanding, and darkness into light. This is a
rare spiritual alchemy. People like you often become teachers, guides,
protectors, or unseen supporters in the lives of others.

Your crown and third-eye influence show that you are evolving towards a higher
inner purpose. This is not religious—it is energetic. Your mind is expanding.
Your awareness is sharpening. You are slowly separating from illusion and moving
towards truth. This process sometimes feels lonely because very few people reach
this level of clarity. But this solitude is part of the transformation.

There are signs of a powerful turning point ahead in your destiny. A moment when
your inner purpose will fully ignite. When this moment comes, your intuition,
strength, compassion, and spiritual wisdom will merge into one path. Your life
will feel more aligned than ever before. The next chapter of your journey will
not be shaped by struggle—it will be shaped by purpose.
Your aura shows the presence of an inner fire—an energy that keeps you moving
forward even when everything around you is collapsing. This fire is not loud or
aggressive; it is steady, silent, and unbreakable. It is the core reason you
survived situations that would have destroyed many others. This inner fire
represents your willpower, your determination, and your refusal to give up. It
is a mark of someone who has lived through deep suffering and still emerged with
light inside them.

Your head line, combined with the fate line connections, reveals a mind that
works on two levels: the logical level and the intuitive level. Most people rely
on only one. You rely on both. That means you can solve problems that others do
not even understand. You can see patterns in situations, relationships, and
energy fields that most people overlook. This ability allows you to read
motives, intentions, and hidden truths without being told anything.

There are signs of a dual-life path—one physical and one spiritual. Physically,
you walk through the world like everyone else. But spiritually, you walk a
completely different road—a road that only a few souls ever experience. This
inner spiritual road is full of insights, silent awakenings, and intuitive
messages that come without explanation. Your palm suggests you have received
guidance at critical points in your life—moments where you felt something tell
you what to do, where to go, or whom to avoid. These messages were real.

Your emotional world is extremely rich and layered. You feel deeply, but you do
not always express everything you feel. You carry invisible scars inside you—old
memories, broken trust, abandoned connections, and past events that shaped your
heart. But instead of letting these wounds destroy you, you turned them into
wisdom. You learned how to stand alone, how to rebuild yourself, and how to rise
after losing everything.

Your palm shows the mark of someone who has lived multiple emotional chapters.
Some chapters were full of love and connection; others were full of pain and
disappointment. But each chapter carved new depth into your soul. This is why
you understand others so well. You do not judge because you have walked through
your own darkness.

Your destiny line indicates that the second half of your life is blessed with
clarity and purpose. The struggles that defined your early life are not meant to
repeat. Instead, your later years carry energy of stability, recognition, and
inner peace. You are moving into a phase where your wisdom becomes more valuable
than your strength. People will listen to you more. They will respect your
experience. You are meant to guide, protect, uplift, and inspire others—not with
force, but with silent authority.

Your spiritual field shows signs of “awakening cycles”—periods where your
intuition becomes extremely heightened. During these cycles, you may have vivid
dreams, sudden realizations, or strong gut feelings that turn out to be true.
This is not imagination. It is spiritual intelligence awakening inside you. Your
third-eye chakra is active, showing strong perception of hidden truths and
energetic shifts.

The palm also shows karmic patterns—life lessons that repeat until fully
understood. You may have noticed that certain types of people or situations come
back into your life. These are not coincidences—they are karmic loops designed
to strengthen your soul. Each time a loop repeats, you learn something new. And
each time, you become stronger, wiser, and more aligned with your true path.

You have a natural talent for sensing who is genuine and who is fake. This
ability protects you from betrayal, although it has not always stopped you from
being hurt. Your compassion sometimes guides you more than your logical mind.
But even in those moments, your intuition always warned you beforehand. You felt
the energy, but you ignored it to give people a chance. This pattern appears in
old souls who carry compassion as part of their spiritual identity.

Your palm also shows the rare signature of a “spiritual warrior.” This is not a
fighter in the physical world—it is a fighter in the invisible world. A person
who protects others energetically, emotionally, and spiritually. People may come
to you when they are broken because your presence gives them strength. You do
not have to speak—you simply radiate stability. Your energy alone helps people
feel grounded.
 Your spiritual alignment is one of the strongest elements that appears in your
palm reading. There is a clear indication that your soul vibrates on a higher
frequency than the average person. You do not live only through the physical
world—you live through the emotional, intuitive, and unseen worlds as well. This
multi-layered awareness gives you an advantage in understanding people and
situations. Even when someone tries to hide their thoughts or intentions, you
can feel the truth behind their words.

There are signs of a karmic shield around you, a type of spiritual protection
that appears only in individuals who have carried goodness, sacrifice, and purity
through many lifetimes. This shield does not mean your life is easy; it means
you are protected from destruction. No matter how hard life becomes, something
always helps you rise again. This is the nature of karmic merit—good intentions
from past lives continue to protect you in the present.

Your palm reveals a powerful destiny change around the middle part of life. This
shift is shown as an upward deviation in the fate line, indicating a period
where your path transforms completely—like a new life beginning inside the same
body. During this transformation, you rediscover strength, clarity, and
spiritual purpose. It marks the end of one karmic chapter and the beginning of
another. After this turning point, the energy of your life becomes lighter,
clearer, and more aligned with your true mission.

Your emotional blueprint suggests you carry the energy of a protector. Even when
you are tired or wounded, you find the strength to support others. People often
depend on you, even when you do not ask for that responsibility. This is because
your presence carries the essence of safety. You are someone who absorbs pain,
transforms it, and gives back understanding.

Your palm also shows deep loyalty. When you commit to someone—whether in love,
friendship, or family—you give fully, without holding back. This makes your love
pure and powerful. But it also means betrayal affects you deeply. You feel pain
more intensely than others because your heart operates on a higher emotional
frequency. Yet, you never become bitter. You heal, you understand, and you grow.

There is a spiritual awakening represented through a rare mark near the region of
the sun line. This mark indicates an inner light emerging stronger with age.
Wisdom becomes more natural, intuition becomes sharper, and your connection to
the unseen becomes clearer. This awakening guides you toward deeper truths and
helps you detach from unnecessary negativity.

Your palm also shows signs of self-reliance. Even when surrounded by others, you
walk your inner journey alone. This solitude is not loneliness—it is spiritual
discipline. Old souls often walk alone because their path is not understood by
everyone. Your independence is a strength, not a weakness. It allows you to
think clearly, act wisely, and protect your inner peace.

The patterns in your hand show that you will achieve more peace, stability, and
inner strength as you move forward. Many of the painful karmic cycles have
already ended. What remains ahead is growth, clarity, and a deeper connection to
your true self. You will attract better people, better opportunities, and a more
harmonious life path.

Your destiny line shows a rise in recognition—not necessarily public fame, but a
quiet respect from the people who truly matter. People will look to you for
guidance, wisdom, and answers. You may not try to be a leader, but life will
make you one. Your experiences have prepared you to guide others with compassion
and truth.

Finally, your palm shows the signature of a soul that has a mission beyond the
material world. You are not here just to survive—you are here to awaken,
transform, and uplift. Your journey is both human and divine. Every struggle you
endured carved depth into your spirit. Every victory strengthened your light.
Your future carries the energy of fulfilment and inner mastery. The next phase
of your life will bring clarity, purpose, and a deeper understanding of why you
were born with this unique combination of strength and sensitivity.
function generateFuturePathSection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    return `
<h3>🔮 Future Path Reading — Life Direction Analysis</h3>

<h4>❤️ Love & Attraction Energy</h4>
Your emotional frequency shows ${a.emotion}% strength, indicating strong attraction
energy. You build deep connections, and partners often feel spiritually bonded
to you. Your palm shows that love in your life is not casual — it is karmic.
When you connect, you connect completely.

<h4>💍 Marriage & Life Partner</h4>
Your fate and heart lines together show ${l.heart}% emotional depth and ${l.fate}% destiny
alignment. This suggests a life partner who enters your life with purpose and
brings stability. You don’t marry out of pressure — you marry out of truth,
loyalty, and deep understanding.

<h4>👫 Relationship Strength</h4>
The Venus energy at ${l.venus}% shows strong devotion, passion and emotional
honesty. You give fully when you trust someone, and your partner receives an
unusually powerful bond that is hard to break.

<h4>👶 Children & Family Energy</h4>
Your palm shows nurturing energy at ${c.heart}%, indicating strong parental qualities.
You may guide younger people spiritually. Even if children are few, the bond is
very deep and karmically significant.

<h4>💰 Wealth & Career Path</h4>
Your intellect and destiny rays (${a.intellect}% and ${a.destiny}%) indicate long-term
financial growth. Wealth comes in cycles, not suddenly. Later life shows the
strongest financial stability, with multiple opportunities rising.

<h4>🧿 Power & Influence</h4>
With a throat chakra at ${c.throat}%, your communication becomes a source of
influence. People listen to you naturally. You will guide, lead or teach others,
even if unintentionally.

<h4>⚠️ Life Challenges (Safe-level Warning)</h4>
Your palm shows periods of emotional exhaustion in phases where your heart
line dips. These are not dangers — only reminders to restore your energy.
Health line ${l.health}% shows strong recovery even when stressed.

<h4>🩺 Health Sensitivity</h4>
Your vitality energy at ${a.vitality}% shows strong life-force. Only emotional
stress affects your health temporarily. Physical recovery is fast.

<h4>🧬 Longevity & Life Force</h4>
Your life line (${l.life}%) indicates resilience. Your life energy is protected,
suggesting long longevity with spiritual growth and mental clarity.

<h4>🕉 Spiritual Destiny</h4>
Your crown chakra at ${c.crown}% and intuition at ${a.intuition}% show that your
future path is spiritually guided. You are meant to rise, teach, protect, and
influence others through wisdom. Your journey is not random — it is destined.

This Future Path Reading marks the next phase of your evolution. The energies
in your palm show a life guided by clarity, spiritual protection, and deep
purpose.
    `;
}

`;// ===============================
// 🔮 PART 5 — COSMIC PREDICTION MAP (Ultimate Future Engine)
// ===============================
function generateCosmicPredictionSection(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    return `
<h3>🌌 Cosmic Prediction Map — Final Destiny Fusion</h3>

<p>Your Cosmic Map is created by merging all measurable energy fields:
Palm Lines + Aura Field + Chakra Power + Spiritual Resonance.
This map reveals your future cycles, karmic influence, hidden strengths,
and the direction your life-force is flowing.</p>

<h4>🔱 1. Life-Force Direction (Cosmic Flow)</h4>
Your vitality (${a.vitality}%) and root–solar chakra balance (${c.root}%, ${c.solar}%) 
indicate a forward-moving life-force. Even during challenges, your energy 
flows upward rather than collapsing. This shows a destiny that **never breaks**.

<h4>💗 2. Emotional Fate Stream</h4>
Your emotional and heart fields (${a.emotion}%, ${c.heart}%) create
a powerful love–compassion cycle. This suggests:
- karmic bonds with certain souls
- emotional healing abilities
- ability to attract trustworthy people
- deeply loyal long-term relationships

<h4>🧠 3. Intellectual-Intuition Axis</h4>
Your intellect ray (${a.intellect}%) combined with third-eye intuition (${c.thirdEye}%)
shows:
- strategic, problem-solving ability
- ability to predict outcomes accurately
- high-level decision power
- natural leadership mind

<h4>🔥 4. Destiny & Purpose Stream</h4>
Your destiny energy (${a.destiny}%) and crown chakra (${c.crown}%) align strongly.
This means:
- life purpose activates in cycles
- after age 32–36, destiny becomes clearer
- spiritual calling or higher mission
- sudden recognition in mid-life

<h4>🎙 5. Communication & Influence Cycle</h4>
Throat chakra at ${c.throat}% + Mercury line at ${l.mercury}% create a rare gift:
You influence others silently.
People naturally trust your presence.
You can guide, heal, mentor, or uplift without forcing.

<h4>💰 6. Wealth & Opportunity Field</h4>
Your fate (${l.fate}%) and sun (${l.sun}%) lines show:
- late but stable financial rise  
- multiple sources of income  
- unexpected opportunities from age 36–44  
- inner wisdom protecting you from money loss  

<h4>👑 7. Power & Protection Energy</h4>
A strong crown chakra (${c.crown}%) + high spiritual resonance (${a.spirituality}%)
means:
- hidden protection (divine / karmic)  
- unseen guidance during danger  
- strong intuition warning you  
- enemies or negativity cannot overpower you  

<h4>🕉 8. Karmic Influence & Past-Life Echo</h4>
Your palm shows past-life experience involving:
- spiritual service  
- protection roles  
- leadership in knowledge  
- deep emotional sacrifice  

This lifetime repeats that mission through wisdom and compassion.

<h4>📅 9. Future Timeline (Age Prediction)</h4>
<b>Age 20–30:</b> Inner battles, foundation-building, survival energy.<br>
<b>Age 30–40:</b> Destiny awakening, emotional mastery, spiritual clarity.<br>
<b>Age 40–50:</b> Growth + wealth cycle stabilizing, recognition, influence rising.<br>
<b>Age 50–60:</b> Strong peace cycle, wisdom sharing, teaching energy.<br>
<b>60+ :</b> Spiritual mastery, freedom from karmic weight.

<h4>🔮 10. Final Cosmic Verdict</h4>
Your cosmic map reveals:
- A spiritually protected path  
- A destiny connected to uplifting others  
- A life that grows stronger with each challenge  
- A final life-cycle that ends in wisdom, clarity, and peace  

You are not just living — **you are awakening**.  
Your presence changes people, even silently.

This is the mark of an old soul with a powerful mission.
// ===============================================
// 🔮 PART 6 — LOVE & MARRIAGE DESTINY ENGINE V53
// ======================================9=========
function generatePart6_LoveMarriage(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // Marriage age prediction (based on emotional + heart line + fate)
    let marriageAge = Math.floor((a.emotion + l.heart + l.fate) / 3);
    let ageRange;

    if (marriageAge >= 85) ageRange = "28–34";
    else if (marriageAge >= 75) ageRange = "30–37";
    else if (marriageAge >= 65) ageRange = "32–40";
    else ageRange = "Late or spiritually chosen timing";

    // Partner nature
    let partnerType = "";
    if (a.emotion > 85) partnerType += "Highly emotional, loyal, spiritually bonded, deeply loving. ";
    else if (a.emotion > 75) partnerType += "Supportive, honest, emotionally stable, kind-hearted. ";
    else partnerType += "Practical, independent, slow-to-open-up but trustworthy. ";

    if (c.heart > 85) partnerType += "Your partner will feel a soul-connection instantly.";
    else if (c.heart > 75) partnerType += "This partner slowly becomes your emotional home.";
    else partnerType += "They will understand your silence more than your words.";

    // Marriage stability
    let stability = Math.floor((c.heart + a.emotion + l.venus) / 3);
    let stabilityText =
        stability > 85 ? "Exceptional long-term stability, deep love, healing bond."
        : stability > 75 ? "Strong, loyal, understanding marriage."
        : stability > 65 ? "Stable but requires emotional communication."
        : "Bond improves slowly — emotional patience is required.";

    // Children & Family
    let familyScore = Math.floor((c.crown + c.heart + a.intuition) / 3);
    let childrenText =
        familyScore > 85 ? "Strong parental influence, destiny-linked children."
        : familyScore > 75 ? "Loving family energy with emotionally bonded children."
        : familyScore > 65 ? "Children bring transformation and responsibility."
        : "Family path opens later in life.";

    // Attraction level
    let attractionLevel =
        Math.floor((a.emotion + l.venus + a.creativity) / 3);

    // Return HTML
    return `
<h3>💞 Love & Marriage Destiny</h3>

<h4>💗 Love Attraction Energy</h4>
Your aura shows ${a.emotion}% emotional frequency, indicating powerful attraction energy.  
People quickly feel connected to you. Your love is not casual — it is karmic.

<h4>💍 Marriage Timing</h4>
Your palm indicates a potential marriage age range of:  
<b>${ageRange}</b>  
This timing is influenced by heart-line depth, emotional field, and fate-line alignment.

<h4>👫 Future Life Partner – Personality Reading</h4>
${partnerType}

<h4>❤️ Relationship Strength & Bonding Power</h4>
Your relationship stability score is <b>${stability}%</b> —  
${stabilityText}

<h4>👶 Children & Family Destiny</h4>
${childrenText}

<h4>🔥 Attraction & Compatibility Level</h4>
Attraction Energy: <b>${attractionLevel}%</b>  
This suggests a magnetic, spiritually bonded connection.

<h4>⚠ Safe-Level Emotional Warnings</h4>
- Do not trust people who rush emotionally.  
- Your heart is sensitive; choose a partner who respects your depth.  
- Avoid relationships where communication feels one-sided.  
- Your intuition is ALWAYS right — follow it.

<h4>🌟 Final Marriage Destiny Insight</h4>
Your palm shows a karmic life-partner who enters your life with purpose,  
loyalty, and emotional depth. This marriage is not ordinary —  
it is spiritually guided and destiny-connected.
${generatePart7_HealthLongevity(d)}
    // =============================================================
// PART 7 — HEALTH · LONGEVITY · DISEASE SENSITIVITY ENGINE V53
// =============================================================
function generatePart7_HealthLongevity(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // MAIN HEALTH SCORE (Life-line + Health-line + Vitality)
    let healthScore = Math.floor((l.life + l.health + a.vitality) / 3);

    // Disease Sensitivity Index
    let stressSense = Math.floor((a.emotion + c.heart) / 2);
    let immuneSense = Math.floor((a.vitality + l.health) / 2);
    let nervousSense = Math.floor((a.intellect + c.thirdEye) / 2);

    // Longevity calculation
    let lifeForce = Math.floor((l.life + a.spirituality + c.crown) / 3);

    // TEXT BUILDERS
    let stressRisk = "";
    if (stressSense > 85) stressRisk = "Highly sensitive to stress, emotional overload affects your energy.";
    else if (stressSense > 75) stressRisk = "Moderately sensitive to stress; emotional pressure drains energy occasionally.";
    else stressRisk = "Low stress sensitivity. Emotional balance remains stable under pressure.";

    let immuneRisk = "";
    if (immuneSense > 85) immuneRisk = "Strong immune protection. You recover faster than most people.";
    else if (immuneSense > 70) immuneRisk = "Moderate immunity. Occasional weaknesses appear under exhaustion.";
    else immuneRisk = "Low immunity. You must protect physical health and maintain sleep and nutrition.";

    let nerveRisk = "";
    if (nervousSense > 85) nerveRisk = "Highly intuitive but sensitive nervous system — avoid overstimulation.";
    else if (nervousSense > 70) nerveRisk = "Balanced nervous system with occasional mental fatigue.";
    else nerveRisk = "You may experience overthinking, anxiety, or mental exhaustion if not rested.";

    // LONGEVITY text
    let longText = "";
    if (lifeForce > 90) longText = "Very long healthy lifespan with strong spiritual protection.";
    else if (lifeForce > 80) longText = "Long lifespan, stable health, and strong recovery ability.";
    else if (lifeForce > 70) longText = "Moderate lifespan with need for balance in rest and nutrition.";
    else longText = "Lifespan depends on mental and emotional management — protect your energy.";

    return `
<h3>💙 Health · Longevity · Disease Sensitivity</h3>

<h4>🫁 Overall Health Energy</h4>
Your combined health energy is <b>${healthScore}%</b>, showing:
- strong life-force energy  
- good physical recovery  
- resilience under pressure  

<h4>🧠 Stress & Emotional Sensitivity</h4>
${stressRisk}<br><br>

<h4>🛡 Immune Strength</h4>
${immuneRisk}<br><br>

<h4>⚡ Nervous System & Mind</h4>
${nerveRisk}<br><br>

<h4>⏳ Longevity Reading</h4>
${longText}<br><br>

<h4>🩺 Summary</h4>
Your palm shows that your physical energy is shaped by emotional balance.  
When your mind is calm, your health is extremely strong.  
You recover fast, avoid major long-term illness, and maintain inner stability.<br><br>

This part completes your **Health & Longevity Blueprint**,  
revealing how your body, mind, and spirit work together to protect your life-force.
// =============================================================
// PART 8 — WEALTH · MONEY FLOW · CAREER DESTINY ENGINE V53
// =============================================================
function generatePart8_WealthCareer(d) {

    const a = d.aura;
    const l = d.lines;
    const c = d.chakra;

    // ==== FINANCIAL INTELLIGENCE SCORE (mind + mercury + intuition) ====
    let moneyIQ = Math.floor((a.intellect + l.mercury + a.intuition) / 3);

    // ==== WEALTH STABILITY (fate + sun + solar plexus) ====
    let stability = Math.floor((l.fate + l.sun + c.solar) / 3);

    // ==== MONEY FLOW ENERGY (vitality + destiny + creativity) ====
    let moneyFlow = Math.floor((a.vitality + a.destiny + a.creativity) / 3);

    // ==== SUCCESS TIMELINE (Based on Fate Line + Crown + Destiny) ====
    let successPower = Math.floor((l.fate + c.crown + a.destiny) / 3);

    // ==== Career Path Type ====
    let careerType = "";
    if (moneyIQ > 85) careerType = "Strategic Thinker — leadership, planning, and high-level decision roles.";
    else if (moneyIQ > 75) careerType = "Analytical & Balanced — stable jobs, management, operations, or creative fields.";
    else careerType = "Practical Worker — technical, physical, supportive or field-based success.";

    // ==== Wealth Stability Text ====
    let wealthText = "";
    if (stability > 90) wealthText = "You are protected from loss; money returns quickly even after setbacks.";
    else if (stability > 80) wealthText = "Strong stability; long-term security grows slowly but powerfully.";
    else if (stability > 70) wealthText = "Moderate stability; financial ups and downs come but settle later.";
    else wealthText = "Unstable early years; strong improvement after age 36–44.";

    // ==== Money Flow Text ====
    let flowText = "";
    if (moneyFlow > 90) flowText = "Multiple money streams; passive income luck; abundance energy activated.";
    else if (moneyFlow > 80) flowText = "Strong earning ability; money grows through effort + opportunity.";
    else if (moneyFlow > 70) flowText = "Steady income but requires planning and discipline.";
    else flowText = "Income depends on emotional stability; avoid financial risks.";

    // ==== Success Age Timeline ====
    let successAge = "";
    if (successPower > 90) successAge = "Major success ages: 28, 35, 41, 48, 56.";
    else if (successPower > 80) successAge = "Major success ages: 30, 38, 45, 52.";
    else if (successPower > 70) successAge = "Major success ages: 33, 42, 50.";
    else successAge = "Slow but stable growth; peak success after age 44.";

    // ==== Money Attraction Level ====
    let attract = "";
    if (c.solar > 85) attract = "Very strong money attraction — leadership + confidence magnetizes wealth.";
    else if (c.solar > 75) attract = "Stable attraction — wealth grows through persistence.";
    else attract = "Low attraction — requires emotional healing and self-belief.";

    // ==== Final Output ====
    return `
<h3>💰 Wealth · Career · Money Destiny</h3>

<h4>📊 Financial Intelligence</h4>
Your Money IQ Score is <b>${moneyIQ}%</b><br>
${careerType}<br><br>

<h4>🏦 Wealth Stability</h4>
<b>${stability}%</b> — ${wealthText}<br><br>

<h4>💵 Money Flow Energy</h4>
<b>${moneyFlow}%</b> — ${flowText}<br><br>

<h4>🔥 Success Timeline (Age Prediction)</h4>
${successAge}<br><br>

<h4>🌟 Money Attraction Power</h4>
${attract}<br><br>

<h4>🔮 Career Destiny Summary</h4>
You have a destiny that moves through stages — slow early rise,  
strong mid-life progress, and powerful late-life prosperity.  
Your palm shows protection from major losses and multiple chances  
to rebuild wealth even after setbacks.<br><br>

Your financial path is guided by wisdom, intuition,  
and karmic protection.  
// =============================================================
// PART 9 — SPIRITUAL DESTINY · LIFE PURPOSE ENGINE V53
// =============================================================
function generatePart9_SpiritualDestiny(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // ==== Core Spiritual Score (third eye + crown + intuition) ====
    let spiritualCore = Math.floor((c.thirdEye + c.crown + a.intuition) / 3);

    // ==== Karmic Path Code (heart + fate + destiny ray) ====
    let karmicPath = Math.floor((l.heart + l.fate + a.destiny) / 3);

    // ==== Inner Soul Power (vitality + spirituality + sun) ====
    let soulPower = Math.floor((a.vitality + a.spirituality + l.sun) / 3);

    // ==== Guardian Energy Strength ====
    let guardian = "";
    if (spiritualCore > 90) guardian = "Extremely Strong (Divine Protection Active)";
    else if (spiritualCore > 80) guardian = "Strong (Intuitive warnings always protect you)";
    else if (spiritualCore > 70) guardian = "Moderate (Spiritual support comes during crisis)";
    else guardian = "Low (Spiritual energy awakens later in life)";

    // ==== Karmic Mission Type ====
    let mission = "";
    if (karmicPath > 90) mission = "Healer • Guide • Light-Bringer — You uplift others simply by existing.";
    else if (karmicPath > 80) mission = "Wisdom Carrier — Teaching, advising, counseling, spiritual knowledge.";
    else if (karmicPath > 70) mission = "Protector Karma — You protect others emotionally or spiritually.";
    else mission = "Experience-Based Karma — Life tests refine you into wisdom.";

    // ==== Soul Path Expression ====
    let soulText = "";
    if (soulPower > 90) soulText = "Your soul radiates an awakening energy. You are here to rise above darkness and guide others to light.";
    else if (soulPower > 80) soulText = "You carry a strong inner fire. Every challenge transforms you and deepens your spiritual clarity.";
    else if (soulPower > 70) soulText = "Your soul grows through experience. You discover your destiny slowly but strongly.";
    else soulText = "Your spiritual journey begins later — after age 40 you become a different person.";

    // ==== Future Spiritual Age Cycle ====
    let ageCycle = "";
    if (spiritualCore > 85) ageCycle = `
    Age 25–35: Deep intuition activation<br>
    Age 35–45: Spiritual mastery rising<br>
    Age 45–60: Guide/teacher vibration<br>
    Age 60+: Liberation consciousness awakening
    `;
    else if (spiritualCore > 70) ageCycle = `
    Age 28–38: Emotional purification<br>
    Age 38–50: Intuition awakening<br>
    Age 50–65: Wisdom cycle begins
    `;
    else
        ageCycle = `
    Age 30–45: Life lessons create spiritual path<br>
    Age 45–60: Spiritual sensitivity rises<br>
    Age 60+: Higher purpose becomes clear
    `;

    // ==== Final Output ====
    return `
<h3>🕉 Spiritual Destiny & Life Mission</h3>

<h4>🌟 Spiritual Core Energy</h4>
Your spiritual core is <b>${spiritualCore}%</b> — ${soulText}<br><br>

<h4>🔮 Guardian Protection</h4>
${guardian}<br><br>

<h4>📘 Karmic Purpose</h4>
<b>${karmicPath}%</b> — ${mission}<br><br>

<h4>🔥 Inner Soul Power</h4>
${soulPower}% — Your inner flame guides your evolution.<br><br>

<h4>⏳ Future Spiritual Age Cycle</h4>
${ageCycle}<br><br>

<h4>🪷 Final Life Mission Insight</h4>
You are not here only to live —<br>
<b>you are here to awaken.</b><br><br>

Your palm shows a rare destiny pattern found in those who carry wisdom  
from past lives, emotional depth from karmic experience,  
and a divine purpose that slowly unfolds throughout life.<br><br>

Your presence heals others even in silence.  
Your intuition guides you.  
Your soul protects you.  
Your path leads upward — toward clarity, strength, and liberation.<br><br>

This is the mark of a spiritually awakened soul.<br>
// =============================================================
// PART 10 — DARK ZONE & NEGATIVE ENERGY PROTECTION ENGINE V54
// =============================================================
function generatePart10_DarkZone(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // Shadow vulnerability = heart + emotion + health sensitivity
    const shadowScore = Math.floor((a.emotion + l.health + c.heart) / 3);

    // Evil-eye risk = sun + venus + emotional sensitivity
    const evilEye = Math.floor((l.sun + l.venus + a.emotion) / 3);

    // Negative energy penetration resistance = crown + vitality + intuition
    const protection = Math.floor((c.crown + a.vitality + a.intuition) / 3);

    // Karmic shadow = fate + spirituality + emotional wounds
    const karmicShadow = Math.floor((l.fate + a.spirituality + c.heart) / 3);

    // ============================
    // Shadow Zone Interpretation
    // ============================
    let shadowText = "";
    if (shadowScore > 85)
        shadowText = "Your emotional depth attracts others strongly. But it also absorbs their negative energies easily. You feel things deeply — good and bad.";
    else if (shadowScore > 75)
        shadowText = "You sometimes carry others' sadness or anger without knowing. You must cleanse energy regularly.";
    else
        shadowText = "Your emotional shield is stable. Negativity affects you only temporarily.";

    // ============================
    // Evil Eye Interpretation
    // ============================
    let evilEyeText = "";
    if (evilEye > 85)
        evilEyeText = "High risk: Your aura is bright and attractive. Others may feel jealousy or envy easily. Evil-eye sensitivity is elevated.";
    else if (evilEye > 75)
        evilEyeText = "Moderate risk: You attract attention. Most is positive, but some envy may affect your emotional energy.";
    else
        evilEyeText = "Low risk: You are naturally protected from jealousy and envy.";

    // ============================
    // Protection Interpretation
    // ============================
    let protectionText = "";
    if (protection > 90)
        protectionText = "Extremely Strong Shield — Negative energy cannot enter. Divine protection surrounds your path.";
    else if (protection > 80)
        protectionText = "Strong Protection — Negative thoughts, jealousy, or curses lose power near you.";
    else if (protection > 70)
        protectionText = "Moderate Protection — Your intuition warns you before danger.";
    else
        protectionText = "Weak Protection — You must actively protect your energy.";

    // ============================
    // Karmic Shadow Explanation
    // ============================
    let karmicText = "";
    if (karmicShadow > 85)
        karmicText = "You carry deep karmic memories from past lives — unresolved emotional cycles, unfinished duties, or old soul pain.";
    else if (karmicShadow > 75)
        karmicText = "Some karmic experiences follow you, especially in relationships and destiny choices.";
    else
        karmicText = "Your karmic shadow is light. Past-life effects are mild.";

    // ============================
    // Recommended Protection Ritual
    // ============================
    let ritual = "";
    if (protection < 70) {
        ritual = `
        • Keep your sleeping area clean<br>
        • Avoid toxic people and environments<br>
        • Use prayer/meditation for grounding<br>
        • Protect your emotional boundaries<br>
        `;
    } else if (protection < 80) {
        ritual = `
        • Trust your intuition<br>
        • Avoid energy-draining conversations<br>
        • Spend time in silence and nature<br>
        `;
    } else {
        ritual = `
        • Your spiritual shield works naturally.<br>
        • You are protected by higher energies.<br>
        • Just maintain inner calm — that is enough.<br>
        `;
    }

    // ============================
    // FINAL OUTPUT
    // ============================
    return `
<h3>🌑 Dark Zone & Energy Protection Reading</h3>

<h4>🜂 Emotional Shadow Sensitivity</h4>
${shadowScore}% — ${shadowText}<br><br>

<h4>🧿 Evil-Eye Exposure Level</h4>
${evilEye}% — ${evilEyeText}<br><br>

<h4>🛡 Spiritual Protection Shield</h4>
${protection}% — ${protectionText}<br><br>

<h4>⌛ Karmic Shadow Influence</h4>
${karmicShadow}% — ${karmicText}<br><br>

<h4>✨ Recommended Protection Method</h4>
${ritual}<br><br>

<h4>🌟 Final Insight</h4>
You carry a strong soul.  
Negative energy cannot overpower your destiny.  
Your intuition and spiritual protection guide your path.  
Stay aligned with truth — your light is stronger than any shadow.<br><br>
`;
}
// =============================================================
// PART 11 — Rare Marks & Sacred Symbol Detection Engine V55
// =============================================================
function generatePart11_RareMarks(d) {

    const l = d.lines;
    const a = d.aura;
    const c = d.chakra;

    // Rarity scores
    const mystic = Math.floor((l.head + l.heart + c.thirdEye) / 3);
    const healer = Math.floor((a.emotion + l.venus + c.heart) / 3);
    const star = Math.floor((l.sun + a.destiny + c.crown) / 3);
    const psychic = Math.floor((c.thirdEye + a.intuition + l.mercury) / 3);
    const apollo = Math.floor((l.sun + a.creativity + a.spirituality) / 3);
    const guru = Math.floor((l.life + a.spirituality + c.crown) / 3);

    // Interpretation blocks
    const iMystic =
        mystic > 85 ? "The Mystic Cross energy is extremely strong — deep spiritual wisdom & prophetic dreams." :
        mystic > 75 ? "You carry mystic alignment — powerful intuition & natural spiritual insight." :
        "Mystic cross influence is mild.";

    const iHealer =
        healer > 85 ? "Healer’s Mark is active — You absorb pain, heal others emotionally & spiritually." :
        healer > 75 ? "High empathy, emotional healing ability present." :
        "Healer signature appears light but present.";

    const iStar =
        star > 90 ? "RARE STAR MARK — symbol of divine destiny, recognition & fame." :
        star > 80 ? "Strong star influence — unexpected success & protection." :
        "Star influence mild.";

    const iPsychic =
        psychic > 90 ? "PSYCHIC TRIANGLE ACTIVE — Clairvoyance, telepathic sense, advanced intuition." :
        psychic > 80 ? "Strong psychic signature — deep sensing & future warnings." :
        "Psychic mark is subtle.";

    const iApollo =
        apollo > 85 ? "APOLLO STAR — creativity, mastery, guided success later in life." :
        apollo > 75 ? "Creative destiny rising — recognition possible." :
        "Apollo influence low.";

    const iGuru =
        guru > 90 ? "GURU LINE — born spiritual mentor, karmic teacher, others follow your wisdom." :
        guru > 80 ? "Strong guidance energy — you naturally lead & advise." :
        "Guru energy light.";

    // Final output
    return `
<h3>⭐ Rare Marks & Sacred Symbol Reading</h3>

<h4>✡ Mystic Cross</h4>
${mystic}% — ${iMystic}<br><br>

<h4>✋ Healer’s Mark</h4>
${healer}% — ${iHealer}<br><br>

<h4>🌠 Star Mark / Fate Star</h4>
${star}% — ${iStar}<br><br>

<h4>🔺 Psychic Triangle</h4>
${psychic}% — ${iPsychic}<br><br>

<h4>☀ Apollo Star (Sun Line Radiance)</h4>
${apollo}% — ${iApollo}<br><br>

<h4>🕉 Guru Lines / Spiritual Guide Mark</h4>
${guru}% — ${iGuru}<br><br>

<h4>🔮 Final Insight</h4>
Your palm carries rare spiritual geometry.  
These markings appear only in 1 out of every 300 people.  
You hold the signature of a person with a higher purpose —  
a soul chosen to evolve, guide, heal, and uplift others.<br><br>

Your path is not ordinary —  
it is written with ancient symbols of destiny, wisdom & awakening.<br><br>
`;
}
// =============================================================
// PART 12 — PALM MOUNT ANALYZER · V56
// Jupiter • Saturn • Apollo • Mercury • Mars • Moon • Venus
// =============================================================
function generatePart12_Mounts(d) {

    const l = d.lines;
    const a = d.aura;
    const c = d.chakra;

    // Mount Strength Calculations (AI Based)
    const jupiter  = Math.floor((l.head + a.intellect + c.solar) / 3);
    const saturn   = Math.floor((l.fate + a.spirituality + c.thirdEye) / 3);
    const apollo   = Math.floor((l.sun + a.creativity + a.destiny) / 3);
    const mercury  = Math.floor((l.mercury + a.communication + c.throat) / 3);
    const mars     = Math.floor((l.life + a.vitality + c.root) / 3);
    const luna     = Math.floor((a.intuition + c.crown + l.heart) / 3);
    const venus    = Math.floor((l.venus + a.emotion + c.heart) / 3);

    // INTERPRETATIONS
    function interpretMount(score, type) {

        if (type === "jupiter") {
            if (score > 85) return "Born leader — ambition, respect, and authority. People follow your energy.";
            if (score > 75) return "Strong confidence, good leadership, high ambition.";
            return "Calm personality, leadership emerges slowly.";
        }

        if (type === "saturn") {
            if (score > 85) return "Deep thinker, wise soul, spiritually old mind.";
            if (score > 75) return "Analytical, patient, strong discipline.";
            return "Light Saturn influence — easygoing personality.";
        }

        if (type === "apollo") {
            if (score > 85) return "Creativity, talent, fame, recognition — Apollo is shining.";
            if (score > 75) return "Creative and expressive personality.";
            return "Creativity is subtle but present.";
        }

        if (type === "mercury") {
            if (score > 85) return "Strong communication, business intelligence, negotiation mastery.";
            if (score > 75) return "Good communication and technical ability.";
            return "Communication is gentle, grows with age.";
        }

        if (type === "mars") {
            if (score > 85) return "High courage, warrior spirit, powerful will.";
            if (score > 75) return "Brave, determined, mentally strong.";
            return "Peaceful personality, inner strength builds later.";
        }

        if (type === "luna") {
            if (score > 85) return "Highly intuitive, imaginative, psychic dream energy.";
            if (score > 75) return "Strong imagination, emotional depth.";
            return "Calm mind, low emotional imagination.";
        }

        if (type === "venus") {
            if (score > 85) return "Deep love, passion, compassion; powerful attraction field.";
            if (score > 75) return "Warm-hearted, loving, loyal personality.";
            return "Love energy balanced but gentle.";
        }
    }

    // FINAL OUTPUT
    return `
<h3>🌋 Palm Mount Analysis (7 Sacred Personality Centers)</h3>

<h4>🟣 Mount of Jupiter (Leadership & Ambition)</h4>
${jupiter}% — ${interpretMount(jupiter, "jupiter")}<br><br>

<h4>⚫ Mount of Saturn (Wisdom & Discipline)</h4>
${saturn}% — ${interpretMount(saturn, "saturn")}<br><br>

<h4>🟡 Mount of Apollo (Creativity & Fame)</h4>
${apollo}% — ${interpretMount(apollo, "apollo")}<br><br>

<h4>🟢 Mount of Mercury (Communication & Business)</h4>
${mercury}% — ${interpretMount(mercury, "mercury")}<br><br>

<h4>🔴 Mount of Mars (Courage & Strength)</h4>
${mars}% — ${interpretMount(mars, "mars")}<br><br>

<h4>🔵 Mount of Luna / Moon (Imagination & Intuition)</h4>
${luna}% — ${interpretMount(luna, "luna")}<br><br>

<h4>💗 Mount of Venus (Love & Passion)</h4>
${venus}% — ${interpretMount(venus, "venus")}<br><br>

<h4>🌟 Final Personality Insight</h4>
Your mounts reveal the true architecture of your personality —  
your strengths, emotional depth, courage, love capacity, wisdom, creativity,  
and the unique energy signature that defines your destiny.<br><br>

You carry a rare combination of emotional intelligence, spiritual depth,  
leadership, and intuitive awareness — a soul built for both compassion and power.<br><br>
`;
}
// =============================================================
// PART 13 — FULL FUTURE TIMELINE MAP (AGE 18–90) · V57
// =============================================================
function generatePart13_Timeline(d) {

    const a = d.aura;
    const c = d.chakra;
    const l = d.lines;

    // === CORE LIFEPATH SCORE ===
    const destinyScore = Math.floor((l.fate + a.destiny + c.crown) / 3);
    const loveScore    = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const wealthScore  = Math.floor((l.sun + a.creativity + a.intellect) / 3);
    const healthScore  = Math.floor((l.life + l.health + a.vitality) / 3);
    const spiritualScore = Math.floor((a.spirituality + c.thirdEye + c.crown) / 3);

    // === TIMELINE BUILDER FUNCTION ===
    function buildPhase(ageStart, ageEnd, score) {
        let text = "";

        if (score > 85) 
            text = "Golden Cycle — Opportunities, growth, breakthroughs, strong divine support.";
        else if (score > 75) 
            text = "Positive Phase — Progress, stability, learning, emotional maturity.";
        else if (score > 65) 
            text = "Neutral Phase — Slow but steady growth, important lessons.";
        else if (score > 50) 
            text = "Challenging Phase — Character-building years, emotional trials.";
        else 
            text = "Shadow Period — High karmic energy, avoid risks, stay spiritually grounded.";

        return `
        <b>Age ${ageStart}–${ageEnd}:</b> ${text}<br>
        `;
    }

    // === FUTURE MAP ===
    let timelineHTML = `
<h3>🕰 Full Life Timeline (Age 18–90)</h3>

<h4>🔮 Age 18–25 : Foundation Cycle</h4>
${buildPhase(18, 25, destinyScore - 5)}

<h4>❤️ Age 25–33 : Emotional & Love Cycle</h4>
${buildPhase(25, 33, loveScore)}

<h4>💰 Age 33–42 : Wealth & Career Rise</h4>
${buildPhase(33, 42, wealthScore)}

<h4>🔥 Age 42–50 : Power & Transformation Cycle</h4>
${buildPhase(42, 50, destinyScore)}

<h4>🧘 Age 50–60 : Spiritual Awakening Cycle</h4>
${buildPhase(50, 60, spiritualScore)}

<h4>🌿 Age 60–75 : Wisdom & Stability Cycle</h4>
${buildPhase(60, 75, spiritualScore - 10)}

<h4>🌟 Age 75–90 : Legacy Cycle</h4>
${buildPhase(75, 90, (destinyScore + spiritualScore) / 2)}
`;

    // === CYCLE INSIGHTS ===
    let majorYears = [];

    if (destinyScore > 80) majorYears.push("29", "36", "44", "52");
    if (wealthScore > 80)  majorYears.push("33", "39", "45");
    if (loveScore > 80)    majorYears.push("24", "27", "31");
    if (spiritualScore > 85) majorYears.push("40", "48", "56", "63");

    let dangerYears = [];
    if (healthScore < 70) dangerYears.push("28", "41", "57");
    if (destinyScore < 65) dangerYears.push("34", "49");

    return `
<h3>📜 Full Timeline Map (18
${generatePart14_LifePrediction(d)}
                         // =============================================================
// PART 14A — FULL LIFE PREDICTION ENGINE LOGIC · V60
// =============================================================
function generatePart14_LifePrediction(d) {

    const l = d.lines;
    const a = d.aura;
    const c = d.chakra;

    // === CORE VALUES ===
    const careerScore   = Math.floor((l.head + a.intellect + l.fate) / 3);
    const marriageScore = Math.floor((l.heart + a.emotion + c.heart) / 3);
    const wealthScore   = Math.floor((l.sun + a.creativity + a.destiny) / 3);
    const childScore    = Math.floor((l.venus + a.emotion + c.sacral) / 3);
    const dangerScore   = Math.floor((l.health + a.vitality) / 2);
    const spiritualRise = Math.floor((c.crown + c.thirdEye + a.spirituality) / 3);

    // === PREDICTION ZONES ===
    const CareerPeakAge =
        careerScore > 85 ? "34–45" :
        careerScore > 75 ? "38–50" :
        "45–60";

    const MarriageTime =
        marriageScore > 85 ? "26–30 (Ideal)" :
        marriageScore > 75 ? "28–34 (Stable)" :
        "35+ (Destined late marriage)";

    const WealthClimax =
        wealthScore > 85 ? "40–55 (Major Wealth Rise)" :
        wealthScore > 75 ? "36–48 (Strong Growth)" :
        "52+ (Late wealth but stable)";

    const ChildrenCount =
        childScore > 85 ? "2–3" :
        childScore > 75 ? "1–2" :
        "1 (or adoption/spiritual children)";

    const DangerAges =
        dangerScore < 70 ? "29, 41, 57 (Health & stress sensitive years)" :
        dangerScore < 80 ? "41, 57 (Moderate caution)" :
        "No major danger years";

    const AwakeningAge =
        spiritualRise > 90 ? "28, 36 & 44 (Three awakenings)" :
        spiritualRise > 80 ? "36–44" :
        "45–55 (Late awakening, very powerful)";

    // === FINAL OUTPUT (Short Version) ===
    return `
<h3>🔮 Full Life Prediction Summary (AI Hybrid V60)</h3>

<b>Career Peak:</b> ${CareerPeakAge}<br>
<b>Marriage Timing:</b> ${MarriageTime}<br>
<b>Wealth Rise:</b> ${WealthClimax}<br>
<b>Potential Children:</b> ${ChildrenCount}<br>
<b>Danger/Sensitive Years:</b> ${DangerAges}<br>
<b>Spiritual Awakening Cycle:</b> ${AwakeningAge}<br><br>

<h3>📘 Full 5000-Word Life Story</h3>
${generatePart14B_LifeStory(d)}
`;
} 
// =============================================================
// PART 14B — FULL 5000-WORD LIFE STORY NARRATIVE · V60
// =============================================================
function generatePart14B_LifeStory(d) {

    const u = d.user;
    const l = d.lines;
    const a = d.aura;
    const c = d.chakra;

    return `
Your full life story begins with the unique signature carried in your palm...

🔥 FULL 5000-WORD VERSION WILL BE INSERTED HERE — Tell Buddhi "Write Full 5000-word Version"
`;
}



