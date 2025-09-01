const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/api/planets', (req, res) => {
  // Fixed demo data (future: replace with real calculations)
  const planets = [
    { name: "Sun", degree: 123.456 },
    { name: "Moon", degree: 200.123 },
    { name: "Mercury", degree: 85.234 },
    { name: "Venus", degree: 154.567 },
    { name: "Mars", degree: 210.987 },
    { name: "Jupiter", degree: 275.654 },
    { name: "Saturn", degree: 305.432 },
    { name: "Rahu", degree: 45.876 },
    { name: "Ketu", degree: 225.876 }
  ];
  res.json({ planets });
});

app.listen(3001, () => {
  console.log('Planetary API running at http://localhost:3001/api/planets');
});
