<!-- markdownlint-disable MD013 -->

# Agent Object Protocol (AOP)

> **Status:** Draft / Experimental
> **Version:** v0.5.0
> **Stability:** Breaking changes may occur between `v0.x` releases.
> **Scope:** Specification only (no reference runtime in this repo).
> **License:** Apache-2.0

## v0.5.0 Announcement (CN/EN)

### 中文版（10行）

1. AOP v0.5.0 已正式发布，定位为 AI Agent 的对象契约层。
2. 该版本以“可验证工件”为核心：schemas + fixtures + CI gates。[^3]
3. 它不绑定任何 runtime，实现可替换、契约可复用。
4. combo 线展示同一 policy/object 在不同策略下的决策差异。
5. first_match 与 deny_overrides 都有对应 expected decision 工件。[^1]
6. 同时包含语义负例，确保“策略标签不能乱写”可被 gate 拦截。
7. mcp 线从 tool 的 schema.outputs 派生输出校验约束。
8. expected 输出必须通过，invalid 输出必须被拒绝。
9. 这与 MCP 对 output schema 的责任模型一致：server MUST、client SHOULD。[^2]
10. v0.5.0 是一个可引用、可复现、可裁决的 MINOR 基线。

### English (10 lines)

1. AOP v0.5.0 is now released as the object-contract layer for AI agents.
2. The baseline is built on verifiable artifacts: schemas, fixtures, and CI gates. [^3]
3. It remains runtime-agnostic: no reference runtime is required in-repo.
4. The combo track demonstrates decision deltas for one policy/object pair.
5. It ships expected decisions for first_match and deny_overrides. [^1]
6. It also includes a semantic-invalid fixture to prevent label/behavior mismatch.
7. The mcp track derives output validation directly from tool.schema.outputs.
8. Expected outputs must pass; invalid outputs must fail in CI.
9. This aligns with MCP output-schema responsibilities (server MUST, client SHOULD). [^2]
10. v0.5.0 is a citeable, reproducible, and adjudicable MINOR baseline.

[^1]: XACML 3.0 Core (combining algorithms): [x-acml-3.0-core-spec-en](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-en.html)
[^2]: MCP Tools spec (output schema responsibility): [mcp-tools-spec](https://modelcontextprotocol.io/specification/draft/server/tools)
[^3]: JSON Schema 2020-12 `unevaluatedProperties`: [draft-bhutton-json-schema-01#section-11.3](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01#section-11.3)

Agent Object Protocol (AOP) is a proposed open standard for defining executable objects used by AI agents.

AOP introduces a universal object structure that allows AI agents to discover, load, and execute capabilities in a standardized way.

The protocol is inspired by the FAIR Digital Object (FDO) concept and aims to bring executable semantics to agent ecosystems.

---

## Motivation

Current AI agent ecosystems lack a standard way to represent executable capabilities.

Existing standards such as:

- Model Context Protocol (MCP)
- Function calling APIs
- Tool schemas

focus primarily on connectivity and invocation.

However, they do not define a **portable object model for executable capabilities**.

AOP fills this gap.

---

## Vision

AOP aims to become the **object layer of the agent stack**.

Agent Stack:

Application Layer  
Runtime / Orchestrator  
**Object Layer (AOP)**  
Tool Transport Layer (MCP)  
Model Layer

---

## Core Concepts

An AOP Object includes:

- Unique Identifier
- Metadata
- Input Schema
- Output Schema
- Execution Interface

Example:

{
"id": "urn:aop:tool:file-search:v1",
"type": "tool",
"name": "file-search",
"description": "Search files in a directory",

"inputs": {
"path": "string",
"query": "string"
},

"outputs": {
"results": "array"
}
}

---

## Relationship to MCP

AOP is complementary to the Model Context Protocol (MCP).

MCP defines **tool connectivity**.

AOP defines **executable objects**.

MCP -> transport layer  
AOP -> object layer

---

## Relationship to FAIR Digital Objects

AOP is inspired by the FAIR Digital Object (FDO) framework.

The AOP object model follows similar principles:

- Persistent identifiers
- Machine-readable metadata
- Executable semantics

AOP can be seen as an execution-oriented profile of FAIR Digital Objects for AI agents.

---

## Example Objects

See:

- `schemas/aop-object.schema.json`
- `schemas/aop-policy.schema.json`
- `schemas/aop-policy-decision.schema.json`
- `schemas/aop-registry-record.schema.json` (non-normative, v0.4.x)
- `schemas/aop-resolve-response.schema.json` (non-normative, v0.4.x)
- `examples/aop-object.json`
- `examples/aop-tool.object.json`
- `examples/aop-workflow.object.json`
- `examples/aop-policy.allow.json`
- `examples/aop-policy.deny.json`
- `examples/aop-policy-decision.allow.json`
- `examples/aop-policy-decision.deny.json`
- `V1_PUBLIC_API_CANDIDATE.md`
- `examples/registry/aop-registry-record.example.json`
- `examples/registry/aop-resolve-response.example.json`
- `CONFORMANCE.md`

---

## v0.3 Quick Start (Validation)

Run local schema conformance checks with Ajv (Draft 2020-12):

```bash
ajv compile --spec=draft2020 -s schemas/aop-object.schema.json
ajv validate --spec=draft2020 -s schemas/aop-object.schema.json -d "examples/*.json" --all-errors
```

Negative fixtures must be rejected:

```bash
for file in examples/invalid/*.json; do
  if ajv validate --spec=draft2020 -s schemas/aop-object.schema.json -d "$file" --all-errors; then
    echo "Unexpectedly valid invalid fixture: $file"
    exit 1
  fi
done
```

---

## Roadmap

Phase 1 - Protocol definition  
Phase 2 - Object schema registry  
Phase 3 - Agent runtime implementation  
Phase 4 - Ecosystem adoption

Upcoming:

- `AEP-0003` (`aep/aep-0003-v0.4-agenda.md`) defines the v0.4.0 agenda for policy semantics, registry surface, and MCP interop hardening.
- v1.0.0 freeze complete: `AEP-0009` is `Accepted` (`aep/aep-0009-v1.0-freeze.md`).
- `AEP-0010` (`aep/aep-0010-v1.1-dsse-optional-profile.md`) tracks the
  v1.1 DSSE optional profile roadmap.
- `AEP-0011` (`aep/aep-0011-v1.2-in-toto-statement-compat.md`) tracks
  v1.2 in-toto Statement compatibility for DSSE payloads.

---

## Status

AOP is currently a **draft protocol proposal**.

Community contributions are welcome.
