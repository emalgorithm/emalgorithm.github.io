---
name: sync-upstream
description: Merge the latest upstream al-folio (alshedivat/al-folio) into this fork while keeping site content and customizations, verify the build and visuals in Docker, have an independent agent review it, merge the PR and report what changed. Use when asked to sync, update or pull from upstream al-folio, and for the scheduled monthly sync.
---

# Sync with upstream al-folio

Goal: one merge commit on a `chore/sync-upstream-<timestamp>` branch whose second parent is `upstream/main`, verified locally (build, CI gates, visuals), independently reviewed, merged, and summarised for the site owner. Work autonomously. On a genuinely ambiguous conflict or an unresolved review finding, leave the PR open and say why in the report instead of merging.

## 0. Anything to sync?

```bash
git fetch upstream
git log --oneline --no-merges origin/main..upstream/main
```

If nothing is new, or every new commit is upstream housekeeping that doesn't affect the fork (`refresh star history chart`, `refresh README screenshots`, `Update Google Scholar citations`, `Auto update markdown TOC`), stop and report "nothing worth syncing" in one line.

## 1. Branch

```bash
git fetch origin && git fetch upstream
git status --short          # tracked modifications → stop and ask; untracked files are fine
git switch -c chore/sync-upstream-$(date +%Y%m%d-%H%M%S) origin/main
```

Branch from `origin/main` directly — `main` is often checked out in another worktree (Codex/Cursor), so `git checkout main` can fail.

## 2. Merge

Check that the fork shares recent history with upstream first:

```bash
git log -1 --format='%h %ad %s' --date=short $(git merge-base HEAD upstream/main)
```

- **Recent base (normal case):** `git merge upstream/main`.
- **Ancient base (e.g. 2017) / a flood of `add/add` conflicts:** an earlier sync PR was squash-merged, which drops the upstream parent. Find the newest upstream PR commit already in the fork by subject, and merge with it as an explicit base:

  ```bash
  git log upstream/main --format='%H|%s' | grep -E '\(#[0-9]+\)$' | while IFS='|' read h s; do
    git log HEAD --format=%s | grep -qxF "$s" && { echo "$h $s"; break; }; done
  BASE=<hash from above>
  git merge-tree --write-tree --merge-base=$BASE HEAD upstream/main   # preview: lists real conflicts
  git read-tree -m -u $BASE HEAD upstream/main
  git merge-index -o -q git-merge-one-file -a
  GD=$(git rev-parse --git-dir)   # .git is a file in worktrees
  git rev-parse upstream/main > "$GD/MERGE_HEAD"
  echo "chore: sync with upstream al-folio" > "$GD/MERGE_MSG"
  ```

  Resolve conflicts, then `git commit --no-edit`. The commit records the real upstream parent, so the next sync is a normal merge again.

## 3. Resolve conflicts

The fork is a thin starter: runtime lives in `al_*` gems, so conflicts are almost always config, content or CI.

- `_config.yml`: keep personal values (title, url, icon, analytics IDs, socials, toggles the site turned on); take new upstream keys, plugin entries and version/SRI pins.
- `Gemfile` / `Gemfile.lock` / `package*.json`: take upstream, then re-add any fork-only gems. The `Gemfile` plugin group and `_config.yml` `plugins:` must stay in sync.
- Content (`_pages`, `_bibliography`, `_data`, `_news`, `_projects`, own `_posts`): keep the fork. `_data/citations.yml` is the fork's own Scholar data — always `--ours`.
- `.gitignore`, docs, workflows: usually union both sides.
- Local overrides (`_sass/_custom.scss`, any `_includes`/`_layouts` override listed in `.al-folio-overrides.yml`): keep the fork; if upstream changed the overridden gem file, port the fork's tweak onto it.
- If a conflict needs a judgment call about site behavior, ask.

After resolving, also check the auto-merged diff (`git diff --cached --stat HEAD`) for upstream changes to fork content. The fork hides al-folio's demo posts via `_config.yml` `exclude:` (not deletion, to avoid conflicts): add any new upstream `_posts/` demo files there.

## 4. Known traps

- **Duplicate YAML keys** — the fork once gated starter-only workflows with `if: github.repository == 'alshedivat/al-folio'`; upstream now does the same. The `check-yaml` pre-commit hook fails on the duplicate `if:`; drop the fork's copy.
- **Prettier upgrades reformat files** (e.g. `assets/css/main.scss` Liquid spacing). Keep the reformat: CI's `npx prettier . --check` uses the new version and fails otherwise.
- **Stale local overrides** — when an `al_folio_core` bump changes a file the fork overrides, CI's `overrides audit --fail-on-stale` fails. Diff the old vs new gem copy, port upstream's change into the local file, then accept (see step 5).
- Host `bundle exec` is broken; use Docker for everything Ruby.

