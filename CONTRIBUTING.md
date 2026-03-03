<!-- markdownlint-disable MD013 MD029 MD032 -->

# Contributing to Agent Object Protocol (AOP)

Thank you for your interest in contributing to Agent Object Protocol (AOP).

AOP is a protocol/specification project. The primary contribution surface is the spec, examples, and governance process, not runtime implementations.

## Quick Start

- Read [README.md](README.md) and [SPEC.md](SPEC.md).
- Check open Issues and Pull Requests.
- Propose non-trivial changes via the AEP (AOP Enhancement Proposal) process.

## Scope of Contributions

Welcome contributions:

- Spec improvements (clarity, consistency, examples)
- Object model extensions (new object types, fields, lifecycle events)
- Security considerations and threat model refinements
- Test vectors, fixtures, and conformance ideas
- Documentation, diagrams, and tooling that improve spec correctness

Out of scope for this repository:

- Binding AOP to a single vendor runtime or proprietary API
- Shipping a full runtime implementation in this repository

---

## Development Workflow

### Repository Conventions

- Primary spec docs: `README.md`, `SPEC.md`
- Examples: `examples/`
- Future AEPs: `aep/` (created when first AEP lands)

### Branching

- Branch from `main`
- Use feature branches:
  - `feat/...`
  - `fix/...`
  - `docs/...`
  - `aep/...`

### Commit Style

- Keep commits small and reviewable.
- Recommended prefixes: `spec:`, `docs:`, `ci:`, `chore:`, `aep:`

### Sign-off (Optional, Recommended)

To add a lightweight provenance trail, use DCO sign-off:

```bash
git commit -s -m "spec: clarify object id format"
```

---

## AEP (AOP Enhancement Proposal) Process

AEPs are required for changes that affect:

- Object schema or semantics
- Lifecycle or invocation semantics
- Security model or trust boundaries
- Registry or governance rules
- Compatibility guarantees and versioning

### AEP Lifecycle

0. Discussion (Issue)
- Open an Issue labeled `aep`.
- Include problem, motivation, proposed approach, alternatives, and compatibility impact.

1. Draft (Pull Request)
- Create an AEP in `aep/`.
- Filename format: `aep-0001-short-title.md`.
- If `aep/` does not exist, create it in the same PR.
- Mark status as `Draft`.

2. Review
- Maintainers and community review.
- Iterate until concerns are resolved.

3. Decision
- Maintainers mark as `Accepted` or `Rejected`.
- If accepted, a follow-up PR updates `SPEC.md` and/or `README.md`.

4. Implemented
- After spec change is merged and versioned, status becomes `Implemented`.

5. Superseded
- If replaced by another AEP, mark as `Superseded by AEP-XXXX`.

### AEP Template (Minimum)

Each AEP must include:

- Title
- Status (`Draft | Accepted | Rejected | Implemented | Superseded`)
- Authors
- Created date
- Abstract (1-2 paragraphs)
- Motivation / problem statement
- Specification (normative terms: `MUST`, `SHOULD`, `MAY`)
- Backward compatibility
- Security considerations
- Reference implementation notes (optional)
- Alternatives considered
- Appendix / examples

### Compatibility Policy (Initial)

- AOP `v0.x` is experimental: breaking changes may occur between minor versions.
- Once `v1.0` is declared, a stricter compatibility contract will be defined via AEP.

---

## Pull Request Checklist

Before requesting review:

- Spec language is clear and consistent (`MUST`/`SHOULD`/`MAY` used intentionally).
- Examples are updated if semantics changed.
- Security section is updated if trust boundary changed.
- CI checks pass (Markdown and link checks).
- Version notes are included if applicable.

---

## Code of Conduct

Be respectful and constructive. If a dedicated code of conduct is added later, it will be linked here.

## Maintainer Decision Rules (v0.1)

- Simple doc fixes: maintainer merge after review
- Semantic changes: require AEP and at least one maintainer approval
- Security-sensitive changes: require explicit `SECURITY` section update and maintainer approval
