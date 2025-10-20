// scripts/validate-schema.js — Validate palm JSON files against schema
// Run: node scripts/validate-schema.js datasets/annotations/sample.json

import fs from "fs";
import path from "path";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });
const schema = JSON.parse(fs.readFileSync("./ontology/palmistry.schema.json", "utf8"));

const file = process.argv[2];
if (!file) {
  console.error("❌ Usage: node scripts/validate-schema.js <file.json>");
  process.exit(1);
}

try {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (valid) {
    console.log("✅ Schema validation passed:", path.basename(file));
  } else {
    console.error("❌ Validation failed:", path.basename(file));
    console.error(validate.errors);
    process.exitCode = 1;
  }
} catch (err) {
  console.error("⚠️ Error reading file:", err.message);
  process.exit(1);
}
