import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PricingButton } from "@/components/pricing-button";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
}));

describe("PricingButton", () => {
  let originalLocation: Location;

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    originalLocation = window.location;
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...originalLocation, href: "" },
    });
    window.alert = vi.fn();
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: originalLocation,
    });
  });

  it("navigates to /generator for free plan without calling fetch", async () => {
    const user = userEvent.setup();
    render(<PricingButton plan="free" cta="Get Started" highlighted={false} />);
    await user.click(screen.getByRole("button", { name: /get started/i }));
    expect(mockPush).toHaveBeenCalledWith("/generator");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("calls /api/checkout and redirects on success for paid plan", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: () => Promise.resolve({ url: "https://checkout.stripe.com/pay" }),
    });
    render(<PricingButton plan="starter" cta="Subscribe" highlighted={true} />);
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "starter" }),
      });
    });
    await waitFor(() => {
      expect(window.location.href).toBe("https://checkout.stripe.com/pay");
    });
  });

  it("shows loading state while fetching", async () => {
    const user = userEvent.setup();
    let resolveFetch!: (value: unknown) => void;
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );
    render(<PricingButton plan="starter" cta="Subscribe" highlighted={true} />);
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
    // The CTA text should be gone during loading (replaced by spinner)
    expect(screen.queryByText(/subscribe/i)).not.toBeInTheDocument();
    resolveFetch({ json: () => Promise.resolve({ url: "https://checkout.stripe.com/pay" }) });
  });

  it("disables button during loading", async () => {
    const user = userEvent.setup();
    let resolveFetch!: (value: unknown) => void;
    (global.fetch as ReturnType<typeof vi.fn>).mockReturnValueOnce(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );
    render(<PricingButton plan="business" cta="Upgrade" highlighted={false} />);
    await user.click(screen.getByRole("button", { name: /upgrade/i }));
    await waitFor(() => {
      expect(screen.getByRole("button")).toBeDisabled();
    });
    resolveFetch({ json: () => Promise.resolve({ url: "https://example.com" }) });
  });

  it("shows alert when API returns no URL", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      json: () => Promise.resolve({ error: "Invalid plan" }),
    });
    render(<PricingButton plan="starter" cta="Subscribe" highlighted={true} />);
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Something went wrong. Please try again.");
    });
  });

  it("shows alert when fetch throws", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );
    render(<PricingButton plan="starter" cta="Subscribe" highlighted={true} />);
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Something went wrong. Please try again.");
    });
  });

  it("re-enables button after fetch error", async () => {
    const user = userEvent.setup();
    (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error")
    );
    render(<PricingButton plan="starter" cta="Subscribe" highlighted={true} />);
    await user.click(screen.getByRole("button", { name: /subscribe/i }));
    await waitFor(() => {
      expect(screen.getByRole("button")).not.toBeDisabled();
    });
  });

  it("applies highlighted styling when highlighted is true", () => {
    render(<PricingButton plan="starter" cta="Subscribe" highlighted={true} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-primary");
    expect(button.className).toContain("text-white");
  });

  it("applies non-highlighted styling when highlighted is false", () => {
    render(<PricingButton plan="starter" cta="Subscribe" highlighted={false} />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border");
    expect(button.className).not.toContain("bg-primary");
  });

  it("renders the CTA text", () => {
    render(<PricingButton plan="free" cta="Get Started Free" highlighted={false} />);
    expect(screen.getByText("Get Started Free")).toBeInTheDocument();
  });

  it("renders ArrowRight icon alongside CTA text when not loading", () => {
    render(<PricingButton plan="free" cta="Go" highlighted={false} />);
    const button = screen.getByRole("button");
    // The button should contain an SVG (ArrowRight icon)
    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});
