  } catch (err) {
    console.error(err);
    res.status(500).json({ error: String(err && err.message || err) });
  }
});

// health
app.get('/', (_, res) => res.type('text').send('OK: /horizons?utc=YYYY-MM-DDTHH:mm[:ss]Z'));

app.listen(PORT, () => {
  console.log(`Horizons proxy running on http://localhost:${PORT}`);
});
