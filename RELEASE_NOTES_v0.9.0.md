# AOP v0.9.0 - v1 Pre-Freeze (Profiles + Convergence)

## Summary

v0.9.0 is the pre-freeze sprint before v1.0. It upgrades AOP evidence
from bound envelopes to **profiled evidence semantics**, converges
registry-to-E2E-to-evidence artifacts under v0.9 scenarios, and
publishes a v1 public API candidate surface.

## What's new

### 1) Evidence profiles (v0.9)

- Added profile schemas:
  - `schemas/profiles/aop-provenance.profile.schema.json`
  - `schemas/profiles/slsa-provenance-min.profile.schema.json`
- Added profile fixture validation for v0.9 evidence artifacts.

### 2) v0.9 converged E2E chain

- Added v0.9 positive scenario chain under:
  - `examples/v0.9/e2e/positive/scenario-1/`
- Added v0.9 negative scenarios (single-fault violations):
  - `scenario-n1-resolve-manifest-mismatch`
  - `scenario-n2-evidence-digest-mismatch`
  - `scenario-n3-evidence-profile-invalid`

### 3) CI gates

- v0.9 positive gate enforces:
  - schema validity across resolve/manifest/policy/decision/evidence
  - profile validity (`predicateType` + `predicate` shape)
  - semantic chain consistency
  - digest binding via `SHA-256(JCS(json))`
- v0.9 negative gate enforces:
  - negative scenarios MUST be rejected

### 4) Conformance and governance closure

- Added **Level 7** in `CONFORMANCE.md`:
  - Profiled Evidence-Bound E2E Chain (v0.9)
- Added `V1_PUBLIC_API_CANDIDATE.md`
- Marked `AEP-0008` as **Accepted**

## Why this matters

- SemVer context: `0.y.z` is pre-stable; `1.0.0` defines public API.
- RFC 8785 defines JCS as a hashable canonical JSON representation,
  enabling deterministic digest checks.
- SLSA provenance frames provenance as attestation so consumers can
  verify artifacts meet expectations.
- in-toto attestation layering (predicate type + schema) aligns with
  AOP profile-based evidence validation.

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [RFC 8785 JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785)
- [SLSA provenance v1.1](https://slsa.dev/spec/v1.1/provenance)
- [in-toto attestation envelope (DSSE)](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md)
