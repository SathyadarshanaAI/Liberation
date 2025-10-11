import { loadResults } from './storage.js';

const list = document.getElementById('pairs');
const exportBtn = document.getElementById('exportAll');
const clearBtn = document.getElementById('clearAll');

function groupByPair(arr){
  const m={}; for(const r of arr){ const k=r.pairId||`solo-${r.ts}`;
    m[k] = m[k]||{id:k,left:null,right:null}; m[k][r.hand]=r; }
  return Object.values(m).sort((a,b)=>(b.left?.ts||b.right?.ts||0)-(a.left?.ts||a.right?.ts||0));
}

function delta(a,b){ return (b?.score||0)-(a?.score||0); }

function render(){
  const data = loadResults();
  const pairs = groupByPair(data);
  list.innerHTML='';
  if(!pairs.length){ list.innerHTML = `<div class="empty">No results yet. Analyze & Save from Analyzer.</div>`; return; }

  for(const p of pairs){
    const L=p.left?.lines||{}, R=p.right?.lines||{};
    const lines = ['heart','head','life','fate','sun','mercury','marriage'];

    const rows = lines.map(k=>{
      const l=L[k]?.score||0, r=R[k]?.score||0, d=r-l;
      const cls = d>1?'up':(d<-1?'down':'eq');
      return `<tr>
        <td>${k[0].toUpperCase()+k.slice(1)}</td>
        <td>${l}</td>
        <td>${r}</td>
        <td class="delta ${cls}">${d>0?'+':''}${d}</td>
      </tr>`;
    }).join('');

    const conf = Math.round(((p.left?.meta?.confidence||0)+(p.right?.meta?.confidence||0))/ ( (p.left&&p.right)?2:1 ));
    const time = (t)=> t? new Date(t).toLocaleString() : '—';

    list.insertAdjacentHTML('beforeend', `
      <article class="card">
        <div class="row" style="justify-content:space-between;align-items:flex-start">
          <div>
            <div class="meta"><b>Pair:</b> ${p.id}</div>
            <div class="tip">Past: ${time(p.left?.ts)} · Present: ${time(p.right?.ts)} · Conf ~ ${conf||'—'}%</div>
          </div>
          <div class="thumbs row">
            ${p.left?`<img src="${p.left.thumb}" alt="left" class="thumb" loading="lazy">`:''}
            ${p.right?`<img src="${p.right.thumb}" alt="right" class="thumb" loading="lazy">`:''}
          </div>
        </div>
        <table class="table">
          <thead><tr><th>Line</th><th>Past</th><th>Present</th><th>ΔK</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="row" style="justify-content:flex-end">
          <button class="btn" onclick='print()'>Print / PDF</button>
        </div>
      </article>
    `);
  }
}
render();

// bulk controls (optional: keep same as old page if you already had it)
exportBtn?.addEventListener('click', ()=>{
  const blob=new Blob([JSON.stringify(loadResults(),null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob);
  a.download='palmistry_results_all.json'; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),500);
});
clearBtn?.addEventListener('click', ()=>{
  if(!confirm('Delete all saved results?')) return;
  localStorage.removeItem('palmistryResults'); render();
});
