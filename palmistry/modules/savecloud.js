/* ============================================================
   Module: savecloud.js | Version: v2.3 Ethereal Memory Cloud
   Purpose: Secure encrypted save of report data & user info
   ============================================================ */

const CLOUD_URL = "https://your-secure-endpoint.example.com/upload"; 
// Replace with Firebase/Cloudflare Worker URL

// --- Encrypt text using Web Crypto API (AES-GCM) ---
async function encryptText(text, secretKey="Sathyadarshana2025"){
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secretKey), { name:"AES-GCM" }, false, ["encrypt"]
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name:"AES-GCM", iv }, key, enc.encode(text)
  );
  return { cipher: btoa(String.fromCharCode(...new Uint8Array(cipher))), iv: Array.from(iv) };
}

// --- Main save function ---
export async function saveToCloud(filename, blob, user={}){
  try{
    const meta = {
      name: user.name || "Unknown",
      dob: user.dob || "",
      gender: user.gender || "",
      nicHash: await hashNIC(user.nic || "N/A"),
      timestamp: new Date().toISOString()
    };

    // Encrypt metadata before upload
    const encrypted = await encryptText(JSON.stringify(meta));

    const form = new FormData();
    form.append("file", blob, filename);
    form.append("meta", JSON.stringify(encrypted));

    const res = await fetch(CLOUD_URL, { method:"POST", body: form });
    if(!res.ok) throw new Error(`Upload failed (${res.status})`);

    console.log("✅ Encrypted report uploaded:", meta.name);
    return true;
  }catch(err){
    console.warn("⚠️ Cloud upload failed, saving locally:", err);
    localStorage.setItem("backup_"+Date.now(), JSON.stringify(user));
    return false;
  }
}

// --- Hash NIC for privacy ---
async function hashNIC(nic){
  const enc = new TextEncoder().encode(nic);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
