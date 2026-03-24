import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test("login page renders", async ({ page }) => {
    await page.goto("/auth/login");
    // Shows either "Coming Soon" or login form depending on Supabase config
    const hasComing = await page.getByText("Coming Soon").isVisible().catch(() => false);
    const hasForm = await page.getByText("Welcome back").isVisible().catch(() => false);
    expect(hasComing || hasForm).toBe(true);
  });

  test("signup page renders", async ({ page }) => {
    await page.goto("/auth/signup");
    const hasComing = await page.getByText("Coming Soon").isVisible().catch(() => false);
    const hasForm = await page.getByText("Create your account").isVisible().catch(() => false);
    expect(hasComing || hasForm).toBe(true);
  });

  test("auth pages have link to generator or signup", async ({ page }) => {
    await page.goto("/auth/login");
    // Either "Generate a Policy" link (coming soon) or "Sign up" link (configured)
    const hasGenerator = await page.getByRole("link", { name: "Generate a Policy" }).isVisible().catch(() => false);
    const hasSignup = await page.getByRole("link", { name: "Sign up" }).isVisible().catch(() => false);
    expect(hasGenerator || hasSignup).toBe(true);
  });
});
