# Local Agent Guidelines

This file contains site-specific instructions for emalgorithm.github.io, a fork of al-folio. It extends `AGENTS.md` (upstream).

## Fork Policy

This repo is a fork of al-folio. Keep changes content-focused; minimise style/template edits to reduce merge conflicts with upstream updates. Refer to `CUSTOMIZE.md` before making any theme changes.

## Pull Requests

Always use `gh pr create --repo emalgorithm/emalgorithm.github.io` — the `upstream` remote causes `gh` to resolve the wrong repo otherwise.

## Presentations

Slide files live in `assets/presentations/`. Name files `{topic}_{venue}_{date}` in lowercase with underscores; HTML and PDF share the same base name. In `_data/outreach.yml`, add a `# source: <commit-url>` comment below the slide URL pointing to the exact commit that generated the slides.
