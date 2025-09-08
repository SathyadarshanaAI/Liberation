// server.js - Node.js Express proxy for NASA Horizons API (CommonJS format)
const express = require('express');
const fetch = require('node-fetch');  // using node-fetch v2 for CommonJS2
const app = express();

// Enable CORS for all requests (so the proxy can be called from any origin)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');       // allow any domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // quickly respond to preflight OPTIONS
  }
  next();
});

// Proxy endpoint: forwards query parameters to NASA Horizons API
app.get('/horizons', async (req, res) => {
  try {
    const horizonsUrl = 'https://ssd-api.jpl.nasa.gov/api/horizons.api';
    // Construct the target URL with the same query string received
    const queryString = new URLSearchParams(req.query).toString();  // Node has URLSearchParams globally3
    const targetUrl = queryString ? `${horizonsUrl}?${queryString}` : horizonsUrl;
    
    // Fetch data from NASA Horizons API
    const response = await fetch(targetUrl);
    const contentType = response.headers.get('content-type') || 'text/plain';
    // Forward status and content-type from NASA response
    res.status(response.status);
    res.setHeader('Content-Type', contentType);
    // Read response body (as text) and send it
    const body = await response.text();
    res.send(body);
  } catch (err) {
    console.error('Error fetching Horizons API:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server on port 3000 (or PORT env if provided)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Horizons proxy server listening at http://localhost:${PORT}`);
});
