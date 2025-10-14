const PR_KEY='palmistryResults', PAIR_KEY='currentPairId';
let meta={};

export function init(m){ meta=m||{}; }
export function load(){ try{ return JSON.parse(localStorage.getItem(PR_KEY)||'[]'); }catch{ return []; } }
export function saveAll(a){ localStorage.setItem(PR_KEY, JSON.stringify(a)); }
export function add(o){ const a=load(); a.push(o); saveAll(a); }
export function setPairId(id){ localStorage.setItem(PAIR_KEY,id); }
export function getPairId(){ return localStorage.getItem(PAIR_KEY)||null; }

export function saveResult(result, thumb){
  let pid=getPairId(); if(!pid){ pid=crypto.randomUUID?.()||('pair_'+Date.now().toString(36)); setPairId(pid); }
  add({ ts:Date.now(), pairId:pid, hand:document.getElementById('handSel').value,
        thumb, meta:{ version:meta.appVersion, confidence:result.confidence }, lines:result.lines });
}
export function lastResult(){ const a=load(); return a[a.length-1]||null; }
export function latestPairWithBoth(){
  const all=load(), map={};
  for(const r of all){ const id=r.pairId||('solo-'+r.ts);
    map[id]=map[id]||{id,left:null,right:null,ts:0};
    if(r.hand==='left') map[id].left=r; if(r.hand==='right') map[id].right=r; map[id].ts=Math.max(map[id].ts,r.ts);
  }
  return Object.values(map).filter(g=>g.left&&g.right).sort((a,b)=>b.ts-a.ts)[0]||null;
}
