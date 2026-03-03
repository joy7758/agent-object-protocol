# AOP v0.4.0 Release Notes

## Summary

v0.4.0 establishes the policy and registry interoperability layer as
schema-backed, CI-enforced protocol artifacts.

## Highlights

- Accepted AEP-0003 as the v0.4.0 agenda baseline.
- Added normative policy object family:
  - `schemas/aop-policy.schema.json`
  - `examples/aop-policy.allow.json`
  - `examples/aop-policy.deny.json`
  - negative policy fixtures under `examples/invalid/`
- Added policy decision envelope family:
  - `schemas/aop-policy-decision.schema.json`
  - `examples/aop-policy-decision.allow.json`
  - `examples/aop-policy-decision.deny.json`
  - negative decision fixtures under `examples/invalid/`
- Added non-normative registry interoperability family:
  - `schemas/aop-registry-record.schema.json`
  - `schemas/aop-resolve-response.schema.json`
  - `examples/registry/*.json`
  - negative registry fixtures under `examples/invalid/`
- Updated SPEC and CONFORMANCE docs:
  - Policy normative hooks in `SPEC.md`
  - Registry field semantics (non-normative) in `SPEC.md`
  - Level-based conformance alignment in `CONFORMANCE.md`

## CI and Conformance

CI now enforces schema families independently:

1. Compile all schemas with Ajv (`--spec=draft2020`)
2. Validate positive examples by schema family
3. Reject negative fixtures by schema family

## Compatibility

v0.4.0 is a MINOR release in the v0.x line. It introduces additive
schema families and validation gates for policy decision and registry
interop artifacts, plus policy semantics hooks.

No v0.3 object schema contract has been removed.
