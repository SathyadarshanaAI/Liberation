const bus = new Map(); // simple event bus

export function init(){
  // wire buttons here (ids from your HTML)
  bind('startCam','startCamera'); bind('switchBtn','switchCam'); bind('flashBtn','flash');
  bind('capture','capture'); bind('analyze','analyze'); bind('pdfBtn','pdf'); bind('summaryBtn','pairSummary');
}
function bind(id, name){
  const el=document.getElementById(id); if(!el) return;
  el.addEventListener('click', ()=>emit(name));
}
export function on(name, fn){ (bus.get(name)||bus.set(name,[]).get(name)).push(fn); }
export function emit(name, payload){ (bus.get(name)||[]).forEach(fn=>fn(payload)); }

export function draw(canvas){
  // already drawn by camera; could add overlays.
  document.getElementById('status').textContent='Frame captured';
}
export function getImageData(){
  const c=document.getElementById('canvas'), g=c.getContext('2d');
  return g.getImageData(0,0,c.width,c.height);
}
export function getThumb(){ return document.getElementById('canvas').toDataURL('image/jpeg',0.85); }

export function renderScores(result){
  const bars=[...Array(7)].map((_,i)=>document.getElementById('b'+i));
  const sc=[result.lines.heart,result.lines.mind,result.lines.life,result.lines.fate,result.lines.success,result.lines.health,result.lines.marriage];
  sc.forEach((v,i)=>bars[i].style.transform=`scaleX(${v/100})`);
  document.getElementById('conf').textContent = `Confidence ${result.confidence}%`;
}

export function renderPairSummary(group){
  if(!group){ alert('Save both Left & Right first.'); return; }
  document.getElementById('sumLeft').src  = group.left.thumb;
  document.getElementById('sumRight').src = group.right.thumb;
  // ...add the rest (same as you have)
  document.getElementById('pairSummary').style.display='block';
}
