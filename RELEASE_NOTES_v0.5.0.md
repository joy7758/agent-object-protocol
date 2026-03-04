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

## Short External Blurb (Copy/Paste)

**中文版（10行）**  
1. AOP v0.5.0 已正式发布，定位为 AI Agent 的对象契约层。  
2. 该版本以“可验证工件”为核心：schemas + fixtures + CI gates。[^3]  
3. 它不绑定任何 runtime，实现可替换、契约可复用。  
4. `combo` 线展示同一 policy/object 在不同策略下的决策差异。  
5. `first_match` 与 `deny_overrides` 都有对应 expected decision 工件。[^1]  
6. 同时包含语义负例，确保“策略标签不能乱写”可被 gate 拦截。  
7. `mcp` 线从 tool 的 `schema.outputs` 派生输出校验约束。  
8. expected 输出必须通过，invalid 输出必须被拒绝。  
9. 这与 MCP 对 output schema 的责任模型一致：server MUST、client SHOULD。[^2]  
10. v0.5.0 是一个可引用、可复现、可裁决的 MINOR 基线。  

**English (10 lines)**  
1. AOP v0.5.0 is now released as the object-contract layer for AI agents.  
2. The baseline is built on verifiable artifacts: schemas, fixtures, and CI gates. [^3]  
3. It remains runtime-agnostic: no reference runtime is required in-repo.  
4. The `combo` track demonstrates decision deltas for one policy/object pair.  
5. It ships expected decisions for `first_match` and `deny_overrides`. [^1]  
6. It also includes a semantic-invalid fixture to prevent label/behavior mismatch.  
7. The `mcp` track derives output validation directly from `tool.schema.outputs`.  
8. Expected outputs must pass; invalid outputs must fail in CI.  
9. This aligns with MCP output-schema responsibilities (server MUST, client SHOULD). [^2]  
10. v0.5.0 is a citeable, reproducible, and adjudicable MINOR baseline.  

[^1]: XACML 3.0 Core (combining algorithms): [docs.oasis-open.org](https://docs.oasis-open.org/xacml/3.0/xacml-3.0-core-spec-en.html)  
[^2]: MCP Tools spec (output schema responsibility): [modelcontextprotocol.io](https://modelcontextprotocol.io/specification/draft/server/tools)  
[^3]: JSON Schema 2020-12 `unevaluatedProperties`: [json-schema.org](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-01#section-11.3)
