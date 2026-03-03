# Agent Object Protocol Specification (Draft v0.2)

This document defines the core AOP object contract.
The normative machine-readable schema for v0.2 is:

- `schemas/aop-object.schema.json`

## 1. Object Identifier

Every AOP object must have a globally unique identifier.

Format:

urn:aop:<kind>:<name>:<version>

Example:

urn:aop:tool:file-search:v1

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

CI MUST validate examples against the canonical schema for pull requests and pushes to `main`.

---

## 7. Security Considerations

Execution environments should:

- sandbox object execution
- validate input schemas
- enforce policy constraints
