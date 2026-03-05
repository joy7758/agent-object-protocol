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
echo "Done. Results written under experiments/**/results*.txt"
