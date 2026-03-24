import { describe, it, expect, vi } from "vitest";

vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-inter" }),
}));

import { metadata } from "@/app/layout";
import type { Metadata } from "next";

const meta = metadata as Metadata;

describe("SEO metadata", () => {
  it("has the correct default title", () => {
    expect((meta.title as { default: string }).default).toBe(
      "PolicyForge — Generate Legal Pages in Minutes"
    );
  });

  it("has a title template containing %s and PolicyForge", () => {
    const template = (meta.title as { template: string }).template;
    expect(template).toContain("%s");
    expect(template).toContain("PolicyForge");
  });

  it("has a description mentioning GDPR and CCPA", () => {
    expect(meta.description).toContain("GDPR");
    expect(meta.description).toContain("CCPA");
  });

  it("has the correct OpenGraph title", () => {
    expect(meta.openGraph?.title).toBe(
      "PolicyForge — Generate Legal Pages in Minutes"
    );
  });

  it("sets OpenGraph type to website", () => {
    expect((meta.openGraph as { type: string }).type).toBe("website");
  });

  it("sets twitter card to summary_large_image", () => {
    expect(meta.twitter?.card).toBe("summary_large_image");
  });

  it("has a canonical URL", () => {
    expect((meta.alternates?.canonical as string | URL)?.toString()).toBe(
      "https://policyforge.site"
    );
  });

  it("has a keywords array with relevant terms", () => {
    expect(Array.isArray(meta.keywords)).toBe(true);
    expect(meta.keywords!.length).toBeGreaterThan(0);
    expect(meta.keywords).toContain("privacy policy generator");
    expect(meta.keywords).toContain("GDPR privacy policy");
  });
});
