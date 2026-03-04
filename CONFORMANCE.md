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

### Optional: Strict date-time validation with `ajv-formats`

Some AOP schemas intentionally avoid `format: date-time` so baseline CI
remains minimal and reproducible across environments. Implementations
MAY enable stricter format validation by loading `ajv-formats` in
ajv-cli.

Example:

```bash
ajv validate --spec=draft2020 -c ajv-formats -s <schema.json> -d <data.json> --all-errors
```

CI validates examples by schema family:

- `examples/*.json` except `aop-policy.*.json` against `schemas/aop-object.schema.json`
- `examples/aop-policy.*.json` against `schemas/aop-policy.schema.json`
- `examples/aop-policy-decision.*.json` against
  `schemas/aop-policy-decision.schema.json`
- `examples/registry/aop-registry-record*.json` against `schemas/aop-registry-record.schema.json`
- `examples/registry/aop-resolve-response*.json` against `schemas/aop-resolve-response.schema.json`
- `examples/v0.5/combo/{object,policy,expected}/*.json` by mapped family
  schemas when present (draft gate)
- `examples/v0.6/combo/{object,policy,expected}/*.json` by mapped family
  schemas when present (draft gate)
- `examples/v0.5/mcp/tool/*.json` against `schemas/aop-object.schema.json`,
  then `examples/v0.5/mcp/expected/*.json` against a schema derived from
  `tool.schema.outputs` when present (draft gate)

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

### Level 4: v0.6 Suite Expansion (Combo + Multi-Tool MCP)

A system meets Level 4 if it additionally supports the v0.6 suite
expansion artifacts and corresponding gate behavior.

Combo semantics fixtures (strategy deltas + semantic-invalid rejection):

- C1 fixtures:
  - `examples/v0.6/combo/object/c1-sensitive-writer.object.json`
  - `examples/v0.6/combo/policy/c1-permit-vs-deny.policy.json`
  - `examples/v0.6/combo/expected/c1-permit-vs-deny.first_match.expected.json`
  - `examples/v0.6/combo/expected/c1-permit-vs-deny.deny_overrides.expected.json`
  - `examples/v0.6/combo/expected/c1-permit-vs-deny.first_match.semantic.invalid.json`
- C2 fixtures:
  - `examples/v0.6/combo/object/c2-network-sensitive.object.json`
  - `examples/v0.6/combo/policy/c2-permit-vs-deny.policy.json`
  - `examples/v0.6/combo/expected/c2-permit-vs-deny.permit_overrides.expected.json`
  - `examples/v0.6/combo/expected/c2-permit-vs-deny.deny_unless_permit.expected.json`
  - `examples/v0.6/combo/expected/c2-permit-vs-deny.permit_overrides.semantic.invalid.json`

MCP multi-tool fixtures (derived output-schema validation):

- Tool fixtures:
  - `examples/v0.5/mcp/tool/file-search.tool.object.json`
  - `examples/v0.5/mcp/tool/kv-get.tool.object.json`
  - `examples/v0.5/mcp/tool/web-fetch.tool.object.json`
- Expected outputs:
  - `examples/v0.5/mcp/expected/file-search.output.expected.json`
  - `examples/v0.5/mcp/expected/kv-get.output.expected.json`
  - `examples/v0.5/mcp/expected/web-fetch.output.expected.json`
- Invalid outputs:
  - `examples/invalid/v0.5/mcp/file-search.output-missing-results.invalid.json`
  - `examples/invalid/v0.5/mcp/file-search.output-score-out-of-range.invalid.json`
  - `examples/invalid/v0.5/mcp/kv-get.output-missing-value.invalid.json`
  - `examples/invalid/v0.5/mcp/kv-get.output-wrong-type.invalid.json`
  - `examples/invalid/v0.5/mcp/web-fetch.output-status-out-of-range.invalid.json`
  - `examples/invalid/v0.5/mcp/web-fetch.output-missing-body.invalid.json`

Required gate behavior for Level 4:

- Combo expected fixtures MUST pass schema and semantic checks.
- Combo semantic-invalid fixtures MUST be rejected.
- MCP expected outputs MUST pass derived output-schema validation.
- MCP invalid outputs MUST be rejected.

### Level 5: End-to-End Artifact Chain (v0.7)

A system meets Level 5 if it additionally supports the end-to-end
artifact chain fixtures and semantic rejection behavior for v0.7:

- Positive scenarios (MUST pass semantic checks):
  - `examples/v0.7/e2e/positive/*/resolve.json`
  - `examples/v0.7/e2e/positive/*/manifest.json`
  - `examples/v0.7/e2e/positive/*/policy.json`
  - `examples/v0.7/e2e/positive/*/decision*.json`
- Negative scenarios (MUST be rejected by semantic checks):
  - `examples/v0.7/e2e/negative/*/resolve.json`
  - `examples/v0.7/e2e/negative/*/manifest.json`
  - `examples/v0.7/e2e/negative/*/policy.json`
  - `examples/v0.7/e2e/negative/*/decision*.json`

Required gate behavior for Level 5:

1. Each E2E file MUST be schema-valid against its family schema.
2. Cross-artifact constraints MUST hold for positives:
   - `resolve.request.object_id == manifest.id`
   - `decision.policy_id == policy.id`
   - `decision.target.selector == "object_id"`
   - `decision.target.object_id == manifest.id`
3. Negative scenarios MUST violate exactly one constraint and MUST be
   rejected by the semantic gate.

Reference fixtures for quick reproducibility:

- Positive:
  - `examples/v0.7/e2e/positive/scenario-1/resolve.json`
  - `examples/v0.7/e2e/positive/scenario-1/manifest.json`
  - `examples/v0.7/e2e/positive/scenario-1/policy.json`
  - `examples/v0.7/e2e/positive/scenario-1/decision.deny_overrides.json`
- Negative:
  - `examples/v0.7/e2e/negative/scenario-n1-resolve-manifest-mismatch/resolve.json`
  - `examples/v0.7/e2e/negative/scenario-n2-policy-id-mismatch/decision.deny_overrides.json`

Notes:

- Level 5 expresses request/decision consistency as verifiable artifacts,
  aligned with common PEP-to-PDP interaction decomposition.
- Unknown-field discipline remains strict through schema families using
  2020-12 controls such as `unevaluatedProperties`.

### Level 6: Evidence-Bound E2E Chain (JCS + SHA-256)

A system meets Level 6 if it meets Level 5 and additionally validates
evidence artifacts bound to v0.8 E2E chains:

- Evidence schema:
  - `schemas/aop-evidence.schema.json`
- v0.8 positive scenarios:
  - `examples/v0.8/e2e/positive/*/`
- v0.8 negative scenarios (MUST be rejected):
  - `examples/v0.8/e2e/negative/*/`

Evidence binding rules (CI-enforced):

1. Evidence subject identity binds to artifacts:
   - `evidence.manifest.subject.id == manifest.id`
2. Evidence subject digest binds to artifacts:
   - `evidence.manifest.subject.digest.sha256 == SHA-256(JCS(manifest.json))`
   - `evidence.decision.subject.digest.sha256 == SHA-256(JCS(decision*.json))`
3. Evidence binds to policy used:
   - `evidence.decision.predicate.policy_id == policy.id`

Canonicalization rule:

- JCS refers to RFC 8785 JSON Canonicalization Scheme, which produces a
  hashable representation for cryptographic methods.

### Validation Expectations

When a schema is provided for structured artifacts, providers are
expected to conform and consumers are expected to validate.
This follows the broader interoperability pattern used in MCP tool
schemas (provider conformance plus client-side validation).
