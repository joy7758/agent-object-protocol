#!/usr/bin/env bash
# build_artifact_package.sh
# Create an artifact-only package for supplementary submission.

set -euo pipefail

OUTPUT="AOP_artifact_package.zip"

echo "Cleaning old package..."
rm -f "$OUTPUT"

echo "Packing experiments and evidence..."
zip -r "$OUTPUT" \
  experiments \
  docs/paper-evidence \
  README.md \
  CONFORMANCE.md \
  -x "*.DS_Store"

echo "Artifact package $OUTPUT created successfully."
