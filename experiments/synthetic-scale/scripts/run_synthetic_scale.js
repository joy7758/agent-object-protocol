#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const GENERATED_DIR = path.join(ROOT, "synthetic-scale", "generated");

const VALID_COUNT = 900;
const INVALID_SHAPE_COUNT = 50;
const INVALID_PAYLOAD_CASE_COUNT = 30;
const INVALID_UNSAFE_INTEGER_COUNT = 20;
const TOTAL_EXPECTED = VALID_COUNT + INVALID_SHAPE_COUNT + INVALID_PAYLOAD_CASE_COUNT + INVALID_UNSAFE_INTEGER_COUNT;

function resetDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      fs.rmSync(abs, { recursive: true, force: true });
      continue;
    }
    fs.unlinkSync(abs);
  }
}

function canonicalPayloadType() {
  return "application/vnd.in-toto+json";
}

function syntheticTool(idx) {
  const tools = ["weather_lookup", "battery_status", "route_plan", "policy_check", "inventory_query"];
  return tools[idx % tools.length];
}

function makeValidArtifact(idx) {
  return {
    aop_version: "1.0",
    kind: "tool_invocation",
    id: `syn-valid-${idx}`,
    tool: {
      name: syntheticTool(idx),
      arguments: {
        ticket: `T-${100000 + idx}`,
        urgency: idx % 3 === 0 ? "high" : "normal",
      },
    },
    envelope: {
      payloadType: canonicalPayloadType(),
      payload: `payload-${idx}`,
    },
    ts: `2026-03-05T00:${String(idx % 60).padStart(2, "0")}:${String((idx * 7) % 60).padStart(2, "0")}Z`,
  };
}

function writeArtifact(fileName, raw, expectedClass) {
  const abs = path.join(GENERATED_DIR, fileName);
  fs.writeFileSync(abs, raw, "utf8");
  return { fileName, expectedClass };
}

function generateDataset() {
  resetDir(GENERATED_DIR);
  const manifest = [];

  for (let i = 0; i < VALID_COUNT; i += 1) {
    const obj = makeValidArtifact(i);
    manifest.push(writeArtifact(`valid-${String(i + 1).padStart(4, "0")}.json`, `${JSON.stringify(obj)}\n`, "valid"));
  }

  for (let i = 0; i < INVALID_SHAPE_COUNT; i += 1) {
    const obj = makeValidArtifact(VALID_COUNT + i);
    delete obj.id;
    manifest.push(writeArtifact(`invalid-shape-${String(i + 1).padStart(4, "0")}.json`, `${JSON.stringify(obj)}\n`, "invalid"));
  }

  for (let i = 0; i < INVALID_PAYLOAD_CASE_COUNT; i += 1) {
    const obj = makeValidArtifact(VALID_COUNT + INVALID_SHAPE_COUNT + i);
    obj.envelope.payloadType = "application/vnd.in-Toto+json";
    manifest.push(writeArtifact(`invalid-payload-case-${String(i + 1).padStart(4, "0")}.json`, `${JSON.stringify(obj)}\n`, "invalid"));
  }

  for (let i = 0; i < INVALID_UNSAFE_INTEGER_COUNT; i += 1) {
    const toolName = syntheticTool(VALID_COUNT + INVALID_SHAPE_COUNT + INVALID_PAYLOAD_CASE_COUNT + i);
    const raw = [
      "{",
      '  "aop_version": "1.0",',
      '  "kind": "tool_invocation",',
      `  "id": "invalid-unsafe-${i + 1}",`,
      `  "tool": {"name": "${toolName}", "arguments": {"ticket": "U-${100 + i}"}},`,
      '  "envelope": {"payloadType": "application/vnd.in-toto+json"},',
      '  "counter": 9007199254740993',
      "}",
      "",
    ].join("\n");
    manifest.push(writeArtifact(`invalid-unsafe-integer-${String(i + 1).padStart(4, "0")}.json`, raw, "invalid"));
  }

  return manifest;
}

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
  return payloadType === canonicalPayloadType() || /^application\/vnd\.in-toto\.[a-z0-9_.-]+\+json$/.test(payloadType);
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

function evaluate(manifest) {
  let parseRejected = 0;
  let checksRejected = 0;
  let adjudicatedPass = 0;
  let mismatchCount = 0;

  for (const item of manifest) {
    const abs = path.join(GENERATED_DIR, item.fileName);
    const raw = fs.readFileSync(abs, "utf8");

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parseRejected += 1;
      if (item.expectedClass === "valid") {
        mismatchCount += 1;
      }
      continue;
    }

    const checkPass =
      hasRequiredShape(parsed) &&
      hasCanonicalPayloadType(parsed) &&
      !containsUnsafeInteger(parsed);

    if (checkPass) {
      adjudicatedPass += 1;
      if (item.expectedClass !== "valid") {
        mismatchCount += 1;
      }
    } else {
      checksRejected += 1;
      if (item.expectedClass !== "invalid") {
        mismatchCount += 1;
      }
    }
  }

  return {
    parseRejected,
    checksRejected,
    adjudicatedPass,
    mismatchCount,
  };
}

function main() {
  const manifest = generateDataset();
  if (manifest.length !== TOTAL_EXPECTED) {
    throw new Error(`unexpected dataset size: ${manifest.length}`);
  }

  const validTarget = manifest.filter((x) => x.expectedClass === "valid").length;
  const invalidTarget = manifest.filter((x) => x.expectedClass === "invalid").length;

  const result = evaluate(manifest);

  console.log("Experiment 4 (synthetic-scale stress test)");
  console.log(`Synthetic artifacts generated: ${manifest.length}`);
  console.log(`Valid target: ${validTarget}`);
  console.log(`Invalid target: ${invalidTarget}`);
  console.log(`Parse rejected: ${result.parseRejected}`);
  console.log(`AOP checks rejected: ${result.checksRejected}`);
  console.log(`AOP admitted: ${result.adjudicatedPass}`);
  console.log(`Unexpected pass/fail mismatches: ${result.mismatchCount}`);
}

main();
