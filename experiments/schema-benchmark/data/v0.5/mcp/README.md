# v0.5 MCP interop fixtures (draft)

Fixtures in this directory document AOP tool schema to MCP-style tool
mapping and structured-result validation shapes.

Phase-1 route in this repository:

- Validate tool fixtures as AOP objects.
- Derive output schema from `tool.schema.outputs`.
- Validate expected output payloads against the derived schema.
- Reject invalid output payloads.

This follows the schema-conformance pattern used in MCP integrations:
when output schemas are provided, provider responses should conform and
consumers should validate.
