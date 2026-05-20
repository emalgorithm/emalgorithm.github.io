---
name: add-paper
description: Add a new publication to the site. Provide one or more arXiv URLs/IDs, a DOI, or a direct paper URL. The skill fetches metadata, extracts a teaser image from the PDF, and adds a fully populated BibTeX entry to _bibliography/papers.bib.
---

Add the paper(s) provided by the user to `_bibliography/papers.bib`. Follow these steps for each paper.

## Step 1 — Fetch metadata

Fetch the paper's abstract page (arXiv, ACL Anthology, NeurIPS proceedings, etc.) and extract:
- Title
- Authors (full names, in order)
- Year
- Venue / journal / conference (use the published venue if available, otherwise `arXiv`)
- Abstract
- arXiv ID (if applicable)
- DOI — only include for **published** papers (journal, conference proceedings). Do **not** add a DOI for arXiv preprints.
- Any linked resources: code (GitHub), demo/project page (`website`), dataset (HuggingFace or other), X/Twitter thread (`xthread`)

## Step 2 — Determine publication type

Set `pubtype` to one of: `journal`, `conference`, `workshop`, `preprint`.

Set `abbr` to the short venue name (e.g., `NeurIPS`, `ICML`, `arXiv`, `TKDE`).

Mark `selected = {true}` only for first-author papers by Emanuele Rossi.

## Step 3 — Extract teaser image

1. Download the paper PDF from arXiv (or the publisher).
2. Identify which page contains **Figure 1** (the main overview/teaser figure). It is usually on page 1 or 2.
3. Extract that page at **300 DPI** as a PNG using `pdftoppm`:
   ```bash
   pdftoppm -r 300 -png -f <page> -l <page> paper.pdf /tmp/paper_page
   ```
4. Auto-trim whitespace with ImageMagick and add **60 px** of white padding:
   ```bash
   magick /tmp/paper_page-<N>.png -trim +repage /tmp/trimmed.png
   magick /tmp/trimmed.png -bordercolor white -border 60x60 /tmp/preview.png
   ```
5. Visually inspect the result. If the crop includes the figure caption (e.g., "Figure 1: …"), reduce the page crop height to exclude it before trimming:
   ```bash
   magick /tmp/paper_page-<N>.png -crop <W>x<H>+0+0 +repage /tmp/cropped.png
   # then trim + border as above
   ```
6. Choose a short, descriptive filename (e.g., `lac.png`, `lightning_network_closure.png`).
7. Copy to `assets/img/publication_preview/<filename>.png`.

If the PDF is unavailable or the figure cannot be extracted cleanly, skip the preview and omit the `preview` field.

## Step 4 — Write the BibTeX entry

Insert the new entry at the **top** of `_bibliography/papers.bib` (just after the `---` front matter block), so the most recent papers appear first.

Use this field order and formatting style — align values with spaces:

```bibtex
@article{<citekey>,
  title       = {<Title>},
  author      = {<Author One> and <Author Two> and ...},
  year        = {<year>},
  journal     = {<Venue>},
  doi         = {<doi>},           % omit entirely for arXiv preprints
  proceedings = {<proceedings URL>},  % omit if not available
  arxiv       = {<arXiv ID>},      % omit if not on arXiv
  abbr        = {<Abbr>},
  preview     = {<filename>.png},
  website     = {<demo/project URL>},   % omit if not available
  code        = {<GitHub URL>},         % omit if not available
  dataset     = {<dataset URL>},        % omit if not available
  xthread     = {<X/Twitter URL>},      % omit if not available
  pubtype     = {<journal|conference|workshop|preprint>},
  bibtex_show = {true},
  selected    = {true},            % only for first-author papers
  abstract    = {<abstract text>}
}
```

**Citation key convention:** `<firstauthorlastname><year><firstwordoftitle>` in lowercase (e.g., `rossi2026lac`, `antonelli2026lightning`).

**Author formatting:** Use `{\`a}`, `{\'e}`, etc. for accented characters in LaTeX style.

**Do not add `doi` for arXiv preprints** — the `arxiv` field alone is sufficient.

## Step 5 — Report

List what was added: cite key, venue, preview image filename, and any linked resources.
