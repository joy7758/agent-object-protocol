#!/usr/bin/env bash
set -euo pipefail

echo "== Experiment 1: parse-only baseline =="
node experiments/schema-benchmark/scripts/run_benchmark.js | tee experiments/schema-benchmark/results/benchmark.txt

echo
echo "== Experiment 2: CI determinism (3 runs) =="
bash experiments/ci-determinism/run_ci_test.sh | tee experiments/ci-determinism/results.txt

echo
echo "== Experiment 3: adversarial invalid suite =="
node tools/validate_invalid_fixtures.mjs | tee experiments/adversarial-tests/results.txt

echo
echo "== Experiment 4: synthetic-scale stress test =="
node experiments/synthetic-scale/scripts/run_synthetic_scale.js | tee experiments/synthetic-scale/results/results.txt

echo
echo "== Experiment 5: cross-validator consistency (Node vs Python) =="
bash experiments/cross-validator/scripts/run_cross_validator.sh | tee experiments/cross-validator/results/results.txt

echo
echo "Done. Results written under experiments/**/results*.txt"
