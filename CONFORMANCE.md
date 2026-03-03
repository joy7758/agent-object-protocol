# AOP Conformance Profile

This document defines how conformance is interpreted and tested for the
Agent Object Protocol (AOP) repository.

## Normative Sources

The following artifacts are normative for object validation:

- `SPEC.md`
- `schemas/aop-object.schema.json`

The following artifacts are non-normative but used as executable
conformance fixtures:

- `examples/*.json`
- `examples/invalid/*.json`

## Tested Surface

CI currently tests conformance with these commands:

```bash
ajv compile --spec=draft2020 -s schemas/aop-object.schema.json
ajv validate --spec=draft2020 \
  -s schemas/aop-object.schema.json \
  -d "examples/*.json" \
  --all-errors
```

CI also asserts rejection behavior for negative fixtures:

- Each file under `examples/invalid/` MUST fail schema validation.
- If any invalid file unexpectedly passes, CI MUST fail.

## Conformance Levels

### Level 0: Parseable Manifest

An implementation can parse object manifests and access required top-level
fields without runtime execution.

### Level 1: Schema Conformance

An implementation validates AOP manifests against the normative schema and
rejects malformed manifests.

### Level 2: Governance and Security Conformance

An implementation enforces governance/security relation rules expressed in
schema (for example, conditional auth and integrity constraints) and can
apply policy gating based on declared fields.

---

Current repository CI provides Level 1 checks and partial Level 2 coverage
through governance and security relation validation.
