#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

function runAjv(schemaPath, dataPath) {
  const args = [
    "validate",
    "--spec=draft2020",
    "-s",
    schemaPath,
    "-d",
    dataPath,
    "--all-errors"
  ];

  execFileSync("ajv", args, {
    cwd: repoRoot,
    stdio: "pipe",
    encoding: "utf8"
  });
}

function fail(msg) {
  console.error(`[FAIL] ${msg}`);
  process.exitCode = 1;
}

function ok(msg) {
  console.log(`[PASS] ${msg}`);
}

function main() {
  const vectorsPath = process.argv[2] || "conformance/v1.1-vectors.json";
  const absVectorsPath = path.resolve(repoRoot, vectorsPath);
  if (!fs.existsSync(absVectorsPath)) {
    throw new Error(`Vectors file not found: ${vectorsPath}`);
  }

  const payload = JSON.parse(fs.readFileSync(absVectorsPath, "utf8"));
  const vectors = payload.vectors || [];
  if (vectors.length === 0) {
    throw new Error(`No vectors found in ${vectorsPath}`);
  }

  let passed = 0;
  let failed = 0;

  for (const vector of vectors) {
    const schemaPath = vector.schema;
    const dataPath = vector.data;
    const expect = vector.expect;
    const id = vector.id;

    if (!schemaPath || !dataPath || !expect || !id) {
      fail("Vector missing required fields (id/schema/data/expect)");
      failed += 1;
      continue;
    }

    const absSchema = path.resolve(repoRoot, schemaPath);
    const absData = path.resolve(repoRoot, dataPath);
    if (!fs.existsSync(absSchema)) {
      fail(`${id}: schema file not found: ${schemaPath}`);
      failed += 1;
      continue;
    }
    if (!fs.existsSync(absData)) {
      fail(`${id}: data file not found: ${dataPath}`);
      failed += 1;
      continue;
    }

    let isValid = false;
    try {
      runAjv(schemaPath, dataPath);
      isValid = true;
    } catch {
      isValid = false;
    }

    if (expect === "valid" && isValid) {
      ok(`${id} (${vector.level}): valid as expected`);
      passed += 1;
      continue;
    }
    if (expect === "invalid" && !isValid) {
      ok(`${id} (${vector.level}): invalid as expected`);
      passed += 1;
      continue;
    }

    fail(`${id} (${vector.level}): expected ${expect}, got ${isValid ? "valid" : "invalid"}`);
    failed += 1;
  }

  console.log(`\nSummary: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
