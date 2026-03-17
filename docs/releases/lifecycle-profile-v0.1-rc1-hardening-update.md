# Lifecycle Profile v0.1 RC1 Hardening Update

This note records a narrow hardening pass on Lifecycle Profile v0.1 RC1. The
RC1 name does not change, and this update does not expand the protocol scope,
state machine, or transition set.

The hardening work is focused on two points.

First, lifecycle checks are now enforced directly in CI. The repository already
described Lifecycle Profile v0.1 as part of the current conformance baseline,
but the lifecycle schema family and lifecycle semantic gate were not both being
run by the default CI workflow. This update closes that gap by compiling the
lifecycle schemas and running the lifecycle verification command as part of the
main validation path.

Second, the profile text now states the `subject_instance_id` /
`related_instance_id` semantics more explicitly. For `fork`, the subject is the
source branch and the related instance is the new child. For `merge`, the
subject is the branch being merged and closed, while the related instance is
the existing merge target.

This is a hardening update to RC1, not a new release line. The goal is to make
the published RC1 surface more explicit and more reliably enforced.
