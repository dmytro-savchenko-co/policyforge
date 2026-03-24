import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test("login page shows coming soon without Supabase", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByText("Coming Soon")).toBeVisible();
  });

  test("signup page shows coming soon without Supabase", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByText("Coming Soon")).toBeVisible();
  });

  test("coming soon page links to generator", async ({ page }) => {
    await page.goto("/auth/login");
    await page.getByRole("link", { name: "Generate a Policy" }).click();
    await expect(page).toHaveURL("/generator");
  });
});
