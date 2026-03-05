#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const adversarialRoot = path.join(repoRoot, "examples", "invalid", "adversarial");

class StrictJsonParser {
  constructor(text) {
    this.text = text;
    this.index = 0;
    this.unsafeIntegerPointers = [];
  }

  parse() {
    const value = this.parseValue("");
    this.skipWhitespace();
    if (this.index !== this.text.length) {
      this.throwError("Unexpected trailing characters", "SYNTAX_ERROR");
    }
    return { value, unsafeIntegerPointers: this.unsafeIntegerPointers };
  }

  parseValue(pointer) {
    this.skipWhitespace();
    const ch = this.peek();

    if (ch === "{") {
      return this.parseObject(pointer);
    }

    if (ch === "[") {
      return this.parseArray(pointer);
    }

    if (ch === "\"") {
      return this.parseString();
    }

    if (ch === "t") {
      return this.parseLiteral("true", true);
    }

    if (ch === "f") {
      return this.parseLiteral("false", false);
    }

    if (ch === "n") {
      return this.parseLiteral("null", null);
    }

    return this.parseNumber(pointer);
  }

  parseObject(pointer) {
    this.expect("{");
    this.skipWhitespace();

    const obj = {};
    const seen = new Set();

    if (this.peek() === "}") {
      this.index += 1;
      return obj;
    }

    while (true) {
      this.skipWhitespace();
      if (this.peek() !== "\"") {
        this.throwError("Expected object key string", "SYNTAX_ERROR");
      }

      const key = this.parseString();
      if (seen.has(key)) {
        this.throwError(`Duplicate key "${key}"`, "DUPLICATE_KEY");
      }
      seen.add(key);

      this.skipWhitespace();
      this.expect(":");

      const childPointer = `${pointer}/${escapeJsonPointer(key)}`;
      obj[key] = this.parseValue(childPointer);

      this.skipWhitespace();
      const ch = this.peek();
      if (ch === ",") {
        this.index += 1;
        continue;
      }
      if (ch === "}") {
        this.index += 1;
        break;
      }
      this.throwError("Expected ',' or '}' in object", "SYNTAX_ERROR");
    }

    return obj;
  }

  parseArray(pointer) {
    this.expect("[");
    this.skipWhitespace();

    const arr = [];
    if (this.peek() === "]") {
      this.index += 1;
      return arr;
    }

    let idx = 0;
    while (true) {
      arr.push(this.parseValue(`${pointer}/${idx}`));
      idx += 1;

      this.skipWhitespace();
      const ch = this.peek();
      if (ch === ",") {
        this.index += 1;
        continue;
      }
      if (ch === "]") {
        this.index += 1;
        break;
      }
      this.throwError("Expected ',' or ']' in array", "SYNTAX_ERROR");
    }

    return arr;
  }

  parseString() {
    this.expect("\"");
    let out = "";

    while (this.index < this.text.length) {
      const ch = this.peek();

      if (ch === "\"") {
        this.index += 1;
        return out;
      }

      if (ch === "\\") {
        this.index += 1;
        const esc = this.peek();
        if (esc === undefined) {
          this.throwError("Unterminated escape sequence", "SYNTAX_ERROR");
        }

        if (esc === "\"" || esc === "\\" || esc === "/") {
          out += esc;
          this.index += 1;
          continue;
        }
        if (esc === "b") {
          out += "\b";
          this.index += 1;
          continue;
        }
        if (esc === "f") {
          out += "\f";
          this.index += 1;
          continue;
        }
        if (esc === "n") {
          out += "\n";
          this.index += 1;
          continue;
        }
        if (esc === "r") {
          out += "\r";
          this.index += 1;
          continue;
        }
        if (esc === "t") {
          out += "\t";
          this.index += 1;
          continue;
        }
        if (esc === "u") {
          const hex = this.text.slice(this.index + 1, this.index + 5);
          if (!/^[0-9a-fA-F]{4}$/.test(hex)) {
            this.throwError("Invalid unicode escape", "SYNTAX_ERROR");
          }
          out += String.fromCharCode(parseInt(hex, 16));
          this.index += 5;
          continue;
        }

        this.throwError(`Unsupported escape sequence "\\${esc}"`, "SYNTAX_ERROR");
      }

      if (ch < " ") {
        this.throwError("Control characters are not allowed in JSON strings", "SYNTAX_ERROR");
      }

      out += ch;
      this.index += 1;
    }

    this.throwError("Unterminated string", "SYNTAX_ERROR");
  }

  parseLiteral(token, value) {
    if (this.text.slice(this.index, this.index + token.length) !== token) {
      this.throwError(`Invalid token, expected "${token}"`, "SYNTAX_ERROR");
    }
    this.index += token.length;
    return value;
  }

