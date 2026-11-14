import { test, expect } from "@playwright/test";

test.describe("site navigation", () => {
  test("landing page renders the hero and primary CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Build a Healthier Relationship/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Start Wellness Assessment/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /Explore Resources/i })).toBeVisible();
  });

  test("no 'Admin' link appears anywhere in the public navigation or footer", async ({ page }) => {
    await page.goto("/");
    const adminLinks = page.locator('a:text-matches("admin", "i")');
    await expect(adminLinks).toHaveCount(0);
  });

  test("primary nav links lead to the correct pages", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Resources", exact: true }).first().click();
    await expect(page).toHaveURL(/\/resources$/);
  });

  test("mobile viewport shows a hamburger menu instead of the full nav", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Desktop/tablet projects don't need this check");
    await page.goto("/");
    await expect(page.getByRole("button", { name: /open menu/i })).toBeVisible();
  });
});
