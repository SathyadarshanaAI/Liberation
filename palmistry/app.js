// ======================================================
//  Sathya Darshana Quantum Palm Analyzer V5.1 (with F12)
// ======================================================

import { CameraCard } from './modules/camara.js';

// ---------- F12 Console Integration ----------
(function(){
  if (!window.F12Ready) {
    window.F12Ready = true;
    const box = document.createElement('div');
    box.id = 'f12';
    box.style.cssText = `
      position:fixed;left:0;right:0;bottom:0;background:#0b0f16;color:#d9f99d;
      font:12px/1.3 ui-monospace,monospace;border-top:1px solid #22d3ee;z-index:999999;
    `;
    box.innerHTML = `
      <div style="display:flex;gap:8px;align-items:center;padding:6px 8px;background:#081018">
        <b style="color:#22d3ee">F12</b>
        <button id="f12Toggle">Show</button>
        <button id="f12Clear">Clear</button>
        <button id="f12Copy">Copy</button>
        <span id="f12Info" style="margin-left:auto;opacity:.75"></span>
      </div>
      <div id="f12Wrap" style="max-height:36vh;overflow:auto;padding:8px;display:none"></div>`;
    document.body.appendChild(box);

    const wrap = document.getElementById('f12Wrap');
    const info = document.getElementById('f12Info');
    const btnT = document.getElementById('f12Toggle');
    const btnC = document.getElementById('f12Clear');
    const btnCp= document.getElementById('f12Copy');
    const ts = ()=> new Date().toLocaleTimeString();
    const push = (kind,...args)=>{
      const el=document.createElement('div');
      el.style.padding='4px 0';
      el.style.borderBottom='1px solid #0f172a';
      const c = {L:'#a7f3d0',W:'#fde68a',E:'#fecaca',N:'#93c5fd'}[kind]||'#a7f3d0';
      el.innerHTML=`[${ts()}] <span style="color:${c}">${kind}</span> — ${args.join(' ')}`;
      wrap.appendChild(el); wrap.scrollTop=wrap.scrollHeight;
    };
    const oldLog=console.log.bind(console),
          oldWarn=console.warn.bind(console),
          oldErr=console.error.bind(console);
    console.log=(...a)=>{oldLog(...a);push('L',...a);}
    console.warn=(...a)=>{oldWarn(...a);push('W',...a);}
    console.error=(...a)=>{oldErr(...a);push('E',...a);}
    window.addEventListener('error',e=>push('E',e.message));
    window.addEventListener('unhandledrejection',e=>push('E','Promise:',e.reason));
    btnT.onclick=()=>{const v=wrap.style.display==='none';wrap.style.display=v?'block':'none';btnT.textContent=v?'Hide':'Show';};
    btnC.onclick=()=>wrap.textContent='';
    btnCp.onclick=async()=>{
      try{await navigator.clipboard.writeText(wrap.textContent);push('L','📋 Copied');}
      catch(e){push('W','Copy failed');}
    };
    info.textContent=`${screen.width}×${screen.height}`;
    push('L','✅ F12 console ready');

    // status helpers
    window.statusMsg=(m)=>{try{document.getElementById('status').textContent=m;}catch{};console.log('[STATUS]',m)};
    console.tag=(tag,...a)=>console.log(`[${tag.toUpperCase()}]`,...a);
  }
})();

// ---------- ELEMENTS ----------
const camBoxLeft = document.getElementById("camBoxLeft");
const camBoxRight = document.getElementById("camBoxRight");
const canvasLeft = document.getElementById("canvasLeft");
const canvasRight = document.getElementById("canvasRight");
const statusEl = document.getElementById("status");
const insightEl = document.getElementById("insight");

// ---------- CAMERA INSTANCES ----------
let camLeft, camRight;
let leftPalmAI = null, rightPalmAI = null;

function setStatus(msg){ statusEl.textContent=msg; console.tag('status',msg); }

