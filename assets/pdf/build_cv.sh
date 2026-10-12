#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")"

latex_args=(-interaction=nonstopmode -halt-on-error)
build_dir=$(mktemp -d)
trap 'rm -r "$build_dir"' EXIT

python3 generate_cv_outreach.py ../../_data/outreach.yml emanuele_rossi_cv_outreach.tex
python3 generate_cv_publications.py \
    ../../_bibliography/papers.bib \
    ../../_data/citations.yml \
    emanuele_rossi_cv_publications.tex

pdflatex "${latex_args[@]}" -output-directory="$build_dir" emanuele_rossi_cv.tex
pdflatex "${latex_args[@]}" -output-directory="$build_dir" emanuele_rossi_cv.tex

full_input='\def\FULLCV{1}\input{emanuele_rossi_cv.tex}'
pdflatex "${latex_args[@]}" -output-directory="$build_dir" -jobname=emanuele_rossi_cv_full "$full_input"
pdflatex "${latex_args[@]}" -output-directory="$build_dir" -jobname=emanuele_rossi_cv_full "$full_input"

short_pages=$(pdfinfo "$build_dir/emanuele_rossi_cv.pdf" | awk '/^Pages:/ { print $2 }')
if [[ "$short_pages" != "1" ]]; then
    echo "Warning: the short CV currently has $short_pages pages." >&2
fi

mv "$build_dir/emanuele_rossi_cv.pdf" emanuele_rossi_cv.pdf
mv "$build_dir/emanuele_rossi_cv_full.pdf" emanuele_rossi_cv_full.pdf

echo "Built emanuele_rossi_cv.pdf and emanuele_rossi_cv_full.pdf."
