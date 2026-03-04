# AOP v0.5 Semantics (Draft, Schema-Validated)

This document summarizes the v0.5 draft semantics currently represented
as schema-validated fixtures in this repository.

v0.5 is implementation-agnostic: it does not mandate a specific runtime
or policy engine. Instead, it provides verifiable artifacts (schemas,
positive examples, negative fixtures, and CI gates) that encode expected
shapes and boundary conditions.

---

## 1) Combination semantics demo (policy + object -> decision)

### Goal

Demonstrate that the same `(policy, object)` pair can yield different
expected decision envelopes under different rule-combination strategies.

This is expressed as expected decision fixtures, not runtime execution.

### Fixtures

- Policy: `examples/v0.5/combo/policy/strategy-demo.policy.json`
- Object: `examples/v0.5/combo/object/high-side-effects.object.json`
- Expected decisions:
  - First-match:
    `examples/v0.5/combo/expected/strategy-demo.first_match.expected.json`
  - Deny-overrides:
    `examples/v0.5/combo/expected/strategy-demo.deny_overrides.expected.json`

### Notes

- These fixtures illustrate combining-algorithm families documented in
  policy standards such as XACML (for example, deny-overrides and
  first-applicable).
- v0.5 does not require runtimes to implement a single strategy. It
  provides a verifiable reference surface for interoperability
  discussions.

---

## 2) MCP interop: schema-derived output validation

### Goal

Demonstrate that when a tool provides an output schema, structured
results can be validated mechanically.

This aligns with MCP guidance: if an output schema is provided, servers
MUST produce structured results that conform to the schema and clients
SHOULD validate.

### Fixtures

- Tool object (AOP): `examples/v0.5/mcp/tool/file-search.tool.object.json`
  - Provides `schema.outputs` (JSON Schema)
- Expected output (must validate against derived `schema.outputs`):
  - `examples/v0.5/mcp/expected/file-search.output.expected.json`
- Invalid outputs (must be rejected):
  - `examples/invalid/v0.5/mcp/file-search.output-missing-results.invalid.json`
  - `examples/invalid/v0.5/mcp/file-search.output-score-out-of-range.invalid.json`

### CI gate behavior

CI derives the output schema from each tool fixture's
`tool.schema.outputs` and validates:

- expected outputs MUST pass
- invalid outputs MUST be rejected

This keeps MCP interop fixtures schema-native without pinning to a
particular external MCP JSON Schema version.

---

## 3) Validation discipline and unknown-field control

Across object, policy, decision, and registry schema families, AOP uses
strict unknown-field control.

In draft 2020-12, `unevaluatedProperties` validates object properties
that were not successfully evaluated by adjacent object applicators,
which helps prevent shadow fields from bypassing validation.

---

## 4) How to run locally

This repository uses Ajv CLI with `--spec=draft2020` for schema
compilation and validation.

See `CONFORMANCE.md` for current conformance levels and command
examples.

---

## References

- OASIS XACML 3.0 core specification (combining algorithms appendix):
  https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-en.html
- MCP tools specification (`outputSchema` conformance/validation):
  https://modelcontextprotocol.io/specification/draft/server/tools
- JSON Schema 2020-12 core (`unevaluatedProperties` semantics):
  https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01#section-11.3
