import sitemap from "@/app/sitemap";

describe("sitemap", () => {
  const entries = sitemap();

  it("returns 7 entries", () => {
    expect(entries).toHaveLength(7);
  });

  it("uses policyforge.site as the base URL", () => {
    for (const entry of entries) {
      expect(entry.url).toMatch(/^https:\/\/policyforge\.site/);
    }
  });

  it("assigns correct priorities", () => {
    const priorities = entries.map((e) => e.priority);
    expect(priorities).toEqual([1, 0.9, 0.9, 0.8, 0.8, 0.7, 0.7]);
  });

  it("sets lastModified as Date instances", () => {
    for (const entry of entries) {
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });

  it("contains the expected URLs", () => {
    const urls = entries.map((e) => e.url);
    expect(urls).toEqual([
      "https://policyforge.site",
      "https://policyforge.site/generator",
      "https://policyforge.site/generator/privacy-policy",
      "https://policyforge.site/generator/terms-of-service",
      "https://policyforge.site/generator/cookie-policy",
      "https://policyforge.site/generator/refund-policy",
      "https://policyforge.site/pricing",
    ]);
  });
});
