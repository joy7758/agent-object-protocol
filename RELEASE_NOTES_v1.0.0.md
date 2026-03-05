# AOP v1.0.0 - Public API Freeze

## Summary

AOP v1.0.0 defines the first stable public API for the protocol.

This release freezes the normative contract listed in
`V1_PUBLIC_API_CANDIDATE.md` and upgrades AOP from pre-stable `0.y.z`
evolution to SemVer-governed stability commitments.

## Public API Definition

Public API for AOP v1.0.0 is the set of normative artifacts and
conformance requirements explicitly listed in
`V1_PUBLIC_API_CANDIDATE.md`, including:

- `schemas/aop-object.schema.json`
- `schemas/aop-policy.schema.json`
- `schemas/aop-policy-decision.schema.json`
- `schemas/aop-evidence.schema.json`
- `schemas/profiles/aop-provenance.profile.schema.json`
- `schemas/profiles/slsa-provenance-min.profile.schema.json`
- `CONFORMANCE.md` Levels 2-7 and their gate semantics

## Compatibility Contract (Post-v1.0.0)

Versioning follows Semantic Versioning:

- MAJOR for breaking public API changes
- MINOR for backward-compatible additions
- PATCH for backward-compatible fixes

`1.0.0` is the point where public API is defined and treated as stable.

## Evidence and Integrity Baseline

v1.0.0 keeps evidence binding as a normative conformance requirement:

- Evidence digests are bound using `SHA-256(JCS(json))`.
- JCS is RFC 8785 JSON Canonicalization Scheme, which defines a
  hashable canonical JSON representation for cryptographic methods.
- Profiled evidence validation remains required in conformance gates.

## Provenance Positioning

AOP evidence profiles align with provenance as verifiable artifact
metadata (where/when/how produced), consistent with SLSA provenance
positioning.

## Explicitly Non-Normative / Not Frozen

The following remain outside v1 public API freeze unless promoted by a
future Accepted AEP:

- Registry schemas (`aop-registry-record`, `aop-resolve-response`)
- `x-<vendor>-<key>` extension fields
- Mandatory signature verification requirements

## Signature Packaging Direction (Optional)

v1.0.0 does not require signature verification or key-management policy.
Future evolution MAY align envelope/signature packaging with DSSE/in-toto
conventions through subsequent AEPs.

## Conformance Expectations

Conformance remains CI-adjudicable:

- Positive fixtures MUST pass
- Negative fixtures MUST be rejected
- Gate definitions in `CONFORMANCE.md` are part of the stable contract

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [RFC 8785 JSON Canonicalization Scheme](https://www.rfc-editor.org/rfc/rfc8785)
- [SLSA provenance v1.1](https://slsa.dev/spec/v1.1/provenance)
- [in-toto attestation envelope (DSSE)](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md)
