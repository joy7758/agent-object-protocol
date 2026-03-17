# Lifecycle Profile v0.1 RC1

## What it is

Lifecycle Profile v0.1 RC1 is the first frozen release candidate for the
minimal lifecycle governance surface in Agent Object Protocol.

It defines a small, reviewable contract for lifecycle continuity across
autonomous agent instances. The profile is intentionally narrow: lifecycle
objects describe current continuity state, lifecycle receipts describe governed
state transitions, and conformance checks decide whether the resulting lineage,
fork, merge, and terminate claims are still valid.

## What is included in RC1

RC1 includes:

- lifecycle object and lifecycle receipt schemas
- positive and negative fixtures for the minimal state machine
- cross-object semantic scenarios for lineage continuity and terminal-state rules
- an executable semantic verifier entry point
- external-facing RC1 positioning notes for first-time readers

The minimal state surface remains:

- `BORN`
- `ACTIVE`
- `SUSPENDED`
- `MERGED`
- `TERMINATED`

The minimal transition surface remains:

- `init`
- `activate`
- `suspend`
- `resume`
- `fork`
- `merge`
- `terminate`

## What is intentionally out of scope

RC1 does not define a full runtime, a policy engine, or agent personhood. It
does not settle metaphysical identity questions. It also does not claim global
finality, external anchoring, or multi-writer concurrency resolution.

## Minimal validation command

```bash
node tools/verify_lifecycle_profile.mjs
```

## Relationship to POP / AIP / ARO-Audit

- POP provides persona-facing attachment and reference surfaces.
- AIP can carry lifecycle-related requests, but does not define lifecycle
  continuity semantics by itself.
- ARO-Audit takes the same lifecycle receipt shape into reviewable receipt
  boundaries, freshness checks, and tamper-evident conformance.

This RC1 release is therefore not a standalone stack. It is the smallest
portable lifecycle contract meant to compose with adjacent governance and audit
layers.

## Known limitations

- freshness and replay semantics are not defined here; they are enforced in the
  audit layer
- there is no shared verifier library yet across all lifecycle repositories
- merge and fork semantics are intentionally minimal and object-centric
- distributed consensus, external anchoring, and multi-party lifecycle finality
  remain out of scope for RC1
