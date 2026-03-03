# AEP-0001: Versioning and Compatibility Policy for v0.x

- Status: Draft
- Authors: joy7758 (maintainers may append)
- Created: 2026-03-04
- Target: AOP v0.x (Draft/Experimental era)
- Related: `CONTRIBUTING.md` (AEP process), `README.md` status block

---

## 1. Abstract

This AEP defines the versioning and compatibility policy for Agent Object Protocol (AOP) during the v0.x (Draft/Experimental) phase.

It clarifies:

- How AOP spec releases are versioned
- What "compatible" means before v1.0
- What kinds of changes are allowed in MAJOR/MINOR/PATCH
- Deprecation and breaking-change signaling rules

This policy provides a citeable baseline for future AEPs and reduces ambiguity in spec evolution.

---

## 2. Normative Language

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

---

## 3. Motivation

AOP is currently a specification-only repository. As new object types, lifecycle semantics, and security hooks are introduced, contributors need shared rules for:

- Determining whether a proposed change is breaking
- Choosing the appropriate version bump
- Communicating stability expectations to adopters

Without a written policy, changes will be debated ad hoc and adoption costs will rise.

---

## 4. Definitions

- Spec release: A tagged release of the repository (for example, `v0.1.0`)
- Public API (spec sense): Externally visible, implementer-facing contracts expressed by AOP docs and normative schemas (when present)
- Breaking change: A change that makes a previously conforming implementation non-conforming, or changes the meaning of previously valid objects in a way that can cause runtime behavior divergence

---

## 5. Versioning Scheme

AOP releases MUST use Semantic Versioning 2.0.0 (`MAJOR.MINOR.PATCH`, optionally with pre-release/build metadata).

- During `v0.x`, AOP is Draft/Experimental.
- AOP MUST tag releases with the `v` prefix (for example, `v0.1.0`).

### 5.1 Pre-1.0 Compatibility Rule (AOP Interpretation)

SemVer states that before `1.0.0`, the public API is not considered stable. AOP adopts this explicit interpretation:

- PATCH releases MUST be backward compatible.
- MINOR releases MAY include breaking changes, but MUST follow signaling and migration requirements in Section 8.
- MAJOR bump is reserved for the first stable release (`v1.0.0`).

Reasoning: v0.x is experimental, but patches should stay predictable.

---

## 6. Change Classification Rules

### 6.1 PATCH (`v0.x.y`): Non-breaking, editorial, clarifying

PATCH releases MUST NOT introduce breaking changes.

Allowed in PATCH:

- Typos and wording clarifications without semantic changes
- Additional examples that do not redefine semantics
- Non-normative guidance
- CI, governance, and contribution workflow improvements
- Security documentation expansions that do not add new conformance requirements

### 6.2 MINOR (`v0.y.0`): Feature additions, schema evolution, may break

MINOR releases MAY introduce breaking changes, but MUST:

- Label breaking changes clearly (Section 8)
- Provide migration guidance
- Update spec examples accordingly

Allowed in MINOR:

- Add new object kinds with clear semantics
- Add new required fields only with a versioning and migration path
- Introduce normative JSON Schemas and conformance tests
- Tighten validation rules if justified and announced

### 6.3 MAJOR (`v1.0.0`): Stability declaration

`v1.0.0` MUST only be published when:

- Core AOP object schema is stable and normative
- Conformance criteria are defined and testable
- Deprecation policy is operating
- Routine evolution no longer expects major semantic breaks

These criteria MAY be refined by future AEPs.

---

## 7. Object ID Versioning vs Spec Versioning

AOP distinguishes:

- Spec version: Repository release version (for example, `v0.1.0`)
- Object ID version segment: Version embedded in URN (for example, `urn:aop:tool:file-search:v1`)

Rules:

1. The URN version segment MUST represent the object contract version, not the repo tag.
2. The URN version segment SHOULD increment when that specific object's schema/semantics changes incompatibly.
3. Multiple URN versions MAY coexist in a registry.

This separation allows spec evolution without forcing immediate URN bumps for all objects.

---

## 8. Breaking-Change Signaling and Migration Requirements (v0.x)

When a MINOR release introduces breaking changes, maintainers MUST:

1. Mark breaking changes in release notes under a "Breaking changes" section.
2. Provide migration guidance showing:
   - Old behavior/shape
   - New behavior/shape
   - Minimal conversion examples
3. Update `SPEC.md` and `examples/` to match new semantics.
4. If schemas exist, update `schemas/` and keep conformance checks aligned.

Additionally:

- Breaking changes SHOULD be minimized and batched.
- Security-driven breaks MAY be expedited but MUST still be documented.

---

## 9. Deprecation Policy (v0.x)

AOP adopts a lightweight deprecation policy:

- A feature or field MAY be marked Deprecated in `SPEC.md`.
- A deprecated feature SHOULD remain supported for at least one MINOR release cycle, unless security-critical.
- Removal of a deprecated feature is breaking and MUST follow Section 8.

---

## 10. Conformance Policy (Forward-Compatible)

Until normative schemas exist:

- "Conformance" is primarily defined by `SPEC.md` and canonical examples.

Once `schemas/` exists:

- Implementations claiming conformance SHOULD validate objects against normative schema.
- This repository SHOULD validate `examples/` against `schemas/` in CI.

---

## 11. Alternatives Considered

- Pure SemVer pre-1.0 interpretation (everything may break anytime)
  - Rejected: Too unpredictable for early adopters.
- Date-based versions
  - Rejected: Weaker semantic signal and weaker compatibility intent.

---

## 12. Security Considerations

Versioning impacts supply-chain safety:

- Downgrade/replay risk grows if old versions remain broadly accepted.
- Runtimes should support version pinning and policy gates (future AEP).

---

## 13. Appendix: Release Note Checklist for Maintainers

For each release:

- Version bump rationale (PATCH/MINOR)
- Compatibility statement
- Breaking changes section (if any)
- Migration steps (if breaking)
- Updated examples
- CI passing
