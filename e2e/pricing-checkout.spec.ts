import { test, expect } from "@playwright/test";

test.describe("Pricing page", () => {
  test("free plan button navigates to generator", async ({ page }) => {
    await page.goto("/pricing");
    await page.getByRole("button", { name: "Get Started Free" }).click();
    await expect(page).toHaveURL("/generator");
  });

  test("paid plan button calls checkout API", async ({ page }) => {
    await page.goto("/pricing");

    // Intercept the checkout API call
    const apiPromise = page.waitForRequest("**/api/checkout");
    await page.getByRole("button", { name: "Start 7-Day Free Trial" }).first().click();

    const request = await apiPromise;
    const body = JSON.parse(request.postData() || "{}");
    expect(body.plan).toBe("starter");
  });
});
