import { test, expect } from "@playwright/test";

async function fillBusinessInfo(page: import("@playwright/test").Page) {
  await page.getByPlaceholder("Acme Inc.").fill("Test Company");
  await page.getByPlaceholder("https://example.com").fill("https://testco.com");
  await page.getByPlaceholder("contact@example.com").fill("legal@testco.com");
}

test.describe("Privacy Policy Generation", () => {
  test("full flow: fill wizard → generate → see output", async ({ page }) => {
    await page.goto("/generator/privacy-policy");
    await expect(page.getByText("Privacy Policy Generator")).toBeVisible();

    // Step 0: Business Info
    await fillBusinessInfo(page);
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Step 1: Jurisdictions
    await expect(page.getByRole("heading", { name: "Jurisdictions" })).toBeVisible();
    await page.getByText("GDPR (European Union)").click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Step 2: Data Collection
    await expect(page.getByRole("heading", { name: "Data Collection" })).toBeVisible();
    await page.getByText("Email Addresses").click();
    await page.getByText("Names").click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Step 3: Third-Party Services
    await expect(page.getByRole("heading", { name: "Third-Party Services" })).toBeVisible();
    await page.getByText("Google Analytics").click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Step 4: Cookies
    await expect(page.getByRole("heading", { name: "Cookies" })).toBeVisible();
    await page.getByRole("button", { name: "Generate Policy" }).click();

    // Output
    await expect(page.getByText("Generated for Test Company")).toBeVisible();
    await expect(page.getByText("Copy HTML")).toBeVisible();
    await expect(page.getByText("Privacy Policy for Test Company")).toBeVisible();
    await expect(page.getByText("Your Rights Under GDPR")).toBeVisible();
  });

  test("does NOT show data collection or third-party steps", async ({ page }) => {
    await page.goto("/generator/privacy-policy");
    // 5 step indicators visible
    const indicators = page.locator(".rounded-full").filter({ hasText: /^[1-5]$/ });
    await expect(indicators).toHaveCount(5);
  });
});

test.describe("Terms of Service Generation", () => {
  test("only 2 steps: business info (with extras) + jurisdictions", async ({ page }) => {
    await page.goto("/generator/terms-of-service");
    await expect(page.getByText("Terms of Service Generator")).toBeVisible();

    // Step 0: Business Info with terms-specific fields
    await fillBusinessInfo(page);
    await expect(page.getByPlaceholder("United States")).toBeVisible();
    await page.getByPlaceholder("United States").fill("Canada");
    await page.getByText("Users can create accounts").click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Step 1: Jurisdictions (last step)
    await page.getByText("CCPA (California, USA)").click();
    await expect(page.getByRole("button", { name: "Generate Policy" })).toBeVisible();
    await page.getByRole("button", { name: "Generate Policy" }).click();

    // Output
    await expect(page.getByText("Generated for Test Company")).toBeVisible();
    await expect(page.getByText("Terms of Service for Test Company")).toBeVisible();
  });
});

test.describe("Cookie Policy Generation", () => {
  test("4 steps: business info → jurisdictions → cookies → third-party", async ({ page }) => {
    await page.goto("/generator/cookie-policy");

    await fillBusinessInfo(page);
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Jurisdictions
    await page.getByText("GDPR (European Union)").click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Cookies step (before third-party)
    await expect(page.getByText("Essential (login, security)")).toBeVisible();
    await page.getByText("Analytics (usage tracking)").click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Third-party
    await expect(page.getByText("Google Analytics")).toBeVisible();
    await page.getByRole("button", { name: "Generate Policy" }).click();

    await expect(page.getByText("Cookie Policy for Test Company")).toBeVisible();
  });
});

test.describe("Refund Policy Generation", () => {
  test("only 2 steps: business info + refund details", async ({ page }) => {
    await page.goto("/generator/refund-policy");

    await fillBusinessInfo(page);
    await page.getByText("SaaS / Web App").click();
    await page.getByRole("button", { name: "Next", exact: true }).click();

    // Refund details (NOT jurisdictions)
    await expect(page.getByRole("heading", { name: "Refund Details" })).toBeVisible();
    await expect(page.getByText("Refund Window (days)")).toBeVisible();
    // Should NOT show jurisdictions
    await expect(page.getByRole("heading", { name: "Jurisdictions" })).not.toBeVisible();

    await page.getByRole("button", { name: "Generate Policy" }).click();
    await expect(page.getByText("Refund Policy for Test Company")).toBeVisible();
    await expect(page.getByText("Subscription Refunds")).toBeVisible();
  });
});

test.describe("Validation", () => {
  test("cannot proceed past step 0 without required fields", async ({ page }) => {
    await page.goto("/generator/privacy-policy");
    const nextBtn = page.getByRole("button", { name: "Next", exact: true });
    await expect(nextBtn).toHaveClass(/cursor-not-allowed/);

    // Fill only name — still blocked
    await page.getByPlaceholder("Acme Inc.").fill("Test");
    await expect(nextBtn).toHaveClass(/cursor-not-allowed/);
  });
});

test.describe("Output actions", () => {
  test("generate another resets wizard", async ({ page }) => {
    await page.goto("/generator/refund-policy");
    await fillBusinessInfo(page);
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Generate Policy" }).click();
    await expect(page.getByText("Generated for Test Company")).toBeVisible();

    await page.getByText("Generate another policy").click();
    await expect(page.getByPlaceholder("Acme Inc.")).toBeVisible();
  });

  test("download button triggers download", async ({ page }) => {
    await page.goto("/generator/refund-policy");
    await fillBusinessInfo(page);
    await page.getByRole("button", { name: "Next", exact: true }).click();
    await page.getByRole("button", { name: "Generate Policy" }).click();

    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: "Download" }).click(),
    ]);
    expect(download.suggestedFilename()).toContain("refund-policy");
  });
});
