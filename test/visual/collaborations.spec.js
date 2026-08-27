const { test, expect } = require("@playwright/test");
const { preparePage, stabilizeVisuals } = require("./helpers");

test.beforeEach(async ({ page }) => {
  await preparePage(page, "light");
  await page.goto("/al-folio/collaborations/", { waitUntil: "networkidle" });
  await stabilizeVisuals(page);
  await expect(page.locator("#collaboration-map svg")).toBeVisible();
});

test("collaboration map aggregates the core network and opens country details", async ({ page }) => {
  await expect(page.locator("#collab-stat-people")).toHaveText("33");
  await expect(page.locator("#collab-stat-papers")).toHaveText("24");
  await expect(page.locator("#collaboration-coverage-note")).toContainText("33 of 33");
  await expect(page.locator("#collaboration-collaborator-ranking li")).toHaveCount(6);
  await expect(page.locator("#collaboration-collaborator-ranking li").first()).toContainText("Michael Bronstein");
  await expect(page.locator("#collaboration-collaborator-ranking li").first()).toContainText("14");

  const unitedStatesFill = await page.locator('path[data-country="US"]').evaluate((country) => window.getComputedStyle(country).fill);
  const canadaFill = await page.locator('path[data-country="CA"]').evaluate((country) => window.getComputedStyle(country).fill);
  expect(unitedStatesFill).not.toBe("rgb(0, 0, 0)");
  expect(unitedStatesFill).not.toBe(canadaFill);

  const layout = await page.locator(".collaboration-map-card").evaluate((card) => ({
    mapWidth: card.getBoundingClientRect().width,
    viewportWidth: window.innerWidth,
    selectedCountries: document.querySelectorAll(".collaboration-countries .is-selected").length,
  }));
  expect(layout.mapWidth / layout.viewportWidth).toBeGreaterThan(0.98);
  expect(layout.selectedCountries).toBe(0);

  await page.locator("#collaboration-country-select").selectOption("CA");
  await expect(page.locator("#collaboration-detail h3")).toHaveText("Canada");
  await expect(page.locator("#collaboration-detail")).toContainText("Reihaneh Rabbany");

  const firstPaperLink = page.locator("#collaboration-detail .collaboration-paper-list a").first();
  await expect(firstPaperLink).toHaveAttribute("href", /\/publications\/#.+/);
});

test("map countries support pointer and keyboard exploration", async ({ page }) => {
  const unitedKingdom = page.locator('path[data-country="GB"]');
  await unitedKingdom.hover();
  await expect(page.locator("#collaboration-tooltip")).toContainText("United Kingdom");

  await unitedKingdom.focus();
  await unitedKingdom.press("Enter");
  await expect(page.locator("#collaboration-detail h3")).toHaveText("United Kingdom");
  await expect(unitedKingdom).toHaveClass(/is-selected/);
});

test("collaboration map follows the site theme", async ({ page }) => {
  const country = page.locator('path[data-country="US"]');
  const lightFill = await country.getAttribute("fill");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  await page.waitForTimeout(300);
  const darkFill = await country.getAttribute("fill");
  expect(darkFill).not.toBe(lightFill);
});
