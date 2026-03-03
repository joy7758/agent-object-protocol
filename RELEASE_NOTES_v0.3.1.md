## Summary

PATCH release: documentation and conformance coverage improvements only.

## Changes

- Align `CONFORMANCE.md` with v0.3.x baseline (compile + valid pass + invalid rejected).
- README: v0.3.x marker + local quick-start commands (Ajv compile/validate + invalid gate).
- Schema: add descriptions/comments/examples for governance fields (no required/enum changes).
- Add edge-case negative fixtures (token_cost + permissions).

## Compatibility

Backward compatible. No schema behavior changes and no new required fields. (PATCH per SemVer)
