# AOP v0.4.1 Release Notes

## Summary

PATCH release focused on documentation clarifications only.

## Changes

- Added optional strict format-validation guidance in `CONFORMANCE.md`
  for implementations that enable `ajv-formats` with ajv-cli.
- Clarified that baseline CI remains unchanged and continues to use
  schema compilation and example/fixture validation without requiring
  external format plugins.

## Compatibility

Backward compatible. No schema behavior changes, no CI gate-logic
changes, and no new required fields.
