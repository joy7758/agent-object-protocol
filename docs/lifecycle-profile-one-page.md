# Lifecycle Profile One-Page

Lifecycle Profile v0.1 is a minimal governance profile for autonomous agent
instances.

It does not try to explain what an agent is in a philosophical sense. It only
defines how lifecycle transitions can be named, referenced, and reviewed.

## What problem it solves

Agent systems often have governance events that do not fit cleanly into normal
tracing:

- a governed instance is created
- an instance is activated or suspended
- one governed branch forks from another
- one branch is merged into another
- an instance is terminated under policy

Without a small lifecycle profile, those events stay repository-specific and
hard to compare.

## The three minimal artifacts

- Lifecycle Object: current lifecycle state plus lineage and reference fields
- Lifecycle Receipt: one transition event with governance and evidence links
- Lifecycle Profile: the allowed states, transitions, and minimal validation rules

## Minimal lifecycle surface

States:

- `BORN`
- `ACTIVE`
- `SUSPENDED`
- `MERGED`
- `TERMINATED`

Transitions:

- `init`
- `activate`
- `suspend`
- `resume`
- `fork`
- `merge`
- `terminate`

## Why this profile is intentionally small

This profile is meant to be reviewed quickly:

- it does not replace POP
- it does not replace interaction protocols
- it does not replace governance engines
- it does not replace audit evidence systems

It only adds a reusable continuity layer for lifecycle governance.

## Validation minimum

At minimum, a conforming implementation should:

- validate objects and receipts against the lifecycle schemas
- reject forbidden transitions
- require lineage references
- require governance and evidence references on receipts
- require a reason for termination

## Reader takeaway

Lifecycle Profile v0.1 is a small protocol specimen for agent lifecycle
governance. It is meant for continuity control, lineage review, and receipt
validation, not for metaphysical identity claims.
