#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

latex_args=(-interaction=nonstopmode -halt-on-error)

pdflatex "${latex_args[@]}" emanuele_rossi_cv.tex
pdflatex "${latex_args[@]}" emanuele_rossi_cv.tex

full_input='\def\FULLCV{1}\input{emanuele_rossi_cv.tex}'
pdflatex "${latex_args[@]}" -jobname=emanuele_rossi_cv_full "$full_input"
pdflatex "${latex_args[@]}" -jobname=emanuele_rossi_cv_full "$full_input"

short_pages=$(pdfinfo emanuele_rossi_cv.pdf | awk '/^Pages:/ { print $2 }')
if [[ "$short_pages" != "1" ]]; then
    echo "The short CV must be exactly one page, but it has $short_pages pages." >&2
    exit 1
fi

echo "Built emanuele_rossi_cv.pdf and emanuele_rossi_cv_full.pdf."
