# CI Log Screenshots

Generated from GitHub Actions run `22658349784` (job `65672839352`, `JSON Schema validate`).

- Run: https://github.com/joy7758/agent-object-protocol/actions/runs/22658349784
- Job: https://github.com/joy7758/agent-object-protocol/actions/runs/22658349784/job/65672839352
- Raw log: `ci_run_22658349784_job_65672839352.log`
- Clean log: `ci_run_22658349784_job_65672839352.clean.log`

## Files

- `S1_object-invalid-rejected.png` (clean log lines 1078-1087)
- `S2_mcp-derived-schema-invalid-rejected.png` (lines 1545-1556)
- `S3_v07-e2e-negative-rejected.png` (lines 1904-1944)
- `S4_v08-evidence-digest-mismatch-rejected.png` (lines 2600-2616)
- `S5_v09-evidence-digest-mismatch-rejected.png` (lines 2341-2382)
- `S6_v11-dsse-invalid-rejected.png` (lines 720-752)
- `S7_v12-intoto-payloadtype-invalid-rejected.png` (lines 529-561)

## Adversarial Gate (local evidence)

- Command: `node tools/validate_invalid_fixtures.mjs`
- Log: `adversarial_gate_local.log`
- Screenshot: `S8_adversarial-gate-summary.png`
- Summary:
  - `Adversarial invalid fixtures total: 3`
  - `Rejected at parse: 1`
  - `Rejected by checks: 2`
  - `Unexpectedly passed: 0`

## Adversarial Gate (CI evidence)

- Run: https://github.com/joy7758/agent-object-protocol/actions/runs/22717328360
- Job: https://github.com/joy7758/agent-object-protocol/actions/runs/22717328360/job/65870183177
- Log: `ci_run_22717328360_job_65870183177.clean.log`
- Screenshot: `S8_adversarial-gate-summary-ci.png`
- Summary:
  - `Adversarial invalid fixtures total: 3`
  - `Rejected at parse: 1`
  - `Rejected by checks: 2`
  - `Unexpectedly passed: 0`
