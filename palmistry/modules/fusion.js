// ===============================
// Sathyadarshana Quantum Palm Analyzer · Fusion v9.7
// Dual-Hand Independent Analyzer
// ===============================
import { generateFusionReport } from './report.js';

let leftData=null, rightData=null;

export function setLeftData(lines,aura,mounts,anomalies){
  leftData={lines,aura,mounts,anomalies};
  updateStatus("🌙 Left hand data stored (Karma Imprint)");
}
export function setRightData(lines,aura,mounts,anomalies){
  rightData={lines,aura,mounts,anomalies};
  updateStatus("☀️ Right hand data stored (Dharma Expression)");
}

export function generateDualReport(){
  if(!leftData && !rightData){ updateStatus("⚠️ No data captured!"); return "Capture both hands first."; }
  const merged = mergeHands(leftData,rightData);
  return generateFusionReport(merged);
}

// --- internal ---
function mergeHands(L,R){
  const empty={lines:[],aura:{energy:"neutral"},mounts:[],anomalies:[]};
  const left=L||empty, right=R||empty;
  return {
    lines: mergeLines(left.lines,right.lines),
    aura: fuseAura(left.aura,right.aura),
    mounts:[...(left.mounts||[]),...(right.mounts||[])],
    anomalies:[...(left.anomalies||[]),...(right.anomalies||[])]
  };
}
function mergeLines(L,R){
  const map={};
  [...(L||[]),...(R||[])].forEach(x=>{
    if(!map[x.name]) map[x.name]={name:x.name,strength:0,count:0};
    map[x.name].strength+=x.strength||0; map[x.name].count++;
  });
  return Object.values(map).map(x=>({...x,strength:Math.min(100,Math.round(x.strength/x.count))}));
}
function fuseAura(aL,aR){
  if(!aL&&!aR) return {energy:"neutral"};
  const txt=[aL?.energy,aR?.energy].filter(Boolean).join("+");
  return {energy:txt.includes("radiant")?"radiant":"balanced"};
}
function updateStatus(msg){const el=document.getElementById("status");if(el)el.textContent=msg;}
