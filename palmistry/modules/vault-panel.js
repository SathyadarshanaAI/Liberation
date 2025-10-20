// modules/vault-panel.js
import { exportJSONL, exportCSV, downloadText, listRecords, removeRecord } from './vault.js';

export function mountVaultPanel() {
  if (document.getElementById('vault-panel')) return;
  const box = document.createElement('div');
  box.id = 'vault-panel';
  box.innerHTML = `
    <style>
      #vault-panel{position:fixed;left:18px;bottom:18px;z-index:9999;background:#0c121cde;color:#dff;
        border:1px solid #1e2b3a;border-radius:12px;padding:10px 12px;font:13px system-ui;box-shadow:0 12px 28px rgba(0,0,0,.35)}
      #vault-panel button{background:#0f1b2a;color:#dff;border:1px solid #1e2b3a;border-radius:10px;padding:6px 10px;font-weight:600;margin-right:6px;cursor:pointer}
      #vault-panel small{opacity:.8}
      #vault-list{max-height:30vh;overflow:auto;margin-top:6px}
      #vault-list .row{display:flex;justify-content:space-between;gap:6px;border-top:1px dashed #1e2b3a;padding:4px 0}
      #vault-list .row b{font:12px ui-monospace}
    </style>
    <div><b>Research Vault</b> · <small id="vault-count">0</small></div>
    <div style="margin:6px 0 8px">
      <button id="vault-jsonl">Export JSONL</button>
      <button id="vault-csv">Export CSV</button>
    </div>
    <div id="vault-list"></div>
  `;
  document.body.appendChild(box);

  const refresh = async () => {
    const rows = await listRecords({ onlyConsent:false, limit:200 });
    document.getElementById('vault-count').textContent = rows.length;
    const list = document.getElementById('vault-list');
    list.innerHTML = rows.map(r => `
      <div class="row">
        <div><b>${r.id}</b><br/><small>${new Date(r.timestamp).toLocaleString()} · ${r.hand}</small></div>
        <div><button data-id="${r.id}" class="del">Delete</button></div>
      </div>
    `).join('');
    list.querySelectorAll('.del').forEach(btn => btn.onclick = async () => {
      await removeRecord(btn.dataset.id); refresh();
    });
  };

  document.getElementById('vault-jsonl').onclick = async () => {
    const txt = await exportJSONL({ consentOnly:true });
    downloadText('palm_scans.jsonl', txt, 'application/json');
  };
  document.getElementById('vault-csv').onclick = async () => {
    const txt = await exportCSV({ consentOnly:true });
    downloadText('palm_traits.csv', txt, 'text/csv');
  };

  refresh();
}
