import robots from "@/app/robots";

describe("robots", () => {
  const result = robots();

  it("allows all user agents", () => {
    expect(result.rules).toHaveProperty("userAgent", "*");
  });

  it('allows "/"', () => {
    expect(result.rules).toHaveProperty("allow", "/");
  });

  it("points to the correct sitemap URL", () => {
    expect(result.sitemap).toBe("https://policyforge.site/sitemap.xml");
  });
});
