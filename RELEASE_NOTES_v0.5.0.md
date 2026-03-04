# AOP v0.5.0 - Strategy Semantics Fixtures + MCP Interop Gates

## Summary

v0.5.0 promotes phase-1 semantics to a reproducible conformance
baseline using schema-validated fixtures and CI gates, with no runtime
implementation required in this repository.

## What's Included

- Combination semantics fixtures for policy/decision strategy deltas:
  - same policy/object pair
  - strategy-specific expected decisions (`first_match`,
    `deny_overrides`)
- Semantic mismatch guard for combo expected decisions:
  - schema-valid but semantically contradictory fixture is rejected by
    CI semantic checks
- MCP interop schema-derived validation gate:
  - derive output schema from each tool fixture `schema.outputs`
  - validate expected outputs per tool prefix
  - reject invalid outputs per tool prefix
- Published v0.5 semantics contract:
  - `V0_5_SEMANTICS.md` with fixture references and external anchors
    (XACML, MCP tools output schema guidance, JSON Schema
    `unevaluatedProperties`)

## Governance

- `AEP-0004` status moved to `Accepted` with explicit phase-1
  acceptance criteria.

## Compatibility

This is a MINOR release in v0.x. Review migration and conformance notes
if your implementation consumes new v0.5 fixture families.

## Validation Baseline

- Schemas compile under draft2020
- Positive fixtures pass
- Negative fixtures are rejected
- v0.5 combo and MCP gates are enabled in CI
