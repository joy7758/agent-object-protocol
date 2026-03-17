# Lifecycle Profile v0.1

Lifecycle Profile v0.1 defines the smallest governance continuity surface for
autonomous agent instances.

This profile defines governance continuity semantics, not metaphysical identity.
Lifecycle conformance includes cross-object semantic checks, not only schema validity.

## What this profile covers

The profile defines three minimal artifact types:

- Lifecycle Object
- Lifecycle Receipt
- Lifecycle Profile

The object says what state an agent instance is currently in. The receipt says
which governance transition was issued for that instance. The profile defines
the allowed states, allowed transitions, and minimum validation rules.

## Allowed states

The allowed lifecycle states are:

- `BORN`
- `ACTIVE`
- `SUSPENDED`
- `MERGED`
- `TERMINATED`

## Allowed transitions

The allowed lifecycle transitions are:

- `init`: `null -> BORN`
- `activate`: `BORN -> ACTIVE`
- `suspend`: `ACTIVE -> SUSPENDED`
- `resume`: `SUSPENDED -> ACTIVE`
- `fork`: `ACTIVE -> ACTIVE` for the source instance, with a related instance reference for the new branch
- `merge`: `ACTIVE|SUSPENDED -> MERGED`
- `terminate`: `BORN|ACTIVE|SUSPENDED|MERGED -> TERMINATED`

## `related_instance_id` semantics

`related_instance_id` is only required for transitions that point at another
instance.

- For `fork`, `subject_instance_id` is the source branch whose state continues,
  and `related_instance_id` is the new child branch created by the fork.
- For `merge`, `subject_instance_id` is the branch being merged and closed, and
  `related_instance_id` is the existing target instance that receives the merge.

In other words, `subject_instance_id` is always the instance whose lifecycle
state is being updated by the receipt.

## Forbidden transitions

The profile forbids at least these cases:

- `resume` from `ACTIVE`
- `activate` from `SUSPENDED`
- `terminate` without a transition reason
- `fork` without a governance decision reference
- `merge` without a prior state
- any further transition after `TERMINATED`
- any further transition after `MERGED` for the merged subject instance

## Minimal validation requirements

An implementation claiming Lifecycle Profile v0.1 support should do the
following at minimum:

1. Validate Lifecycle Objects against `schemas/lifecycle/lifecycle-object.schema.json`.
2. Validate Lifecycle Receipts against `schemas/lifecycle/lifecycle-receipt.schema.json`.
3. Reject unknown fields outside the extension namespace.
4. Require `lineage_id` on both objects and receipts.
5. Require `transition_reason` on `terminate`.
6. Require `related_instance_id` on `fork` and `merge`.
7. Require `governance_decision_ref` and `evidence_ref` on each receipt.
8. Treat `MERGED` and `TERMINATED` as terminal outcomes for the subject instance.

## Relationship to POP / AIP / ARO

- POP provides the persona-facing reference surface through `persona_ref`.
- AIP can carry lifecycle-related requests or actions, but it does not define
  lifecycle continuity semantics by itself.
- ARO-Audit preserves lifecycle receipts as reviewable evidence and conformance
  artifacts, but it does not define the lifecycle state machine.

The profile also depends on governance and runtime-evidence systems:

- governance policy references are carried through `governance_profile_ref`
  and `governance_decision_ref`
- evidence links are carried through `evidence_refs` and `evidence_ref`

## Minimal interoperability claim

Lifecycle Profile v0.1 is a smallest viable governance profile. It is intended
to make continuity, lineage, fork, merge, and terminate semantics portable
enough to validate and review across repositories. It is not a claim that the
entire lifecycle problem is solved.
