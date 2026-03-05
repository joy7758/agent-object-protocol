#!/usr/bin/env python3

import json
import re
from pathlib import Path

GENERATED_DIR = Path(__file__).resolve().parent.parent.parent / "synthetic-scale" / "generated"
SAFE_INT_MAX = 9007199254740991
PAYLOAD_RE = re.compile(r"^application/vnd\.in-toto\.[a-z0-9_.-]+\+json$")


def has_required_shape(value):
    return (
        isinstance(value, dict)
        and isinstance(value.get("aop_version"), str)
        and isinstance(value.get("kind"), str)
        and isinstance(value.get("id"), str)
    )


def has_canonical_payload_type(value):
    if not isinstance(value, dict):
        return False
    envelope = value.get("envelope")
    if not isinstance(envelope, dict):
        return False
    payload_type = envelope.get("payloadType")
    if not isinstance(payload_type, str):
        return False
    return payload_type == "application/vnd.in-toto+json" or bool(PAYLOAD_RE.match(payload_type))


def contains_unsafe_integer(value):
    if isinstance(value, bool):
        return False
    if isinstance(value, int):
        return value > SAFE_INT_MAX or value < -SAFE_INT_MAX
    if isinstance(value, list):
        return any(contains_unsafe_integer(item) for item in value)
    if isinstance(value, dict):
        return any(contains_unsafe_integer(v) for v in value.values())
    return False


def classify(value):
    return has_required_shape(value) and has_canonical_payload_type(value) and not contains_unsafe_integer(value)


def main():
    if not GENERATED_DIR.exists():
        raise SystemExit(f"missing generated dataset: {GENERATED_DIR}")

    files = sorted(p for p in GENERATED_DIR.iterdir() if p.suffix == ".json")
    if not files:
        raise SystemExit(f"no synthetic artifacts found in {GENERATED_DIR}")

    parse_rejected = 0
    checks_rejected = 0
    admitted = 0

    for p in files:
        raw = p.read_text(encoding="utf-8")
        try:
            value = json.loads(raw)
        except json.JSONDecodeError:
            parse_rejected += 1
            continue

        if classify(value):
            admitted += 1
        else:
            checks_rejected += 1

    print(f"python_total={len(files)}")
    print(f"python_parse_rejected={parse_rejected}")
    print(f"python_checks_rejected={checks_rejected}")
    print(f"python_admitted={admitted}")


if __name__ == "__main__":
    main()
