---
name: sync-upstream
description:
---

I need to update my repository with changes from the upstream `al-folio` repository while preserving my personal customizations.

Please execute the following "Upstream Sync Workflow":

**Phase 1: Clean Start**

1.  Check status to ensure the working tree is clean. If not, stop and tell me.
2.  Switch to the `main` branch: `git checkout main`.
3.  Pull the latest changes from my remote: `git pull origin main`.
4.  Create and switch to a new temporary sync branch: `git checkout -b chore/sync-upstream-$(date +%Y%m%d-%H%M%S)`.

**Phase 2: Fetch & Merge**

1.  Fetch the upstream remote: `git fetch upstream`.
2.  Attempt to merge upstream main: `git merge upstream/main`.

**Phase 3: Intelligent Conflict Resolution**
If the merge stops due to conflicts, do not abort. For every conflicting file, analyze the `<<<<<<< HEAD` (my changes) vs `>>>>>>> upstream` (their changes) and apply these rules:

- **Global Rule:** If the conflict is purely formatting or whitespace, prefer Upstream.
- **Rule for `_config.yml`:**
  - KEEP my personal values (e.g., `title`, `email`, `url`, `repository`, social links).
  - ACCEPT new configuration keys/settings added by upstream.
  - UPDATE version numbers or dependencies if upstream changed them.
- **Rule for Content (`_pages/`, `_bibliography/`, `_posts/`, `_data/`):**
  - Heavily bias towards MY changes. I do not want to overwrite my bio, papers, or personal data with the template defaults.
  - Only accept upstream changes if they look like structural fixes (e.g., front matter syntax updates).
- **Rule for Layouts/Includes (`_layouts/`, `_includes/`, `_sass/`):**
  - Heavily bias towards UPSTREAM changes to get new features/bug fixes.
  - **Crucial:** Check if I added custom scripts (like analytics), custom CSS classes, or specific HTML blocks. If so, re-inject my custom code into the new upstream structure. My custom styles live in `_sass/_custom.scss` — always preserve this file's contents.

**Phase 4: Finalization**

1.  For each resolved file, automatically `git add` it.
2.  If you are unsure about a specific conflict (e.g., logic is too complex to merge safely), stop and ask me for guidance on that specific file.
3.  Once all conflicts are resolved, commit the merge with the message: "chore: sync with upstream al-folio".
4.  **Build & Verify locally before pushing:**
    - Run `docker compose up --build` and wait for the site to be available at `http://localhost:8080`.
    - Use the browser to inspect the running site: check navigation, key pages (home, publications, CV), images, and dark mode.
    - If you find build errors or visual regressions, attempt to fix them and amend the commit.
    - If an issue cannot be resolved automatically, stop and report it to me with a clear description before proceeding.
5.  Push the branch to origin: `git push origin <branch-name>`.
6.  Create a pull request to `main` using GitHub CLI. For the PR description, summarize what the upstream integration added or updated.
7.  **Report:** At the end, output a Markdown table summarizing:
    - Files that had conflicts.
    - The resolution strategy you used (e.g., "Kept Local Content", "Merged Config", "Adopted Upstream Structure").

At the end, remind me to use a regular merge (not a squash merge) when merging the PR into main. This preserves the detailed commit history of al-folio, making future upstream syncs smoother.
