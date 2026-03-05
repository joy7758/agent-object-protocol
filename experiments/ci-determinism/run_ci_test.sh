#!/bin/bash
set -euo pipefail

echo "Run 1"
node tools/validate_invalid_fixtures.mjs

echo "Run 2"
node tools/validate_invalid_fixtures.mjs

echo "Run 3"
node tools/validate_invalid_fixtures.mjs
