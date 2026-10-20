---
name: sync-upstream
description: Merge the latest upstream al-folio (alshedivat/al-folio) into this fork while keeping site content and customizations, verify the build in Docker, and open a PR. Use when asked to sync, update or pull from upstream al-folio.
---

# Sync with upstream al-folio

Goal: one merge commit on a `chore/sync-upstream-<timestamp>` branch whose second parent is `upstream/main`, verified locally, opened as a PR. Work autonomously; only stop for a genuinely ambiguous conflict.

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
  git rev-parse upstream/main > .git/MERGE_HEAD
  echo "chore: sync with upstream al-folio" > .git/MERGE_MSG
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

After resolving, also check the auto-merged diff (`git diff --cached --stat HEAD`) for upstream changes to fork content. New upstream demo posts are fine — the fork keeps al-folio's demo posts.

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

Then in the built-in browser: home, publications and CV render; the dark-mode toggle (`#light-toggle`) flips `data-theme`; the console shows no errors other than the dev-only livereload CSP block. Fix regressions before pushing.

## 6. Push and open PR

```bash
git push -u origin HEAD
gh api repos/emalgorithm/emalgorithm.github.io/pulls --method POST \
  -f title="chore: sync with upstream al-folio" -f head="$(git branch --show-current)" -f base=main \
  -F body=@<body.md> -q .html_url
```

(`gh pr create` can fail on merge commits and resolves the wrong repo because of the `upstream` remote.) The body should list the upstream changes pulled in, a conflict-resolution table (file → resolution), verification results, and the reminder below.

**Merge the PR with a regular merge commit, never squash.** Squashing drops the upstream parent and breaks the next sync (see step 2).