// ---------- CAMERA INIT ----------
window.addEventListener('DOMContentLoaded', () => {
  camLeft = new CameraCard(camBoxLeft,{facingMode:"environment",onStatus:setStatus});
  camRight= new CameraCard(camBoxRight,{facingMode:"environment",onStatus:setStatus});
  console.tag('init','CameraCard instances created');

  // LEFT
  document.getElementById("startCamLeft").onclick = async ()=>{
    statusMsg("🎥 Starting left camera...");
    await camLeft.start();
    console.tag('camera-left','started');
    statusMsg("Left hand camera started.");
  };
  document.getElementById("captureLeft").onclick = async ()=>{
    camLeft.captureTo(canvasLeft);
    console.tag('capture-left','image drawn');
    statusMsg("Left hand captured.");
    await autoPalmAI(canvasLeft,"left");
  };
  document.getElementById("uploadLeft").onclick = ()=>fileUpload(canvasLeft,()=>autoPalmAI(canvasLeft,"left"));
  document.getElementById("torchLeft").onclick = async ()=>{
    await camLeft.toggleTorch(); console.tag('torch-left','toggled');
  };

  // RIGHT
  document.getElementById("startCamRight").onclick = async ()=>{
    statusMsg("🎥 Starting right camera...");
    await camRight.start();
    console.tag('camera-right','started');
    statusMsg("Right hand camera started.");
  };
  document.getElementById("captureRight").onclick = async ()=>{
    camRight.captureTo(canvasRight);
    console.tag('capture-right','image drawn');
    statusMsg("Right hand captured.");
    await autoPalmAI(canvasRight,"right");
  };
  document.getElementById("uploadRight").onclick = ()=>fileUpload(canvasRight,()=>autoPalmAI(canvasRight,"right"));
  document.getElementById("torchRight").onclick = async ()=>{
    await camRight.toggleTorch(); console.tag('torch-right','toggled');
  };

  // Reports
  document.getElementById("analyze").onclick = ()=>{
    console.tag('ui','Analyze clicked');
    if(leftPalmAI && rightPalmAI){
      showPalmInsight(leftPalmAI,rightPalmAI,"full");
    }else statusMsg("Please capture/upload both hands first!");
  };
  document.getElementById("miniReport").onclick = ()=>{
    console.tag('ui','Mini Report clicked');
    if(leftPalmAI && rightPalmAI){
      showPalmInsight(leftPalmAI,rightPalmAI,"mini");
    }else statusMsg("Please capture/upload both hands first!");
  };
});

// ---------- PALM AI ----------
async function autoPalmAI(canvas, hand){
  statusMsg(`🔍 Detecting ${hand} palm lines...`);
  console.tag('ai',hand,'detect start');
  const aiResult = await fakePalmAI(canvas,hand);
  drawPalmLinesOnCanvas(canvas,aiResult.lines);
  if(hand==='left') leftPalmAI=aiResult; else rightPalmAI=aiResult;
  console.tag('ai',hand,'done',aiResult.lines.length,'lines');
  statusMsg(`${hand} palm lines auto-drawn.`);
}

async function fakePalmAI(canvas,hand="right"){
  const w=canvas.width,h=canvas.height;
  const lines=[
    {name:"Heart Line",color:"red",main:true,points:[[w*0.2,h*0.25],[w*0.8,h*0.27]]},
    {name:"Head Line", color:"blue",main:true,points:[[w*0.28,h*0.4],[w*0.7,h*0.5]]},
    {name:"Life Line", color:"green",main:true,points:[[w*0.38,h*0.78],[w*0.2,h*0.98],[w*0.45,h*0.99]]},
    {name:"Health",    color:"#789",main:false,points:[[w*0.52,h*0.4],[w*0.6,h*0.7]]},
    {name:"Marriage",  color:"#555",main:false,points:[[w*0.7,h*0.2],[w*0.73,h*0.28]]}
  ];
  const reading=[
    "Heart Line: Indicates strong emotions and empathy.",
    "Head Line: Suggests high intellect and curiosity.",
    "Life Line: Shows good vitality and adaptability.",
    ...(hand==="left"?["Past influences are strong."]:["Active, creative present life."])
  ];
  console.tag('ai',hand,'fake data generated');
  return {hand,lines,reading};
}

// ---------- DRAW LINES ----------
function drawPalmLinesOnCanvas(canvas,palmLines){
  const ctx=canvas.getContext('2d');
  ctx.save();
  palmLines.forEach(line=>{
    ctx.save();
    ctx.strokeStyle=line.color;
    ctx.lineWidth=line.main?5:2;
    ctx.globalAlpha=line.main?1.0:0.7;
    if(!line.main) ctx.setLineDash([5,5]);
    ctx.beginPath();
    line.points.forEach(([x,y],i)=>{if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  });
  ctx.restore();
  console.tag('draw','lines rendered',palmLines.length);
}

// ---------- FILE UPLOAD ----------
function fileUpload(canvas,callback){
  const input=document.createElement("input");
  input.type="file"; input.accept="image/*";
  input.onchange=(e)=>{
    const file=e.target.files[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=function(ev){
      const img=new Image();
      img.onload=function(){
        let iw=img.width,ih=img.height,aspect=3/4,tw=iw,th=ih;
        if(iw/ih>aspect){tw=ih*aspect;th=ih;}else{tw=iw;th=iw/aspect;}
        canvas.width=tw;canvas.height=th;
        const ctx=canvas.getContext('2d');
        ctx.fillStyle="#fff";ctx.fillRect(0,0,tw,th);
        ctx.drawImage(img,(iw-tw)/2,(ih-th)/2,tw,th,0,0,tw,th);
        statusMsg("📸 Photo loaded.");
        console.tag('upload','image loaded',file.name);
        if(callback) callback();
      };
      img.src=ev.target.result;
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ---------- SHOW PALM READING ----------
function showPalmInsight(left,right,mode="full"){
  let txt=`Sathya Darshana Quantum Palm Analyzer\n\n`;
  txt+=`Left Hand:\n${left.reading.join("\n")}\n\n`;
  txt+=`Right Hand:\n${right.reading.join("\n")}\n\n`;
  txt+=(mode==="mini")?"Mini Report: Most prominent lines analyzed above.\n":"Full Report: See above for all detected lines.\n";
  insightEl.textContent=txt;
  console.tag('report',mode,'shown');
}
