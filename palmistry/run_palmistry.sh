#!/usr/bin/env bash
# Simple helper to run the palmistry v2 analysis
# Usage:
#   bash run_palmistry.sh /path/to/palm.jpg [outdir]

set -e
INPUT="$1"
OUTDIR="${2:-.}"

if [ -z "$INPUT" ]; then
  echo "Usage: bash $0 /path/to/palm.jpg [outdir]" >&2
  exit 1
fi

mkdir -p "$OUTDIR"

python palmistry_detect_v2.py \
  -i "$INPUT" \
  -o "$OUTDIR/out.png" \
  --json "$OUTDIR/out.json" \
  --txt "$OUTDIR/report_si.txt" \
  --k 6

echo "[OK] Wrote results to $OUTDIR/"
