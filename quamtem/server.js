const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next, lat, lon } = req.query;

    if (!date || !time || !lat || !lon) {
      return res.status(400).json({ error: "Missing parameters (date, time, lat, lon)" });
    }

    // NASA Horizons expects longitude first, then latitude
    const SITE_COORD = 'https://ssd.jpl.nasa.gov/api/horizons.api';
    const params = new URLSearchParams({
      format: 'json',
      COMMAND: "10,199,299,399,499,599,699,799,899,999",
      CENTER: "coord@399",
      SITE_COORD,
 = await fetch(url, { headers: { 'User-Agent': 'TermuxProxy/1.0' } });
    const data = await r.json();

    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server runningclosed curly braces).
- Top-level `await` lines outside of any async function.
- Extra lines from instructions, not code.

---

## **Summary of your steps:**
1. **Open your file:**  
   ```bash
   nano server.js
