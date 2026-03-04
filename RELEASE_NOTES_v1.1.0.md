# AOP v1.1.0 - DSSE Optional Profile (Packaged Evidence)

## Summary

v1.1.0 adds an optional DSSE envelope profile for packaging AOP
evidence as a verifiable artifact:

- DSSE envelope schema
- Positive and negative DSSE fixtures
- CI gates for envelope shape, payloadType allowlist, base64 decode,
  and decoded payload conformance to `aop-evidence`

This is a MINOR release with backward-compatible additions and no
breaking changes to v1.0 frozen public API surfaces.

## What's New

### 1) DSSE envelope profile schema

- `schemas/profiles/dsse-envelope.profile.schema.json`

### 2) Conformance fixtures and CI gates

- Positive:
  - `examples/v1.1/dsse/positive/evidence.dsse.json`
- Negative:
  - `examples/invalid/v1.1/dsse/*.invalid.json`
- CI behavior:
  - DSSE positive fixtures MUST pass
  - DSSE invalid fixtures MUST be rejected

### 3) Conformance level

- Adds Level 8 in `CONFORMANCE.md`:
  - DSSE-Packaged Evidence (Optional)

## Ecosystem Alignment

- in-toto attestation v1 defines envelope-layer conventions based on
  DSSE fields and payload typing.
- Sigstore bundle ecosystem supports attestation content represented as
  DSSE envelope payloads.

## Compatibility

- No breaking changes to v1.0 public API.
- DSSE support remains optional.
- Implementations can remain conformant at Levels 2-7 without DSSE.

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [in-toto attestation envelope v1](https://github.com/in-toto/attestation/blob/main/spec/v1/envelope.md)
- [Sigstore bundle format overview](https://docs.sigstore.dev/about/bundle/)
