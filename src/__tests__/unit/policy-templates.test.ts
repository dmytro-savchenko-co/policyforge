import {
  generatePrivacyPolicy,
  generateTermsOfService,
  generateCookiePolicy,
  generateRefundPolicy,
  type PolicyFormData,
} from "@/lib/policy-templates";

const baseFormData: PolicyFormData = {
  businessName: "Acme Corp",
  websiteUrl: "https://acme.com",
  businessType: "website",
  contactEmail: "hello@acme.com",
  country: "United States",
  jurisdictions: [],
  dataCollected: ["name", "email"],
  thirdPartyServices: ["google-analytics"],
  cookieTypes: ["essential"],
  hasUserAccounts: false,
  sellsProducts: false,
  refundDays: 30,
};

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-06-15T12:00:00Z"));
});

afterAll(() => {
  vi.useRealTimers();
});

// ---------------------------------------------------------------------------
// generatePrivacyPolicy
// ---------------------------------------------------------------------------
describe("generatePrivacyPolicy", () => {
  it("includes h1 with business name", () => {
    const result = generatePrivacyPolicy(baseFormData);
    expect(result).toContain("<h1>Privacy Policy for Acme Corp</h1>");
  });

  it("includes the formatted date", () => {
    const result = generatePrivacyPolicy(baseFormData);
    expect(result).toContain("June 15, 2025");
  });

  it('uses "application" wording for app businessType', () => {
    const result = generatePrivacyPolicy({ ...baseFormData, businessType: "app" });
    expect(result).toContain("our application");
  });

  it('uses "software service" wording for saas businessType', () => {
    const result = generatePrivacyPolicy({ ...baseFormData, businessType: "saas" });
    expect(result).toContain("our software service");
  });

  it('uses "website" wording for website businessType', () => {
    const result = generatePrivacyPolicy(baseFormData);
    expect(result).toContain("our website");
  });

  it("maps name to Name and contact information", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, dataCollected: ["name"] });
    expect(result).toContain("Name and contact information");
  });

  it("maps email to Email address", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, dataCollected: ["email"] });
    expect(result).toContain("Email address");
  });

  it("maps phone to Phone number", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, dataCollected: ["phone"] });
    expect(result).toContain("Phone number");
  });

  it("maps address to Mailing or billing address", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, dataCollected: ["address"] });
    expect(result).toContain("Mailing or billing address");
  });

  it("maps payment to Payment and billing information", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, dataCollected: ["payment"] });
    expect(result).toContain("Payment and billing information");
  });

  it("maps content to Content you submit", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, dataCollected: ["content"] });
    expect(result).toContain("Content you submit, post, or share");
  });

  it("does not include provided-data list when dataCollected is empty and no accounts", () => {
    const result = generatePrivacyPolicy({
      ...baseFormData,
      dataCollected: [],
      hasUserAccounts: false,
    });
    expect(result).not.toContain("We collect information you provide directly");
  });

  it("includes account credentials when hasUserAccounts is true", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, hasUserAccounts: true });
    expect(result).toContain("Account credentials");
  });

  it("maps google-analytics third-party service", () => {
    const result = generatePrivacyPolicy(baseFormData);
    expect(result).toContain("Google Analytics");
  });

  it("maps stripe third-party service", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, thirdPartyServices: ["stripe"] });
    expect(result).toContain("Stripe");
  });

  it("falls back to raw service name for unknown service", () => {
    const result = generatePrivacyPolicy({
      ...baseFormData,
      thirdPartyServices: ["some-unknown-service"],
    });
    expect(result).toContain("<li>some-unknown-service</li>");
  });

  it("skips third-party section when services are empty", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, thirdPartyServices: [] });
    expect(result).not.toContain("Third-Party Services");
  });

  it("numbers Data Retention as 4 when third-party section exists", () => {
    const result = generatePrivacyPolicy(baseFormData);
    expect(result).toContain("<h2>4. Data Retention</h2>");
  });

  it("numbers Data Retention as 3 when no third-party section", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, thirdPartyServices: [] });
    expect(result).toContain("<h2>3. Data Retention</h2>");
  });

  it("includes GDPR section when gdpr jurisdiction is set", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, jurisdictions: ["gdpr"] });
    expect(result).toContain("Your Rights Under GDPR");
    expect(result).toContain("Right of Access");
  });

  it("includes CCPA section when ccpa jurisdiction is set", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, jurisdictions: ["ccpa"] });
    expect(result).toContain("Your Rights Under CCPA");
    expect(result).toContain("Right to Know");
  });

  it("includes PIPEDA section when pipeda jurisdiction is set", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, jurisdictions: ["pipeda"] });
    expect(result).toContain("Your Rights Under PIPEDA");
  });

  it("includes all jurisdiction sections together", () => {
    const result = generatePrivacyPolicy({
      ...baseFormData,
      jurisdictions: ["gdpr", "ccpa", "pipeda"],
    });
    expect(result).toContain("GDPR");
    expect(result).toContain("CCPA");
    expect(result).toContain("PIPEDA");
  });

  it("includes mailto link for contactEmail", () => {
    const result = generatePrivacyPolicy(baseFormData);
    expect(result).toContain('href="mailto:hello@acme.com"');
  });

  it("includes location data when location is in dataCollected", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, dataCollected: ["location"] });
    expect(result).toContain("Approximate location data");
  });

  it("includes cookies tracking line when cookies is in dataCollected", () => {
    const result = generatePrivacyPolicy({ ...baseFormData, dataCollected: ["cookies"] });
    expect(result).toContain("Cookies and similar tracking technologies");
  });

  it("handles special characters in business name", () => {
    const result = generatePrivacyPolicy({
      ...baseFormData,
      businessName: 'O\'Reilly & Sons <LLC>',
    });
    expect(result).toContain("O'Reilly & Sons <LLC>");
  });
});

