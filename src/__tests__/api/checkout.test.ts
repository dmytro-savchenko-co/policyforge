import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockCreate = vi.fn();

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: (...args: unknown[]) => mockCreate(...args),
      },
    },
  },
  PLANS: {
    starter: {
      name: "Starter",
      priceId: "price_starter_123",
      price: 9,
    },
    business: {
      name: "Business",
      priceId: "price_business_456",
      price: 29,
    },
  },
}));

import { POST } from "@/app/api/checkout/route";

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/checkout", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}

describe("POST /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ url: "https://checkout.stripe.com/session_abc" });
  });

  it("returns session URL for valid starter plan", async () => {
    const res = await POST(makeRequest({ plan: "starter" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.url).toBe("https://checkout.stripe.com/session_abc");
  });

  it("returns session URL for valid business plan", async () => {
    const res = await POST(makeRequest({ plan: "business" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.url).toBe("https://checkout.stripe.com/session_abc");
  });

  it("returns 400 for missing plan", async () => {
    const res = await POST(makeRequest({}));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid plan");
  });

  it("returns 400 for invalid plan name", async () => {
    const res = await POST(makeRequest({ plan: "enterprise" }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid plan");
  });

  it("returns 400 for null plan", async () => {
    const res = await POST(makeRequest({ plan: null }));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid plan");
  });

  it("passes correct priceId for starter plan", async () => {
    await POST(makeRequest({ plan: "starter" }));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_starter_123", quantity: 1 }],
      })
    );
  });

  it("passes correct priceId for business plan", async () => {
    await POST(makeRequest({ plan: "business" }));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_business_456", quantity: 1 }],
      })
    );
  });

  it("includes customer_email when email is provided", async () => {
    await POST(makeRequest({ plan: "starter", email: "user@example.com" }));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: "user@example.com",
      })
    );
  });

  it("does not include customer_email when email is omitted", async () => {
    await POST(makeRequest({ plan: "starter" }));
    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg).not.toHaveProperty("customer_email");
  });

  it("uses correct success and cancel URL patterns", async () => {
    await POST(makeRequest({ plan: "starter" }));
    const callArg = mockCreate.mock.calls[0][0];
    expect(callArg.success_url).toContain("/success?session_id=");
    expect(callArg.cancel_url).toContain("/pricing");
  });

  it("includes plan name in metadata", async () => {
    await POST(makeRequest({ plan: "business" }));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: { plan: "business" },
      })
    );
  });

  it("returns 500 when Stripe throws an error", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Stripe failure"));
    const res = await POST(makeRequest({ plan: "starter" }));
    const json = await res.json();
    expect(res.status).toBe(500);
    expect(json.error).toBe("Failed to create checkout session");
  });
});
