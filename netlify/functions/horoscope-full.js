const crypto = require("crypto");

const SIG = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];
const pad = n => String(n).padStart(2,"0");
const toUTC = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
function degToSign(deg){ const idx = Math.floor(((deg%360)+360)%360/30); return SIG[idx]; }

async function computeGeoLongitudes(utc, ayan){
  return {
    utc,
    center: "Geocentric (500@399)",
    ref_plane: "ECLIPTIC",
    planets: [
      { name:"Sun", longitude:120 },
      { name:"Moon", longitude:15 },
      { name:"Mars", longitude:210 },
      { name:"Mercury", longitude:80 },
      { name:"Venus", longitude:95 },
      { name:"Jupiter", longitude:10 },
      { name:"Saturn", longitude:300 }
    ]
  };
}

function sectionText(planets){
  const get = n => planets.find(p=>p.name===n)?.longitude ?? null;
  const sun=get("Sun"), moon=get("Moon"), mar=get("Mars"), ven=get("Venus"),
        mer=get("Mercury"), jup=get("Jupiter"), sat=get("Saturn");

  const health = (sat!=null && Math.abs(sat - sun) % 180 < 5)
    ? "Vitality steady; joints and bones require attention."
    : "Energy fluctuates; maintain consistent sleep and balanced diet.";

  const education = (mer!=null && ["Gemini","Virgo"].includes(degToSign(mer)))
    ? "Quick grasp for languages and analytics; self-study is fruitful."
    : "Learning benefits from repetition and solid foundations.";

  const love = (ven!=null && ["Taurus","Libra","Pisces"].includes(degToSign(ven)))
    ? "Affection flows easily; excellent for proposals and harmony."
    : "Conversations need patience; avoid misunderstandings.";

  const career = (mar!=null && ["Aries","Capricorn","Leo","Scorpio"].includes(degToSign(mar)))
    ? "Leadership roles and initiative favored. Small goals achieved quickly."
    : "Progress through cooperation; maintain documentation.";

  const luck = (jup!=null && ["Sagittarius","Pisces","Cancer"].includes(degToSign(jup)))
    ? "Good fortune through travel, teaching, and spiritual pursuits."
    : "Moderate but steady luck; careful budgeting advised.";

  return { health, education, love, career, luck };
}

function composeFull(planets){
  const sec = sectionText(planets);
  const cycles = "Next 30 days favor steady growth. Productive windows: days 5–8 and 18–21. Avoid impulsive spending near lunar squares.";
  const remedies = "Remedies: early sunlight 10m daily, walking Tue/Thu, donate grains on Thursdays, keep gratitude journal.";
  const text = [sec.health, sec.education, sec.love, sec.career, sec.luck, cycles, remedies].join(" ");
  return { text, sections: sec, cycles, remedies, words: text.split(/\s+/).length };
}

function signHmac(secret, payload){
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

exports.handler = async (event) => {
  try{
    const url = new URL(event.rawUrl);
    const utc = url.searchParams.get("utc") || toUTC(new Date());
    const ayanStr = url.searchParams.get("ayan");
    const ayan = ayanStr!=null ? parseFloat(ayanStr) : undefined;
    const id  = url.searchParams.get("id");
    const token = url.searchParams.get("token");

    if (!id || !token) return json(401,{error:"auth-required"});
    const expected = signHmac(process.env.ASTRO_SECRET || "change-me-super-secret", `${id}:${utc}`);
    if (token !== expected) return json(403,{error:"invalid-token"});

    const geo = await computeGeoLongitudes(utc, ayan);
    const full = composeFull(geo.planets);

    return json(200, { kind:"full-report", utc: geo.utc, center: geo.center, ref_plane: geo.ref_plane, id_hash: hashId(id), ...full });
  }catch(e){ console.error(e); return json(500,{error:"full-failed"}); }
};

function hashId(id){ return crypto.createHash("sha256").update(String(id)).digest("hex").slice(0,24); }
function json(s,b){ return { statusCode:s, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(b) }; }
