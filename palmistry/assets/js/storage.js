// Shared storage + pair helpers (used by both pages)
export const PR_KEY = 'palmistryResults';
export const PAIR_KEY = 'currentPairId';

export function loadResults(){
  try{ return JSON.parse(localStorage.getItem(PR_KEY)||'[]') || []; }
  catch{ return []; }
}
export function saveResults(arr){
  try{ localStorage.setItem(PR_KEY, JSON.stringify(arr)); }
  catch(e){ alert('Storage full. Export & Clear from Results page.'); }
}
export function addResult(entry){
  const a = loadResults();
  if(a.some(x=>x.ts===entry.ts)) entry.ts = Date.now();
  a.push(entry); saveResults(a);
}

export const getPairId = () => localStorage.getItem(PAIR_KEY) || null;
export const setPairId = (id) => localStorage.setItem(PAIR_KEY, id);
export const newPairId = () =>
  (crypto.randomUUID && crypto.randomUUID()) || ('pair_'+Date.now().toString(36));
