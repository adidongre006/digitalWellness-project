import { test, expect } from "@playwright/test";

test.describe("admin authentication boundary", () => {
  test("visiting /admin/dashboard without a session redirects to /admin", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("/admin shows a login or initial-setup form, never a bare page", async ({ page }) => {
    await page.goto("/admin");
    const hasLoginForm = await page.getByLabel(/^email$/i).isVisible().catch(() => false);
    expect(hasLoginForm).toBe(true);
  });

  test("the /admin page is not reachable via any link from the homepage", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator("a").evaluateAll((links) => links.map((l) => l.getAttribute("href")));
    expect(hrefs.some((href) => href?.includes("/admin"))).toBe(false);
  });
});
