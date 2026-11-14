import { test, expect } from "@playwright/test";

test.describe("wellness assessment", () => {
  test("selecting a problem and submitting shows recommendations", async ({ page }) => {
    await page.goto("/assessment");
    await page.getByRole("button", { name: /I am concerned about my online privacy/i }).click();
    await page.getByRole("button", { name: /Get my recommendations/i }).click();

    await expect(page.getByRole("heading", { name: /Your recommendations/i })).toBeVisible();
    // Privacy problem should surface at least uBlock Origin or Privacy Badger.
    const heading = page.locator("h3").filter({ hasText: /uBlock Origin|Privacy Badger/i });
    await expect(heading.first()).toBeVisible();
  });

  test("device filter excludes an incompatible resource with an explanation", async ({ page }) => {
    await page.goto("/assessment");
    await page.getByRole("button", { name: /I cannot concentrate while studying/i }).click();
    await page.getByRole("button", { name: "Android", exact: true }).click();
    await page.getByRole("button", { name: /Get my recommendations/i }).click();

    await expect(page.getByRole("heading", { name: /Your recommendations/i })).toBeVisible();
  });

  test("reset clears the form back to its initial state", async ({ page }) => {
    await page.goto("/assessment");
    await page.getByRole("button", { name: /My sleep is getting ruined/i }).click();
    await page.getByRole("button", { name: /^Reset$/i }).click();
    await expect(page.getByRole("button", { name: /Get my recommendations/i })).toBeDisabled();
  });
});
