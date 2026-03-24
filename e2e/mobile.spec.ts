import { test, expect } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } });

test.describe("Mobile responsive", () => {
  test("mobile menu opens and closes", async ({ page }) => {
    await page.goto("/");

    // Desktop nav should be hidden
    const desktopNav = page.locator("nav.hidden.md\\:flex");
    await expect(desktopNav).toBeHidden();

    // Click hamburger
    await page.locator("button.md\\:hidden").click();

    // Mobile menu links visible
    await expect(page.getByText("Generator").last()).toBeVisible();
    await expect(page.getByText("Pricing").last()).toBeVisible();
  });

  test("mobile menu link navigates and closes", async ({ page }) => {
    await page.goto("/");
    await page.locator("button.md\\:hidden").click();
    await page.getByRole("link", { name: "Generator" }).last().click();
    await expect(page).toHaveURL("/generator");
  });

  test("wizard is usable on mobile", async ({ page }) => {
    await page.goto("/generator/refund-policy");
    await page.getByPlaceholder("Acme Inc.").fill("Mobile Co");
    await page.getByPlaceholder("https://example.com").fill("https://m.co");
    await page.getByPlaceholder("contact@example.com").fill("a@m.co");
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Refund Details" })).toBeVisible();
  });
});
