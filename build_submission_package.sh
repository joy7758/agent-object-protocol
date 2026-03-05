#!/usr/bin/env bash
# build_submission_package.sh
# Create an ICSE submission package: paper + experiments + evidence docs.

set -euo pipefail

OUTPUT="AOP_submission_package.zip"

echo "Cleaning old package..."
rm -f "$OUTPUT"

echo "Packing paper, experiments, and documentation..."
zip -r "$OUTPUT" \
  paper/icse2027 \
  experiments \
  docs/paper-evidence \
  CONFORMANCE.md \
  RELEASE_NOTES_v1.0.0.md \
  README.md \
  LICENSE \
  -x "paper/icse2027/*.aux" \
     "paper/icse2027/*.log" \
     "paper/icse2027/*.out" \
     "paper/icse2027/*.blg" \
     "paper/icse2027/*.fdb_latexmk" \
     "paper/icse2027/*.fls" \
     "paper/icse2027/figures/*.aux" \
     "paper/icse2027/figures/*.log" \
     "paper/icse2027/figures/*_src.pdf"

echo "Package $OUTPUT created successfully."
