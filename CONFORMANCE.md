# AOP Conformance Profile

This document defines how conformance is interpreted and tested for the
Agent Object Protocol (AOP) repository.

## Main Branch Baseline

For the current `main` branch, the repository conformance baseline is:

- `schemas/*.schema.json` compiles with `ajv compile --spec=draft2020`
- Object examples pass `schemas/aop-object.schema.json` validation
- Policy examples pass `schemas/aop-policy.schema.json` validation
- `examples/invalid/*.json` fixtures are rejected by their target schemas

## Normative Sources

The following artifacts are normative for object validation:

- `SPEC.md`
- `schemas/aop-object.schema.json`
- `schemas/aop-policy.schema.json`

The following artifacts are non-normative but used as executable
conformance fixtures:

- `examples/*.json`
- `examples/invalid/*.json`

## Tested Surface

CI currently tests conformance with these commands:

```bash
for schema in schemas/*.schema.json; do
  ajv compile --spec=draft2020 -s "${schema}"
done
```

CI validates examples by schema family:

- `examples/*.json` except `aop-policy.*.json` against `schemas/aop-object.schema.json`
- `examples/aop-policy.*.json` against `schemas/aop-policy.schema.json`

CI also asserts rejection behavior for negative fixtures:

- Object invalid fixtures (non-policy) MUST fail `schemas/aop-object.schema.json`.
- Policy invalid fixtures (`examples/invalid/aop-policy-*.json`) MUST fail `schemas/aop-policy.schema.json`.
- If any invalid file unexpectedly passes, CI MUST fail.
- Conformant publishers and runtimes SHOULD run both valid and invalid
  fixture suites as part of conformance testing.

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
