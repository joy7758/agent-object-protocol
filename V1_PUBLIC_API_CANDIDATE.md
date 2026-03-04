# AOP v1 Public API Candidate (Frozen at v1.0.0)

This document defines the **v1 public API candidate surface** for AOP.
It was introduced in v0.9 and frozen at v1.0.0 by
`aep/aep-0009-v1.0-freeze.md` to clarify what is stable for v1.x and
what is explicitly out of scope for freeze guarantees.

## Stable Candidates for v1.0

The following artifacts are candidates for v1-stable public API:

- Object manifest schema:
  - `schemas/aop-object.schema.json`
  - Governance sections: `invocation`, `capabilities`, `security`
- Policy schema:
  - `schemas/aop-policy.schema.json`
- Policy decision envelope schema:
  - `schemas/aop-policy-decision.schema.json`
  - Decision strategy enum surface currently includes:
    - `first_match`
    - `deny_overrides`
    - `permit_overrides`
    - `deny_unless_permit`
- Evidence envelope schema:
  - `schemas/aop-evidence.schema.json`
- Evidence profile schemas:
  - `schemas/profiles/aop-provenance.profile.schema.json`
  - `schemas/profiles/slsa-provenance-min.profile.schema.json`
- Conformance levels and gate semantics:
  - `CONFORMANCE.md` Levels 2 through 7 (v1.0 freeze baseline)
  - Optional Level 8 was added in v1.1 (AEP-0010)
  - Positive fixtures MUST pass
  - Negative fixtures MUST be rejected

## Explicitly Not Frozen in v1 Baseline

The following surfaces are **not** part of the v1 frozen baseline:

- Registry schemas remain non-normative:
  - `schemas/aop-registry-record.schema.json`
  - `schemas/aop-resolve-response.schema.json`
- Experimental or vendor-specific extension fields:
  - `x-*` namespace fields
- Signature verification, key management, and transparency-log
  requirements:
  - Kept out of v1.0 freeze scope in this document

## Freeze Discipline

Changes to candidate-stable surfaces SHOULD include:

1. An AEP reference documenting motivation and compatibility impact.
2. Fixture updates for affected behavior.
3. CI gate updates that preserve pass/reject semantics.

In v1.x, this discipline is enforced through governance and CI checks.

## Notes

- This file is intentionally explicit and auditable.
- Changes to this surface after v1.0 require AEP-backed SemVer handling.
