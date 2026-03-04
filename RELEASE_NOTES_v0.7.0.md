# AOP v0.7.0 - End-to-End Artifact Chain Baseline

## Summary

v0.7.0 establishes the first end-to-end artifact-chain baseline for AOP:
`resolve -> fetch -> evaluate -> decision`.

This release remains runtime-agnostic and focuses on schema-backed,
reproducible conformance artifacts (schemas + fixtures + CI gates).

## What's New

### 1) End-to-end chain fixtures (v0.7)

Added v0.7 E2E fixture families under `examples/v0.7/e2e/`:

- Positive scenarios (`positive/*`) for valid cross-artifact consistency
- Negative scenarios (`negative/*`) for intentional semantic mismatch

Each scenario contains:

- `resolve.json` (`aop-resolve-response`)
- `manifest.json` (`aop-object`)
- `policy.json` (`aop-policy`)
- `decision*.json` (`aop-policy-decision`)

### 2) CI semantic gates (positive pass + negative reject)

CI now enforces both:

1. Positive E2E scenarios MUST pass schema and semantic checks.
2. Negative E2E scenarios MUST be rejected by semantic checks.

Schema validation remains per family (resolve/object/policy/decision),
followed by cross-artifact consistency checks:

- `resolve.request.object_id == manifest.id`
- `decision.policy_id == policy.id`
- `decision.target.selector == "object_id"`
- `decision.target.object_id == manifest.id`

### 3) Conformance level formalization

`CONFORMANCE.md` now includes **Level 5**:

- End-to-End Artifact Chain (v0.7)
- reproducible positive and negative fixture anchors
- required gate behavior for both acceptance and rejection paths

## Governance Status

- `AEP-0006` is now **Accepted**.
- Acceptance criteria are marked complete with implementation notes.

## Compatibility

- This release adds E2E fixture coverage and semantic gates.
- No reference runtime is introduced.

## References (informative)

- XACML REST profile (PEP/PDP interaction context):
  [docs.oasis-open.org](https://docs.oasis-open.org/xacml/xacml-rest/v1.0/xacml-rest-v1.0.html)
- OPA project reference (policy and decision context):
  [github.com/open-policy-agent/opa](https://github.com/open-policy-agent/opa)
- JSON Schema 2020-12 `unevaluatedProperties`:
  [json-schema.org](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01#section-11.3)
