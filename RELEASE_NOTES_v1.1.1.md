# AOP v1.1.1 - Conformance Operability Improvements

## Summary

v1.1.1 improves conformance operability for paper and release workflows
without changing the frozen v1 public API.

This is a PATCH release under SemVer:

- No schema breaking changes
- No fixture-shape breaking changes
- No conformance-level semantic regressions

## What's New

### 1) Filled preview refresh option

- Added `--from-latest` refresh behavior before generating filled paper
  preview artifacts.
- Reduces stale artifact risk in release/paper packaging flow.

### 2) Paper build and packaging maintenance

- Updated generated paper submission/preview outputs and packaging flow
  for reproducibility.

## Compatibility

- Fully backward compatible with v1.1.0.
- Public API remains frozen at v1.0.0 boundaries.

## References

- [Semantic Versioning 2.0.0](https://semver.org/)
- [AEP-0009: v1.0 Freeze](aep/aep-0009-v1.0-freeze.md)
