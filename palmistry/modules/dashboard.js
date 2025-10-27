/* ============================================================
   Module: dashboard.js | Version: v2.4 Wisdom Dashboard
   Purpose: Display encrypted reports saved via savecloud.js
   ============================================================ */

const listBox = document.getElementById("reportList");
const searchInput = document.getElementById("searchInput");

// --- Load reports from cloud or local backup ---
async function loadReports(){
  listBox.innerHTML = "🔄 Loading reports...";
  try{
    // Example fetch – replace with your real API endpoint
    const res = await fetch("https://your-secure-endpoint.example.com/list");
    const data = await res.json();
    renderReports(data);
  }catch(err){
    console.warn("⚠️ Cloud unavailable, showing local backup.", err);
    const backups = Object.entries(localStorage)
      .filter(([k])=>k.startsWith("backup_"))
      .map(([k,v])=>JSON.parse(v));
    renderReports(backups);
  }
}

// --- Render reports to UI ---
function renderReports(data){
  if(!data?.length){ listBox.innerHTML="No reports found."; return; }
  listBox.innerHTML = "";
  data.forEach(r=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <strong>${r.name || "Unknown"}</strong> <small>(${r.gender||""})</small><br>
      <small>DOB: ${r.dob || "N/A"}</small><br>
      <small>ID Hash: ${r.nicHash || "hidden"}</small><br>
      <small>Date: ${r.timestamp || "unknown"}</small><br>
      <button onclick="downloadReport('${r.file || ''}')">📥 Download</button>
    `;
    listBox.appendChild(card);
  });
}

// --- Simple file downloader ---
window.downloadReport = async function(file){
  if(!file) return alert("No file found.");
  const url = `https://your-secure-endpoint.example.com/files/${file}`;
  const a = document.createElement("a");
  a.href = url;
  a.download = file;
  a.click();
};

// --- Search filter ---
searchInput.addEventListener("input",()=>{
  const q = searchInput.value.toLowerCase();
  document.querySelectorAll(".card").forEach(c=>{
    c.style.display = c.innerText.toLowerCase().includes(q) ? "" : "none";
  });
});

loadReports();
