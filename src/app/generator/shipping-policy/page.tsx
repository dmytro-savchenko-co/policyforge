import type { Metadata } from "next";
import { ShippingPolicyClient } from "./client";

export const metadata: Metadata = {
  title: "Free Shipping Policy Generator — E-Commerce | PolicyForge",
  description:
    "Generate a free shipping policy for your e-commerce store. Cover shipping methods, timeframes, costs, and international delivery.",
  openGraph: {
    title: "Free Shipping Policy Generator — PolicyForge",
    description: "Generate a professional shipping policy for your store. Free.",
  },
};

export default function ShippingPolicyPage() {
  return <ShippingPolicyClient />;
}
