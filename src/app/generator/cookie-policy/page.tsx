import type { Metadata } from "next";
import { CookieClient } from "./client";

export const metadata: Metadata = {
  title: "Free Cookie Policy Generator — EU Cookie Law Compliant | PolicyForge",
  description:
    "Generate a free, EU cookie law compliant cookie policy for your website in 2 minutes. Covers essential, analytics, functional, and marketing cookies.",
  openGraph: {
    title: "Free Cookie Policy Generator — PolicyForge",
    description: "Generate an EU cookie law compliant policy in minutes. Free.",
  },
};

export default function CookiePolicyPage() {
  return <CookieClient />;
}
