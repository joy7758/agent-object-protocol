# Experiments

This folder contains reproducibility-oriented experiments used by the
paper evaluation.

## E1: Schema Benchmark (parse baseline)

- Script: `schema-benchmark/scripts/run_benchmark.js`
- Data: `schema-benchmark/data/` (copied from `examples/`)
- Output: `schema-benchmark/results/benchmark.txt`

Latest result:

- `Total artifacts: 139`
- `Parse rejected: 0`

## E2: CI Determinism (adversarial gate repeated runs)

- Script: `ci-determinism/run_ci_test.sh`
- Output: `ci-determinism/results.txt`

Latest result:

- 3 runs produced identical summaries:
  - `Adversarial invalid fixtures total: 3`
  - `Rejected at parse: 1`
  - `Rejected by checks: 2`
  - `Unexpectedly passed: 0`

## E3: Adversarial Rejection (single run)

- Fixtures: `adversarial-tests/*.json`
- Output: `adversarial-tests/results.txt`

Latest result:

- `Adversarial invalid fixtures total: 3`
- `Rejected at parse: 1`
- `Rejected by checks: 2`
- `Unexpectedly passed: 0`
