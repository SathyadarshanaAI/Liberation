// server.js
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = 3000;

app.use(express.static('public')); // 'public' dir for your html if you wish

app.get('/horizons', async (req, res) => {
    const { date, time, lat, lon } = req.query;
    if (!date || !time || !lat || !lon) return res.status(400).json({error:"Missing parameters"});
    const ymd = date.replace(/-/g,'');
    const hms = time + ":00";
    const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&EPHEM_TYPE=OBSERVER&OBJ_DATA=NO&MAKE_EPHEM=YES&COMMAND='10,199,299,399,499,599,699,799,899,999'&CENTER='coord@399'&SITE_COORD='${lon},${lat},0'&START_TIME='${ymd} ${hms}'&STOP_TIME='${ymd} ${hms}'&STEP_SIZE='1 d'&QUANTITIES='1,20,23'`;

    try {
        const data = await fetch(url).then(r=>r.json());
        res.json(data);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

app.listen(PORT, () => console.log('Proxy server running on port', PORT));
