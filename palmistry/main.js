/* --- 1. PALM DETECT --- */
dbg("Loading palm-detect.js…");
const palmMod = await import("./analysis/palm-detect.js");
const palmData = await palmMod.detectPalm(imageData);
dbg("Palm detected OK");

outputBox.textContent = "Palm analyzed ✔ Extracting lines…";

/* --- 2. TRUE 8-LINE EXTRACTOR (NEW) --- */
dbg("Loading true-palm-8lines.js…");
const lineMod = await import("./analysis/true-palm-8lines.js");
const lines = await lineMod.extractTrueLines(palmData);
dbg("True 8 lines extracted OK");
dbg(JSON.stringify(lines));

outputBox.textContent = "Lines extracted ✔ Generating report…";

/* --- 3. TRUE REPORT ENGINE (NEW) --- */
dbg("Loading true-report.js…");
const repMod = await import("./analysis/true-report.js");

dbg("Generating report…");

/* NO await — report returns plain text */
const report = repMod.generateTrueReport({
    user: userData,
    palm: palmData,
    lines: lines
});

dbg("✔ REPORT READY");
outputBox.textContent = report;
