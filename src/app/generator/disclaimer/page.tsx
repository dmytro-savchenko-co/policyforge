import type { Metadata } from "next";
import { DisclaimerClient } from "./client";

export const metadata: Metadata = {
  title: "Free Disclaimer Generator — Liability Protection | PolicyForge",
  description:
    "Generate a free disclaimer for your website or blog. Protect your business from liability with a professionally written disclaimer.",
  openGraph: {
    title: "Free Disclaimer Generator — PolicyForge",
    description: "Generate a professional disclaimer to protect your business. Free.",
  },
};

export default function DisclaimerPage() {
  return <DisclaimerClient />;
}
