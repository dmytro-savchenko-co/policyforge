import { test, expect } from "@playwright/test";

test.describe("Homepage navigation", () => {
  test("hero CTA goes to generator", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Generate Your Policy Free" }).click();
    await expect(page).toHaveURL("/generator");
  });

  test("view pricing link works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "View Pricing" }).click();
    await expect(page).toHaveURL("/pricing");
  });
});

test.describe("Generator index navigation", () => {
  test("privacy policy card links correctly", async ({ page }) => {
    await page.goto("/generator");
    await page.getByText("Privacy Policy Generator").click();
    await expect(page).toHaveURL("/generator/privacy-policy");
  });

  test("terms card links correctly", async ({ page }) => {
    await page.goto("/generator");
    await page.getByText("Terms of Service Generator").click();
    await expect(page).toHaveURL("/generator/terms-of-service");
  });
});

test.describe("Header navigation", () => {
  test("logo returns to home", async ({ page }) => {
    await page.goto("/pricing");
    await page.getByRole("link", { name: "PolicyForge" }).first().click();
    await expect(page).toHaveURL("/");
  });

  test("header generator link works", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Generator" }).first().click();
    await expect(page).toHaveURL("/generator");
  });
});
