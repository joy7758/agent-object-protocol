#!/usr/bin/env bash
# build_final_pdf.sh
# Build final ICSE-ready PDF and run minimal submission safety checks.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PAPER_DIR="$ROOT_DIR/paper/icse2027"
PDF_PATH="$PAPER_DIR/main.pdf"

if [[ "${1:-}" == "--refresh-experiments" ]]; then
  echo "Refreshing experiment outputs..."
  "$ROOT_DIR/experiments/run_all.sh"
fi

echo "Building PDF (pdflatex + bibtex)..."
cd "$PAPER_DIR"
pdflatex -interaction=nonstopmode main.tex >/tmp/aop_build_pdflatex1.log 2>&1
bibtex main >/tmp/aop_build_bibtex.log 2>&1
pdflatex -interaction=nonstopmode main.tex >/tmp/aop_build_pdflatex2.log 2>&1
pdflatex -interaction=nonstopmode main.tex >/tmp/aop_build_pdflatex3.log 2>&1

echo "Checking PDF metadata..."
pdfinfo "$PDF_PATH" | awk '/^(Author|Creator|Producer):/ {print}'

echo "Checking anonymization keywords in paper sources..."
if grep -RInE "github|zenodo|doi|commit|zhangbin" "$PAPER_DIR" \
  --exclude="*.log" \
  --exclude="*.aux" \
  --exclude="*.out" \
  --exclude="*.blg" \
  --exclude="*.bbl" \
  --exclude="*.fdb_latexmk" \
  --exclude="*.fls"; then
  echo "Anonymization check failed."
  exit 1
fi

echo "Build and checks completed successfully."
echo "PDF: $PDF_PATH"
