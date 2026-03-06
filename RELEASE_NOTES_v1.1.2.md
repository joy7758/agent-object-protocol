# AOP v1.1.2 - Conformance Vectors and Verification Enhancements

## Summary

v1.1.2 packages the new machine-readable conformance vector suite and
its automated verifier as a release-grade conformance artifact.

This is a PATCH release under SemVer:

- No schema breaking changes
- No public API changes
- No conformance-level regressions

## Highlights

### 1) Machine-readable conformance vectors

- Added `conformance/v1.1-vectors.json`
- Captures positive and negative validation cases across Levels 1, 2,
  2.5, 3, 8, and optional 9

### 2) Automated verification

- Added `tools/verify_conformance_vectors.mjs`
- Provides a single local entrypoint for reproducible vector checks
- Current result: `14 passed, 0 failed`

### 3) Documentation alignment

- Updated `CONFORMANCE.md` with vector-suite instructions
- Updated `README.md` to point to the latest release and verification
  command

## Verification

```bash
node tools/verify_conformance_vectors.mjs
```

Expected summary:

```text
Summary: 14 passed, 0 failed
```

## Compatibility

- Fully backward compatible with v1.1.1
- Public API remains frozen at v1.0.0 boundaries

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [AEP-0009: v1.0 Freeze](aep/aep-0009-v1.0-freeze.md)
- [CONFORMANCE](CONFORMANCE.md)
