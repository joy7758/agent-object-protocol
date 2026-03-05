# Paper Experiments (Reproducibility)

This directory contains lightweight, reproducible experiments supporting the paper's evaluation claims.

## Quickstart

Run all experiments and regenerate result files:

```bash
./experiments/run_all.sh
```

## Experiment 1 - Parse-only baseline (schema-benchmark)

**Claim:** Syntactic JSON parsing is insufficient for protocol adjudication.

- Script: `experiments/schema-benchmark/scripts/run_benchmark.js`
- Output: `experiments/schema-benchmark/results/benchmark.txt`
- Expected: `Total artifacts: 139`, `Parse rejected: 0`
- Note: `JSON.parse` does not detect duplicate keys (parser ambiguity).

## Experiment 2 - CI determinism (3 runs)

**Claim:** The adjudicator is deterministic under a pinned toolchain.

- Script: `experiments/ci-determinism/run_ci_test.sh`
- Output: `experiments/ci-determinism/results.txt`
- Expected: repeated identical summaries across 3 runs.

## Experiment 3 - Adversarial invalid suite rejection

**Claim:** Adversarial invalid fixtures are rejected deterministically (negative-safety).

- Command: `node tools/validate_invalid_fixtures.mjs`
- Output: `experiments/adversarial-tests/results.txt`
- Expected: `total=3, parse_reject=1, checks_reject=2, unexpected_pass=0`

## Artifact baseline

For the paper baseline commits and CI evidence runs, see:

- `docs/paper-evidence/README.md`
