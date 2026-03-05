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

## Experiment 4 - Synthetic-scale stress test (1000 artifacts)

**Claim:** AOP checks preserve classification fidelity under larger artifact volume.

- Script: `experiments/synthetic-scale/scripts/run_synthetic_scale.js`
- Output: `experiments/synthetic-scale/results/results.txt`
- Dataset: 900 valid + 100 invalid synthetic artifacts
- Expected: `Parse rejected: 0`, `AOP checks rejected: 100`, `AOP admitted: 900`

## Experiment 5 - Cross-validator consistency (Node vs Python)

**Claim:** Equivalent AOP checks yield consistent outcomes across independent implementations.

- Scripts:
  - `experiments/cross-validator/scripts/node_validator.js`
  - `experiments/cross-validator/scripts/python_validator.py`
  - `experiments/cross-validator/scripts/run_cross_validator.sh`
- Output: `experiments/cross-validator/results/results.txt`
- Input corpus: `experiments/synthetic-scale/generated/*.json`
- Expected: Node and Python report identical totals/rejections/admissions and `Consistent: true`.

## Artifact baseline

For the paper baseline commits and CI evidence runs, see:

- `docs/paper-evidence/README.md`
