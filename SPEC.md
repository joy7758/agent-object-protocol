# Agent Object Protocol Specification (Draft v0.2)

This document defines the core AOP object contract.
The normative machine-readable schema for v0.2 is:

- `schemas/aop-object.schema.json`

## 1. Object Identifier

Every AOP object must have a globally unique identifier.

Format:

`urn:aop:<kind>:<name>:<version>`

Example:

`urn:aop:tool:file-search:v1`

---

## 2. Object Structure

An AOP object contains:

- aop_version
- id
- kind
- name
- description
- schema.inputs
- schema.outputs

Example:

{
  "aop_version": "0.2",
  "id": "urn:aop:tool:file-search:v1",
  "kind": "tool",
  "name": "file-search",
  "description": "Search files in a directory",
  "schema": {
    "inputs": {},
    "outputs": {}
  }
}

---

## 3. Object Kinds

Initial object types:

tool  
workflow  
dataset  
policy

---

## 4. Execution Model

Agents interact with AOP objects using three steps:

1 Discovery  
2 Loading  
3 Invocation

---

## 5. Registry

AOP objects may be stored in registries similar to:

npm  
docker hub  
huggingface

Future work will define a global AOP registry.

---

## 6. Schema and Conformance

The canonical schema lives in:

- `schemas/aop-object.schema.json`

Examples for conformance checks:

- `examples/aop-object.json`
- `examples/aop-tool.object.json`
- `examples/aop-workflow.object.json`

CI MUST validate examples against the canonical schema for pull
requests and pushes to `main`.

---

## 7. Governance Definitions (Normative)

This section defines normative requirements for `invocation`,
`capabilities`, and `security` fields in the AOP Object Manifest.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this
document are to be interpreted as described in RFC 2119.

Only all-caps forms of these keywords are normative.

### 7.1 `invocation` (Normative)

If an object includes `invocation`:

- `invocation.mode` MUST be one of: `sync`, `async`, `stream`.
- `invocation.idempotency` MUST be one of:
  `idempotent`, `non-idempotent`, `best-effort`.
- If `invocation.timeouts_ms` is present:
  - `connect`, `read`, and `overall` values MUST be integers.
  - Each timeout value MUST be within the inclusive schema range.
- If `invocation.retry` is present:
  - `max_attempts` MUST be an integer within the inclusive schema range.
  - `backoff` MUST be one of: `none`, `fixed`, `exponential`.
  - `retry_on` SHOULD contain unique reason identifiers.

### 7.2 `capabilities` (Normative)

If an object includes `capabilities`:

- `capabilities.side_effects` MUST be one of: `none`, `low`, `high`.
- `capabilities.determinism` MUST be one of:
  `deterministic`, `bounded-nondeterministic`, `nondeterministic`.
- If present, `capabilities.token_cost_hint.input_per_1k` MUST be an
  integer greater than or equal to `0`.
- If present, `capabilities.token_cost_hint.output_per_1k` MUST be an
  integer greater than or equal to `0`.
- Objects declaring `side_effects` as `none` MUST NOT intentionally
  perform externally visible state changes in conforming runtimes.

### 7.3 `security` (Normative)

If an object includes `security`:

- If present, `security.auth.scheme` MUST be one of:
  `none`, `api_key`, `oauth2`, `mtls`, `custom`.
- If present, `security.auth.scopes` SHOULD contain unique scope values.
- If present, `security.permissions.data_access` MUST be one of:
  `none`, `read`, `write`, `read-write`.
- If present, `security.permissions.network_access` MUST be one of:
  `none`, `restricted`, `unrestricted`.
- If present, `security.integrity.checksum_algo` MUST be one of:
  `sha256`, `sha512`.
- If present, `security.integrity.checksum` MUST match the schema hash
  pattern for the declared checksum algorithm.
- If present, `security.integrity.signed` MUST be a boolean.
- Objects MUST NOT embed secrets (API keys, private tokens, credentials)
  directly in the manifest.

### 7.4 Validation and Conformance (Normative)

- Conforming implementations SHOULD validate objects against the
  normative JSON Schema when available.
- Registries and repositories publishing AOP objects SHOULD run
  automated validation for published manifests and examples.
- The AOP repository CI MUST keep `examples/` passing validation against
  the normative schema on pull requests and pushes to `main`.

## 8. Security Considerations

Execution environments should:

- sandbox object execution
- validate input schemas
- enforce policy constraints

---

## 9. AOP and MCP Bridge Note (Non-Normative)

- MCP focuses on transport-level discovery and invocation of tools over a
  standardized channel.
- AOP focuses on object manifests, versioned contracts, governance
  definitions, and conformance baselines.
- Combined usage is complementary:
  - MCP carries calls and responses.
  - AOP defines what is being called and how it is validated/governed.