// ---------------------------------------------------------------------------
// generateTermsOfService
// ---------------------------------------------------------------------------
describe("generateTermsOfService", () => {
  it("includes h1 with business name", () => {
    const result = generateTermsOfService(baseFormData);
    expect(result).toContain("<h1>Terms of Service for Acme Corp</h1>");
  });

  it('describes saas as "software-as-a-service platform"', () => {
    const result = generateTermsOfService({ ...baseFormData, businessType: "saas" });
    expect(result).toContain("software-as-a-service platform");
  });

  it('describes ecommerce as "online marketplace and e-commerce platform"', () => {
    const result = generateTermsOfService({ ...baseFormData, businessType: "ecommerce" });
    expect(result).toContain("online marketplace and e-commerce platform");
  });

  it('describes app as "mobile and/or web application"', () => {
    const result = generateTermsOfService({ ...baseFormData, businessType: "app" });
    expect(result).toContain("mobile and/or web application");
  });

  it('describes blog as "online content and publishing platform"', () => {
    const result = generateTermsOfService({ ...baseFormData, businessType: "blog" });
    expect(result).toContain("online content and publishing platform");
  });

  it('describes website as "online platform and website"', () => {
    const result = generateTermsOfService(baseFormData);
    expect(result).toContain("online platform and website");
  });

  it("includes User Accounts section when hasUserAccounts is true", () => {
    const result = generateTermsOfService({ ...baseFormData, hasUserAccounts: true });
    expect(result).toContain("<h2>3. User Accounts</h2>");
    expect(result).toContain("safeguarding your account password");
  });

  it("numbers Intellectual Property as 4 with user accounts", () => {
    const result = generateTermsOfService({ ...baseFormData, hasUserAccounts: true });
    expect(result).toContain("<h2>4. Intellectual Property</h2>");
  });

  it("numbers Intellectual Property as 3 without user accounts", () => {
    const result = generateTermsOfService({ ...baseFormData, hasUserAccounts: false });
    expect(result).toContain("<h2>3. Intellectual Property</h2>");
  });

  it("includes Payments section when sellsProducts is true", () => {
    const result = generateTermsOfService({ ...baseFormData, sellsProducts: true });
    expect(result).toContain("Payments and Billing");
  });

  it("includes Payments section for ecommerce businessType", () => {
    const result = generateTermsOfService({ ...baseFormData, businessType: "ecommerce" });
    expect(result).toContain("Payments and Billing");
  });

  it("includes Payments section for saas businessType", () => {
    const result = generateTermsOfService({ ...baseFormData, businessType: "saas" });
    expect(result).toContain("Payments and Billing");
  });

  it("includes saas subscription text for saas businessType", () => {
    const result = generateTermsOfService({ ...baseFormData, businessType: "saas" });
    expect(result).toContain("Subscriptions are billed in advance");
  });

  it("does not include subscription text for non-saas", () => {
    const result = generateTermsOfService({ ...baseFormData, businessType: "ecommerce" });
    expect(result).not.toContain("Subscriptions are billed in advance");
  });

  it("uses country in governing law", () => {
    const result = generateTermsOfService(baseFormData);
    expect(result).toContain("laws of United States");
  });

  it("falls back when country is empty", () => {
    const result = generateTermsOfService({ ...baseFormData, country: "" });
    expect(result).toContain("the jurisdiction in which the Company operates");
  });
});

