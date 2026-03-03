# AOP Conformance Profile

This document defines how conformance is interpreted and tested for the
Agent Object Protocol (AOP) repository.

## Main Branch Baseline

For the current `main` branch, the repository conformance baseline is:

- `schemas/*.schema.json` compiles with `ajv compile --spec=draft2020`
- Object examples pass `schemas/aop-object.schema.json` validation
- Policy examples pass `schemas/aop-policy.schema.json` validation
- Policy decision examples pass `schemas/aop-policy-decision.schema.json`
  validation
- Registry examples pass registry non-normative schema validation
- `examples/invalid/*.json` fixtures are rejected by their target schemas

## Normative Sources

The following artifacts are normative for object validation:

- `SPEC.md`
- `schemas/aop-object.schema.json`
- `schemas/aop-policy.schema.json`

The following schema artifacts are non-normative in v0.4.x but
validated in CI for interoperability experiments:

- `schemas/aop-policy-decision.schema.json`
- `schemas/aop-registry-record.schema.json`
- `schemas/aop-resolve-response.schema.json`

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
- `examples/aop-policy-decision.*.json` against
  `schemas/aop-policy-decision.schema.json`
- `examples/registry/aop-registry-record*.json` against `schemas/aop-registry-record.schema.json`
- `examples/registry/aop-resolve-response*.json` against `schemas/aop-resolve-response.schema.json`

CI also asserts rejection behavior for negative fixtures:

- Object invalid fixtures (non-policy) MUST fail `schemas/aop-object.schema.json`.
- Policy invalid fixtures (`examples/invalid/aop-policy-*.json`) MUST fail `schemas/aop-policy.schema.json`.
- Policy decision invalid fixtures
  (`examples/invalid/aop-policy-decision-*.json`) MUST fail
  `schemas/aop-policy-decision.schema.json`.
- Registry invalid fixtures
  (`examples/invalid/aop-registry-record-*.json`) MUST fail
  `schemas/aop-registry-record.schema.json`.
- Resolve-response invalid fixtures
  (`examples/invalid/aop-resolve-response-*.json`) MUST fail
  `schemas/aop-resolve-response.schema.json`.
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

### Level 2: Schema-Backed Conformance (Objects + Policy)

A system meets Level 2 if it:

1. Produces and consumes AOP object manifests that validate against
   `schemas/aop-object.schema.json`.
2. Produces and consumes AOP policy objects that validate against
   `schemas/aop-policy.schema.json`.
3. Enforces strict validation discipline:
   - schemas MUST compile (`ajv compile`)
   - all positive examples MUST validate
   - all negative fixtures MUST be rejected

Reference CI and tooling use Ajv CLI with `--spec=draft2020` for schema
compilation and validation.

### Level 2.5: Policy Decision Envelope

A system meets Level 2.5 if it also produces and consumes policy
decision envelopes that validate against
`schemas/aop-policy-decision.schema.json`.

### Level 3: Interoperable Registry Artifacts (Non-Normative, Schema-Validated)

A system meets Level 3 if it additionally supports registry
interoperability artifacts:

- Registry records validate against
  `schemas/aop-registry-record.schema.json`.
- Resolve responses validate against
  `schemas/aop-resolve-response.schema.json`.

Notes:

- These registry schemas are non-normative in v0.4 and support
  interoperable discovery and resolution workflows without v1-level
  protocol guarantees.
- Even as non-normative artifacts, AOP expects schema-backed validation
  for determinism and auditability, including rejection of unknown
  fields.

Reference fixtures for quick interoperability checks:

- Valid registry examples:
  - `examples/registry/aop-registry-record.example.json`
  - `examples/registry/aop-resolve-response.example.json`
- Invalid registry fixtures:
  - `examples/invalid/aop-registry-record-missing-id.invalid.json`
  - `examples/invalid/aop-resolve-response-invalid-shape.invalid.json`

### Validation Expectations

When a schema is provided for structured artifacts, providers are
expected to conform and consumers are expected to validate.
This follows the broader interoperability pattern used in MCP tool
schemas (provider conformance plus client-side validation).
