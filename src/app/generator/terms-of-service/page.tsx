import type { Metadata } from "next";
import { TermsClient } from "./client";

export const metadata: Metadata = {
  title: "Free Terms of Service Generator — Protect Your Business | PolicyForge",
  description:
    "Generate professional terms of service for your website, app, or SaaS in 2 minutes. Covers liability, IP, user accounts, and more.",
  openGraph: {
    title: "Free Terms of Service Generator — PolicyForge",
    description: "Create professional terms and conditions in minutes. Free.",
  },
};

export default function TermsOfServicePage() {
  return <TermsClient />;
}
