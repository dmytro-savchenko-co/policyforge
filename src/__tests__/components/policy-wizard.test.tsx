import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PolicyWizard } from "@/components/policy-wizard";

const mockGenerate = vi.fn(() => "<h1>Test Policy</h1><p>Content here</p>");
const mockWriteText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  vi.clearAllMocks();
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: mockWriteText, readText: vi.fn() },
    writable: true,
    configurable: true,
  });
});

describe("PolicyWizard", () => {
  describe("step count per policy type", () => {
    it("privacy-policy has 5 steps", () => {
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);
      const indicators = screen.getAllByText(/^[1-5]$/);
      expect(indicators).toHaveLength(5);
    });

    it("terms-of-service has 2 steps", () => {
      render(<PolicyWizard policyType="terms-of-service" title="Terms of Service" onGenerate={mockGenerate} />);
      const indicators = screen.getAllByText(/^[1-2]$/);
      expect(indicators).toHaveLength(2);
    });

    it("cookie-policy has 4 steps", () => {
      render(<PolicyWizard policyType="cookie-policy" title="Cookie Policy" onGenerate={mockGenerate} />);
      const indicators = screen.getAllByText(/^[1-4]$/);
      expect(indicators).toHaveLength(4);
    });

    it("refund-policy has 2 steps", () => {
      render(<PolicyWizard policyType="refund-policy" title="Refund Policy" onGenerate={mockGenerate} />);
      const indicators = screen.getAllByText(/^[1-2]$/);
      expect(indicators).toHaveLength(2);
    });
  });

  describe("step 0 - business info", () => {
    it("renders business name, URL, and email fields", () => {
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);
      expect(screen.getByPlaceholderText("Acme Inc.")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("https://example.com")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("contact@example.com")).toBeInTheDocument();
    });

    it("terms-of-service shows country, accounts, and sells checkboxes", () => {
      render(<PolicyWizard policyType="terms-of-service" title="Terms of Service" onGenerate={mockGenerate} />);
      expect(screen.getByPlaceholderText("United States")).toBeInTheDocument();
      expect(screen.getByText("Users can create accounts")).toBeInTheDocument();
      expect(screen.getByText("Sells products/services")).toBeInTheDocument();
    });

    it("privacy-policy does NOT show country or checkboxes", () => {
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);
      expect(screen.queryByPlaceholderText("United States")).not.toBeInTheDocument();
      expect(screen.queryByText("Users can create accounts")).not.toBeInTheDocument();
    });

    it("refund-policy does NOT show country or checkboxes", () => {
      render(<PolicyWizard policyType="refund-policy" title="Refund Policy" onGenerate={mockGenerate} />);
      expect(screen.queryByPlaceholderText("United States")).not.toBeInTheDocument();
      expect(screen.queryByText("Users can create accounts")).not.toBeInTheDocument();
    });

    it("all types show business type selector", () => {
      render(<PolicyWizard policyType="refund-policy" title="Refund Policy" onGenerate={mockGenerate} />);
      expect(screen.getByText("Website")).toBeInTheDocument();
      expect(screen.getByText("SaaS / Web App")).toBeInTheDocument();
      expect(screen.getByText("E-Commerce")).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("next button is disabled when required fields empty", () => {
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);
      const nextBtn = screen.getByText("Next").closest("button")!;
      expect(nextBtn).toHaveClass("cursor-not-allowed");
    });

    it("next button enables after filling required fields", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "Test Co");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://test.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");

      const nextBtn = screen.getByText("Next").closest("button")!;
      expect(nextBtn).not.toHaveClass("cursor-not-allowed");
    });
  });

  describe("navigation", () => {
    it("back button is disabled on step 0", () => {
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);
      const backBtn = screen.getByText("Back").closest("button")!;
      expect(backBtn).toBeDisabled();
    });

    it("clicking next advances to step 1", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "Test");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://t.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);

      expect(screen.getByRole("heading", { name: "Jurisdictions" })).toBeInTheDocument();
    });

    it("back button returns to previous step", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "Test");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://t.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);
      await user.click(screen.getByText("Back").closest("button")!);

      expect(screen.getByPlaceholderText("Acme Inc.")).toBeInTheDocument();
    });
  });

  describe("tailored steps per policy type", () => {
    it("privacy-policy shows data collection step", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="privacy-policy" title="Privacy Policy" onGenerate={mockGenerate} />);

      // Fill step 0
      await user.type(screen.getByPlaceholderText("Acme Inc."), "Test");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://t.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);

      // Step 1: jurisdictions
      await user.click(screen.getByText("GDPR (European Union)"));
      await user.click(screen.getByText("Next").closest("button")!);

      // Step 2: data collection
      expect(screen.getByRole("heading", { name: "Data Collection" })).toBeInTheDocument();
      expect(screen.getByText("Email Addresses")).toBeInTheDocument();
    });

    it("terms-of-service does NOT have data collection step", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="terms-of-service" title="Terms" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "Test");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://t.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);

      // Step 1: jurisdictions (last step for terms)
      expect(screen.getByRole("heading", { name: "Jurisdictions" })).toBeInTheDocument();
      // Should show Generate, not Next
      expect(screen.getByRole("button", { name: /Generate Policy/ })).toBeInTheDocument();
    });

    it("refund-policy shows refund details step instead of jurisdictions", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="refund-policy" title="Refund Policy" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "Test");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://t.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);

      // Step 1: refund details (NOT jurisdictions)
      expect(screen.getByRole("heading", { name: "Refund Details" })).toBeInTheDocument();
      expect(screen.queryByText("Jurisdictions")).not.toBeInTheDocument();
    });

    it("cookie-policy shows cookies step before third-party", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="cookie-policy" title="Cookie Policy" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "Test");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://t.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);

      // Step 1: jurisdictions
      await user.click(screen.getByText("GDPR (European Union)"));
      await user.click(screen.getByText("Next").closest("button")!);

      // Step 2: cookies (NOT data collection) — check for cookie options
      expect(screen.getByText("Essential (login, security)")).toBeInTheDocument();
      expect(screen.queryByText("Data Collection")).not.toBeInTheDocument();
    });
  });

  describe("generation and output", () => {
    it("calls onGenerate with form data and shows result", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="refund-policy" title="Refund Policy" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "MyBiz");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://mybiz.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "hi@mybiz.com");
      await user.click(screen.getByText("Next").closest("button")!);

      // On refund details step, click generate
      await user.click(screen.getByText("Generate Policy").closest("button")!);

      expect(mockGenerate).toHaveBeenCalledTimes(1);
      expect(mockGenerate).toHaveBeenCalledWith(
        expect.objectContaining({
          businessName: "MyBiz",
          websiteUrl: "https://mybiz.com",
          contactEmail: "hi@mybiz.com",
        })
      );
      // Output view
      expect(screen.getByText("Generated for MyBiz")).toBeInTheDocument();
      expect(screen.getByText("Copy HTML")).toBeInTheDocument();
    });

    it("copy HTML button shows Copied! feedback", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="refund-policy" title="Refund" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "X");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://x.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);
      await user.click(screen.getByText("Generate Policy").closest("button")!);

      await user.click(screen.getByText("Copy HTML"));
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });

    it("copy text button exists and is clickable", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="refund-policy" title="Refund" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "X");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://x.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);
      await user.click(screen.getByText("Generate Policy").closest("button")!);

      const copyTextBtn = screen.getByText("Copy Text").closest("button")!;
      expect(copyTextBtn).toBeInTheDocument();
      await user.click(copyTextBtn);
      // Feedback shown (Copied! replaces both copy buttons)
      expect(screen.getByText("Copied!")).toBeInTheDocument();
    });

    it("generate another resets to step 0", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="refund-policy" title="Refund" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "X");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://x.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);
      await user.click(screen.getByText("Generate Policy").closest("button")!);

      await user.click(screen.getByText("Generate another policy"));
      expect(screen.getByPlaceholderText("Acme Inc.")).toBeInTheDocument();
    });
  });

  describe("business type selector", () => {
    it("selects business type on click", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="privacy-policy" title="PP" onGenerate={mockGenerate} />);

      const saasBtn = screen.getByText("SaaS / Web App");
      await user.click(saasBtn);
      expect(saasBtn).toHaveClass("border-primary");
    });
  });

  describe("jurisdiction toggle", () => {
    it("selecting and deselecting jurisdiction toggles state", async () => {
      const user = userEvent.setup();
      render(<PolicyWizard policyType="privacy-policy" title="PP" onGenerate={mockGenerate} />);

      await user.type(screen.getByPlaceholderText("Acme Inc."), "T");
      await user.type(screen.getByPlaceholderText("https://example.com"), "https://t.com");
      await user.type(screen.getByPlaceholderText("contact@example.com"), "a@b.com");
      await user.click(screen.getByText("Next").closest("button")!);

      const gdpr = screen.getByText("GDPR (European Union)");
      await user.click(gdpr);
      expect(gdpr).toHaveClass("border-primary");

      await user.click(gdpr);
      expect(gdpr).not.toHaveClass("border-primary");
    });
  });
});