// ---------------------------------------------------------------------------
// generateCookiePolicy
// ---------------------------------------------------------------------------
describe("generateCookiePolicy", () => {
  it("includes h1 with business name", () => {
    const result = generateCookiePolicy(baseFormData);
    expect(result).toContain("<h1>Cookie Policy for Acme Corp</h1>");
  });

  it("includes Essential Cookies when specified", () => {
    const result = generateCookiePolicy({ ...baseFormData, cookieTypes: ["essential"] });
    expect(result).toContain("<strong>Essential Cookies:</strong>");
  });

  it("includes Analytics Cookies when specified", () => {
    const result = generateCookiePolicy({ ...baseFormData, cookieTypes: ["analytics"] });
    expect(result).toContain("<strong>Analytics Cookies:</strong>");
  });

  it("includes Functional Cookies when specified", () => {
    const result = generateCookiePolicy({ ...baseFormData, cookieTypes: ["functional"] });
    expect(result).toContain("<strong>Functional Cookies:</strong>");
  });

  it("includes Marketing Cookies when specified", () => {
    const result = generateCookiePolicy({ ...baseFormData, cookieTypes: ["marketing"] });
    expect(result).toContain("<strong>Marketing Cookies:</strong>");
  });

  it("renders empty ul when cookieTypes is empty", () => {
    const result = generateCookiePolicy({ ...baseFormData, cookieTypes: [] });
    expect(result).toContain("<ul></ul>");
  });

  it("includes all cookie types when all are specified", () => {
    const result = generateCookiePolicy({
      ...baseFormData,
      cookieTypes: ["essential", "analytics", "functional", "marketing"],
    });
    expect(result).toContain("Essential Cookies");
    expect(result).toContain("Analytics Cookies");
    expect(result).toContain("Functional Cookies");
    expect(result).toContain("Marketing Cookies");
  });

  it("includes Third-Party Cookies section when services are present", () => {
    const result = generateCookiePolicy(baseFormData);
    expect(result).toContain("Third-Party Cookies");
  });

  it("omits Third-Party Cookies section when services are empty", () => {
    const result = generateCookiePolicy({ ...baseFormData, thirdPartyServices: [] });
    expect(result).not.toContain("Third-Party Cookies");
  });

  it("formats service names by capitalizing words and replacing hyphens", () => {
    const result = generateCookiePolicy({
      ...baseFormData,
      thirdPartyServices: ["google-analytics"],
    });
    expect(result).toContain("<li>Google Analytics</li>");
  });

  it("includes GDPR consent section when gdpr jurisdiction is set", () => {
    const result = generateCookiePolicy({ ...baseFormData, jurisdictions: ["gdpr"] });
    expect(result).toContain("Your Rights (GDPR)");
    expect(result).toContain("consent to or reject non-essential cookies");
  });

  it("omits GDPR section when gdpr jurisdiction is not set", () => {
    const result = generateCookiePolicy({ ...baseFormData, jurisdictions: [] });
    expect(result).not.toContain("Your Rights (GDPR)");
  });
});

// ---------------------------------------------------------------------------
// generateRefundPolicy
// ---------------------------------------------------------------------------
describe("generateRefundPolicy", () => {
  it("uses saas template for saas businessType", () => {
    const result = generateRefundPolicy({ ...baseFormData, businessType: "saas" });
    expect(result).toContain("Subscription Refunds");
    expect(result).toContain("money-back guarantee");
  });

  it("uses ecommerce template for ecommerce businessType", () => {
    const result = generateRefundPolicy({ ...baseFormData, businessType: "ecommerce" });
    expect(result).toContain("Return Policy");
    expect(result).toContain("Items must be unused");
  });

  it("uses default template for other businessTypes", () => {
    const result = generateRefundPolicy(baseFormData);
    expect(result).toContain("<h2>Refunds</h2>");
    expect(result).toContain("request a refund within 30 days");
  });

  it("interpolates refundDays in saas template", () => {
    const result = generateRefundPolicy({ ...baseFormData, businessType: "saas", refundDays: 14 });
    expect(result).toContain("14-day money-back guarantee");
    expect(result).toContain("within 14 days of your initial purchase");
  });

  it("interpolates refundDays in ecommerce template", () => {
    const result = generateRefundPolicy({ ...baseFormData, businessType: "ecommerce", refundDays: 60 });
    expect(result).toContain("within 60 days of delivery");
  });

  it("handles 0 refundDays", () => {
    const result = generateRefundPolicy({ ...baseFormData, businessType: "saas", refundDays: 0 });
    expect(result).toContain("0-day money-back guarantee");
  });

  it("includes non-refundable items section", () => {
    const result = generateRefundPolicy(baseFormData);
    expect(result).toContain("Non-Refundable Items");
    expect(result).toContain("Digital products that have been downloaded");
    expect(result).toContain("Custom or personalized orders");
  });

  it("includes cancellation section for saas", () => {
    const result = generateRefundPolicy({ ...baseFormData, businessType: "saas" });
    expect(result).toContain("<h2>Cancellation</h2>");
    expect(result).toContain("cancel your subscription at any time");
  });

  it("includes shipping costs section for ecommerce", () => {
    const result = generateRefundPolicy({ ...baseFormData, businessType: "ecommerce" });
    expect(result).toContain("Shipping Costs");
    expect(result).toContain("responsibility of the customer");
  });

  it("does not include shipping costs for non-ecommerce", () => {
    const result = generateRefundPolicy({ ...baseFormData, businessType: "saas" });
    expect(result).not.toContain("Shipping Costs");
  });
});
