# Agent Object Protocol Specification (Draft v0.1)

## 1. Object Identifier

Every AOP object must have a globally unique identifier.

Format:

urn:aop:<type>:<name>:<version>

Example:

urn:aop:tool:file-search:v1

---

## 2. Object Structure

An AOP object contains:

- id
- type
- name
- description
- inputs
- outputs

Example:

{
  "id": "urn:aop:tool:file-search:v1",
  "type": "tool",
  "name": "file-search",
  "description": "Search files in a directory",
  "inputs": {},
  "outputs": {}
}

---

## 3. Object Types

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

## 6. Security Considerations

Execution environments should:

- sandbox object execution
- validate input schemas
- enforce policy constraints
