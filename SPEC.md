# Agent Object Protocol Specification (v1.x Context)

This document describes AOP architecture and contract boundaries for the
v1.x repository line.

## Document Role and Normative Sources

This file is explanatory. The normative source of truth for AOP public
API behavior is:

- `V1_PUBLIC_API_CANDIDATE.md`
- `schemas/aop-object.schema.json`
- `schemas/aop-policy.schema.json`
- `schemas/aop-policy-decision.schema.json`
- `schemas/aop-evidence.schema.json`
- `schemas/profiles/*.schema.json` listed in the v1 candidate surface
- `CONFORMANCE.md`

If this document conflicts with schema constraints or conformance gate
semantics, schemas and conformance definitions take precedence.

## 1. Protocol Scope

AOP defines an object-contract layer for agent ecosystems.

Repository scope:

- machine-readable schemas
- positive and negative fixtures
- CI-adjudicable conformance gates
- governance via AEP documents

This repository does not provide a reference runtime implementation.

## 2. Core Object Contract

An AOP object manifest is identified by a URN:

`urn:aop:<kind>:<name>:vN`

Current manifest kinds are:

- `tool`
- `workflow`
- `dataset`
- `policy`

Object contract fields are defined by
`schemas/aop-object.schema.json`.
At minimum, manifests include:

- `aop_version`
- `id`
- `kind`
- `name`
- `description`
- `schema.inputs`
- `schema.outputs`

Example shape:

```json
{
  "aop_version": "0.9",
  "id": "urn:aop:tool:file-search:v1",
  "kind": "tool",
  "name": "file-search",
  "description": "Search files in a directory",
  "schema": {
    "inputs": {},
    "outputs": {}
  }
}
```

## 3. Public API Surface Frozen at v1.0

The v1 public API freeze (AEP-0009) covers the schema families and
conformance levels referenced in `V1_PUBLIC_API_CANDIDATE.md`:

- object manifests
- policy objects
- policy decision envelopes
- evidence envelopes
- profile schemas listed in the v1 candidate surface
- conformance levels and gate semantics for stable surfaces

## 4. Registry Interoperability Artifacts

Registry-related schemas remain non-normative unless promoted by an
Accepted AEP:

- `schemas/aop-registry-record.schema.json`
- `schemas/aop-resolve-response.schema.json`

These artifacts are CI-validated for interoperability experiments and
fixture reproducibility.

## 5. Conformance Model

Conformance is defined in `CONFORMANCE.md` and enforced by CI gates.
The baseline model is:

- positive fixtures must validate and pass semantic checks
- negative fixtures must be rejected
- schema compilation must remain green

Current levels cover:

- schema-backed object/policy conformance
- decision envelopes
- registry interoperability artifacts (non-normative)
- end-to-end artifact-chain constraints
- evidence binding and profiles
- DSSE packaged evidence (optional)
- in-toto DSSE payload compatibility (optional, v1.2 track)

## 6. Versioning Model

AOP currently uses two version axes:

- Repository release tags (SemVer): `v1.x.y`
- Manifest payload target (`aop_version`): currently `0.x` in published
  schemas

This separation is intentional in the current repository state.
Any change to this model should be introduced via AEP and coordinated
across schemas, examples, and conformance gates.

## 7. Security and Integrity Considerations

Security-related fields (`security`, policy decisions, evidence,
profiles) are schema-defined and validated in CI.

Implementations should:

- avoid embedding secret material in manifests
- validate incoming artifacts against published schemas
- preserve decision and evidence artifacts for auditability
- enforce runtime sandboxing and authorization controls outside the
  manifest layer

## 8. AOP and MCP

AOP and MCP serve different layers:

- MCP: transport, discovery, invocation channels
- AOP: object contracts, policy/evidence artifacts, conformance

They are complementary and can be deployed together in interoperable
agent stacks.
