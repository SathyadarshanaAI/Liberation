// Main API endpoint
// Example: /api/planets?date=2025-08-23&time=12:00:00&lat=6.9271&lon=79.8612
app.get('/api/planets', async (req, res) => {
  const { date, time, lat, lon } = req.query;
  if (!date || !time || !lat || !lon) {
    return res.status(400).json({ error: "Missing required query parameters." });
  }

  try {
    const planetResults = [];
    // Example planet list (name and Horizons ID)
    const planets = [
      { name: "Sun", id: 10 },
      { name: "Moon", id: 301 },
      { name: "Mercury", id: 199 },
      { name: "Venus", id: 299 },
      { name: "Mars", id: 499 },
      { name: "Jupiter", id: 599 },
      { name: "Saturn", id: 699 },
      { name: "Uranus", id: 799 },
      { name: "Neptune", id: 899 }
    ];

    for (const {name, id} of planets) {
      // NASA Horizons or your own data-fetching logic here
      // Example: using a dummy data response
      planetResults.push({
        name,
        degree: Math.random() * 360 // replace this with real data fetching logic
      });
    }

    res.json(planetResults);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error.' });
  }
});
