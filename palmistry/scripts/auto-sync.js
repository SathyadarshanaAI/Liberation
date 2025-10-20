// scripts/auto-sync.js — auto-sync models and rulesets
// © 2025 Sathyadarshana Research Core

import fs from "fs";
import fetch from "node-fetch";
import crypto from "crypto";
import path from "path";

const LOCAL_PATH = "./config/model_registry.json";

async function hashFile(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(buf).digest("hex");
}

async function syncRegistry() {
  try {
    const local = JSON.parse(fs.readFileSync(LOCAL_PATH, "utf8"));
    const remoteURL = local.features.remoteEndpoint;
    console.log("🌐 Checking remote registry:", remoteURL);

    const response = await fetch(remoteURL);
    if (!response.ok) throw new Error("Cannot fetch remote registry");
    const remote = await response.json();

    if (remote.last_update !== local.last_update) {
      console.log("🔄 New registry version found:", remote.last_update);
      fs.writeFileSync(LOCAL_PATH, JSON.stringify(remote, null, 2));
      console.log("✅ Local registry updated.");

      // Compare model hashes
      for (const model of remote.models) {
        const file = model.file;
        if (!fs.existsSync(file)) {
          console.log("⬇️ Downloading missing model:", file);
          // optional: fetch binary if public
        } else {
          const localHash = await hashFile(file);
          if (localHash !== model.sha256) {
            console.log(`⚠️ Model hash mismatch: ${file}`);
          } else {
            console.log(`✅ ${file} verified`);
          }
        }
      }
    } else {
      console.log("✨ Already up to date.");
    }
  } catch (err) {
    console.error("❌ Sync failed:", err.message);
  }
}

syncRegistry();
