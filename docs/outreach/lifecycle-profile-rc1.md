# Lifecycle Profile RC1

Lifecycle Profile RC1 is a small governance continuity profile for autonomous
agent instances. It is meant to give reviewers a stable surface for asking a
limited set of questions: which instance is being governed, which lineage it
belongs to, which lifecycle transition was issued, and which evidence and
governance decision support that transition.

The scope is intentionally narrow. RC1 focuses on continuity, lineage, fork,
merge, and terminate semantics. It does not try to solve the whole runtime
stack, and it does not try to redefine identity. This profile defines
governance continuity semantics, not metaphysical identity.

Why this exists: tracing can show that something happened, but lifecycle
governance needs a more reviewable object surface. A reviewer should be able to
look at a lifecycle object and a receipt chain and decide whether a branch was
properly initialized, activated, forked, merged, suspended, resumed, or
terminated. That is the problem RC1 is trying to make portable.

What RC1 currently includes:

- lifecycle object and lifecycle receipt schemas
- positive and negative fixtures for the minimal state machine
- cross-object conformance checks for lineage continuity and terminal-state rules
- lifecycle receipt conformance and freshness checks in the audit layer
- a runnable demo that shows `init -> activate -> fork -> merge -> terminate -> verify`

What it does not try to do:

- define agent personhood or ontology
- replace tracing, observability, or policy engines
- provide a full governance runtime
- claim global finality, distributed consensus, or perfect freshness semantics

The current artifact set is meant to be small but reviewable. In
`agent-object-protocol`, the profile is anchored by lifecycle schemas, valid
and invalid fixtures, and an executable conformance entry point. In
`aro-audit`, the same shape is carried into receipt-boundary checks, protected
hash review, and freshness or replay rejection. In `verifiable-agent-demo`, the
same semantics are exercised as a compact end-to-end walkthrough.

That makes RC1 useful as a first public reference point. It is not a claim that
lifecycle governance is finished. It is a claim that the minimum enforceable
shape is now concrete enough to review, challenge, and reuse.
