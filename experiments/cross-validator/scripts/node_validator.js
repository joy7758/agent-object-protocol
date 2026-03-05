#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const GENERATED_DIR = path.resolve(__dirname, "..", "..", "synthetic-scale", "generated");

function hasRequiredShape(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof value.aop_version === "string" &&
    typeof value.kind === "string" &&
    typeof value.id === "string"
  );
}

function hasCanonicalPayloadType(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const payloadType = value?.envelope?.payloadType;
  if (typeof payloadType !== "string") {
    return false;
  }
  return payloadType === "application/vnd.in-toto+json" || /^application\/vnd\.in-toto\.[a-z0-9_.-]+\+json$/.test(payloadType);
}

function containsUnsafeInteger(value) {
  if (typeof value === "number") {
    return Number.isInteger(value) && !Number.isSafeInteger(value);
  }
  if (Array.isArray(value)) {
    return value.some(containsUnsafeInteger);
  }
  if (value && typeof value === "object") {
    return Object.values(value).some(containsUnsafeInteger);
  }
  return false;
}

function classify(value) {
  return hasRequiredShape(value) && hasCanonicalPayloadType(value) && !containsUnsafeInteger(value);
}

function main() {
  if (!fs.existsSync(GENERATED_DIR)) {
    console.error(`missing generated dataset: ${GENERATED_DIR}`);
    process.exit(2);
  }

  const files = fs
    .readdirSync(GENERATED_DIR)
    .filter((name) => name.endsWith(".json"))
    .sort();

  if (files.length === 0) {
    console.error(`no synthetic artifacts found in ${GENERATED_DIR}`);
    process.exit(2);
  }

  let parseRejected = 0;
  let checksRejected = 0;
  let admitted = 0;

  for (const name of files) {
    const abs = path.join(GENERATED_DIR, name);
    const raw = fs.readFileSync(abs, "utf8");
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parseRejected += 1;
      continue;
    }

    if (classify(parsed)) {
      admitted += 1;
    } else {
      checksRejected += 1;
    }
  }

  console.log(`node_total=${files.length}`);
  console.log(`node_parse_rejected=${parseRejected}`);
  console.log(`node_checks_rejected=${checksRejected}`);
  console.log(`node_admitted=${admitted}`);
}

main();
