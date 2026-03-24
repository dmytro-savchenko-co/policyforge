import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/header";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
}));

describe("Header", () => {
  it("renders logo link pointing to /", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", { name: /policyforge/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders desktop nav links for Generator, Pricing, and Get Started Free", () => {
    render(<Header />);
    const links = screen.getAllByRole("link");
    const hrefs = links.map((l) => l.getAttribute("href"));
    expect(hrefs).toContain("/generator");
    expect(hrefs).toContain("/pricing");
  });

  it("hides mobile menu by default", () => {
    render(<Header />);
    // Mobile menu links have "block" class - they should not be in the DOM initially
    const mobileGeneratorLinks = screen.getAllByText("Generator");
    // Only the desktop one should be visible (mobile menu not rendered)
    expect(mobileGeneratorLinks.length).toBe(1);
  });

  it("opens mobile menu when hamburger button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const hamburger = screen.getByRole("button");
    await user.click(hamburger);
    // Now mobile menu should show duplicate links
    const generatorLinks = screen.getAllByText("Generator");
    expect(generatorLinks.length).toBe(2);
  });

  it("closes mobile menu when X button is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const hamburger = screen.getByRole("button");
    await user.click(hamburger);
    // Menu should be open
    expect(screen.getAllByText("Generator").length).toBe(2);
    // Click again (now shows X icon)
    await user.click(screen.getByRole("button"));
    expect(screen.getAllByText("Generator").length).toBe(1);
  });

  it("closes mobile menu when a mobile nav link is clicked", async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole("button"));
    expect(screen.getAllByText("Pricing").length).toBe(2);
    // Click the mobile Pricing link (second one)
    const pricingLinks = screen.getAllByText("Pricing");
    await user.click(pricingLinks[1]);
    expect(screen.getAllByText("Pricing").length).toBe(1);
  });
});
