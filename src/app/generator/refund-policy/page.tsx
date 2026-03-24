import type { Metadata } from "next";
import { RefundClient } from "./client";

export const metadata: Metadata = {
  title: "Free Refund Policy Generator — E-Commerce & SaaS | PolicyForge",
  description:
    "Generate a clear refund and return policy for your e-commerce store or SaaS product. Customizable refund windows and terms.",
  openGraph: {
    title: "Free Refund Policy Generator — PolicyForge",
    description: "Create a clear refund policy for your business in minutes. Free.",
  },
};

export default function RefundPolicyPage() {
  return <RefundClient />;
}
