#!/usr/bin/env node
// Screenshot the live site (baseline) and the local sync candidate, then
// pixel-diff each page so a reviewer can spot visual regressions.
//
// Usage (from the repo root, with the candidate served by `docker compose up`):
//   node .agents/skills/sync-upstream/compare_site.mjs <out-dir> \
//     [--baseline https://emanuelerossi.co.uk] [--candidate http://127.0.0.1:8080]
//
// Writes <out-dir>/<page>-<viewport>-<theme>-{baseline,candidate,diff}.png and
// prints one line per shot with the share of differing pixels.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const PAGES = ["/", "/publications/", "/cv/", "/blog/", "/outreach/", "/news/"];
const VIEWPORTS = { desktop: { width: 1280, height: 900 }, mobile: { width: 390, height: 844 } };
const THEMES = ["light", "dark"];

const args = process.argv.slice(2);
const outDir = args[0];
if (!outDir) {
  console.error("usage: compare_site.mjs <out-dir> [--baseline URL] [--candidate URL]");
  process.exit(2);
}
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const baseline = option("--baseline", "https://emanuelerossi.co.uk");
const candidate = option("--candidate", "http://127.0.0.1:8080");
fs.mkdirSync(outDir, { recursive: true });

async function shoot(browser, base, page, viewport, theme) {
  const context = await browser.newContext({ viewport: VIEWPORTS[viewport], colorScheme: theme, reducedMotion: "reduce" });
  const tab = await context.newPage();
  await tab.addInitScript((value) => localStorage.setItem("theme", value), theme);
  await tab.goto(base + page, { waitUntil: "networkidle", timeout: 60000 });
  await tab.waitForTimeout(1000);
  const image = PNG.sync.read(await tab.screenshot({ fullPage: true }));
  await context.close();
  return image;
}

// Pixel-diff the overlapping area; height changes are reported separately.
function diff(a, b) {
  const width = Math.min(a.width, b.width);
  const height = Math.min(a.height, b.height);
  const crop = (image) => {
    const out = new PNG({ width, height });
    PNG.bitblt(image, out, 0, 0, width, height, 0, 0);
    return out;
  };
  const out = new PNG({ width, height });
  const changed = pixelmatch(crop(a).data, crop(b).data, out.data, width, height, { threshold: 0.1 });
  return { out, ratio: changed / (width * height) };
}

const browser = await chromium.launch();
let worst = 0;
for (const page of PAGES) {
  for (const viewport of Object.keys(VIEWPORTS)) {
    for (const theme of THEMES) {
      const name = `${page.replaceAll("/", "_").replace(/^_|_$/g, "") || "home"}-${viewport}-${theme}`;
      const [before, after] = [await shoot(browser, baseline, page, viewport, theme), await shoot(browser, candidate, page, viewport, theme)];
      const { out, ratio } = diff(before, after);
      fs.writeFileSync(path.join(outDir, `${name}-baseline.png`), PNG.sync.write(before));
      fs.writeFileSync(path.join(outDir, `${name}-candidate.png`), PNG.sync.write(after));
      fs.writeFileSync(path.join(outDir, `${name}-diff.png`), PNG.sync.write(out));
      worst = Math.max(worst, ratio);
      const height = before.height === after.height ? "" : `  height ${before.height}px -> ${after.height}px`;
      console.log(`${(ratio * 100).toFixed(2).padStart(6)}%  ${name}${height}`);
    }
  }
}
await browser.close();
console.log(`max diff ${(worst * 100).toFixed(2)}%  (screenshots in ${outDir})`);
