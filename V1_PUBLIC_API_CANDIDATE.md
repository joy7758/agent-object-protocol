# AOP v1 Public API Candidate (v0.9 Pre-Freeze)

This document defines the **v1 public API candidate surface** for AOP.
It is a pre-freeze artifact introduced in v0.9 to clarify what is
expected to be stable at v1.0 and what is explicitly out of scope for
stability guarantees.

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
  - `CONFORMANCE.md` Levels 2 through 7
  - Positive fixtures MUST pass
  - Negative fixtures MUST be rejected

## Explicitly Not Stable in v0.9

The following surfaces are **not** part of the v1 stability candidate
set:

- Registry schemas remain non-normative:
  - `schemas/aop-registry-record.schema.json`
  - `schemas/aop-resolve-response.schema.json`
- Experimental or vendor-specific extension fields:
  - `x-*` namespace fields
- Signature verification, key management, and transparency-log
  requirements:
  - Kept out of v0.9 scope and not frozen for v1 in this candidate
    document

## Freeze Discipline

Changes to candidate-stable surfaces SHOULD include:

1. An AEP reference documenting motivation and compatibility impact.
2. Fixture updates for affected behavior.
3. CI gate updates that preserve pass/reject semantics.

In v0.9, this discipline is governance guidance. It may be upgraded to a
hard CI rule in a subsequent pre-v1 step.

## Notes

- This file is intentionally explicit and auditable.
- The candidate list may still change before v1.0, but all such changes
  should be traceable through AEP history.
