<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>KP Chart Demo | Sathyadarshana</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: sans-serif; margin: 20px; background: #f5f7fa; }
    h1 { color: #3451bf; }
    #chart { margin-top: 20px; }
    textarea { width: 100%; height: 200px; margin-top: 20px; }
    button { padding: 8px 12px; border-radius: 5px; background: #3451bf; color: #fff; border: none; }
  </style>
</head>
<body>
  <h1>🔭 KP Chart – Sathyadarshana</h1>

  <button id="btnFetch">Get Sun Data</button>
  <div id="chart"></div>

  <h3>Raw JSON</h3>
  <textarea id="output" readonly></textarea>

  <script>
    document.getElementById('btnFetch').onclick = async () => {
      try {
        const url = "http://127.0.0.1:3000/horizons?format=json&COMMAND=10&EPHEM_TYPE=OBSERVER&CENTER=coord@399&SITE_COORD=79.86,6.93,0&START_TIME=2025-09-06T12:00:00&STOP_TIME=2025-09-06T12:00:01&STEP_SIZE=1 m";
        const r = await fetch(url);
        const j = await r.json();
        document.getElementById('output').value = JSON.stringify(j, null, 2);

        // very simple chart (just text for now)
        document.getElementById('chart').innerHTML = "<b>Response Status:</b> " + j.result.status;
      } catch (err) {
        document.getElementById('output').value = "Error: " + err;
      }
    };
  </script>
</body>
</html>
