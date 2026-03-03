# AOP v0.3.0 - Breaking Change Migration Guide

This note is intended for the v0.3.0 release body.

## Breaking changes

- Governance sections are now strong-consistency when present:
  - `invocation.mode` and `invocation.idempotency` are REQUIRED.
  - `capabilities.side_effects` and `capabilities.determinism` are REQUIRED.
  - `security.auth` is REQUIRED when `security` is present.
- Unknown fields are rejected unless they match extension namespace:
  - `x-<vendor>-<key>`

## 30-second migration table

- `invocation` core required
  - Breaks: objects with `invocation` but missing `mode`/`idempotency`
  - Migrate: add both fields using valid schema enum values
- `capabilities` core required
  - Breaks: objects with `capabilities` but missing `side_effects`/`determinism`
  - Migrate: add both fields using valid schema enum values
- `security.auth` required
  - Breaks: objects with `security` but no `auth`
  - Migrate: add `auth` object (`scheme: none` for public objects)
- Unknown top-level fields rejected
  - Breaks: objects with ad-hoc fields such as `foo`
  - Migrate: rename to `x-<vendor>-<key>` or remove
- Unknown governance fields rejected
  - Breaks: ad-hoc fields inside governance sections
  - Migrate: rename to `x-<vendor>-<key>` or remove

## Conformance evidence in repository

- Normative schema: `schemas/aop-object.schema.json`
- Migrated valid fixtures: `examples/*.valid.json`
- Negative fixtures: `examples/invalid/*.invalid.json`
- CI gates:
  - `ajv compile --spec=draft2020`
  - valid fixture validation
  - invalid fixture rejection
