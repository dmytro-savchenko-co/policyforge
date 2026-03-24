import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/footer";

describe("Footer", () => {
  it("renders generator links for all policy types", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: /privacy policy/i })).toHaveAttribute(
      "href",
      "/generator/privacy-policy"
    );
    expect(screen.getByRole("link", { name: /terms of service/i })).toHaveAttribute(
      "href",
      "/generator/terms-of-service"
    );
    expect(screen.getByRole("link", { name: /cookie policy/i })).toHaveAttribute(
      "href",
      "/generator/cookie-policy"
    );
    expect(screen.getByRole("link", { name: /refund policy/i })).toHaveAttribute(
      "href",
      "/generator/refund-policy"
    );
  });

  it("displays the current copyright year", () => {
    render(<Footer />);
    const year = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(year))).toBeInTheDocument();
    expect(screen.getByText(/PolicyForge\. All rights reserved/)).toBeInTheDocument();
  });

  it("renders contact email link", () => {
    render(<Footer />);
    const emailLink = screen.getByRole("link", { name: /contact/i });
    expect(emailLink).toHaveAttribute("href", "mailto:support@policyforge.co");
  });
});
