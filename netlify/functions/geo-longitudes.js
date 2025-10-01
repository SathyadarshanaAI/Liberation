const crypto = require("crypto");

const SIG = [
  "Aries","Taurus","Gemini","Cancer","Leo","Virgo",
  "Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"
];

function pad(n){ return String(n).padStart(2,"0"); }
function toUTC(d){ return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`; }

async function computeGeoLongitudes(utc, ayan){
  // Stub demo data (ඔයාට පසුව NASA Horizons / real API plug කරගන්න)
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

exports.handler = async (event) => {
  try{
    const url = new URL(event.rawUrl);
    const utc = url.searchParams.get("utc");
    if(!utc) return resp(400, {error:"utc required"});

    const ayanStr = url.searchParams.get("ayan");
    const ayan = ayanStr!=null ? parseFloat(ayanStr) : undefined;

    const geo = await computeGeoLongitudes(utc, ayan);
    let planets = geo.planets;
    if (Number.isFinite(ayan)) {
      planets = planets.map(p => ({
        ...p,
        longitude: ((p.longitude - ayan) % 360 + 360) % 360
      }));
    }

    return resp(200, { utc: geo.utc, center: geo.center, ref_plane: geo.ref_plane, planets });
  }catch(e){
    console.error(e);
    return resp(500,{error:"geo-failed"});
  }
};

function resp(code, body){
  return {
    statusCode: code,
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body)
  };
}