  parseNumber(pointer) {
    const start = this.index;

    if (this.peek() === "-") {
      this.index += 1;
    }

    if (this.peek() === "0") {
      this.index += 1;
      if (isDigit(this.peek())) {
        this.throwError("Leading zeros are not allowed", "SYNTAX_ERROR");
      }
    } else if (isDigit19(this.peek())) {
      while (isDigit(this.peek())) {
        this.index += 1;
      }
    } else {
      this.throwError("Invalid number", "SYNTAX_ERROR");
    }

    if (this.peek() === ".") {
      this.index += 1;
      if (!isDigit(this.peek())) {
        this.throwError("Invalid fractional part", "SYNTAX_ERROR");
      }
      while (isDigit(this.peek())) {
        this.index += 1;
      }
    }

    const exp = this.peek();
    if (exp === "e" || exp === "E") {
      this.index += 1;
      const sign = this.peek();
      if (sign === "+" || sign === "-") {
        this.index += 1;
      }
      if (!isDigit(this.peek())) {
        this.throwError("Invalid exponent", "SYNTAX_ERROR");
      }
      while (isDigit(this.peek())) {
        this.index += 1;
      }
    }

    const numText = this.text.slice(start, this.index);
    const num = Number(numText);
    if (Number.isNaN(num)) {
      this.throwError("Invalid number value", "SYNTAX_ERROR");
    }

    if (!/[.eE]/.test(numText) && !Number.isSafeInteger(num)) {
      this.unsafeIntegerPointers.push(pointer || "/");
    }

    return num;
  }

  skipWhitespace() {
    while (this.index < this.text.length) {
      const ch = this.text[this.index];
      if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
        this.index += 1;
      } else {
        break;
      }
    }
  }

  peek() {
    return this.text[this.index];
  }

  expect(ch) {
    if (this.peek() !== ch) {
      this.throwError(`Expected "${ch}"`, "SYNTAX_ERROR");
    }
    this.index += 1;
  }

  throwError(message, code) {
    const err = new Error(`${message} at index ${this.index}`);
    err.code = code;
    throw err;
  }
}

function isDigit(ch) {
  return ch !== undefined && ch >= "0" && ch <= "9";
}

function isDigit19(ch) {
  return ch !== undefined && ch >= "1" && ch <= "9";
}

function escapeJsonPointer(value) {
  return value.replace(/~/g, "~0").replace(/\//g, "~1");
}

function walkJsonFiles(dir) {
  const files = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      files.push(...walkJsonFiles(abs));
      continue;
    }
    if (ent.isFile() && ent.name.endsWith(".json")) {
      files.push(abs);
    }
  }
  return files;
}

function relPath(absPath) {
  return path.relative(repoRoot, absPath).split(path.sep).join("/");
}

function looksLikeCaseConfusionInTotoPayloadType(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const payloadType = value.payloadType;
  if (typeof payloadType !== "string") {
    return false;
  }
  const canonical =
    payloadType === "application/vnd.in-toto+json" ||
    /^application\/vnd\.in-toto\.[a-z0-9_.-]+\+json$/.test(payloadType);
  const caseInsensitiveMatch = /^application\/vnd\.in-toto(?:\.[a-z0-9_.-]+)?\+json$/i.test(payloadType);
  return caseInsensitiveMatch && !canonical;
}

function passesMinimalAopShape(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return (
    typeof value.aop_version === "string" &&
    typeof value.kind === "string" &&
    typeof value.id === "string"
  );
}

if (!fs.existsSync(adversarialRoot)) {
  console.error(`Missing directory: ${relPath(adversarialRoot)}`);
  process.exit(2);
}

const files = walkJsonFiles(adversarialRoot);
if (files.length === 0) {
  console.log("No adversarial invalid fixtures found.");
  process.exit(0);
}

let expectedReject = 0;
let parseReject = 0;
let unexpectedPass = 0;

for (const file of files) {
  const rel = relPath(file);
  const base = path.basename(file);
  const raw = fs.readFileSync(file, "utf8");

  let parsed;
  try {
    const parser = new StrictJsonParser(raw);
    parsed = parser.parse();
  } catch (err) {
    parseReject += 1;
    expectedReject += 1;
    console.log(`[OK] ${rel} rejected during strict JSON parse (${err.code ?? "ERROR"})`);
    continue;
  }

  if (base === "duplicate-keys.invalid.json") {
    unexpectedPass += 1;
    console.error(`[FAIL] ${rel} should contain duplicate keys and fail strict parsing`);
    continue;
  }

  if (base === "number-rounding.edge.invalid.json") {
    if (parsed.unsafeIntegerPointers.length > 0) {
      expectedReject += 1;
      console.log(
        `[OK] ${rel} rejected for unsafe integer at ${parsed.unsafeIntegerPointers.join(", ")}`
      );
    } else {
      unexpectedPass += 1;
      console.error(`[FAIL] ${rel} expected at least one unsafe integer`);
    }
    continue;
  }

  if (base === "intoto-payloadType.case.invalid.json") {
    if (looksLikeCaseConfusionInTotoPayloadType(parsed.value)) {
      expectedReject += 1;
      console.log(`[OK] ${rel} rejected for non-canonical in-toto payloadType casing`);
    } else {
      unexpectedPass += 1;
      console.error(`[FAIL] ${rel} expected non-canonical in-toto payloadType casing`);
    }
    continue;
  }

  if (passesMinimalAopShape(parsed.value)) {
    unexpectedPass += 1;
    console.error(`[FAIL] ${rel} unexpectedly passes minimal AOP shape checks`);
    continue;
  }

  expectedReject += 1;
  console.log(`[OK] ${rel} rejected by baseline shape checks`);
}

console.log(`Adversarial invalid fixtures total: ${files.length}`);
console.log(`Rejected at parse: ${parseReject}`);
console.log(`Rejected by checks: ${expectedReject - parseReject}`);
console.log(`Unexpectedly passed: ${unexpectedPass}`);

process.exit(unexpectedPass === 0 ? 0 : 1);
