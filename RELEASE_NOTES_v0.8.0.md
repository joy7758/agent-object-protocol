# AOP v0.8.0 - Provenance and Integrity (Evidence-Bound E2E Chains)

## Summary

v0.8.0 upgrades AOP end-to-end chains by adding evidence artifacts and
enforcing digest binding:

- Evidence subjects bind to chain artifacts by
  `SHA-256(JCS(json))`.
- CI enforces: positive scenarios MUST pass, negative scenarios MUST be
  rejected.

## What’s New

### 1) Evidence schema family (normative)

- `schemas/aop-evidence.schema.json`
- Tooling: `tools/jcs_sha256.mjs`

### 2) v0.8 E2E scenarios with evidence

- Positive: `examples/v0.8/e2e/positive/scenario-1/`
- Negative (single-fault violations):
  - `examples/v0.8/e2e/negative/scenario-n1-evidence-wrong-digest/`
  - `examples/v0.8/e2e/negative/scenario-n2-evidence-wrong-policy-id/`

### 3) CI gates

- Evidence schema validation
- Evidence binding gate:
  - `sha256 == SHA-256(JCS(json))`
  - policy and identity bindings enforced
  - negatives MUST be rejected

## Why This Matters

- RFC 8785 defines JCS to produce a hashable canonical JSON
  representation for cryptographic methods.
- SLSA provenance models provenance as an attestation for consumers to
  verify artifact expectations.
- in-toto link metadata is evidence that a supply-chain step was carried
  out and materials/products were not changed unexpectedly.

## Conformance

Adds **Level 6 - Evidence-Bound E2E Chain** in `CONFORMANCE.md`.

## References (informative)

- [RFC 8785 JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785)
- [SLSA provenance v1.0](https://slsa.dev/spec/v1.0/provenance)
- [in-toto specification](https://github.com/in-toto/specification/blob/master/in-toto-spec.md)
