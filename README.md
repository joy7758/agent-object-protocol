# Agent Object Protocol (AOP)

> **Status:** Draft / Experimental
> **Version:** v0.1.0
> **Stability:** Breaking changes may occur between `v0.x` releases.
> **Scope:** Specification only (no reference runtime in this repo).
> **License:** Apache-2.0

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
- `examples/aop-object.json`
- `examples/aop-tool.object.json`
- `examples/aop-workflow.object.json`
- `CONFORMANCE.md`

---

## Roadmap

Phase 1 - Protocol definition  
Phase 2 - Object schema registry  
Phase 3 - Agent runtime implementation  
Phase 4 - Ecosystem adoption

---

## Status

AOP is currently a **draft protocol proposal**.

Community contributions are welcome.
