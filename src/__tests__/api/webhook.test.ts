import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/stripe", () => ({
  stripe: {},
}));

import { POST } from "@/app/api/webhook/route";

function makeRequest(body: string, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost/api/webhook", {
    method: "POST",
    body,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function stripeEvent(type: string, object: Record<string, unknown> = {}) {
  return JSON.stringify({
    id: "evt_test_123",
    type,
    data: { object },
  });
}

describe("POST /api/webhook", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 400 when stripe-signature header is missing", async () => {
    const res = await POST(makeRequest(stripeEvent("checkout.session.completed")));
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("No signature");
  });

  it("returns 400 for invalid JSON payload", async () => {
    const res = await POST(
      makeRequest("not valid json {{{", { "stripe-signature": "sig_test" })
    );
    const json = await res.json();
    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid payload");
  });

  it("returns received:true for checkout.session.completed", async () => {
    const body = stripeEvent("checkout.session.completed", {
      id: "cs_123",
      customer_email: "test@example.com",
    });
    const res = await POST(makeRequest(body, { "stripe-signature": "sig_test" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it("returns received:true for customer.subscription.updated", async () => {
    const body = stripeEvent("customer.subscription.updated", {
      id: "sub_123",
      status: "active",
    });
    const res = await POST(makeRequest(body, { "stripe-signature": "sig_test" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it("returns received:true for customer.subscription.deleted", async () => {
    const body = stripeEvent("customer.subscription.deleted", {
      id: "sub_456",
      status: "canceled",
    });
    const res = await POST(makeRequest(body, { "stripe-signature": "sig_test" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it("returns received:true for unknown event types", async () => {
    const body = stripeEvent("invoice.payment_failed");
    const res = await POST(makeRequest(body, { "stripe-signature": "sig_test" }));
    const json = await res.json();
    expect(res.status).toBe(200);
    expect(json.received).toBe(true);
  });

  it("logs session id and email on checkout.session.completed", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const body = stripeEvent("checkout.session.completed", {
      id: "cs_789",
      customer_email: "buyer@example.com",
    });
    await POST(makeRequest(body, { "stripe-signature": "sig_test" }));
    expect(consoleSpy).toHaveBeenCalledWith(
      "Checkout completed:",
      "cs_789",
      "buyer@example.com"
    );
  });

  it("logs subscription id and status on subscription.updated", async () => {
    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    const body = stripeEvent("customer.subscription.updated", {
      id: "sub_999",
      status: "past_due",
    });
    await POST(makeRequest(body, { "stripe-signature": "sig_test" }));
    expect(consoleSpy).toHaveBeenCalledWith(
      "Subscription updated:",
      "sub_999",
      "past_due"
    );
  });
});
