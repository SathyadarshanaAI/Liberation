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

function composePreview(planets){
  const sec = sectionText(planets);
  const order = ["health","education","love","career","luck"];
  let text = order.map(k=>sec[k]).join(" ");
  const words = text.split(/\s+/);
  if (words.length > 300) text = words.slice(0,300).join(" ") + "...";
  return { text, words: Math.min(words.length, 300), sections: sec };
}

exports.handler = async (event) => {
  try{
    const url = new URL(event.rawUrl);
    const utc = url.searchParams.get("utc") || toUTC(new Date());
    const ayanStr = url.searchParams.get("ayan");
    const ayan = ayanStr!=null ? parseFloat(ayanStr) : undefined;
    const id  = url.searchParams.get("id") || "guest";

    const geo = await computeGeoLongitudes(utc, ayan);
    const pr  = composePreview(geo.planets);

    return json(200, {
      kind:"free-preview",
      utc: geo.utc, center: geo.center, ref_plane: geo.ref_plane,
      id_hash: hashId(id),
      ...pr
    });
  }catch(e){ console.error(e); return json(500,{error:"free-failed"}); }
};

function hashId(id){ return require("crypto").createHash("sha256").update(String(id)).digest("hex").slice(0,24); }
function json(s,b){ return { statusCode:s, headers:{ "Content-Type":"application/json" }, body: JSON.stringify(b) }; }
