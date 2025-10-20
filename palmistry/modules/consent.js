// modules/consent.js
const KEY = 'palmistry_research_consent_v1';

export function getConsent() {
  const v = localStorage.getItem(KEY);
  return v === 'true';
}
export function setConsent(on) {
  localStorage.setItem(KEY, on ? 'true' : 'false');
  document.dispatchEvent(new CustomEvent('consent:change', { detail: { on } }));
}

// Floating toggle (optional)
export function mountConsentToggle() {
  if (document.getElementById('consent-pill')) return;
  const el = document.createElement('button');
  el.id = 'consent-pill';
  Object.assign(el.style, {
    position:'fixed', right:'18px', bottom:'110px', zIndex:9999,
    background:'#0f1b2a', color:'#d8eeff', border:'1px solid #1e2b3a',
    borderRadius:'999px', padding:'6px 12px', fontWeight:'700', cursor:'pointer'
  });
  const sync = ()=>{ el.textContent = getConsent() ? 'Research Consent: ON' : 'Research Consent: OFF'; };
  el.onclick = ()=>{ setConsent(!getConsent()); sync(); };
  document.body.appendChild(el); sync();
}
