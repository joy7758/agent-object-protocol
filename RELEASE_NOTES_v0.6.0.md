# AOP v0.6.0 - Suite Expansion (Combo Semantics + Multi-Tool MCP Interop)

## Summary

v0.6.0 expands AOP's verifiable interoperability suite:

- Combo semantics: additional strategy fixtures with expected decisions
  plus semantic-invalid rejections.
- MCP interop: multi-tool schema-derived output validation (expected
  pass + invalid reject) across multiple tools.

This release remains runtime-agnostic and focuses on schema-backed
conformance artifacts (schemas + fixtures + CI gates).

## What's New

### 1) v0.6 Combo Suite (C1 + C2)

Adds v0.6 combo fixtures under `examples/v0.6/combo/`:

- C1: `first_match` vs `deny_overrides`
- C2: `permit_overrides` vs `deny_unless_permit`

Each case includes:

- object + policy fixtures
- strategy-specific expected decision envelopes
- semantic-invalid fixtures that MUST be rejected by gates

Combining-algorithm concepts align with standard access-control
literature (for example, XACML combining algorithms).  
See: [XACML 3.0 Core](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-en.html)

### 2) MCP Interop Suite (multi-tool)

Extends `examples/v0.5/mcp/` with additional tools:

- `file-search`
- `kv-get`
- `web-fetch`

CI derives output validation directly from each tool's
`schema.outputs`:

- expected outputs MUST validate
- invalid outputs MUST be rejected

This follows MCP's output-schema responsibility model (server MUST
conform; client SHOULD validate).  
See: [MCP Tools spec](https://modelcontextprotocol.io/specification/draft/server/tools)

## Conformance and CI

CI enforces:

1. schema compilation (`draft2020`)
2. positive fixtures MUST pass
3. negative fixtures MUST be rejected
4. v0.6 combo semantic consistency checks

See `CONFORMANCE.md` for conformance levels and reproducible fixture
anchors.

## Governance

- `AEP-0005` status: `Accepted`

## Compatibility

- Adds new fixtures, gates, and decision strategy enum coverage.
- No reference runtime is introduced.
