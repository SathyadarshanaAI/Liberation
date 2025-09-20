const express = require("express");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

// ✅ Rate limit
const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use("/api/", limiter);

// ✅ CORS
const allowedOrigins = [
  "http://127.0.0.1:3000",
  "https://<your-frontend>.github.io"  // <-- update with real GitHub Pages URL
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.end();
  next();
});

// ✅ Health endpoint
app.get("/api/health", (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || "dev" });
});

// ✅ Graha sample endpoint
app.get("/api/graha", (req, res) => {
  const { dt, lat, lon } = req.query;
  if (!dt || !lat || !lon) {
    return res.status(400).json({ error: "Missing parameters" });
  }
  res.json({
    sun: { degree: 123.45 },
    moon: { degree: 200.12 },
    msg: "Secure Render response"
  });
});

// ✅ Serve static frontend
app.use(express.static("public"));

app.listen(PORT, HOST, () =>
  console.log(`🔒 API listening on http://${HOST}:${PORT}`)
);
