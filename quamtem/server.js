cat > server.js <<'EOF'
// server.js - Node.js Express proxy for NASA Horizons API (CommonJS)
const express = require('express');
const fetch = require('node-fetch');  // node-fetch v2
const app = express();

// CORS (allow all)
app.use((req,res,next)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','*');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Proxy endpoint
app.get('/horizons', async (req,res)=>{
  try{
    const base = 'https://ssd-api.jpl.nasa.gov/api/horizons.api';
    const qs = new URLSearchParams(req.query).toString();
    const url = qs ? `${base}?${qs}` : base;

    const r = await fetch(url, { headers:{'User-Agent':'QuamtemProxy/1.0'} });
    const contentType = r.headers.get('content-type') || 'text/plain';
    const body = await r.text();
    res.status(r.status);
    res.set('Content-Type', contentType);
    res.send(body);
  }catch(e){
    console.error('Horizons proxy error:', e);
    res.status(500).json({ error: String(e && e.message || e) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Horizons proxy server listening at http://localhost:${PORT}`));
EOF