## 5. Verify

```bash
docker compose up --build -d
until docker compose logs --since 5m 2>&1 | grep -q "Server running"; do sleep 5; done
for p in / /publications/ /cv/ /blog/ /outreach/ /news/; do
  printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8080$p)" "$p"; done
docker compose exec -T jekyll sh -c 'cd /srv/jekyll && bundle list | grep al_'   # new gem versions loaded

# Same gates CI runs:
npx prettier . --check
docker compose exec -T jekyll sh -c 'cd /srv/jekyll && bundle exec al-folio upgrade audit && bundle exec al-folio upgrade overrides audit --fail-on-stale'
```

For each override reported `stale`, compare the gem versions (`gem fetch al_folio_core -v <old> && gem unpack ...` in the container; the new one is under `/usr/local/bundle/gems/`), apply upstream's diff to the local file, then `bundle exec al-folio upgrade overrides accept <path>` and prettier-format `.al-folio-overrides.yml`. Re-accept any override that prettier reformatted.

Then in the built-in browser: home, publications and CV render; the dark-mode toggle (`#light-toggle`) flips `data-theme`; the console shows no errors other than the dev-only livereload CSP block.

**Visual comparison against the live site.** The live site is the baseline, since it is built from `origin/main`. First confirm the latest Pages deployment is for `origin/main` (`gh api repos/emalgorithm/emalgorithm.github.io/deployments -q '.[0].sha'` equals `git rev-parse origin/main`; wait for the deploy otherwise). Then, with the candidate served on `:8080`:

```bash
npx playwright install chromium   # once per Playwright version
node .agents/skills/sync-upstream/compare_site.mjs <scratch-dir>/visual
```

It screenshots home, publications, CV, blog, outreach and news at desktop and mobile width in light and dark theme, and writes baseline/candidate/diff PNGs plus a per-shot diff percentage. Small diffs from animated previews are noise; a block shifted down shifts everything below it, so find where the first difference starts in the diff image and compare the two screenshots there. The bar is: everything looks as before or better, with nothing missing, broken, unstyled or harder to read. Fix regressions before pushing.

## 6. Push and open PR

```bash
git push -u origin HEAD
gh api repos/emalgorithm/emalgorithm.github.io/pulls --method POST \
  -f title="chore: sync with upstream al-folio" -f head="$(git branch --show-current)" -f base=main \
  -F body=@<body.md> -q .html_url
```

(Plain `gh pr create` resolves the wrong repo because of the `upstream` remote.) The body should list the upstream changes pulled in, a conflict-resolution table (file → resolution), verification results, and the reminder below.

**Merge the PR with a regular merge commit, never squash.** Squashing drops the upstream parent and breaks the next sync (see step 2).

## 7. Independent review

Spawn a separate agent (Agent tool, `general-purpose`, fresh context, not a fork of this conversation) to review the PR before merging. Give it the PR URL, the branch name, the visual-comparison directory, and this brief:

- Check every conflict resolution against step 3: personal `_config.yml` values kept, new upstream keys and pins taken, `Gemfile` plugin group and `_config.yml` `plugins:` in sync, fork content and `_data/citations.yml` untouched, new upstream demo posts excluded.
- Scan the full upstream diff (`git diff origin/main...HEAD`) for anything the merge silently dropped or that changes site behaviour the PR body doesn't mention.
- Run the step-5 gates again (prettier, `upgrade audit`, `overrides audit --fail-on-stale`) and read the CI results on the PR.
- Inspect the visual comparison: look at every shot with a non-trivial diff, side by side, and judge whether the page looks the same or better.
- Return a list of findings, each marked blocking or non-blocking, with file/page and evidence. Report only, no edits.

Fix blocking findings, re-run the affected checks, and ask the reviewer to re-check if the fix was substantial. Note non-blocking findings in the report.

## 8. Merge

```bash
gh pr checks <number> --repo emalgorithm/emalgorithm.github.io --watch --fail-fast
gh pr merge <number> --repo emalgorithm/emalgorithm.github.io --merge --delete-branch
```

Only merge when CI is green and the review has no open blocking findings. Then `docker compose down`.

## 9. Report

End with a short report for the site owner, at most ~15 lines:

- **Synced:** upstream range, PR link, merged or not (and why).
- **What changed upstream that matters for this site:** a few bullets, each one line on what it is and why it's relevant, e.g. a new plugin, a feature flag, a gem bump fixing something visible, a new config option.
- **Worth using:** for anything the site could take advantage of, the concrete step (e.g. "enable `al_marimo` in `_config.yml` and `Gemfile` to embed notebooks in posts").
- **Review notes:** non-blocking findings, if any.

Skip upstream changes that don't affect this fork (CI for the starter repo, README screenshots, docs-only edits) or mention them in one line at most.
