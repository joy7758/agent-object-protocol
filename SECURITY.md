# Security Policy

AOP is a protocol/specification project. Security here focuses on:

- Threats introduced by specification design choices
- Threats introduced by implementations that claim AOP conformance
- Secure handling of reports and coordinated disclosure

## Reporting a Vulnerability

Please report security issues privately.

- Preferred: open a GitHub Security Advisory (if enabled)
- Otherwise: open a public Issue without sensitive details and request a private channel

In your report, include:

- Affected spec section or implementation area
- Impact (what an attacker can do)
- Minimal reproduction or example object
- Suggested mitigation (if available)

We aim to acknowledge reports promptly and coordinate fixes responsibly.

## Supported Versions

Because AOP is currently Draft/Experimental (`v0.x`):

- The latest `main` branch is the primary supported target
- Historic tags may not receive security backports

When AOP reaches `v1.0`, a formal support window will be published.

---

# Minimal Threat Model (Skeleton)

This section is a living baseline for AOP-aligned ecosystems.

## 1. Security Goals

- Integrity: Objects and metadata must not be silently altered in transit or at rest.
- Authenticity/provenance: Consumers should be able to verify object authorship/publisher where applicable.
- Least privilege: Invocation should not grant more capability than declared.
- Non-bypassable policy: Policy controls must be enforceable, not advisory.
- Safe execution: Avoid code execution and injection via object fields.

## 2. Assets to Protect

- Object definitions (`tool`, `workflow`, `dataset`, `policy`)
- Registry entries (IDs, versions, signatures, hashes, metadata)
- Invocation inputs/outputs (may include sensitive data)
- Agent/runtime configuration (permissions, credentials, grants)
- Audit logs and execution traces

## 3. Trust Boundaries

1. Registry boundary
- Untrusted publisher -> registry
- Registry -> agent/runtime (read path)

2. Runtime boundary
- Agent core -> tool adapter / transport layer
- Runtime -> external tool APIs / plugins

3. Data boundary
- Runtime -> datasets / filesystems / remote storage

4. Policy boundary
- Policy evaluator -> invocation engine

## 4. Threat Actors

- Malicious object publisher
- Compromised registry or mirror
- Network attacker (MITM)
- Malicious tool endpoint or plugin
- Insider misuse (developer, operator, registry admin)

## 5. Primary Threat Categories

### A) Object Poisoning / Supply Chain

- Object contains malicious parameters, deceptive descriptions, or hidden side effects.
- Registry entry is replaced with a trojan version.

Mitigations:

- Strong object identity and versioning rules
- Optional signatures/checksums (future AEP)
- Registry immutability policy (no overwrite of published versions)

### B) Confused Deputy / Capability Escalation

- Object appears low-privilege but triggers high-privilege operations.
- Agent invokes object with broader permissions than intended.

Mitigations:

- Capability declarations for required resources
- Policy objects that gate invocation by scope
- Runtime enforcement of least-privilege execution contexts

### C) Injection Attacks (Prompt / Tool / Schema)

- Object fields smuggle instructions into prompts or adapters.
- Input fields carry shell/code injection payloads.

Mitigations:

- Separate metadata from executable parameters
- Strict input validation (schema/type checks)
- Contextual escaping guidance for implementers

### D) Replay / Downgrade

- Runtime is forced to use older vulnerable versions.
- Replay of previously valid objects.

Mitigations:

- Version pinning policy
- Minimum version constraints
- Registry transparency logs/audit trails (future AEP)

### E) Confidentiality Leaks

- Secrets accidentally included in objects or examples.
- Invocation outputs logged insecurely.

Mitigations:

- No-secrets-in-objects guidance
- Log redaction rules
- Secure-by-default examples

## 6. Security Requirements (Normative Hooks)

Implementations claiming AOP conformance SHOULD:

- Validate objects against published schemas (when available)
- Treat registry content as untrusted input
- Provide an explicit policy enforcement point
- Support provenance verification when signatures are present (future AEP)

## 7. Open Security Questions (Track via AEP)

- Object signing format and verification model
- Registry immutability and transparency mechanisms
- Policy object semantics and enforcement contract
- Sandboxing requirements for tool/workflow execution
