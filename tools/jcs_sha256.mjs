#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

function compareUnicodeCodePoints(a, b) {
  const aPoints = Array.from(a);
  const bPoints = Array.from(b);
  const minLength = Math.min(aPoints.length, bPoints.length);

  for (let i = 0; i < minLength; i += 1) {
    const aCode = aPoints[i].codePointAt(0);
    const bCode = bPoints[i].codePointAt(0);
    if (aCode !== bCode) {
      return aCode - bCode;
    }
  }

  return aPoints.length - bPoints.length;
}

function canonicalizeJcs(value) {
  if (value === null) {
    return "null";
  }

  const t = typeof value;

  if (t === "boolean") {
    return value ? "true" : "false";
  }

  if (t === "number") {
    if (!Number.isFinite(value)) {
      throw new Error("Non-finite numbers are not allowed in canonical JSON");
    }
    return JSON.stringify(value);
  }

  if (t === "string") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => canonicalizeJcs(item)).join(",")}]`;
  }

  if (t === "object") {
    const keys = Object.keys(value).sort(compareUnicodeCodePoints);
    const members = keys.map((key) => {
      return `${JSON.stringify(key)}:${canonicalizeJcs(value[key])}`;
    });
    return `{${members.join(",")}}`;
  }

  throw new Error(`Unsupported JSON value type: ${t}`);
}

function usage() {
  console.error("Usage: node tools/jcs_sha256.mjs [--canonical] <json-file>");
}

const args = process.argv.slice(2);
const canonicalOnly = args.includes("--canonical");
const filteredArgs = args.filter((arg) => arg !== "--canonical");

if (filteredArgs.length !== 1) {
  usage();
  process.exit(2);
}

const filePath = filteredArgs[0];
let parsed;

try {
  parsed = JSON.parse(readFileSync(filePath, "utf8"));
} catch (err) {
  console.error(`Failed to read/parse JSON: ${filePath}`);
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

let canonical;

try {
  canonical = canonicalizeJcs(parsed);
} catch (err) {
  console.error(`Failed to canonicalize JSON: ${filePath}`);
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

if (canonicalOnly) {
  process.stdout.write(`${canonical}\n`);
  process.exit(0);
}

const sha256 = createHash("sha256").update(canonical, "utf8").digest("hex");
process.stdout.write(`${sha256}\n`);
