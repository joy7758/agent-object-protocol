#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const vectorVerifierPath = path.resolve(__dirname, "verify_conformance_vectors.mjs");

const objectSchema = "schemas/lifecycle/lifecycle-object.schema.json";
const receiptSchema = "schemas/lifecycle/lifecycle-receipt.schema.json";

function runAjv(schemaPath, dataPath) {
  execFileSync(
    "ajv",
    ["validate", "--spec=draft2020", "-s", schemaPath, "-d", dataPath, "--all-errors"],
    {
      cwd: repoRoot,
      stdio: "pipe",
      encoding: "utf8"
    }
  );
}

function fail(message, issues = []) {
  console.error(`[FAIL] ${message}`);
  for (const issue of issues) {
    console.error(`  - ${issue}`);
  }
  process.exitCode = 1;
}

function ok(message) {
  console.log(`[PASS] ${message}`);
}

function writeTempJson(tempDir, prefix, payload) {
  const filename = path.join(tempDir, `${prefix}-${Math.random().toString(16).slice(2)}.json`);
  fs.writeFileSync(filename, JSON.stringify(payload, null, 2));
  return filename;
}

function parseTimestamp(value) {
  return Date.parse(value);
}

function validateScenarioSemantics(scenario) {
  const issues = [];
  const objects = new Map();
  for (const object of scenario.objects ?? []) {
    objects.set(object.agent_instance_id, object);
  }

  const subjectStates = new Map();
  const lastReceiptBySubject = new Map();

  for (const receipt of scenario.receipts ?? []) {
    const subjectId = receipt.subject_instance_id;
    const transition = receipt.transition_type;
    const currentState = subjectStates.get(subjectId) ?? null;

    if (currentState !== null && receipt.prior_state !== currentState) {
      issues.push(
        `state continuity mismatch for ${subjectId}: expected prior_state ${currentState}, got ${receipt.prior_state}`
      );
    }

    if (transition === "resume" && currentState === "TERMINATED") {
      issues.push("terminated object cannot resume");
    }

    if (transition === "fork") {
      const child = objects.get(receipt.related_instance_id);
      if (!child) {
        issues.push(`fork child object missing: ${receipt.related_instance_id}`);
      } else if (child.lineage_id !== receipt.lineage_id) {
        issues.push("fork child lineage continuity must match parent lineage_id");
      }
    }

    if (transition === "merge") {
      if (!objects.has(receipt.related_instance_id)) {
        issues.push("merge receipt must reference an existing target object");
      }
      if (currentState === "TERMINATED" || receipt.prior_state === "TERMINATED") {
        issues.push("merge cannot originate from TERMINATED state");
      }
    }

    if (currentState === "TERMINATED") {
      issues.push(`terminal state cannot transition again for ${subjectId}`);
    }
    if (currentState === "MERGED" && transition !== "terminate") {
      issues.push(`merged branch cannot continue with ${transition} for ${subjectId}`);
    }

    if (receipt.transition_type === "fork" && currentState !== "ACTIVE") {
      issues.push(`fork requires ACTIVE current state for ${subjectId}`);
    }

    if (receipt.transition_type === "merge" && !["ACTIVE", "SUSPENDED"].includes(receipt.prior_state)) {
      issues.push(`merge requires ACTIVE or SUSPENDED prior_state for ${subjectId}`);
    }

    const previous = lastReceiptBySubject.get(subjectId);
    if (previous) {
      const previousTime = parseTimestamp(previous.issued_at);
      const currentTime = parseTimestamp(receipt.issued_at);
      if (Number.isFinite(previousTime) && Number.isFinite(currentTime) && currentTime < previousTime) {
        issues.push(`timestamp regression for ${subjectId}`);
      }
    }

    subjectStates.set(subjectId, receipt.next_state);
    lastReceiptBySubject.set(subjectId, receipt);

    if (transition === "fork" && receipt.related_instance_id) {
      subjectStates.set(receipt.related_instance_id, "ACTIVE");
    }
  }

  for (const [instanceId, object] of objects.entries()) {
    const lastReceipt = lastReceiptBySubject.get(instanceId);
    if (!lastReceipt) {
      continue;
    }
    if (object.current_state !== lastReceipt.next_state) {
      issues.push(`object current_state mismatch for ${instanceId}`);
    }
    if (object.receipt_chain_head !== lastReceipt.receipt_id) {
      issues.push(`object receipt_chain_head mismatch for ${instanceId}`);
    }
  }

  return issues;
}

function validateScenarioStructure(scenarioPath, scenario) {
  const issues = [];
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "lifecycle-profile-"));
  try {
    for (const object of scenario.objects ?? []) {
      const tempPath = writeTempJson(tempDir, "object", object);
      try {
        runAjv(objectSchema, tempPath);
      } catch (error) {
        issues.push(`schema validation failed for object ${object.agent_instance_id}: ${String(error.message || error)}`);
      }
    }
    for (const receipt of scenario.receipts ?? []) {
      const tempPath = writeTempJson(tempDir, "receipt", receipt);
      try {
        runAjv(receiptSchema, tempPath);
      } catch (error) {
        issues.push(`schema validation failed for receipt ${receipt.receipt_id}: ${String(error.message || error)}`);
      }
    }
  } finally {
    for (const file of fs.readdirSync(tempDir)) {
      fs.unlinkSync(path.join(tempDir, file));
    }
    fs.rmdirSync(tempDir);
  }

  if (!Array.isArray(scenario.objects) || !Array.isArray(scenario.receipts)) {
    issues.push(`invalid scenario structure in ${scenarioPath}`);
  }

  return issues;
}

function main() {
  execFileSync("node", [vectorVerifierPath, "conformance/lifecycle-profile-v0.1-vectors.json"], {
    cwd: repoRoot,
    stdio: "inherit"
  });

  const manifestPath = process.argv[2] || "conformance/lifecycle-profile-v0.1-scenarios.json";
  const manifest = JSON.parse(fs.readFileSync(path.resolve(repoRoot, manifestPath), "utf8"));
  const scenarios = manifest.scenarios || [];
  let passed = 0;
  let failed = 0;

  for (const entry of scenarios) {
    const scenarioPath = path.resolve(repoRoot, entry.data);
    const scenario = JSON.parse(fs.readFileSync(scenarioPath, "utf8"));

    const structureIssues = validateScenarioStructure(entry.data, scenario);
    const semanticIssues = structureIssues.length > 0 ? [] : validateScenarioSemantics(scenario);
    const issues = [...structureIssues, ...semanticIssues];
    const isValid = issues.length === 0;

    if (entry.expect === "valid" && isValid) {
      ok(`${entry.id}: valid as expected`);
      passed += 1;
      continue;
    }
    if (entry.expect === "invalid" && !isValid) {
      ok(`${entry.id}: invalid as expected`);
      passed += 1;
      continue;
    }

    fail(`${entry.id}: expected ${entry.expect}, got ${isValid ? "valid" : "invalid"}`, issues);
    failed += 1;
  }

  console.log(`\nSummary: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
